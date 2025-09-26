# Transcription Worker - Instructions

## Overview

`@puredialog/worker-transcription` consumes Pub/Sub work messages whose `stage` is `"MetadataReady"`. For each job it transitions the status to `Processing`, orchestrates transcript generation via the Gemini LLM service, persists the resulting transcript artifact, and publishes completion/failure events back onto the messaging fabric.

## Responsibilities

- Expose an Effect-based HTTP endpoint that accepts Pub/Sub push notifications, validates the envelope, and decodes the embedded `ProcessingJob` payload (stage `MetadataReady`).
- Enforce idempotency: skip/ack messages whose job has already advanced beyond `MetadataReady`.
- Transition the job to `Processing` before invoking the LLM, persisting the state change and emitting a `JobStatusChanged` event.
- Acquire transcription inputs (media URL, speaker configuration, metadata snapshot) and invoke the Gemini transcription service (`@puredialog/gemini`).
- Stream intermediate chunks to storage/logs if available, capturing usage metadata for observability.
- Persist the final `Transcript` domain entity (and any metadata: token usage, runtime) via `TranscriptStore`.
- Update the job status to `Completed` (or `Failed` on errors) and publish the appropriate events (`TranscriptComplete`, `JobFailed`, plus corresponding `JobStatusChanged`).
- Manage retries, ack deadlines, and DLQ routing according to Pub/Sub semantics, ensuring long-running transcription can continue via periodic ack extensions.
- Emit structured logs and metrics for every job attempt.

## HTTP Surface

- Adopt the same `HttpApi`/`HttpApiBuilder` pattern as other services.
  - API name: `TranscriptionWorkerApi`.
  - Groups: `health` (`GET /health`) and `pubsub` (`POST /pubsub`).
  - Request schema identical to metadata worker (`PubSubPushBody`). Reuse a shared module if helpful.
- `/pubsub` handler returns 200/JSON `{"status":"ack"}` for successes and fatal errors; return 500 for retryable failures.
- Add optional middleware for OIDC token validation once identity requirements are finalized.

## Business Logic Flow

1. **Decode Push Envelope**
   - Validate body via `Schema`.
   - Convert `message.data` (base64) into a `ProcessingJob` using `MessageAdapter.decodeWorkMessage`.
   - Extract `attempt`, `correlationId`, and `deliveryAttempt` attributes.

2. **Idempotency Guard**
   - Call `ProcessingJobStore.ensureStageTransition(jobId, "MetadataReady")`.
   - If already `Processing`/`Completed`/`Failed`, log `transcription.worker.skipped` and ack.

3. **Mark as Processing**
   - Persist stage change to `Processing` with `ProcessingJobStore.update(jobId, patch)` (increment attempts, set `startedProcessingAt`).
   - Publish `JobStatusChanged` event (`MetadataReady` → `Processing`).
   - Continue only after successful persistence/publish; on failure return 500.

4. **Prepare Transcription Inputs**
   - Resolve speaker configuration using `SpeakerRoleRegistry` or metadata snapshot fallback.
   - Retrieve any cached metadata/artifacts required by Gemini (e.g., `YoutubeApiClient` for high-confidence metadata, signed media URLs from storage).
   - Construct `GeminiTranscriptionRequest` (job id, media resource, speaker configs, optional prompt overrides) using types defined in `@puredialog/gemini` spec.

5. **Run Transcription**
   - Use `GeminiTranscriptionLive` layer to invoke Gemini via streaming.
   - Handle streaming in Effect:
     - Buffer chunks to assemble final transcript JSON.
     - Optionally persist incremental progress to `ProcessingJobStore.appendIntermediate(jobId, chunk)` for monitoring (future enhancement).
   - Enforce timeout/backoff defined in config; extend ack deadline every N seconds via subscriber handle while streaming.

6. **Persist Transcript & Finalize Job**
   - Validate Gemini output against domain `Transcript` schema.
   - Persist via `TranscriptStore.upsert(transcript)` and link to job.
   - Update job to `Completed`, store `transcriptId`, `runtimeMs`, redaction metadata, and clear `error` field.
   - Publish `TranscriptComplete` + `JobStatusChanged` (`Processing` → `Completed`).

