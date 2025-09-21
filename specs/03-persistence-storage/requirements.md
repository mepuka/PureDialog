### Requirements — 03 Persistence & Storage (Phase 2)

#### Scope

Drive-backed (or pluggable) persistence consuming domain events and providing retrieval interfaces.

#### Functional Requirements

- Write Artifacts
  - On `TranscriptReadyEvent`, write `transcript-{transcriptId}.json` under `transcripts/videos/{videoId}/`.
  - Maintain `metadata.json` snapshot per video (includes `PromptMetadata`, `PromptContext`, `preambleHash`).
  - Maintain dedupe file `transcripts/.dedup/{dedupeKey}.json` if absent.
  - Persist `topics.json` per channel when `ChannelTopicModel` hash changes.
  - Persist `glossary-stats.json` per video when verification data provided.
- Retrieval
  - `getByJobId(jobId)` and `getByVideoId(videoId)` return decoded `Transcript` including metadata/glossary stats.
  - `getJob(jobId)` returns `ProcessingJob` with latest status timeline.
  - `getChannelTopics(channelId)` returns cached `ChannelTopicModel` with hash.
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

- Metrics: `storage_writes_total{artifact}`, `storage_write_duration_ms`, `storage_topics_updates_total`, `storage_glossary_updates_total`.
- Logs: `persistence.transcript.stored`, `persistence.topics.updated`, `persistence.glossary.updated`, `persistence.failure.archived`.

#### Acceptance Criteria

- [ ] Valid events result in correctly placed files with version `1.0.0` (transcript, metadata, topics, glossary).
- [ ] Retrieval returns schema-validated values for transcripts, jobs, and channel topics.
- [ ] Writes are atomic and idempotent.
- [ ] Hash changes trigger topic/glossary update metrics/logs.

#### Improvements/Simplifications

- Provide alternate adapter for Google Cloud Storage with the same interfaces.
