### Requirements — 01 Ingestion Service (Phase 2)

#### Scope

Effect HTTP façade that accepts YouTube URLs, resolves speaker roles, deduplicates, fetches metadata, and publishes typed jobs/events.

#### Functional Requirements

- Endpoints
  - POST `/api/v1/ingest` accepts `{ url, userId, speakers?, metadata? }`.
  - GET `/api/v1/jobs/:jobId` returns status projection.
  - GET `/api/v1/jobs/:jobId/metadata` returns `VideoMetadata` snapshot.
- Behavior
  - Parse and validate URL → `VideoId` via domain decoder.
  - Resolve `SpeakerRoleRegistry` mapping (create or reuse canonical roles) using fallback hierarchy (registry → metadata → payload → generic `HOST/GUEST`).
  - Deduplicate via `DedupStore.acquire(videoId, userId)`.
  - Fetch `VideoMetadata` with `YouTubeClient` and store snapshot on job.
  - Refresh or reuse `ChannelTopicModel` when channel fingerprint changes; attach `topicHints`/`vocabHints` to job metadata.
  - Create `ProcessingJob{status: Queued}` with `metadataSnapshot`, `topicHints`, `preambleHash`; publish to topic `transcription-jobs` with codec including `userId`/`metadataVersion` attributes.
  - Emit `JobStatusChangedEvent (Queued → MetadataFetched)` and `MetadataAppliedEvent` upon publish.

#### Non-Functional Requirements

- Idempotency: multiple identical requests must return same `jobId` or existing transcript id reference.
- Latency target `<300ms` for ingest happy path excluding YouTube fetch.
- Concurrency safe dedupe (no duplicate jobs on race).

#### Error Handling Requirements

- 400 ValidationError for URL/speakers; 422 for domain constraint violations.
- 502 ExternalServiceError (YouTube) with retryable=false unless 5xx.
- Response envelope `{ error: { tag, message, retryable }, correlationId }`.

#### Security Requirements

- AuthN middleware validates bearer token; extracts `UserId`.
- Rate limit per-user (default 100/h) and per-video (1/24h).

#### Observability Requirements

- Logs: `ingestion.request.accepted`, `ingestion.job.dedupe_hit`, `ingestion.job.published`, `metadata.applied`, `metadata.missing` (include missing field list).
- Metrics: `ingestion_jobs_total{result}`, `ingestion_latency_ms` histogram, `metadata.applied_total`, `metadata.missing_fields_total`, `nlp.topic_tags_generated_total`.

#### Acceptance Criteria

- [ ] All endpoints implemented with Effect handlers and schema validation (including `metadata` payload).
- [ ] Pub/Sub publish uses domain codec; attributes include `jobId`, `videoId`, `schemaVersion`, `userId`, `metadataVersion`.
- [ ] Dedupe prevents duplicate job creation under concurrent requests.
- [ ] ChannelTopicModel cache updates and logs/metrics recorded.
- [ ] Structured errors and logs verified via local tests.

#### Improvements/Simplifications

- Cache YouTube metadata for short TTL (e.g., 10 minutes) to avoid repeated API calls.
- Phase follow-up to persist ChannelTopicModel in storage adapter beyond memory (spec 03).
