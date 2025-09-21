### 04 - Observability & Telemetry

#### Feature Overview

Provide end-to-end visibility across ingestion and transcription via structured logs, metrics, traces, and job status events.

#### Metrics

- `videos_processed_total{status}` (status from `JobStatus`).
- `transcription_duration_ms` (distribution).
- `gemini_latency_ms`, `gemini_cost_usd` sourced from `LLMMetrics`.
- `tokens_used_total{type="prompt|completion"}`.
- Metadata pipeline counters: `metadata.applied_total`, `metadata.missing_fields_total`, `metadata.inference_used_total`, `metadata.override_rate`.
- NLP/persistence counters: `nlp.topic_tags_generated_total`, `nlp.channel_model_updates_total`, `storage_topics_updates_total`, `storage_glossary_updates_total`.

#### Logs

- All logs JSON-structured with `jobId`, `videoId`, `status`, `correlationId`.
- Key events: `ingestion.request.accepted`, `ingestion.job.published`, `metadata.applied`, `metadata.missing`, `transcription.job.starting`, `transcription.llm.retrying`, `transcription.job.completed`, `transcription.job.failed`, `persistence.transcript.stored`, `persistence.topics.updated`, `persistence.glossary.updated`.
- Errors include serialized `DomainError` (redacted sensitive metadata fields).

#### Tracing

- Span hierarchy: `HTTP ingest` → `Metadata enrichment` → `Publish job` → `Transcription worker` → `Gemini call` → `Verification` → `Persist transcript`.
- Propagate context via Pub/Sub attributes `traceparent`, `correlationId`, and attach `metadataVersion`/`promptHash` as span attributes.

#### Status Stream

- `job-status` topic carries `JobStatusChangedEvent` for UI streaming (include `metadataVersion`, `PromptHash`).
- `metadata-events` topic carries `MetadataAppliedEvent` for dashboards.
- Provide SSE gateway service (planned in monorepo as `services/status-gateway`) that converts events into client updates; payload `{ jobId, next, previous, at, metadataVersion, promptHash }`.

#### Health & Readiness

- Ingestion: checks YouTube quota status, Pub/Sub publish, `ChannelTopicModelStore` reachability, Auth/RateLimit layer wiring.
- Transcription: checks subscriber pull, Gemini auth, storage write token, `GlossaryStatsStore` health, prompt template checksum.
- Expose `/health/live` and `/health/ready` on both services.

#### Non-Goals

- External dashboards (handled in deployment infra).
- Alerting policies (future phase).
