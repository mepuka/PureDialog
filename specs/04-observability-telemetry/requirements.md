### Requirements — 04 Observability & Telemetry (Phase 2)

#### Scope

Cross-cutting metrics, logs, traces, and status event stream support across services.

#### Functional Requirements

- Metrics
  - `videos_processed_total{status}` counter.
  - `transcription_duration_ms` histogram.
  - `gemini_latency_ms`, `tokens_used_total{type}` and `gemini_cost_usd`.
- Logs
  - JSON logs including `jobId`, `videoId`, `status`, `correlationId`.
  - Emit key events across ingestion/transcription/persistence.
- Tracing
  - Propagate `traceparent` and `correlationId` via Pub/Sub attributes.
- Status Stream
  - Publish `JobStatusChangedEvent` to `job-status` topic.
  - Optional SSE proxy service to stream status to clients (future work).

#### Non-Functional Requirements

- No secrets or PII in logs; redact tokens.
- Low-overhead logging; sampling allowed for verbose categories.

#### Acceptance Criteria

- [ ] Metrics counters/histograms increment and record on local runs.
- [ ] Logs are structured and correlate across services with the same `correlationId`.
- [ ] Status change events are published on each transition.

#### Improvements/Simplifications

- Start without full tracing provider; rely on correlation IDs first.