7. **Respond**
   - On success: structured log `transcription.worker.completed`, metrics increments, return ack.
   - On failure:
     - `GeminiUnavailableError`, `TransientNetworkError`, `StorageTimeoutError`: log `warning`, schedule ack extension if continuing, return 500 to trigger redelivery (respect max attempts).
     - Non-retryable (`UnsupportedMediaType`, schema decode, exceeded max attempts, quota exhausted flagged fatal): publish `JobFailed` event, update job to `Failed`, ack.
   - Ensure DLQ publishing occurs when attempts exceed configured threshold.

## Error Handling

- Tagged errors to model failure modes:
  - `DecodeMessageError`, `StageMismatchError`.
  - `TranscriptionStartError` (when failing to mark job `Processing`).
  - `GeminiInvocationError` (wraps API issues with retry classification).
  - `TranscriptValidationError` (LLM result failed schema check).
  - `PersistenceError`, `PublishError`.
- Use `Effect.catchTags` to translate to: ack (fatal), nack (retryable), or ack + DLQ (poison message).
- Always wrap side effects with `return yield*` when emitting failures inside generators.
- Propagate correlation ids / trace spans for diagnostics.

## Configuration & Dependencies

- `TranscriptionWorkerConfig` (env-driven):
  - `WORK_TOPIC`, `EVENTS_TOPIC`, `DLQ_TOPIC` names.
  - `GEMINI_MODEL`, `GEMINI_API_KEY` secret binding (via Config service).
  - `MAX_ATTEMPTS`, `ACK_EXTENSION_SECONDS`, `EXECUTION_TIMEOUT_MS`.
- Layers required:
  - `PubSubClientLive` for publish + ack extension helpers.
  - `GeminiTranscriptionLive` (built atop `@effect/ai-google`).
  - `ProcessingJobStoreLive`, `TranscriptStoreLive` (once implemented).
  - Optional `AudioFetcherLive` for downloading media assets when Gemini requires direct audio streams.
  - Observability layers (logger, tracer, metrics) shared with other services.

## Observability

- Structured logs at key points:
  - `transcription.worker.received`
  - `transcription.worker.stage_mismatch`
  - `transcription.worker.processing_started`
  - `transcription.worker.gemini_request`
  - `transcription.worker.gemini_chunk`
  - `transcription.worker.persist_success`
  - `transcription.worker.completed`
  - `transcription.worker.failed`
- Metrics:
  - Counter `transcription_worker_messages_total{result="success|skipped|failure"}`.
  - Histogram `transcription_worker_duration_ms`.
  - Counter `transcription_worker_redeliveries_total` (attempt > 1).
  - Counter `transcription_worker_dlq_total`.
  - Gauge/Histogram for `gemini_stream_latency_ms`, `gemini_tokens_total`.
- Attach trace spans: `handle`, `mark-processing`, `gemini-call`, `persist`, `publish`.

## Testing Strategy

- Unit tests with `@effect/vitest` mocking `GeminiTranscription` to emit deterministic chunks.
- Integration tests using Pub/Sub emulator + fake Gemini service verifying ack/nack behaviour and stage transitions.
- Property tests ensuring idempotent processing: duplicate message → single transcript persisted.
- Failure scenario tests: Gemini timeout -> returns 500 to trigger redelivery; schema mismatch -> job marked failed + ack; storage error -> retry with eventual DLQ.
- Test ack extension scheduling using `TestClock` to advance virtual time.

## Acceptance Criteria

1. Service builds with `pnpm --filter @puredialog/worker-transcription build` and its test suite passes.
2. `/health` endpoint responds `200 { status: "ok" }`.
3. Valid `MetadataReady` work message results in job state transitions (`Processing` → `Completed`) and publishes `TranscriptComplete`.
4. Gemini/transcript failures publish `JobFailed`, mark job failed, and ack the push.
5. Logs and metrics include `jobId`, `requestId`, `stage`, `attempt`, and `correlationId`.
6. Ack extension logic prevents timeouts for long-running jobs in integration tests.
