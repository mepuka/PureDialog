# Requirements: Ingestion Pub/Sub Client

## 1. Functional Requirements

1.1 The system shall expose an Effect-based `PubSubClient` service composed of:
- `Publisher` interface for publishing domain messages to Google Pub/Sub topics.
- `Subscriber` interface for running handlers against Pub/Sub subscriptions using Effect-managed fibers.

1.2 The publisher shall support sending `ProcessingJob` lifecycle messages—parameterized by media type—to a configurable work topic (`job-processing`) and event topic (`job-events`).

1.3 The publisher shall encode message payloads using existing domain `Schema` codecs, ensuring each media-type variant uses its corresponding payload shape and schema version tag.

1.4 The publisher shall attach minimal attributes including `jobId`, `userId`, `mediaType`, stage transition metadata, schema version, and an optional correlation identifier, omitting anything extraneous.

1.5 The subscriber shall decode incoming payloads using the corresponding `Schema` for the declared media type, rejecting messages that fail validation and routing them to Dead Letter Queue (DLQ) or retry logic as configured.

1.6 The subscriber shall support subscription filters on message attributes to route jobs by stage (e.g., `stage = "Queued"`, `stage = "MetadataReady"`).

1.7 The system shall treat `jobId` as the idempotency key, ensuring publishes are deterministic and safe to repeat; downstream consumers remain responsible for deduplicating persisted state.

1.8 The system shall ensure subscriber handlers are idempotent by exposing utilities or guidance for checking persisted job state before applying side effects.

1.9 The ingestion API shall publish a `ProcessingJob` message to `job-processing` and emit a `JobQueued` event on `job-events` for each new job request.

1.10 Metadata workers shall consume messages tagged with `stage = "Queued"`, enrich metadata, persist updates, and publish a `MetadataReady` job progression message.

1.11 Transcription workers shall consume messages tagged with `stage = "MetadataReady"`, execute transcription, and publish `TranscriptComplete` or `JobFailed` events as appropriate.

1.12 A projection/background process shall subscribe to `job-events` to maintain a query-optimized read model used by the API for status reads.

1.13 The subscriber utilities shall support configurable concurrency, acknowledgement deadlines, ack-deadline extension cadence, and backoff policies for retries.

## 2. Non-Functional Requirements

2.1 The client shall avoid using `async/await` or `try/catch` within `Effect.gen`, leveraging Effect error handling primitives instead.

2.2 All operations shall comply with at-least-once delivery semantics; handlers must tolerate duplicate deliveries through idempotent persistence logic.

2.3 Message processing must prevent PII leakage by restricting payloads and attributes to identifiers and non-sensitive metadata.

2.4 The system shall be deployable against Google Cloud Pub/Sub in production and the Pub/Sub emulator for local development and automated tests.

2.5 Observability shall include structured logging fields (`jobId`, `userId`, `stage`, `attempt`, correlation ID) and hooks for metrics (publish latency, handler duration, redelivery count, DLQ deliveries).

2.6 Subscriber handlers shall refresh acknowledgement deadlines for long-running operations on a configurable interval with jitter, ceasing extension immediately upon completion or cancellation.

2.7 Ordering keys shall be disabled; domain logic must validate state transitions to handle out-of-order messages safely.

2.8 Configuration must be managed through Effect Layers, aligning with existing repository patterns for service wiring and lifecycle management.
2.9 The system shall require IAM roles granting publish/subscribe access to configured topics/subscriptions while supporting emulator bypass without credentials.


## 3. Interfaces & Integrations

3.1 The `PubSubClient` layer shall depend on the Google Cloud Pub/Sub Node.js client library (`@google-cloud/pubsub`).

3.2 Integration points include existing ingestion services:
- `ProcessingJobStore` for persistence and idempotency checks.
- `SpeakerRoleRegistry` and `YouTubeClient` for metadata enrichment.
- Domain status models defined in `packages/domain/src`.

3.3 Emulator integration shall be toggleable via configuration, including endpoint overrides and authentication settings suitable for local development.

3.4 The projection process shall default to an in-memory read model updated from `job-events`, with optional extension points for durable persistence.

## 4. Configuration & Deployment

4.1 Topic and subscription names shall be configurable with sane defaults (`job-processing`, `job-events`, shared DLQ), allowing overrides per media type if future isolation is required.

4.2 Subscription filters shall be configurable to allow stage-based routing without redeploying code.

4.3 Dead Letter Queue (DLQ) configuration (subscription names, delivery attempts) shall default to a shared DLQ per topic while allowing per-stage overrides via configuration.

4.4 The system shall provide guidelines for running subscribers as background layers within the API service, including lifecycle hooks for startup, shutdown, and health checks.

4.5 Deployment documentation shall cover environment variables, required IAM permissions, and steps for enabling the Pub/Sub emulator in CI/local setups.

## 5. Testing Requirements

5.1 Provide integration tests against the Pub/Sub emulator covering publish/subscribe flows, filtering, and schema validation.

5.2 Provide contract tests ensuring each media-type variant's domain schema encodes/decodes consistently across the messaging boundary.

5.3 Provide tests for idempotent behavior (duplicate message processing), backpressure handling under bounded concurrency, and acknowledgement handling (ack vs nack vs DLQ).

5.4 Provide tests verifying observability fields are emitted for both publisher and subscriber paths.

## 6. Open Questions / Follow-Ups

- Determine whether dedicated DLQ subscriptions are required per stage or if a shared DLQ is sufficient (impacting configuration defaults).
- Decide whether the projection read model requires durable storage (e.g., database) or can remain in-memory with periodic checkpointing.
- Define target concurrency levels, retry/backoff policies, and ack extension cadence per subscriber type to balance throughput and resource usage.

