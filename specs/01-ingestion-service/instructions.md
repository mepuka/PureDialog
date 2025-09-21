### 01 - Ingestion Service

#### Feature Overview

Effect-based HTTP façade that accepts YouTube URLs, resolves speaker roles, validates metadata, and publishes `ProcessingJob` records to Pub/Sub.

#### Core Functionality

- `POST /api/v1/ingest`
  - Body: `{ url: string, userId: string, speakers?: { host: string; guest: string } }`.
  - Steps:
    1. Parse URL → `VideoId` via domain decoder.
    2. Resolve speaker roles: infer host/guest from request payload or prompt caller to supply; persist canonical mapping in `packages/domain` `SpeakerRoleRegistry` helper.
    3. Deduplicate using `DedupStore.acquire` (returns existing job if found).
    4. Fetch `VideoMetadata` from YouTube (satisfied via `YouTubeClient`).
    5. Create `ProcessingJob` with `status = Queued`, `metadataSnapshot`, `dedupeKey`.
    6. Publish `JobQueuedEvent` with codec-defined payload.
  - Response: `{ jobId: string }` for new or existing job.

- `GET /api/v1/jobs/:jobId`
  - Returns `ProcessingJob` projection limited to `jobId`, `status`, `submittedAt`, `attempts`, `lastError?`, `relatedFailures`.
  - Derived field `statusTimeline`: array of `{ status: JobStatus; at: string }` stitched from `JobStatusChangedEvent` stream (see below).

- `GET /api/v1/jobs/:jobId/metadata`
  - Returns `VideoMetadata` snapshot.

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

#### Error Handling

- Use domain `ValidationError` for malformed input.
- `ExternalServiceError` for upstream YouTube issues.
- Respond with structured JSON: `{ error: { tag: string; message: string; retryable: boolean } }`.

#### Observability Hooks

- Emit structured logs: `ingestion.request.accepted`, `ingestion.job.dedupe_hit`, `ingestion.job.published`.
- Metrics: `ingestion_jobs_total{status="new|duplicate"}`, `ingestion_latency_ms`.

#### Non-Goals

- Transcription execution, persistence, or UI rendering.
- Additional security hardening beyond provided GCP auth layers.
