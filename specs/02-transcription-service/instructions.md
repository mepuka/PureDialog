### 02 - Transcription Service

#### Feature Overview

Worker that consumes `ProcessingJob` messages, orchestrates Gemini transcription, validates invariants, and updates job status via domain events.

#### Subscription Flow

1. Subscriber Layer reads from `transcription-jobs` topic using `ProcessingJobPayloadCodec`.
2. For each message:
   - Ack deadline set via backpressure policy (max 5 concurrent jobs by default).
   - Transition job status to `Processing` with `JobStatusChangedEvent` (`previous: MetadataFetched`); subsequent retries stay within `Processing` and emit telemetry events only (no duplicate status transitions).
   - Load speaker roles from `SpeakerRoleRegistry` (fail fast if missing).
   - Fetch latest `VideoMetadata` and compare against snapshot (duration delta ≤ 2%).

#### Transcription Pipeline

- **Gemini Call**
  - Use Effect streaming helpers to accumulate JSON; wrap with `LLMCall` instrumentation.
  - Prompt assembled via `PromptBuilder` using merged `PromptContext` (video metadata + prompt metadata + topic hints) and includes canonical host/guest labels from domain package.
  - On completion, build `Transcript` using domain Schema; decoding must pass `Schema.decodeUnknownEffect`.

- **Validation**
  - Run invariant suite returning `ReadonlyArray<ValidationResults>`; abort with `TranscriptionError` when any `Error` severity fails.
  - Enforce alternating speakers, confident timestamps, duration coverage.

- **Persistence & Events**
  - Persist transcript via `TranscriptStore.put(transcript)`.
  - Persist glossary feedback to `GlossaryStatsStore` and embed latest stats within transcript metadata.
  - Emit `TranscriptReadyEvent` (including `promptHash`) and `JobStatusChangedEvent` (`Processing → Completed`).
  - Capture metrics (`LLMMetrics`) and log `transcription.llm.completed`.

#### Failure Handling

- On recoverable errors (Gemini 5xx, transient network):
  - Emit `JobStatusChangedEvent` with `next: Processing` and increment `attempts`.
  - Retry with exponential backoff respecting Pub/Sub ack deadline.
- On unrecoverable errors (validation failure, invalid metadata, DLQ ack deadline exceeded):
  - Emit `JobFailedEvent` and set status `Failed`.
  - Persist failure details in `ProcessingJob.lastError`.

#### DLQ Guidance

- Dead-letter topic: `transcription-jobs-dlq`.
- Payload identical to source plus serialized `DomainError`.
- Operational process: daily job scans DLQ and either retries (new `JobId`) or archives after manual review.

#### Layers & Dependencies

- `SubscriberLayer` – typed Pub/Sub consumer.
- `GeminiClientLayer` – wraps streaming API with metrics collection.
- `TranscriptStoreLayer` – ensures atomic writes.
- `PromptBuilderLayer` – constructs preamble from `PromptContext` (spec 02).
- `MetadataEnhancerLayer` – merges video metadata, prompt metadata, and topic hints prior to prompt assembly.
- `GlossaryStatsStoreLayer` – captures verification feedback loops.
- `MetricsLayer`, `LoggerLayer`, `ConfigLayer` (ack deadlines, concurrency limit).
- `SpeakerRoleRegistryLayer` – shared with ingestion for consistent host/guest mapping.

#### Telemetry

- Logs: `transcription.job.starting`, `transcription.llm.retrying`, `transcription.job.completed`, `transcription.job.failed`, `metadata.inference.used`, `metadata.override.applied`.
- Metrics: `transcription_jobs_inflight`, `transcription_duration_ms`, `transcription_failures_total{reason}`, `metadata.inference_used_total`, `metadata.override_rate`.

#### Outputs

- Persisted `Transcript` artifact.
- `TranscriptReadyEvent`, `JobStatusChangedEvent`, and (when necessary) `JobFailedEvent` published to their respective topics.

#### Metadata-Driven Prompt Optimisation

Focus the refinement work on richer metadata extraction and smarter first-pass prompting to avoid avoidable errors:

- **Enhanced Metadata Snapshot**
  - Before invoking Gemini, enrich the `ProcessingJob.metadataSnapshot` with domain hints: probable topic tags, glossary of proper nouns (from ingestion), detected accent cues, and prior transcript summaries for the same channel.
  - Use dedicated `MetadataEnhancer` Layer (`enhance(metadata) -> Effect.Effect<VideoMetadata, DomainError>`) to keep transformations pure and testable.

- **Prompt Construction Discipline**
  - Centralise prompt assembly in a `PromptBuilder` service that consumes the enhanced metadata. Ensure every prompt includes: speaker roles, domain glossary, expected tone (formal/informal), and instructions to preserve diarization fidelity.
  - Cache prompt templates in configuration, exposing knobs for glossary length and confidence thresholds.

- **Runtime Guardrails**
  - Validate prompt payloads against Schema before sending to Gemini to prevent malformed instructions.
  - Log the derived glossary and prompt attributes for observability; redact sensitive terms per security guidance.

- **Continuous Feedback Loop**
  - Capture post-run statistics of misrecognised proper nouns and feed them back into the metadata enhancer so future prompts become progressively smarter without a second pass.

By investing in metadata accuracy and prompt quality up front, we reduce accent and jargon mistakes for the core pass.

#### Domain Verification Pass (Final Spell & Terminology Guard)

- After the main transcript is produced, run a lightweight, deterministic verification effect:
  - `DomainVerifier.verify({ transcript, glossary, metadata }) -> Effect.Effect<Transcript, DomainError>`.
  - Responsibilities: enforce glossary spellings, confirm critical entities, surface unresolved jargon as structured `ValidationResults`.
- Keep the verifier text-only (no audio rescore) to maintain fast turnaround.
- Emit corrections as a diff applied through domain Schema decoders; fail with `DomainError` only when mandatory terms remain incorrect.
- Record verified glossary hits to feed back into ingestion so metadata extraction stays the top priority.

This keeps the pipeline primarily single-pass while guaranteeing a final, domain-faithful transcript.
