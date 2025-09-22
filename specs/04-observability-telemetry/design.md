### Design — 04 Observability & Telemetry (Phase 3)

#### Overview

Unified logging, metrics, and (optional) tracing with correlation ID propagation and a status event stream for UI.

#### Modules

- `logging/Logger` — JSON logger with fields: `jobId`, `videoId`, `status`, `correlationId`.
- `metrics/Registry` — counters and histograms; pluggable sink (stdout/local, Cloud Monitoring later).
- `status/Publisher` — publishes `JobStatusChangedEvent`.
- `http/Health` — `/health/live`, `/health/ready`.
- `status/Gateway` — optional SSE service bridging Pub/Sub to clients.

#### Layers

- `LoggerLayer`, `MetricsLayer`, `StatusPublisherLayer`, `ConfigLayer`, `ClockLayer`.

#### Correlation & Tracing

- Generate/propagate `correlationId` per request/job.
- Carry `traceparent` via Pub/Sub attributes; tracing exporter optional in MVP.

#### References

- Patterns: `effect-observability-patterns.md`.
