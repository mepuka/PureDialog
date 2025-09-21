### Design — 01 Ingestion Service (Phase 3)

#### Overview

Effect Platform-Node HTTP API that validates requests, resolves speaker roles, deduplicates jobs, fetches metadata, and publishes typed `ProcessingJob` to Pub/Sub. Uses domain codecs for all IO boundaries.

#### Modules

- `http/Routes` — request handlers with Schema validation for inputs/outputs.
- `core/Ingestion` — orchestration logic (Effects only).
- `adapters/YouTubeClient` — metadata fetcher (pluggable).
- `adapters/PubSubPublisher` — typed publisher using domain event codecs.
- `adapters/DedupStore` — Drive/GCS or in-memory implementation.
- `adapters/SpeakerRoleRegistry` — canonical mapping storage.
- `adapters/ChannelTopicModel` — deterministic NLP enrichment per channel (spec 03).

#### Layers

- `ConfigLayer` — topics, projectId, rate limits.
- `LoggerLayer`, `MetricsLayer`, `ClockLayer`.
- `YouTubeClientLayer`, `PublisherLayer`, `DedupStoreLayer`, `SpeakerRoleRegistryLayer`.

#### Handler Flow (POST /api/v1/ingest)

1. Decode `{ url, userId, speakers? }`.
2. `VideoId.fromUrl(url)` via domain decoder.
3. Resolve `SpeakerRoleRegistry` first, then merge request `metadata` and heuristics; emit `MetadataAppliedEvent` when fields missing.
4. `DedupStore.acquire(videoId, userId)` → existing job? return `{ jobId }`.
5. `YouTubeClient.fetchMetadata(videoId)`.
6. `ChannelTopicModel.refreshIfStale(channelId)` and attach hints to job.
7. `ProcessingJob.create(videoId, userId, metadata, topicHints)`.
8. Publish job to topic with attributes `{ jobId, videoId, schemaVersion, metadataVersion, userId }`.
9. Emit `JobStatusChangedEvent (Queued → MetadataFetched)`.
10. Return `{ jobId }`.

#### Error Handling

- Use `Effect.result` and map to structured errors. No try/catch inside generators.
- Domain errors converted to HTTP codes: 400/422/502.

#### Observability

- Logs: request accepted, dedupe hit, published.
- Metrics: ingestion_jobs_total, ingestion_latency_ms.

#### References

- Patterns: `patterns/effect-service-layer-patterns.md`, `effect-error-management-patterns.md`.
