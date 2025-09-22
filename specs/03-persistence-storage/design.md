### Design — 03 Persistence & Storage (Phase 3)

#### Overview

Event-driven storage that writes transcripts and job artifacts to Drive (or GCS adapter), with atomic writes and schema validation.

#### Modules

- `listeners/TranscriptReady` — handles transcript writes.
- `listeners/JobFailed` — archives failure payloads.
- `stores/TranscriptStore` — interface + Drive/GCS implementations.
- `stores/ProcessingJobStore` — job snapshots and status timeline.
- `codecs/Json` — deterministic encoding with sorted keys.

#### Layers

- `DriveClientLayer` (pluggable `GcsClientLayer`).
- `TranscriptStoreLayer`, `ProcessingJobStoreLayer`.
- `LoggerLayer`, `MetricsLayer`, `ClockLayer`.

#### Write Flow

1. Validate event via domain codec.
2. Stage file to temp location; `rename` to final path.
3. Update dedupe record if absent.
4. Emit metrics and logs (include hashes for quick diffing).

#### Retrieval API (internal)

- `getByJobId`, `getByVideoId`, `getJob` returning decoded results.

#### References

- Patterns: `effect-resource-management-patterns.md`, `effect-schema-coding-patterns.md`.
