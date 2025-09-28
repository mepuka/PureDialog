# Ingestion Workers: Instructions

## 1. Feature Overview

This feature involves the implementation of two new containerized worker services, `worker-metadata` and `worker-transcription`, to process transcription jobs asynchronously. These workers will be integrated into the existing event-driven, serverless architecture built on Google Cloud Run and Pub/Sub.

The goal is to create a scalable and resilient ingestion pipeline where:
1.  The `api` service accepts transcription jobs and publishes them to a central work queue.
2.  The `worker-metadata` service consumes these jobs, fetches metadata from external sources (like YouTube), and forwards the enriched job for transcription.
3.  The `worker-transcription` service consumes the enriched job, performs the transcription, stores the result, and emits a final completion event.

## 2. System Stories

- **Story 1: Metadata Fetching**
  - **As** the system,
  - **When** a `WorkMessage` for a new media resource is published to the `work` topic,
  - **I need** the `worker-metadata` service to consume the message, fetch the relevant metadata using the `YoutubeApiClient`, update the job's status, and publish a new `WorkMessage` to the `work` topic for the transcription stage.

- **Story 2: Transcription Processing**
  - **As** the system,
  - **When** a `WorkMessage` containing enriched job data is received,
  - **I need** the `worker-transcription` service to consume the message, perform the transcription, store the resulting transcript artifact in the shared Google Cloud Storage bucket, and publish a `TranscriptComplete` event to the `events` topic.

- **Story 3: Error Handling**
  - **As** the system,
  - **When** either worker encounters a non-recoverable error during processing,
  - **I need** the worker to publish a `JobFailed` event to the `events` topic and acknowledge the original message to prevent retries from the push subscription.

## 3. Acceptance Criteria

### `worker-metadata`
- A `packages/worker-metadata` directory is created with its own `package.json`, `Dockerfile`, and `tsconfig.json`.
- The service exposes an HTTP server on port 8080.
- A `POST /pubsub` endpoint exists to receive push messages from Pub/Sub.
- The handler correctly decodes the `TranscriptionJob` from the incoming message using the `@puredialog/ingestion` `MessageAdapter`.
- It uses the `YoutubeApiClient` from `@puredialog/ingestion` to fetch video metadata.
- It publishes a `JobStatusChanged` event to the `events` topic upon successful metadata retrieval.
- It publishes a new `WorkMessage` (with a specific attribute or modified payload to signify it's ready for transcription) to the `work` topic.
- It acknowledges the Pub/Sub message by returning a `204 No Content` response.

### `worker-transcription`
- A `packages/worker-transcription` directory is created with its own `package.json`, `Dockerfile`, and `tsconfig.json`.
- The service exposes an HTTP server on port 8080 with a `POST /pubsub` endpoint.
- The handler correctly decodes the `TranscriptionJob` from the incoming message.
- It performs a placeholder/mock transcription process (e.g., using `Effect.sleep`).
- It uses the `CloudStorageService` from `@puredialog/ingestion` to save the generated transcript to the shared GCS bucket.
- It publishes a `TranscriptComplete` event (containing the `transcriptId`) to the `events` topic.
- It acknowledges the Pub/Sub message by returning a `204 No Content` response.

## 4. Constraints & Dependencies

- **Constraint:** Must use the existing `@puredialog/domain`, `@puredialog/ingestion`, and `@puredialog/storage` packages for all core types, external service clients, and job persistence.
- **Constraint:** Must adhere strictly to the Effect-TS patterns established in the project (`Layer`, `Context.Tag`, `Effect.gen`, `Data.TaggedError`).
- **Constraint:** Must integrate with the existing infrastructure defined in the `infra/` package (Cloud Run, Pub/Sub, GCS).
- **Dependency:** `@effect/platform-node` for creating the HTTP server.
- **Dependency:** `@google-cloud/pubsub` and `@google-cloud/storage` via the clients in `@puredialog/ingestion`.
- **Dependency:** `@puredialog/storage` for shared job persistence layer (JobStore, JobRepository, and storage utilities).

## 5. Out of Scope

- The actual machine learning model for transcription. A placeholder that generates mock data will be used.
- Complex retry logic within the worker. The initial implementation will rely on the DLQ configured in the Pub/Sub subscription for failed message delivery. Internal processing failures will be handled via `JobFailed` events.
