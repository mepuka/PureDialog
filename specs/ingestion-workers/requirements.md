# Ingestion Workers: Technical Requirements

## 1. Project Scaffolding

1.  **Create Packages**:
    -   Initialize a new package at `packages/worker-metadata`.
    -   Initialize a new package at `packages/worker-transcription`.

2.  **Package Configuration**:
    -   For each new package, create the following configuration files, mirroring the structure of `packages/api`:
        -   `package.json`: Define dependencies, including `@puredialog/domain`, `@puredialog/ingestion`, `@puredialog/storage`, `effect`, and `@effect/platform-node`.
        -   `tsconfig.json`, `tsconfig.build.json`: Configure TypeScript for the project.
        -   `vitest.config.ts`: Set up the test runner.
        -   `eslint.config.mjs`: Configure linting rules.

3.  **Workspace Integration**:
    -   Add the new packages to the `pnpm-workspace.yaml` file in the root directory.

## 2. Common Worker Architecture

Both workers will share a common architecture for handling Pub/Sub push messages.

-   **HTTP Server (`src/server.ts`)**
    -   Implement an HTTP server using `@effect/platform-node`.
    -   The server should listen on the port specified by the `PORT` environment variable (defaulting to 8080).
    -   It must define a single `POST /pubsub` route.

-   **Pub/Sub Handler (`src/handler.ts`)**
    -   The handler will receive a `PubSubPushMessage` payload.
    -   It must use the `MessageAdapter` from `@puredialog/ingestion` to decode the `data` field of the message into a `TranscriptionJob`.
    -   The core business logic for the worker should be invoked with the decoded job.
    -   **Crucially**, the HTTP response must be a `204 No Content` to acknowledge the message with Pub/Sub, regardless of whether the internal processing succeeds or fails. This prevents unwanted retries from the push subscription.

-   **Configuration (`src/config.ts`)**
    -   Implement a `Config` service to load necessary settings from environment variables, such as Pub/Sub topic names and GCS bucket details.

-   **Error Handling**
    -   All processing failures must be caught within the Effect workflow.
    -   On failure, a `JobFailed` event must be published to the `events` topic using the `PubSubClient`.

## 3. `worker-metadata` Implementation Details

-   **Business Logic (`src/logic.ts`)**
    1.  Receive the `TranscriptionJob` from the handler.
    2.  Use the `JobStore` from `@puredialog/storage` to update the job status to `Processing` in persistent storage.
    3.  Publish a `JobStatusChanged` event to `events` topic, setting the status to `Processing`.
    4.  Use the `YoutubeApiClient` from `@puredialog/ingestion` to fetch video details based on the `job.media` resource.
    5.  Enrich the `TranscriptionJob` with the fetched metadata and update it in storage using `JobStore`.
    6.  Publish a new `WorkMessage` to the `work` topic. This message will contain the enriched `TranscriptionJob` and include a specific attribute (e.g., `worker-type: transcription`) to ensure it is picked up by the transcription worker and not re-processed by the metadata worker.

-   **Dockerfile**
    -   Create a `Dockerfile` that builds the `worker-metadata` package and sets the `CMD` to run the server.

## 4. `worker-transcription` Implementation Details

-   **Business Logic (`src/logic.ts`)**
    1.  Receive the enriched `TranscriptionJob` from the handler.
    2.  Use the `JobStore` from `@puredialog/storage` to update the job status to `Processing` in persistent storage.
    3.  Publish a `JobStatusChanged` event to `events` topic, confirming the start of transcription.
    4.  **Transcription Placeholder**: Implement a mock transcription process. This can be an `Effect.sleep` followed by the generation of a mock transcript object.
    5.  **Store Artifact**: Use the `CloudStorageService` from `@puredialog/ingestion` to write the generated transcript to the shared GCS bucket. The object key should be deterministic, e.g., `transcripts/{jobId}.json`.
    6.  **Update Job**: Use the `JobStore` to update the job status to `Completed` and set the `transcriptId`.
    7.  **Publish Completion**: Publish a `TranscriptComplete` event to the `events` topic. This event must include the `transcriptId` and the GCS path of the saved artifact.

-   **Dockerfile**
    -   Create a `Dockerfile` for the `worker-transcription` service.

## 5. Integration and Deployment

-   **Cloud Build (`cloudbuild.yaml`)**: Verify that the existing `cloudbuild.yaml` correctly builds and pushes the Docker images for both new services. The configuration already contains steps for `worker-metadata` and `worker-transcription`, which should now work with the new packages.
-   **Infrastructure as Code (`infra/index.ts`)**: Confirm that the Pulumi program correctly defines the Cloud Run services, Pub/Sub subscriptions, and IAM bindings for the new workers. The existing code already accounts for these services.
