# API Service – Requirements (Phase 2)

## Functional Endpoints (MVP)
- POST `/v1/transcription-jobs`
  - Purpose: Accept a request to create a new transcription job from user input (e.g., YouTube link in text) using canonical domain schema.
  - Request body: `CreateTranscriptionJobRequest` (from `@puredialog/domain`)
  - Response: `202 Accepted` with `{ jobId, requestId }` once enqueued; `400` on validation errors.
- GET `/health`
  - Purpose: Liveness probe for Cloud Run.
  - Response: `{ status: "ok" }`

## Near-term Endpoints (stub/placeholder)
- GET `/v1/transcription-jobs/:id`
  - Purpose: Fetch job status and metadata from a projection (to be implemented).
  - Response: `{ id, status, updatedAt, ... }` or `404` if unknown.
- GET `/v1/events/stream`
  - Purpose: Server-sent events for job status updates (projection-backed); optional for MVP.

## Input Validation
- Use Effect Schema for all inbound payloads via `HttpServerRequest.schemaBodyJson()`.
- Canonical request type: `CreateTranscriptionJobRequest` (packages/domain/src/requests.ts)
- Strict decoding; on failure return `400` with structured error details.

## Publishing Workflow (enqueue)
- On accepted `CreateTranscriptionJobRequest`:
  - Parse resources from `inputText` and `resources` (initially support `type = "youtube"`).
  - Compose a `TranscriptionJob` domain object and publish to work topic.
  - Emit `JobQueued` event to events topic.
- For MVP: enqueue step may be stubbed (log + 202) until `@puredialog/ingestion` publisher service is wired.

## Technology & Composition
- Runtime: `@effect/platform` (HttpRouter/HttpServer) + `@effect/platform-node` for Node adapter.
- Patterns: `HttpRouter` → `HttpServer.serve()` → `NodeHttpServer.layer(() => createServer(), { port })` → `NodeRuntime.runMain`.
- Logging: `HttpServer.withLogAddress`; structured logs per request later.

## Observability
- Log route, requestId, status code; later integrate correlation IDs.
- Expose health route for Cloud Run checks.

## Errors
- Validation: 400 (schema decode errors)
- Internal: 500 (unexpected failures)
- Publishing errors (future): 503 with retry hint if upstream is unavailable

## Configuration
- `PORT` (default 8080)
- Pub/Sub topic names (future): `PUBSUB_TOPIC_WORK`, `PUBSUB_TOPIC_EVENTS`
- Project / emulator (future): from `@puredialog/ingestion` Config layer

## Security (MVP)
- Public POST endpoint (no auth) acceptable for early development; plan to introduce auth later.

## Testing
- Unit: route decoding with `HttpServerRequest.schemaBodyJson()` (pure-ish via Effect)
- Integration: spin up in-memory server via `NodeHttpServer.layerTest`, call routes with `HttpClient`
- Avoid wall-clock dependencies; keep deterministic

## Out of Scope (for now)
- Projection storage and query API (status reads)
- SSE/WebSocket plumbing
- Full Pub/Sub wiring (until publisher is merged)
