# Metadata Worker - Instructions

## Overview

`@puredialog/worker-metadata` processes newly queued transcription jobs. The service receives Pub/Sub push notifications for work messages whose `stage` attribute is `"Queued"`. Each notification triggers metadata enrichment (YouTube lookups today, additional providers later), persists a job update, and publishes both the next work item and corresponding domain events.

## Responsibilities

- Accept Pub/Sub push requests on `/pubsub`, verify the bearer token audience, and decode the payload using `MessageAdapter.fromWorkMessage`.
- Enforce idempotency: confirm the job is still at `Queued` by consulting `ProcessingJobStore.ensureStageTransition(jobId, "Queued")`; ack and log an `ingestion.job.skipped` event if the stage already advanced.
- Fetch external metadata:
  - `media.type === "youtube"`: resolve via `YoutubeApiClient getVideo` + `getChannel`.
  - Prepare hooks for future media types with a dispatcher function.
- Merge metadata onto the job (`metadataSnapshot`, `topicHints`, `preambleHash`, `durationSeconds`, etc.) and persist via `ProcessingJobStore.update(jobId, patch)`.
- Publish downstream effects:
  1. Updated work message with `stage = "MetadataReady"` using `MessageAdapter.encodeWork`. Include incremented `attempt` attribute and the enriched metadata payload.
  2. `JobStatusChanged` (`Queued` → `MetadataReady`) and `MetadataReady` domain events via `MessageAdapter.encodeDomainEvent`.
- Emit structured logs for each decision point (`metadata.worker.received`, `metadata.worker.skipped`, `metadata.worker.enriched`, `metadata.worker.publish_failed`, etc.) with `jobId`, `requestId`, `correlationId`, `stage`, `attempt`, `mediaType`, and timing metrics.
- Surface metrics counters/histograms through the shared metrics layer: handler duration, retries, DLQ publishes, YouTube latency.

## HTTP Surface

- Use Effect's `HttpApi`/`HttpApiBuilder` just like the API service:
  - API name: `MetadataWorkerApi` with groups `health` (`GET /health`) and `pubsub` (`POST /pubsub`).
  - `POST /pubsub` endpoint accepts the Google push schema:
    ```ts
    interface PubSubPushBody {
      readonly message: {
        readonly data: string; // base64 JSON payload
        readonly attributes?: Record<string, string>;
        readonly messageId: string;
        readonly publishTime: string;
      };
      readonly subscription: string;
    }
    ```
  - Decode the body using `Schema` combinators. Reject requests missing required fields with `return yield* HttpServerResponse.json({ error: "invalid push" }, { status: 400 })`.
  - Always return a JSON ack `{ status: "ack" }` on success. Non-retryable errors (malformed payload, unknown stage) should still return 200 to avoid redelivery after reporting to DLQ.
- Add middleware for authentication if we later validate OIDC tokens; keep the spec extensible.

## Business Logic Flow

1. **Decode & Validate**
   - Parse the push envelope and convert `message.data` (base64) into a `ProcessingJob` using `MessageAdapter.decodeWorkMessage`.
   - Capture `attempt` from attributes; default to 1 if absent.
   - Attach an `Effect.currentSpan` span named `metadata.worker.handle` with tags (`jobId`, `requestId`, `attempt`).

2. **Guard Against Replays**
   - Call `ProcessingJobStore.ensureStageTransition(jobId, "Queued")`.
   - If already advanced, emit `metadata.worker.skipped` log and `return yield* HttpServerResponse.json({ status: "ack" })`.

3. **Enrichment Pipeline**
   - Dispatch by `job.media.type`. For YouTube:
     - Fetch video + channel documents via `YoutubeApiClient`.
     - Derive structured metadata (duration seconds, channel author info, categories, publishedAt, keywords).
     - Compute speaker hints (`SpeakerRoleRegistry.resolve(job.requestId, channelId)` where available).
     - Populate `metadataSnapshot` structure defined in domain package (create schema if missing).
   - For unsupported media types, raise `UnsupportedMediaTypeError` (custom `Data.TaggedError`), publish to DLQ, and return ack.

