### Phase 4 — Implementation Plan: Ingestion Service

#### 1. Bootstrap service runtime

- Add minimal server entry using Effect Platform patterns (handlers later)
- Provide `ConfigLayer` for env (topics, schema version)
- Health endpoints `/health/live`, `/health/ready`

Checkpoint: service builds, starts locally

#### 2. Domain wiring

- Import `@puredialog/domain` once implemented: `VideoId`, `ProcessingJob`, errors, codecs
- Create request/response schemas for `/api/v1/ingest`

Checkpoint: input decoding via Schema works

#### 3. Speaker resolution

- Implement `SpeakerRoleRegistry` interface + in-memory adapter (dev)
- Merge provided `{ speakers? }` with registry

Checkpoint: registry unit-tested with basic cases

#### 4. Dedup store

- Implement `DedupStore` interface + in-memory adapter (dev)
- `acquire(videoId, userId)` ensures idempotency

Checkpoint: concurrent requests dedupe in test

#### 5. YouTube client

- Implement `YouTubeClient` (metadata only): title, description, links, publishedAt, duration, channelId
- Add simple memo cache with TTL (dev)

Checkpoint: sample video returns metadata

#### 6. Job construction + publish

- Build `ProcessingJob.create(videoId, userId, metadata)`
- Publish to `transcription-jobs` with attributes `{ jobId, videoId, schemaVersion, userId }`
- Emit `JobStatusChangedEvent` (Queued → MetadataFetched)

Checkpoint: publish verified in local stub

#### 7. HTTP handlers

- POST `/api/v1/ingest` orchestrates steps (decode → speakers → dedupe → metadata → job → publish)
- GET `/api/v1/jobs/:jobId` returns status projection (from store)
- GET `/api/v1/jobs/:jobId/metadata` returns metadata snapshot

Checkpoint: happy path E2E via local request

#### 8. Observability

- Structured logs: request.accepted, job.dedupe_hit, job.published
- Metrics: ingestion_jobs_total{result}, ingestion_latency_ms

Checkpoint: logs/metrics visible in dev

#### 9. Security & limits (MVP)

- Auth middleware stub (toggleable)
- Fixed-window per-user limit (in-memory)

Checkpoint: over-quota returns QuotaError

#### 10. App Engine packaging

- Add `infrastructure/appengine/ingestion/app.yaml`
- Update Cloud Build to deploy service

Checkpoint: build+deploy pipeline dry-run

#### Notes

- Keep adapters pluggable (Drive/GCS, real Pub/Sub later)
- No topic modeling or glossary in MVP
