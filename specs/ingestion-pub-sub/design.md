# Design: Ingestion Pub/Sub Client

## 1. Architecture Overview

The feature introduces an Effect-managed Pub/Sub client composed of three primary layers:

1. `PubSubConfigLive` — loads configuration (project, emulator host, topics, subscriptions, concurrency, ack settings) from environment/config files.
2. `PubSubClientLive` — wraps `@google-cloud/pubsub` publisher/subscriber primitives into Effect services with schema enforcement, structured logging, and ack management.
3. `IngestionProjectionLive` — a background subscriber to `job-events` maintaining an in-memory read model for API status queries.

All layers integrate with existing ingestion services (`ProcessingJobStore`, `SpeakerRoleRegistry`, `YouTubeClient`) and domain schemas to ensure message integrity. The architecture maintains a minimal messaging surface (work topic + events topic + shared DLQ) with stage-based subscription filters.

```
+----------------+         +-------------------+
| Ingestion API  |         | Metadata Worker   |
| - PubSubClient |         | - PubSubClient    |
| - Projection   |         | - JobStore        |
+-------+--------+         +---------+---------+
        |                            |
        | publish (job-processing)   | subscribe (stage=Queued)
        v                            |
   +-----------+                     |
   | Pub/Sub   | <-------------------+
   | Topics &  |                     |
   | Subs      |                     v
   +-----------+                +----------+
        ^                       | Job DLQ  |
        |                       +----------+
        | subscribe (job-events)             
+-------+--------+
| Transcription  |
| Worker         |
+----------------+
```

## 2. PubSubClient Service Design

### 2.1 Interfaces

```ts
import type { Schema } from "effect/Schema";
import type { Effect } from "effect/Effect";

interface PubSubAttributes {
  readonly jobId: JobId;
  readonly userId: UserId;
  readonly mediaType: MediaType; // sum type from domain
  readonly stage: JobStage;
  readonly schemaVersion: string;
  readonly correlationId?: string;
  readonly attempt?: number; // derived from deliveryAttempt
}

interface PublishRequest<A> {
  readonly topic: TopicName; // string alias from config
  readonly payload: A;
  readonly schema: Schema<A>;
  readonly attributes: PubSubAttributes;
}

interface SubscribeContext<A> {
  readonly payload: A;
  readonly attributes: PubSubAttributes;
  readonly messageId: string;
  readonly deliveryAttempt: number;
  readonly publishTime: Date;
}

interface PubSubClient {
  publish: <A>(request: PublishRequest<A>) => Effect<never, PublishError>;
  runSubscriber: <A, R = never>(
    subscription: SubscriptionName,
    schema: Schema<A>,
    handler: (
      ctx: SubscribeContext<A>
    ) => Effect<R, SubscribeError | DecodeError | AckError>
  ) => Effect<never, never>;
}
```

### 2.2 Layer Construction

- `PubSubClientLive` instantiates the GCP Pub/Sub client:
  - `Publisher` uses `Effect.tryPromise` around `topic.publishMessage`, encoding payload via `Schema.encode` and serializing to `Buffer`. Attributes stored as strings, respecting minimal set.
  - `Subscriber` creates a streaming pull via `subscription.on("message"...)` adapter using Effect `Stream` or low-level `Effect.async` to feed a worker pool.
  - Concurrency enforced with `Semaphore` (permits = config.concurrency).
  - Each message processing spawns a fiber:
    1. Decode payload with `Schema.decodeUnknownEffect` (wrapping attribute-based schema selection).
    2. Launch ack-deadline extension fiber using `Schedule.spaced` with jitter, cancelled when handler completes or fails.
    3. Run user handler; on success -> ack; on handled failure -> ack (if non-retryable); on retryable failure -> nack; on repeated failures beyond `maxDeliveryAttempts` -> route to DLQ (publish to DLQ topic).
    4. Structured logs at start/end with context (jobId, stage, attempt, messageId).
  - Errors wrapped in tagged `PublishError`, `SubscribeError`, `DecodeError`, `AckError`.

- `PubSubClientTest` layer: provides in-memory queues for tests; supports substitution via dependency injection.

## 3. Configuration Layer

