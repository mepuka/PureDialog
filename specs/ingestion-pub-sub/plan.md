# Implementation Plan: Ingestion Pub/Sub Client

## Phase Overview
- **Scope**: Introduce Pub/Sub client services, configuration, and integration points for ingestion workflows without altering existing domain schemas.
- **Dependencies**: `@google-cloud/pubsub`, domain schemas (`packages/domain/src`), ingestion services (`packages/services/ingestion`).

## Step-by-Step Plan

### 1. Baseline Investigation & Setup
1.1 Review existing ingestion service structure, configuration facilities, and domain schemas (`ProcessingJob`, job stages, events).
1.2 Inspect patterns in `patterns/effect-platformhttpapi-patterns.md` and related docs for Layers, concurrency, and resource management.
1.3 Ensure workspace dependencies include `@google-cloud/pubsub`; add to appropriate package if missing.
1.4 Create placeholder tests and emulator configuration scaffolding for Pub/Sub integration.

### 2. Define Configuration & Types
2.1 Introduce `PubSubConfig` type and `PubSubConfigLive` layer (likely under `packages/services/ingestion/src/services/` or new module).
2.2 Add configuration wiring (environment variables / config file updates) with defaults for topics, subscriptions, ack settings, concurrency, media type filters.
2.3 Define `PubSubAttributes`, `PublishRequest`, and `SubscribeContext` types referencing domain IDs and stage/media type sum types.

### 3. Implement PubSubClient Service (Publisher)
3.1 Create `PubSubClient` interface describing `publish` and `runSubscriber` methods.
3.2 Implement `PubSubClientLive` publisher:
- Use `Schema.encode` to serialize payloads; convert to `Buffer`.
- Use `Effect.tryPromise` wrapping `topic.publishMessage`.
- Attach minimal attributes (converted to strings) including schema version and correlation ID.
- Apply retry schedule using Effect `Schedule` and configuration-driven attempts/backoff.
3.3 Implement error tagging via `PublishError` (extending `Data.TaggedError`).

### 4. Implement PubSubClient Service (Subscriber)
4.1 Wrap Pub/Sub subscription pulling with Effect-managed fibers, enforcing concurrency via `Semaphore` or `Queue` pattern.
4.2 For each message:
- Decode schema based on `mediaType` attribute using `Schema.decodeUnknownEffect`.
- Spawn ack-deadline extension fiber using configured interval with jitter; cancel on completion.
- Execute handler supplied by consumer; on success -> ack; on retryable error -> nack; after max attempts -> publish to DLQ and ack.
- Ensure structured logging and metrics hooks.
4.3 Implement error tagging (`SubscribeError`, `DecodeError`, `AckError`).
4.4 Provide interruption-safe shutdown by wiring subscribers through `Scope` and `Effect.forever` loops.

### 5. Integration Layers & Utilities
5.1 Provide helper functions/utilities for idempotent state transitions (`ensureStageTransition`), located near `ProcessingJobStore` integration.
5.2 Wire new `PubSubClient` layer into ingestion API service and worker startup sequences.
5.3 Update API request flow to publish `ProcessingJob` to work topic and `JobQueued` to events topic via new service.
5.4 Implement Metadata and Transcription worker subscriber wiring using `PubSubClient.runSubscriber`, ensuring stage filters and handler logic leverage existing services.
5.5 Implement `IngestionProjectionLive` subscriber to maintain in-memory read model for API status reads.

### 6. Configuration & Deployment Docs
6.1 Update configuration documentation and `.env.example` (if applicable) with new Pub/Sub settings.
6.2 Document IAM role requirements and emulator setup steps.
6.3 Ensure CLI/scripts for creating topics/subscriptions are noted or referenced.

### 7. Testing Strategy Execution
7.1 Add emulator-based integration tests covering publish and subscribe flows, including stage filtering and schema decoding.
7.2 Add contract tests verifying encode/decode for each media-type variant using domain schemas.
7.3 Add tests for retries, nack -> DLQ flow, and ack extension cancellation.
7.4 Provide tests for projection read model updates and API consumption.

### 8. Validation & Tooling
8.1 Run lint, type-check (`pnpm lint --fix`, `pnpm tsc`, `pnpm check`) per modified file requirements.
8.2 Run pub/sub integration tests (`pnpm test <...>`), emulator if needed.
8.3 Run `pnpm docgen` to verify JSDoc examples compile.

### 9. Rollout Considerations
9.1 Prepare feature flag or configuration toggle to enable Pub/Sub client in staging before production.
9.2 Verify observability (logs/metrics) with sample runs.
9.3 Document rollback strategy (disable subscribers, revert config) in spec or deployment notes.

## Deliverables
- Source code implementing `PubSubConfig`, `PubSubClient` (publisher/subscriber), and associated layers.
- Updated ingestion API and worker wiring.
- In-memory projection subscriber.
- Configuration documentation and scripts/pointers.
- Comprehensive tests (unit, integration, contract) leveraging Pub/Sub emulator.
- Updated spec docs reflecting decisions/resolutions on open questions.

