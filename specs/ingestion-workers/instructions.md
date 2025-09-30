# Ingestion Workers: Instructions

## 1. Feature Overview

This feature involves the implementation of two new containerized worker services, `worker-metadata` and `worker-transcription`, to process transcription jobs asynchronously. These workers are integrated into a **state-triggered choreography architecture** built on Google Cloud Run, Eventarc Advanced, and Google Cloud Storage.

The goal is to create a scalable and resilient ingestion pipeline where:
1.  The `api` service accepts transcription jobs and writes them to GCS at `jobs/Queued/{jobId}.json`
2.  **Eventarc Advanced** detects the GCS object creation and routes CloudEvents to workers via HTTP
3.  The `worker-metadata` service receives CloudEvents for `jobs/Queued/`, fetches metadata from external sources (like YouTube), and **moves** the job file to `jobs/Processing/` to trigger the next stage
4.  The `worker-transcription` service receives CloudEvents for `jobs/Processing/`, performs the transcription, and **moves** the job file to `jobs/Completed/` upon success
5.  All state transitions are tracked via immutable event logs in the `events/` directory

## 2. System Stories

- **Story 1: Metadata Fetching via CloudEvents**
  - **As** the system,
  - **When** a new job file is created at `jobs/Queued/{jobId}.json`,
  - **I need** Eventarc Advanced to detect the GCS object finalized event and POST a CloudEvent to the `worker-metadata` service HTTP endpoint
  - **Then** the worker fetches metadata using the `YoutubeApiClient`, enriches the job, and **atomically moves** the file to `jobs/Processing/{jobId}.json` to trigger the next stage

- **Story 2: Transcription Processing via CloudEvents**
  - **As** the system,
  - **When** a job file is moved to `jobs/Processing/{jobId}.json`,
  - **I need** Eventarc Advanced to detect the GCS object finalized event and POST a CloudEvent to the `worker-transcription` service HTTP endpoint
  - **Then** the worker performs transcription, stores the transcript artifact, and **atomically moves** the file to `jobs/Completed/{jobId}.json`

- **Story 3: State-Triggered Choreography**
  - **As** the system,
  - **When** any job file is moved between state directories (`Queued/`, `Processing/`, `Completed/`, `Failed/`),
  - **I need** Eventarc to trigger the appropriate worker based on CEL expression filtering
  - **And** I need all state transitions to be logged as immutable events in `events/{jobId}/{timestamp}_{event_type}.json`

- **Story 4: Error Handling via Failed State**
  - **As** the system,
  - **When** either worker encounters a non-recoverable error during processing,
  - **I need** the worker to **move** the job file to `jobs/Failed/{jobId}.json` and write a `JobFailed` event to the event log
  - **Then** no further automatic processing occurs (manual intervention or retry logic can monitor `Failed/`)

## 3. Acceptance Criteria

### `worker-metadata`
- A `packages/worker-metadata` directory exists with its own `package.json`, `Dockerfile`, and `tsconfig.json`
- The service exposes an HTTP server on port 8080 with the following endpoints:
  - `GET /health` - Returns health status
  - `POST /` - Receives CloudEvents from Eventarc Pipeline
- The CloudEvents handler:
  - Parses incoming CloudEvent with GCS object finalized data
  - Extracts `jobId` and `status` from the CloudEvent `subject` field (`objects/jobs/Queued/{jobId}.json`)
  - Validates the job is in the expected `Queued` state
  - Fetches video metadata using `YoutubeApiClient` from `@puredialog/ingestion`
  - Enriches the job with metadata
  - **Atomically moves** the job file from `jobs/Queued/{jobId}.json` to `jobs/Processing/{jobId}.json`
  - Writes a `JobStatusChanged` event to `events/{jobId}/{timestamp}_status_changed.json`
  - Returns HTTP 200 with structured response on success
  - Returns HTTP 200 with error details on failure (to prevent Eventarc retries)
- Idempotency: Skips processing if job has already advanced past `Queued` state
- Error handling: Moves job to `jobs/Failed/{jobId}.json` on non-recoverable errors

### `worker-transcription`
- A `packages/worker-transcription` directory exists with its own `package.json`, `Dockerfile`, and `tsconfig.json`
- The service exposes an HTTP server on port 8080 with the following endpoints:
  - `GET /health` - Returns health status
  - `POST /` - Receives CloudEvents from Eventarc Pipeline
- The CloudEvents handler:
  - Parses incoming CloudEvent with GCS object finalized data
  - Extracts `jobId` and `status` from the CloudEvent `subject` field (`objects/jobs/Processing/{jobId}.json`)
  - Validates the job is in the expected `Processing` state
  - Performs placeholder/mock transcription process
  - Saves generated transcript to `transcripts/{transcriptId}.json` using `CloudStorageService`
  - **Atomically moves** the job file from `jobs/Processing/{jobId}.json` to `jobs/Completed/{jobId}.json`
  - Writes a `TranscriptComplete` event to `events/{jobId}/{timestamp}_transcript_complete.json`
  - Returns HTTP 200 with structured response on success
  - Returns HTTP 200 with error details on failure (to prevent Eventarc retries)
- Idempotency: Skips processing if job has already advanced past `Processing` state
- Error handling: Moves job to `jobs/Failed/{jobId}.json` on non-recoverable errors

## 4. Constraints & Dependencies

- **Constraint:** Must use the existing `@puredialog/domain`, `@puredialog/ingestion`, and `@puredialog/storage` packages for all core types, external service clients, and job persistence
- **Constraint:** Must adhere strictly to the Effect-TS patterns established in the project (`Layer`, `Context.Tag`, `Effect.gen`, `Data.TaggedError`)
- **Constraint:** Must integrate with the existing Eventarc Advanced infrastructure defined in the `infra/` package (MessageBus, Enrollments, Pipelines, Cloud Run)
- **Constraint:** Must use CloudEvents v1.0 format for all incoming HTTP requests from Eventarc
- **Constraint:** State transitions MUST be atomic: write-then-delete pattern for file moves to prevent orphaned state
- **Constraint:** All state changes MUST write immutable event logs to `events/` directory for audit trail
- **Dependency:** `@effect/platform-node` for creating the HTTP server
- **Dependency:** `@google-cloud/storage` via `CloudStorageService` in `@puredialog/ingestion`
- **Dependency:** `@puredialog/storage` for shared path utilities (`Index`, `PathParsers`) and job persistence
- **Dependency:** `@puredialog/domain` for CloudEvents schemas, worker HTTP DTOs, and domain events

## 5. Out of Scope

- The actual machine learning model for transcription. A placeholder that generates mock data will be used
- Complex retry logic within the worker. Eventarc Pipelines handle retries with exponential backoff. Workers return HTTP 200 to prevent retries and use `Failed/` directory for terminal errors
- Authentication/authorization of CloudEvents. Initial implementation trusts all requests from Eventarc. OIDC validation can be added later
- Concurrent processing of the same job. Eventarc delivers events at-least-once, but our idempotency checks (state validation) prevent duplicate processing
