# API Service Implementation Plan

## 1. Overview

This document provides a systematic, step-by-step implementation plan for the `@puredialog/api` service. The plan is based on the revised `design.md`, which specifies a service that both handles HTTP requests for job creation and subscribes to Pub/Sub topics to track job progress. The implementation will strictly follow the project's established architectural patterns.

## 2. Phase 1: Foundational Services & Types

**Goal:** Establish the core services, mocks, and data types required by the application.

- **Step 1.1: Implement Configuration (`src/config.ts`)**
  - **Action:** Create the `ApiConfig` service interface and `ApiConfigLive` layer.
  - **Details:** The config will include `port`, `gcpProjectId`, `jobProcessingTopicId`, and the new `jobEventsSubscriptionId`. The layer will load these from the environment using `Config.all`.

- **Step 1.2: Implement Error Types (`src/errors.ts`)**
  - **Action:** Create the `ApiError` tagged union.
  - **Details:** Define `DatabaseError` and `PubSubError` classes extending `Data.TaggedError`.

- **Step 1.3: Implement Mock Persistence Service (`src/services/JobStore.ts`)**
  - **Action:** Create the `ProcessingJobStore` service tag and the `ProcessingJobStoreMock` layer.
  - **Details:** The mock layer will be a `Layer.succeed` that provides an implementation using an in-memory `Map`. It must implement `createJob`, `findJobByIdempotencyKey`, and the new `updateJobStatus` methods.

- **Step 1.4: Implement Mock Publisher Service (`src/services/PubSubPublisher.ts`)**
  - **Action:** Create the `PubSubPublisher` service tag and the `PubSubPublisherMock` layer.
  - **Details:** The mock layer will provide an implementation that logs any message it's asked to publish to the console.

## 3. Phase 2: Declarative API Definition

**Goal:** Define the complete, declarative HTTP API structure.

- **Step 2.1: Update API Schemas (`src/schemas.ts`)**
  - **Action:** Create a new file for shared API response schemas.
  - **Details:** Define `JobAccepted` (`202`) and `JobAlreadyExists` (`200`) response schemas.

- **Step 2.2: Update API Definition (`src/api.ts`)**
  - **Action:** Extend the existing `HttpApi` definition.
  - **Details:**
    1. Create a new `HttpApiGroup` named `"Jobs"`.
    2. Define the `createJobEndpoint` for `POST /v1/transcription-jobs`. This endpoint will use the `CreateTranscriptionJobRequest` schema for its payload and reference the new response schemas for its success cases.
    3. Add the `Jobs` group to the main `PureDialogApi` definition.

## 4. Phase 3: HTTP Handler Implementation

**Goal:** Implement the business logic for the new API endpoints.

- **Step 3.1: Create Jobs Handler (`src/handlers/jobs.ts`)**
  - **Action:** Create the `jobsLive` layer using `HttpApiBuilder.group`.
  - **Details:** This layer will require `ProcessingJobStore` and `PubSubPublisher` in its context.
  - **Action:** Implement the handler for the `createJob` endpoint.
  - **Details:** The handler will be an `Effect.gen` block that performs the idempotency check, job creation, and event publishing logic as specified in the design document. It will use `Effect.withSpan` and `Effect.annotateLogs` for observability.

## 5. Phase 4: Background Subscriber Implementation

**Goal:** Implement the background process for consuming job status updates.

- **Step 4.1: Create Subscriber Service (`src/services/PubSubSubscriber.ts`)**
  - **Action:** Create the `PubSubSubscriberLive` layer.
  - **Details:** This layer will not expose a service interface but will provide a long-running `Effect`. It will require `ProcessingJobStore` and `ApiConfig`.
  - **Implementation:** The effect will contain a loop (`Effect.forever`) that simulates pulling a message from a subscription, logs the message, and calls the (mock) `jobStore.updateJobStatus` method. This proves the background process can run and interact with other services.

## 6. Phase 5: Final Assembly & Application Entry Point

**Goal:** Compose all the layers and create the main application entry point.

- **Step 5.1: Implement Server Composition (`src/server.ts`)**
  - **Action:** Define the `HttpServerLive` layer.
  - **Details:** This layer will be responsible for composing the full dependency graph for the HTTP server component, providing the mock `JobStore` and `PubSubPublisher` to the `jobsLive` handler, and providing the `ApiConfigLive` layer.

- **Step 5.2: Implement Main Entry Point (`src/index.ts`)**
  - **Action:** Create the main runnable effect for the application.
  - **Details:**
    1. Import `HttpServerLive` and `PubSubSubscriberLive`.
    2. Define `const main = Effect.all([HttpServerLive, PubSubSubscriberLive], { concurrency: "unbounded", discard: true })`.
    3. Create the final application `Layer` by providing all necessary mock and live service implementations to `main`.
    4. Use `Layer.launch` and `NodeRuntime.runMain` to execute the application.

## 7. Phase 6: Verification

- **Step 7.1: Create Integration Test (`test/api.integration.test.ts`)**
  - **Action:** Create a new integration test file.
  - **Details:** Use the `layer` helper from `@effect/vitest` and a `testServerLayer` factory as described in `patterns/http-specific-testing.md`. The test layer will run the full application (both server and subscriber) on a random port.

- **Step 7.2: Implement Test Cases**
  - **Action:** Write tests to verify the behavior of the `POST /v1/transcription-jobs` endpoint.
  - **Details:**
    - Test for a `202 Accepted` response on the first valid request.
    - Test for a `200 OK` response on a second request with the same idempotency key.
    - Test for a `400 Bad Request` on a request with an invalid body.
