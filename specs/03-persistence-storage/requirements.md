### Requirements — 03 Persistence & Storage (Phase 2)

#### Scope

Drive-backed (or pluggable) persistence consuming domain events and providing retrieval interfaces.

#### Functional Requirements

- Write Artifacts
  - On `TranscriptReadyEvent`, write `transcript-{transcriptId}.json` under `transcripts/videos/{videoId}/`.
  - Maintain `metadata.json` snapshot per video.
  - Maintain dedupe file `transcripts/.dedup/{dedupeKey}.json` if absent.
- Retrieval
  - `getByJobId(jobId)` and `getByVideoId(videoId)` return decoded `Transcript`.
  - `getJob(jobId)` returns `ProcessingJob` with latest status timeline.
- Failure Archive
  - On `JobFailedEvent`, write failure record `transcripts/.failures/{jobId}.json`.

#### Non-Functional Requirements

- Atomic writes with temp staging then rename.
- Schema validation before write; reject invalid payloads.
- Deterministic JSON encoding (sorted keys) for diffability.

#### Security Requirements

- Do not log PII or full transcript content; log identifiers only.
- Enforce minimal scopes for Drive client; rotate tokens securely.

#### Observability Requirements

- Metrics: `storage_writes_total{artifact}`, `storage_write_duration_ms`.
- Logs: `persistence.transcript.stored`, `persistence.failure.archived`.

#### Acceptance Criteria

- [ ] Valid events result in correctly placed files with version `1.0.0`.
- [ ] Retrieval returns schema-validated values.
- [ ] Writes are atomic and idempotent.

#### Improvements/Simplifications

- Provide alternate adapter for Google Cloud Storage with the same interfaces.
