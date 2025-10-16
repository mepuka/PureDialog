# Metadata Worker - Instructions

## Overview

`@puredialog/worker-metadata` processes newly queued transcription jobs via **Eventarc Advanced CloudEvents**. The service receives HTTP POST requests from Eventarc Pipelines when GCS objects are created in `jobs/Queued/`. Each CloudEvent triggers metadata enrichment (YouTube lookups today, additional providers later), and atomically moves the job file to `jobs/Processing/` to trigger the next stage.

## Responsibilities

- Accept CloudEvents HTTP POST on `/` endpoint, parse CloudEvents v1.0 envelope with GCS object finalized payload
- Extract `jobId` and `status` from CloudEvent `subject` field (`objects/jobs/Queued/{jobId}.json`)
- Enforce idempotency: validate job is still in `Queued` state; skip processing if already advanced
- Fetch external metadata:
  - `media.type === "youtube"`: resolve via `YouTube.YouTubeClient` from `@puredialog/domain` (domain layer service)
  - Prepare hooks for future media types with a dispatcher function
- Enrich job with metadata (title, description, duration, tags, speaker hints)
- **Atomic state transition**: Write enriched job to `jobs/Processing/{jobId}.json`, then delete from `jobs/Queued/{jobId}.json`
- Write immutable event log: `JobStatusChanged` event to `events/{jobId}/{timestamp}_status_changed.json`
- Return HTTP 200 with structured response on all outcomes (success and errors) to prevent Eventarc retries
- Move job to `jobs/Failed/{jobId}.json` on non-recoverable errors
- Emit structured logs for each decision point (`metadata.worker.received`, `metadata.worker.skipped`, `metadata.worker.enriched`, `metadata.worker.failed`) with `jobId`, `requestId`, `mediaType`, and timing metrics
- Surface metrics counters/histograms: handler duration, YouTube API latency, success/skip/failure rates

## HTTP Surface

- Use Effect's `HttpApi`/`HttpApiBuilder` pattern:
  - API name: `MetadataWorkerApi` with groups `health` (`GET /health`) and `events` (`POST /`)
  - `POST /` endpoint accepts CloudEvents v1.0 format:
    ```ts
    interface CloudEventRequest {
      readonly id: string
      readonly source: string // "//storage.googleapis.com/projects/_/buckets/BUCKET"
      readonly specversion: "1.0"
      readonly type: "google.cloud.storage.object.v1.finalized"
      readonly subject: string // "objects/jobs/Queued/{jobId}.json"
      readonly time: string // ISO 8601
      readonly data: GcsObjectMetadata
    }
    ```
  - Decode the body using `Workers.WorkerCloudEventRequest` schema from `@puredialog/domain`
  - Parse GCS metadata from `data` field using `Events.GcsObjectMetadata` schema
  - Extract job info using `extractJobFromSubject(event.subject)` from `@puredialog/storage`
  - Always return HTTP 200 with structured JSON response (success or error) to prevent Eventarc retries
  - Response schemas: `Workers.WorkerProcessingResponse` or `Workers.WorkerErrorResponse`
- Add middleware for OIDC token validation in future (Eventarc sends signed JWTs); keep the spec extensible

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
     - Fetch video metadata via `YouTube.YouTubeClient` from `@puredialog/domain` (domain layer service).
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
  - `YouTube.YouTubeClientLive` from `@puredialog/domain`, `SpeakerRoleRegistryLive`.
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
