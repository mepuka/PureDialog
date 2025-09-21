### 04 - Observability & Telemetry

#### Feature Overview

Provide end-to-end visibility across ingestion and transcription via structured logs, metrics, traces, and job status events.

#### Metrics

- `videos_processed_total{status}` (status from `JobStatus`).
- `transcription_duration_ms` (distribution).
- `gemini_latency_ms`, `gemini_cost_usd` sourced from `LLMMetrics`.
- `tokens_used_total{type="prompt|completion"}`.

#### Logs

- All logs JSON-structured with `jobId`, `videoId`, `status`, `correlationId`.
- Key events: `ingestion.request.accepted`, `ingestion.job.published`, `transcription.job.starting`, `transcription.job.completed`, `transcription.job.failed`, `persistence.transcript.stored`.
- Errors include serialized `DomainError`.

#### Tracing

- Span hierarchy: `HTTP ingest` → `Publish job` → `Transcription worker` → `Gemini call` → `Persist transcript`.
- Propagate context via Pub/Sub attributes `traceparent` and `correlationId`.

#### Status Stream

- `job-status` topic carries `JobStatusChangedEvent` for UI streaming.
- Provide SSE gateway service that converts events into client updates; payload `{ jobId, next, previous, at }`.

#### Health & Readiness

- Ingestion: checks YouTube quota status, Pub/Sub publish.
- Transcription: checks subscriber pull, Gemini auth, storage write token.
- Expose `/health/live` and `/health/ready` on both services.

#### Non-Goals

- External dashboards (handled in deployment infra).
- Alerting policies (future phase).
