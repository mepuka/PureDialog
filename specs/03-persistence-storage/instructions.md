### 03 - Persistence & Storage

#### Feature Overview

Google Drive-backed persistence with versioned, schema-validated artifacts for transcripts and dedupe records.

#### Core Responsibilities

- Handle `TranscriptReadyEvent` subscriptions and write artifacts to Drive.
- Maintain `ProcessingJob` state snapshots for status queries.
- Support retrieval APIs keyed by `jobId` or `videoId`.

#### Storage Layout

- Transcript path: `transcripts/videos/{videoId}/transcript-{transcriptId}.json`.
- Metadata snapshot: `transcripts/videos/{videoId}/metadata.json`.
- Dedupe record: `transcripts/.dedup/{dedupeKey}.json` containing `{ jobId, videoId, userId, submittedAt }`.
- Failure archive: `transcripts/.failures/{jobId}.json` mirroring `JobFailedEvent` payload.
- Channel topic model cache: `transcripts/channels/{channelId}/topics.json` (includes `ChannelTopicModel` and hash).
- Glossary stats: `transcripts/videos/{videoId}/glossary-stats.json`.

All files embed `version: "1.0.0"` and must conform to schemas from `packages/domain`.

#### Writing Workflow

1. Receive `TranscriptReadyEvent`.
2. Validate payload using domain codec.
3. Stage file under temp name → move to target path (atomic rename).
4. Update dedupe record if missing.
5. Persist/update `ChannelTopicModel` and `glossary-stats` artifacts when provided.
6. Emit structured log `persistence.transcript.stored` (include `promptHash`, `topicsHash`).

#### Retrieval Interfaces

- `TranscriptStore.getByJobId(jobId)` and `.getByVideoId(videoId)` return decoded `Transcript` including metadata/glossary stats.
- `ProcessingJobStore.get(jobId)` returns domain `ProcessingJob` with latest status timeline.
- `ChannelTopicModelStore.get(channelId)` exposes cached topic/vocabulary hints for ingestion/transcription reuse.

#### Layers

- `DriveClientLayer` – handles auth and rate limiting.
- `JsonCodecLayer` – ensures consistent encoding (sorted keys for diffability).
- `ClockLayer` – deterministic timestamps for tests.

#### Observability

- Metrics: `storage_writes_total{artifact}`, `storage_write_duration_ms`, `storage_topics_updates_total`, `storage_glossary_updates_total`.
- Logs: successes and failures with `jobId`, `videoId`, plus `persistence.topics.updated`, `persistence.glossary.updated`.

#### Non-Goals

- No direct mutations of transcript content beyond schema validation.
- No cross-region replication (future phase).
