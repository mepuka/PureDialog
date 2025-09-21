### 01 - Ingestion Service

#### Feature Overview

Effect-based HTTP façade that accepts YouTube URLs, resolves speaker roles, validates metadata, and publishes `ProcessingJob` records to Pub/Sub.

#### Core Functionality

- `POST /api/v1/ingest`

  - Body: `{ url: string, userId: string, speakers?: { host: string; guest: string }, metadata?: PromptMetadataInput }`.
  - Steps:
    1. Parse URL → `VideoId` via domain decoder.
    2. Resolve speaker roles: prefer stored registry mapping; fall back to `metadata.speakers`, then request payload; if unresolved, enqueue with generic `HOST/GUEST` labels and emit `MetadataAppliedEvent` noting missing fields.
    3. Deduplicate using `DedupStore.acquire` (returns existing job if found).
    4. Fetch `VideoMetadata` from YouTube (satisfied via `YouTubeClient`).
    5. Update or reuse `ChannelTopicModel` (spec 03) when channel hash differs; attach `topicHints`/`vocabHints` to job snapshot.
    6. Create `ProcessingJob` with `status = Queued`, `metadataSnapshot`, `topicHints`, `preambleHash`, `dedupeKey`.
    7. Publish `JobQueuedEvent` with codec-defined payload including `userId` and `metadataVersion`.
  - Response: `{ jobId: string }` for new or existing job.

- `GET /api/v1/jobs/:jobId`

  - Returns `ProcessingJob` projection limited to `jobId`, `status`, `submittedAt`, `attempts`, `lastError?`, `relatedFailures`.
  - Derived field `statusTimeline`: array of `{ status: JobStatus; at: string }` stitched from `JobStatusChangedEvent` stream (see below).

- `GET /api/v1/jobs/:jobId/metadata`

  - Returns `VideoMetadata` snapshot enriched with latest `PromptMetadata` and `ChannelTopicModel` references.

#### Job Lifecycle & Status Handling

- Ingestion owns transitions from `Queued → MetadataFetched`.
- Publishing to Pub/Sub updates status to `MetadataFetched` and emits `JobStatusChangedEvent` (`previous: Queued`, `next: MetadataFetched`).
- Any failure before publish surfaces as `DomainError` with HTTP 422.

#### Pub/Sub Contract

- Topic: `transcription-jobs` (configurable).
- Payload: `ProcessingJob` encoded through `ProcessingJobPayloadCodec` defined in domain package.
- Attributes:
  - `jobId`
  - `videoId`
  - `schemaVersion` (`1.0.0`)
- On publish success, emit `JobStatusChangedEvent` to `job-status` topic.

#### Layers & Dependencies

- `ConfigLayer` – projectId, topic names, retry backoff.
- `DedupStoreLayer` – Drive-backed or memory (local dev).
- `YouTubeClientLayer` – uses effect resource management pattern.
- `PubSubPublisherLayer` – typed with `JobQueuedEvent` codec.
- `SpeakerRoleRegistryLayer` – stores canonical host/guest mapping per `VideoId`.
- `ChannelTopicModelLayer` – deterministic NLP outputs and caching per channel.

#### Error Handling

- Use domain `ValidationError` for malformed input.
- `ExternalServiceError` for upstream YouTube issues.
- Respond with structured JSON: `{ error: { tag: string; message: string; retryable: boolean } }`.

#### Observability Hooks

- Emit structured logs: `ingestion.request.accepted`, `ingestion.job.dedupe_hit`, `ingestion.job.published`, `metadata.applied`, `metadata.missing` (with missing field list).
- Metrics: `ingestion_jobs_total{status="new|duplicate"}`, `ingestion_latency_ms`, `metadata.applied_total`, `metadata.missing_fields_total`, `nlp.topic_tags_generated_total`.

#### Non-Goals

- Transcription execution, persistence, or UI rendering.
- Additional security hardening beyond provided GCP auth layers.
