### Requirements — 04 Observability & Telemetry (Phase 2)

#### Scope

Cross-cutting metrics, logs, traces, and status event stream support across services.

#### Functional Requirements

- Metrics
  - `videos_processed_total{status}` counter.
  - `transcription_duration_ms` histogram.
  - `gemini_latency_ms`, `tokens_used_total{type}` and `gemini_cost_usd`.
  - `metadata.applied_total`, `metadata.missing_fields_total`, `metadata.inference_used_total`, `metadata.override_rate`.
  - `nlp.topic_tags_generated_total`, `nlp.channel_model_updates_total`, `storage_topics_updates_total`, `storage_glossary_updates_total`.
- Logs
  - JSON logs including `jobId`, `videoId`, `status`, `correlationId`, `metadataVersion`, `promptHash`.
  - Emit key events across ingestion/transcription/persistence (metadata applied/missing, topics/glossary updates).
- Tracing
  - Propagate `traceparent` and `correlationId` via Pub/Sub attributes.
- Status Stream
  - Publish `JobStatusChangedEvent` to `job-status` topic (include prompt/metadata hashes).
  - Publish `MetadataAppliedEvent` to `metadata-events` topic for observability.
  - SSE proxy service (`services/status-gateway`) streams combined events to clients.

#### Non-Functional Requirements

- No secrets or PII in logs; redact tokens.
- Low-overhead logging; sampling allowed for verbose categories.

#### Acceptance Criteria

- [ ] Metrics counters/histograms increment and record on local runs (including metadata/NLP/storage counters).
- [ ] Logs are structured and correlate across services with the same `correlationId` and `metadataVersion`/`promptHash`.
- [ ] Status change and metadata events are published on each transition.
- [ ] Health endpoints verify connectivity to ChannelTopicModel/Glossary stores and security layers.

#### Improvements/Simplifications

- Start without full tracing provider; rely on correlation IDs first.