4. **Persist**
   - Use `ProcessingJobStore.update(jobId, updater)` ensuring atomic status flip to `MetadataReady` and storing enrichment artifacts.
   - Record `updatedAt` and `metadataVersion`.

5. **Publish Downstream Messages**
   - Publish updated work message back to work topic with stage `MetadataReady` and the latest job snapshot.
   - Emit domain events (`JobStatusChanged`, `MetadataReady`) onto the events topic. Propagate `correlationId`.
   - Wrap publish calls in retry schedule (`Schedule.exponential`, jittered) with max attempts from config. Escalate to DLQ after exhausting retries, tagging logs/metrics.

6. **Respond**
   - On success, respond with `{ status: "ack" }`.
   - On handler failure (non-domain errors), return 500 to trigger redelivery. Ensure logs capture the exception and attempts.

## Error Handling

- Implement tagged errors:
  - `DecodeMessageError`, `StageMismatchError`, `MetadataEnrichmentError`, `PersistenceError`, `PublishError`.
  - Convert each to structured logs + metrics increments.
  - Use `Effect.catchTags` to map to HTTP responses (200 vs 500) and DLQ side effects.
- Distinguish fatal vs retryable:
  - Fatal: schema decode, unsupported media, already advanced status → log + ack.
  - Retryable: transient HTTP failures, datastore contention, publish failures → log + return 500 (nack), rely on Pub/Sub redelivery.
- Provide optional ack-extension util when fetching metadata (wrap long calls in `Effect.withFiberRuntime` to schedule `subscriber.extendAckDeadline`).

## Configuration & Dependencies

- Config layer `MetadataWorkerConfig` deriving from env vars: `WORK_TOPIC`, `EVENTS_TOPIC`, `DLQ_TOPIC`, timeout thresholds, max attempts, `PUBSUB_VERIFICATION_AUDIENCE`.
- Provide layers:
  - `PubSubClientLive` (work + event publishers, DLQ publisher).
  - `ProcessingJobStoreLive` (backed by Postgres/Firestore once available, stub storage for now).
  - `YoutubeApiClientLive`, `SpeakerRoleRegistryLive`.
  - `Logger`, `Tracer`, `Metrics` (shared platform layers).

## Observability

- Log events:
  - `metadata.worker.received`
  - `metadata.worker.stage_mismatch`
  - `metadata.worker.youtube_fetch_start` / `_success`
  - `metadata.worker.persist_success`
  - `metadata.worker.publish_success`
  - `metadata.worker.failure`
- Metrics:
  - Counter `metadata_worker_messages_total{result="success|skipped|failure"}`.
  - Histogram `metadata_worker_duration_ms` (handler runtime).
  - Counter `metadata_worker_redeliveries_total` (increment on attempt > 1).
  - Counter `metadata_worker_dlq_total`.
- Attach trace spans for enrichment and publish steps; propagate correlation IDs via trace attributes.

## Testing Strategy

- Unit tests with `@effect/vitest` using `TestClock` for retry timing.
- Contract tests for `MessageAdapter` round-tripping between push envelope and domain job.
- Integration tests using Pub/Sub emulator push -> ensure ack semantics and DLQ routes.
- Property tests verifying idempotent processing (processing the same message twice results in a single state change and single downstream publish).
- Simulate YouTube API errors using `TestServices` to ensure retries + fallback logging.

## Acceptance Criteria

1. Service compiles with `pnpm --filter @puredialog/worker-metadata build` and passes `pnpm test services/worker-metadata`.
2. `/health` returns `200 { status: "ok" }`.
3. Valid Pub/Sub push triggers enrichment, persists updates, publishes work + events, and responds with 200.
4. Malformed payloads log decoding errors, publish to DLQ, and still return 200.
5. Downstream publish failures retry with backoff and eventually raise to DLQ with structured log.
6. Metrics/logs include `jobId`, `requestId`, `stage`, and `correlationId` for every handler invocation.
