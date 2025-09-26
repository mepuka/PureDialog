# HTTP API Integration - Instructions

## Overview

This feature upgrades the PureDialog API service to use Effect's `@effect/platform` HTTP API machinery. We are replacing the existing `HttpRouter` implementation with a declarative `HttpApi` definition that covers the health probe and the transcription job queueing endpoint. The goal is to produce an explicit, schema-driven API surface that we can extend as new ingestion capabilities are added.

## User Story

**As a platform engineer**, I want the API service to expose our ingestion endpoints through `HttpApi` so that we gain type-safe request/response contracts, organised groups, and compatibility with future tooling (documentation, generated clients, etc.).

## Core Requirements

### 1. Declarative HTTP API Definition
- Model the service with `HttpApi`, `HttpApiGroup`, and `HttpApiEndpoint`.
- Keep the API name and group names aligned with PureDialog nomenclature.
- Ensure `HttpApiBuilder` layers are used to bind handlers and serve via the Node runtime.

### 2. Health Check Endpoint
- Endpoint: `GET /health`.
- Respond with HTTP 200 and JSON body `{ "status": "ok" }`.
- Place the endpoint inside a `health` group in the API definition.

### 3. Transcription Job Queue Endpoint
- Endpoint: `POST /v1/transcription-jobs`.
- Validate the request body using `CreateTranscriptionJobRequest` from `@puredialog/domain` via `HttpApiSchema`.
- Return HTTP 202 with a placeholder payload `{ jobId: string, requestId: string }`.
- For now, stub the job enqueueing logic—just echo the request ID and a fixed job identifier.

### 4. Runtime Integration
- Serve the API through `HttpApiBuilder.serve()` and `NodeHttpServer.layer`.
- Continue reading the port from `process.env.PORT` (default 8080).
- Keep startup logging consistent with existing patterns.
- Gracefully wire the layers so that future endpoints can be added by extending the `HttpApi`.

## Technical Specifications

### API Structure
```
HttpApi ("PureDialogApi")
├── HttpApiGroup ("health")
│   └── HttpApiEndpoint ("status") - GET /health
└── HttpApiGroup ("transcription")
    └── HttpApiEndpoint ("queueJob") - POST /v1/transcription-jobs
```

### Endpoint Contracts
- **GET /health**
  - Response: 200 OK
  - Content-Type: application/json
  - Body: `{ "status": "ok" }`

- **POST /v1/transcription-jobs**
  - Request body schema: `CreateTranscriptionJobRequest`
  - Response: 202 Accepted
  - Content-Type: application/json
  - Body: `{ "jobId": "pending", "requestId": <value from request> }`
  - Failure case: 400 Bad Request with `{ "error": "invalid request" }` when schema decoding fails.

### Dependencies
- Reuse existing dependencies: `@effect/platform`, `@effect/platform-node`, and domain schemas from `@puredialog/domain`.
- No new external packages should be introduced.

## Acceptance Criteria

1. **API Definition**: `HttpApi` encapsulates both health and transcription job endpoints.
2. **Runtime Layering**: Server is composed via `HttpApiBuilder` and `NodeRuntime` without legacy `HttpRouter` usage.
3. **Endpoint Behaviour**: Requests to `/health` and `/v1/transcription-jobs` behave as documented.
4. **Error Handling**: Invalid transcription job requests return 400 responses produced by Effect-based error handling.
5. **Tooling Compatibility**: Implementation compiles with `pnpm tsc`, passes `pnpm lint`, and supports `pnpm dev`.

## Out of Scope

- Actual job enqueueing or integration with Pub/Sub.
- Authentication and authorization.
- Additional endpoints beyond health and job queueing.
- API documentation generation or Swagger wiring.
- Observability (structured logging, tracing, etc.).
- HTTPS/TLS configuration.

## Success Metrics

- Both endpoints respond within 100ms locally.
- Zero compilation errors with `pnpm tsc`.
- Zero linting errors with `pnpm lint` for touched files.
- `pnpm dev` continues to start the server successfully.

## Future Considerations

- Enqueue transcription jobs onto Pub/Sub or the internal queueing mechanism.
- Add job status retrieval endpoints and streaming updates.
- Integrate authentication/authorization once the control plane is ready.
- Generate OpenAPI documentation from the `HttpApi` definition.
- Provide a typed client using `HttpApiClient.make` for internal services.

## Testing Requirements

- Unit tests for each handler using `@effect/vitest`.
- Integration-style test that verifies the API layer produces expected responses.
- Validate both the happy path and the invalid request path for the job queue endpoint.
