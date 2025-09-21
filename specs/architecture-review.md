### Architecture Review (Current State vs Target Production Design)

#### Current Codebase Snapshot

- UI: React + TypeScript Vite app, simple single-page flow that:
  - Accepts pasted text, extracts YouTube links, queues jobs
  - Calls `transcribeVideo` in `src/services/geminiService.ts` (client-side)
  - Streams Gemini response (JSON array) and renders progressive preview
- Backend: Minimal Node static server (`server.js`) for health and static files
- No server API for ingestion, deduplication, persistence, or streaming
- No monorepo structure; single app with minimal infra config (App Engine deploy)

#### Strengths

- Clean UI flow for discovery and queueing
- Streaming-first client implementation already handles partial JSON progressively
- Types are lightweight and coherent for the current prototype

#### Gaps vs Production Goals

- No ingestion API or queue; all work is done client-side
- No duplication prevention or idempotent processing
- No persistence layer (Drive or database) or transcript retrieval API
- No observability: metrics, tracing, structured logs, or cost accounting
- No authentication or rate limiting
- No error taxonomy or retry policy
- No separation of concerns (services) or monorepo workspace
- No validation against YouTube metadata or transcript invariants

#### Risks

- Client holds API keys and performs LLM calls directly
- Lack of backpressure control and concurrency limits
- Unverified JSON schema compliance and timestamp validity

#### Recommendations (High-Level)

- Split into two services: Ingestion and Transcription (worker)
- Introduce Pub/Sub queue between services
- Move Gemini calls server-side with strict input validation and schema conformance checking
- Add persistence to Drive or object storage with dedup records
- Add observability: request logs, metrics, LLM cost tracking
- Implement authentication and per-user rate limits; prevent reprocessing per video
- Enforce invariants (two speakers, non-overlapping, duration tolerance)

#### Immediate Priorities

1. Monorepo setup with packages: `domain`, `gemini`, and services: `ingestion`, `transcription`
2. Ingestion API: submit URL, produce job, publish to queue, job status endpoints
3. Transcription worker: process job, call Gemini, validate, persist, stream events
4. Minimal persistence: Drive-backed JSON storage and dedup file
5. Observability baseline: health, logs, counters, latency metrics
