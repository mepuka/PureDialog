### Requirements — 01 Ingestion Service (Phase 2)

#### Scope

Effect HTTP façade that accepts YouTube URLs, resolves speaker roles, deduplicates, fetches metadata, and publishes typed jobs/events.

#### Functional Requirements

- Endpoints
  - POST `/api/v1/ingest` accepts `{ url, userId, speakers? }`.
  - GET `/api/v1/jobs/:jobId` returns status projection.
  - GET `/api/v1/jobs/:jobId/metadata` returns `VideoMetadata` snapshot.
- Behavior
  - Parse and validate URL → `VideoId` via domain decoder.
  - Resolve `SpeakerRoleRegistry` mapping (create or reuse canonical roles).
  - Deduplicate via `DedupStore.acquire(videoId, userId)`.
  - Fetch `VideoMetadata` with `YouTubeClient` and store snapshot on job.
  - Create `ProcessingJob{status: Queued}`; publish to topic `transcription-jobs` with codec.
  - Emit `JobStatusChangedEvent (Queued → MetadataFetched)` upon publish.

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

- Logs: `ingestion.request.accepted`, `ingestion.job.dedupe_hit`, `ingestion.job.published`.
- Metrics: `ingestion_jobs_total{result}`, `ingestion_latency_ms` histogram.

#### Acceptance Criteria

- [ ] All endpoints implemented with Effect handlers and schema validation.
- [ ] Pub/Sub publish uses domain codec; attributes include `jobId`, `videoId`, `schemaVersion`.
- [ ] Dedupe prevents duplicate job creation under concurrent requests.
- [ ] Structured errors and logs verified via local tests.

#### Improvements/Simplifications

- Defer `speakers` auto-inference; require explicit host/guest initially to reduce ambiguity.
- Cache YouTube metadata for short TTL (e.g., 10 minutes) to avoid repeated API calls.
