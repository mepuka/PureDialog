# API Service Design Document (Revised)

## 1. Overview

This document provides the revised technical design for the `@puredialog/api` service. Based on a deeper analysis of system requirements, the API's role is expanded from a simple job ingress point to a comprehensive service that both **initiates** and **tracks** transcription jobs. 

This revised design incorporates a **Pub/Sub subscriber** role within the API service itself, enabling it to listen to downstream events and maintain an up-to-date view of job statuses. This is critical for providing clients with progress tracking capabilities in the future.

## 2. High-Level Architecture (Revised)

The architecture is now bidirectional. The API publishes work and consumes resulting events.

### Revised Job Lifecycle Flow

```
[Client]--HTTP POST-->[API Service]
                      |
                      +----1. (Idempotency Check & Create)-->[ProcessingJobStore]
                      |
                      +----2. (Publish JobQueued)---------->[Pub/Sub: job-processing-topic]
                      |
                      v
[202 Accepted]      [Workers]
   ^                  |
   |                  |
   |                  +----3. (Publish JobUpdated)---------->[Pub/Sub: job-events-topic]
   |                                                              |
   |                                                              v
   +------------------4. (Receives & Processes Event)----[API Service Subscriber]
                                                              |
                                                              v
                                                        [ProcessingJobStore]
                                                              | (Update Status)
                                                              v
                                                        [Database]
```

## 3. Application Entry & Compositon (`src/index.ts` & `src/server.ts`)

The application will now consist of two primary, long-running processes that run concurrently:
1.  **HTTP Server:** Serves the public-facing API for creating jobs.
2.  **Pub/Sub Subscriber:** Listens for job status updates in the background.

The main application entry point will launch both using `Effect.all`.

```typescript
// in index.ts
const main = Effect.all([HttpServerLive, PubSubSubscriberLive], {
  concurrency: "unbounded",
  discard: true,
});

Layer.launch(main).pipe(NodeRuntime.runMain);
```

## 4. API Definition (`src/api.ts`)

*No changes from the original design.* The declarative API definition for `POST /v1/transcription-jobs` and `GET /health` remains the same.

## 5. Service & Component Design (Revised)

### 5.1. Configuration (`src/config.ts`)

The `ApiConfig` service will be expanded to include the subscription ID.

- **Interface (Revised):**
  ```typescript
  interface ApiConfig {
    readonly port: number;
    readonly gcpProjectId: string;
    readonly jobProcessingTopicId: string; // For publishing
    readonly jobEventsSubscriptionId: string; // For subscribing
  }
  ```

### 5.2. Error Types (`src/errors.ts`)

*No changes from the original design.* The unified `ApiError` union remains.

### 5.3. Persistence Service (`src/services/JobStore.ts`)

- **Interface (Revised):** The `ProcessingJobStore` interface will be expanded to support status updates.
  ```typescript
  class ProcessingJobStore extends Context.Tag("ProcessingJobStore")<...>() {
    // ... createJob(job)
    // ... findJobByIdempotencyKey(key)
    readonly updateJobStatus: (jobId: string, status: JobStatus) => Effect.Effect<void, DatabaseError>;
  }
  ```
- **Initial Implementation:** The `ProcessingJobStoreMock` will be updated to include a mock implementation for `updateJobStatus` that updates its internal `Map`.

### 5.4. Publisher Service (`src/services/PubSubPublisher.ts`)

- A new `PubSubPublisher` service will be created as originally designed, responsible only for publishing messages. The mock implementation will log messages.

### 5.5. Subscriber Service (`src/services/PubSubSubscriber.ts`) (New)

- **Design:** A new background service will be designed to listen for and process messages from the `job-events` subscription. This will not be a traditional service with methods to be called, but rather a self-contained, runnable `Layer`.
- **Implementation (`PubSubSubscriberLive`):**
  - This `Layer` will require the `ApiConfig`, `ProcessingJobStore`, and a low-level (mocked) Pub/Sub client.
  - It will construct a single `Effect` that contains an infinite loop (`Stream.fromEffect(...)` or `Effect.forever`).
  - Inside the loop, it will:
    1. Pull a message from the subscription.
    2. Decode and validate the message against a `JobUpdatedEvent` domain schema.
    3. On success, call `jobStore.updateJobStatus` with the new status.
    4. Acknowledge the message.
    5. On failure (decode or update), log the error and negatively acknowledge the message so it can be redelivered or sent to a DLQ.

## 6. Handler Implementation (`src/handlers/jobs.ts`)

*No changes from the original design.* The job creation handler's responsibility ends after it successfully publishes the initial `JobQueued` event.

## 7. Testing Design (Revised)

- The integration test suite (`test/api.integration.test.ts`) will be expanded.
- In addition to testing the HTTP endpoint, tests will need to verify the subscriber's behavior.
- **Test Scenario Example:**
  1. Start the test server layer, which includes the background subscriber.
  2. Make an HTTP request to create a job.
  3. Assert the `202 Accepted` response.
  4. **Simulate a downstream event:** Manually publish a `JobUpdatedEvent` message to the mock Pub/Sub subscription that the subscriber is listening to.
  5. **Assert State Change:** Check the mock `ProcessingJobStore` to confirm that the job's status was correctly updated by the subscriber.