`PubSubConfig` record:
```ts
interface PubSubConfig {
  readonly projectId: string;
  readonly emulatorHost?: string;
  readonly topics: {
    readonly work: TopicName;
    readonly events: TopicName;
    readonly dlq: TopicName;
  };
  readonly subscriptions: {
    readonly work: SubscriptionName; // filtered by stage attr
    readonly metadata: SubscriptionName; // optional alias
    readonly transcription: SubscriptionName;
    readonly events: SubscriptionName;
    readonly dlq: SubscriptionName;
  };
  readonly ackDeadlineSeconds: number; // default 10
  readonly ackExtensionIntervalSeconds: number; // default 5
  readonly maxAckExtensionSeconds: number; // cap
  readonly concurrency: number; // default 5
  readonly publishRetryAttempts: number; // default 3
  readonly subscribeRetryAttempts: number; // default 5
  readonly backoffSchedule: ScheduleConfig; // exponential with jitter
}
```
- `PubSubConfigLive` loads values from `Config` service or environment, ensuring emulator host toggles TLS/insecure settings.
- Filters defined in configuration to keep code generic (ex: `attributes.stage = "Queued"`).

## 4. Integration Points

### 4.1 Ingestion API
- When receiving new job requests:
  - Validate via domain schema -> persist baseline job (idempotent check by `ProcessingJobStore`).
  - Publish to `topics.work` with stage `Queued` and correlation ID.
  - Publish `JobQueued` to `topics.events`.
- Expose background `Layer.succeed` that starts projection subscriber on service startup; ensures clean shutdown via `Scope`.

### 4.2 Metadata Worker
- `runSubscriber` wired with schema `ProcessingJobSchema`. Handler sequence:
  1. Check job status -> skip if stage already advanced (idempotency).
  2. Enrich metadata using `YouTubeClient` (or other by media type).
  3. Persist updates via `ProcessingJobStore`.
  4. Publish updated job to `topics.work` with stage `MetadataReady`.
  5. Publish `MetadataReady` event to `topics.events`.

### 4.3 Transcription Worker
- Similar subscriber with filter `stage = "MetadataReady"`:
  1. Acquire necessary resources (transcription service).
  2. Run transcription, handle long-running tasks with ack extensions.
  3. Persist transcript & status.
  4. Emit `TranscriptComplete` or `JobFailed` events.

### 4.4 Projection Layer
- Subscriber on `topics.events` updates `SynchronizedRef` or `DurableRef` with latest job state.
- API queries read the projection, falling back to eventual consistency rules.

## 5. Message Schema Handling

- Domain module `packages/domain/src/events.ts` and related provide sum types for job events and stages.
- Each message includes `mediaType` (sum type e.g., `"youtube" | "podcast" | ...`).
- Codec selection: `schemaByMediaType[mediaType]` mapping; ensures compile-time coverage.
- Attributes kept minimal: `jobId`, `userId`, `mediaType`, `stage`, `schemaVersion`, optional `correlationId`, `attempt` (derived).
- Payload excludes PII; references existing domain IDs.

## 6. Error Handling & Idempotency

- Publishing: wrap GCP errors in `PublishError`. Retry using configured `Schedule` with exponential backoff.
- Subscribing: 
  - `DecodeError` -> ack & publish to DLQ with reason.
  - `SubscribeError` -> log, `nack` to trigger retry; after `maxDeliveryAttempts` route to DLQ.
  - Idempotency utilities: helper `ensureStageTransition(jobId, expectedStage)` that checks `ProcessingJobStore` before processing.

## 7. Observability & Monitoring

- Structured logging via `Logger.info`/`Logger.error` with context fields.
- Metrics layer integration: counters for `pubsub_publish_latency_ms`, `pubsub_handler_duration_ms`, `pubsub_redelivery_total`, `pubsub_dlq_total`.
- Tracing (if available): wrap `Span.start` around handlers, pass `correlationId` as trace context.

## 8. Testing Strategy

- Emulator-based integration tests using `PubSubClientLive` pointed at emulator host.
- Unit tests substituting `PubSubClientTest` to simulate message deliveries.
- Contract tests verifying `Schema.encode`/`decode` round-trips for each media-type variant.
- Failure scenario tests: decode failures -> DLQ; handler errors -> nack -> redelivery -> DLQ; ack extension stops after completion.

## 9. Deployment Considerations

- Document required IAM roles: `pubsub.topics.publish`, `pubsub.subscriptions.consume`, `pubsub.subscriptions.update`.
- Provide scripts/config for creating topics/subscriptions with filters and DLQ.
- Deploy subscribers as part of worker services; ensure graceful shutdown interrupts `runSubscriber` fibers.

## 10. Outstanding Decisions

- Confirm DLQ configuration (shared vs per-stage) defaults.
- Choose default retry/backoff schedule parameters.
- Decide whether projection eventually persist to durable storage.

