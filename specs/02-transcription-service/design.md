### Design — 02 Transcription Service (Phase 3)

#### Overview

Effect worker consuming `ProcessingJob` messages, orchestrating Gemini transcription, validating invariants, persisting artifacts, and emitting status/events.

#### Modules

- `subscriber/Worker` — Pub/Sub pull loop with concurrency control.
- `core/Transcribe` — main pipeline orchestrator.
- `adapters/GeminiClient` — streaming content wrapper with metrics.
- `adapters/TranscriptStore` — persistence interface.
- `adapters/StatusPublisher` — publishes job and transcript events.
- `core/Validation` — invariants and coherence checks.

#### Layers

- `SubscriberLayer`, `GeminiClientLayer`, `TranscriptStoreLayer`.
- `StatusPublisherLayer`, `ConfigLayer`, `LoggerLayer`, `MetricsLayer`, `ClockLayer`.

#### Pipeline

1. Decode job; transition `MetadataFetched → Processing`.
2. Load speaker roles; fetch/validate latest metadata (≤2% duration delta).
3. Call Gemini with canonical roles; accumulate streaming JSON to string.
4. Decode to `Transcript` via `Schema.decodeUnknownEffect`.
5. Run `Validation.checkAll(transcript, metadata)`.
6. On success: persist transcript, publish `TranscriptReadyEvent`, transition to `Completed`.
7. On failure: publish `JobFailedEvent`, transition to `Failed`.

#### Concurrency & Backpressure

- `Semaphore` set to N=5; each job runs within a scoped fiber.
- Ack deadline refresh scheduled; cancel on shutdown.

#### Error & Retry

- Wrap Gemini and IO in `Effect.retry` with exponential backoff for transient errors.
- Idempotent persistence: check existing transcript for jobId before write.

#### Observability

- Logs: starting, retrying, completed, failed.
- Metrics: jobs_inflight, duration_ms, failures_total{reason}; LLM metrics per call.

#### References

- Patterns: `effect-concurrency-patterns.md`, `effect-resource-management-patterns.md`, `effect-error-accumulation-yielding-patterns.md`.
