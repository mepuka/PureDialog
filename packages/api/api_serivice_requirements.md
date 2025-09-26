# API Service Implementation Requirements

## 1. Overview

This document outlines the requirements for the initial production-ready implementation of the `@puredialog/api` service. This service acts as the primary public-facing HTTP entry point for the PureDialog system, responsible for accepting, validating, persisting, and queueing new transcription jobs.

The implementation must adhere strictly to the established architectural principles of the project, including the use of Effect for control flow, declarative schemas for data modeling, and a layered architecture for dependency management.

## 2. Core Functional Requirements (FRs)

- **FR-1: Health Endpoint**
  - The service MUST expose a `GET /health` endpoint.
  - A successful response MUST return an HTTP `200 OK` status with a JSON body of `{"status": "ok"}`.

- **FR-2: Transcription Job Creation Endpoint**
  - The service MUST expose a `POST /v1/transcription-jobs` endpoint.
  - A successful response for a new job MUST return an HTTP `202 Accepted` status with a JSON body containing the `jobId` and the `requestId` from the request.

- **FR-3: Request Validation**
  - The job creation endpoint MUST validate incoming request bodies against the `CreateTranscriptionJobRequest` schema defined in the `@puredialog/domain` package.
  - If validation fails, the service MUST return an HTTP `400 Bad Request` response with a structured error body detailing the validation failures.

- **FR-4: Idempotent Job Creation**
  - The job creation endpoint MUST be idempotent based on the `idempotencyKey` provided in the request body.
  - Before creating a new job, the service MUST check the `ProcessingJobStore` for an existing job with the same idempotency key.
  - If a matching job is found, the service MUST return an HTTP `200 OK` status with the existing `jobId` and MUST NOT publish a new event.

- **FR-5: Job Persistence**
  - Upon receiving a valid, new job request, the service MUST create an entry in the `ProcessingJobStore`.
  - The initial state of the job MUST be set to `"QUEUED"`.

- **FR-6: Job Publishing**
  - After successfully persisting the new job, the service MUST publish a `JobQueued` event to the `job-processing` Pub/Sub topic.
  - The message payload MUST be a valid domain event and include the `jobId`, `correlationId`, and other necessary details.

## 3. Architectural & Non-Functional Requirements (NFRs)

- **NFR-1: Declarative API Definition**
  - The entire API surface MUST be defined declaratively using `@effect/platform`'s `HttpApi`, `HttpApiGroup`, and `HttpApiEndpoint` constructs, as specified in `patterns/http-api.md`.

- **NFR-2: Service-Oriented Architecture**
  - All external dependencies and internal components (e.g., `PubSubClient`, `ProcessingJobStore`) MUST be modeled as Effect services using `Context.Tag` and provided to the application via `Layer`s, as per `patterns/effect-service-layer-patterns.md`.

- **NFR-3: Structured & Type-Safe Configuration**
  - All configuration (server port, GCP Project ID, Pub/Sub topic names, database connection strings) MUST be loaded via a dedicated `ApiConfig` service.
  - This service MUST use the `Config` module for loading and validation. Secrets, such as API keys or database passwords, MUST be handled using `Config.redacted`, as per `patterns/effect-configuration-patterns.md`.

- **NFR-4: Structured Error Handling**
  - The service MUST define and use a unified `ApiError` tagged union (`Data.TaggedError`) for all known failure modes (e.g., `ValidationError`, `PubSubError`, `DatabaseError`).
  - Raw exceptions or errors from underlying libraries MUST be caught and mapped to a structured `ApiError` variant.
  - HTTP handlers MUST map these domain errors to the appropriate HTTP status codes and response bodies.

- **NFR-5: Observability - Structured Logging**
  - All request handlers and service methods MUST use structured logging via `Effect.log*`.
  - A unique `correlationId` MUST be generated for each incoming request (or retrieved from headers) and annotated on all logs produced during the processing of that request, as per `patterns/effect-observability-patterns.md`.

- **NFR-6: Observability - Distributed Tracing**
  - Each API endpoint handler MUST be wrapped in a `Effect.withSpan` call.
  - Spans MUST be annotated with relevant attributes, including `http.method`, `http.route`, `jobId` (where applicable), and `correlationId`.

- **NFR-7: Observability - Metrics**
  - The service MUST expose, at a minimum, the following metrics:
    - `http_requests_total`: A `Counter` tagged by `route` and `status_code`.
    - `http_request_duration_seconds`: A `Histogram` or `Timer` tagged by `route`.

## 4. Integration Requirements

- **INT-1: Pub/Sub Publisher**
  - The API service requires a `PubSubPublisher` service layer. This service must provide a method to publish a message to a given topic, abstracting away the underlying Google Cloud Pub/Sub client.

- **INT-2: Persistence Layer**
  - The API service requires a `ProcessingJobStore` service layer. This service must expose methods such as `createJob(job)` and `findJobByIdempotencyKey(key)`.

## 5. Testing Requirements

- **TEST-1: Unit & Service-Level Tests**
  - Individual components (e.g., handlers, clients) MUST be tested in isolation, with their dependencies mocked.

- **TEST-2: Integration Tests**
  - The complete API service MUST be tested via integration tests that spin up a real HTTP server on a random port, as per `patterns/http-specific-testing.md`.
  - Tests MUST cover:
    - The happy path for job creation.
    - Request validation failures (400 Bad Request).
    - Idempotency key handling (200 OK on repeat request).
    - Failure to publish to Pub/Sub (503 Service Unavailable).

## 6. Out of Scope

- The implementation of the `worker-metadata` or `worker-transcription` services.
- API endpoints for querying job status or retrieving results.
- User authentication and authorization.
