### Requirements — 02 Transcription Service (Phase 2)

#### Scope

Worker that consumes `ProcessingJob`, orchestrates Gemini transcription, validates invariants, persists artifacts, and emits status/events.

#### Functional Requirements

- Subscription
  - Pull from `transcription-jobs` with ack deadline 600s; max 5 concurrent jobs.
  - Decode messages via `ProcessingJobPayloadCodec`.
  - Update status `MetadataFetched → Processing` with `JobStatusChangedEvent`.
- Processing
  - Load canonical `SpeakerRoleRegistry` and `VideoMetadata`.
  - Enforce duration delta ≤ 2% vs snapshot.
  - Call Gemini via `GeminiClient` with host/guest labels; accumulate JSON stream.
  - Decode to `Transcript` via `Schema.decodeUnknownEffect`.
  - Validate invariants (non-overlap, chronology, exactly two speakers, confidence threshold).
  - Persist transcript and metrics via `TranscriptStore`.
  - Emit `TranscriptReadyEvent` and `JobStatusChangedEvent(Processing → Completed)`.

#### Non-Functional Requirements

- Concurrency control; backpressure when ≥5 inflight jobs.
- Timeouts and safe cancellation on ack deadline approach.
- Idempotent processing per `jobId` (safe re-delivery handling).

#### Error & Retry Requirements

- Transient errors: retry with exponential backoff within ack window; log `retryCount`.
- Terminal errors: publish `JobFailedEvent`, set status `Failed`, store details.
- DLQ subscription configured to `transcription-jobs-dlq` after 5 deliveries.

#### Observability Requirements

- Logs: start, retrying, completed, failed; include `LLMMetrics` summary.
- Metrics: `transcription_jobs_inflight`, `transcription_duration_ms`, `transcription_failures_total{reason}`.

#### Acceptance Criteria

- [ ] Subscriber respects concurrency and ack deadlines.
- [ ] Valid transcripts persist and events publish; invalid ones fail deterministically.
- [ ] Re-delivery does not create duplicate artifacts.

#### Improvements/Simplifications

- Start with a single model variant and temperature=0; defer model selection feature.
- Persist intermediate streaming chunks only in memory; no partial artifact writes in MVP.
