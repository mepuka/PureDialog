# API Service Implementation Plan (Revised Push Model)

## 1. Overview

This document provides a systematic implementation plan for the `@puredialog/api` service, based on a push-subscription architecture. This revised plan emphasizes the up-front scaffolding of the entire application to create a solid, type-safe foundation. The core principle is to define all interfaces, data types, service layers, and API endpoints first, ensuring they are correctly wired with the existing `@puredialog/domain` and `@puredialog/ingestion` packages before implementing the detailed business logic.

## 2. Phase 1: Foundational Dependencies and Service Scaffolding

**Goal:** Establish the complete set of dependencies, configurations, and service interfaces that the API will rely on. This creates a stable, mockable base for all subsequent development.

- **Step 1.1: Add Project Dependency**
  - **Action:** Add `@puredialog/ingestion` as a dependency to `@puredialog/api` in its `package.json`.
  - **Emphasis:** This is the first and most critical step. It makes all shared services (`PubSubClient`, `PubSubConfigLive`, `MessageAdapter`) and types (`PubSubError`) available, ensuring our new API is built upon the existing, real infrastructure from the outset.

- **Step 1.2: Implement API Configuration (`src/config.ts`)**
  - **Action:** Create the `ApiConfig` service for API-specific settings (e.g., `port`).
  - **Emphasis:** This config is kept separate from the `PubSubConfig` to maintain clear service boundaries. The final application will be provided with *both* the `ApiConfigLive` and the `PubSubConfigLive` layers, demonstrating proper layer composition.

- **Step 1.3: Implement Error Types (`src/errors.ts`)**
  - **Action:** Create a `DatabaseError` tagged error.
  - **Emphasis:** Defining this upfront allows us to create a complete `ApiError` type union by combining our new error with the imported `PubSubError`. This enables us to define the full error channel for our service interfaces from the very beginning.

- **Step 1.4: Scaffold Mock Persistence Service (`src/services/JobStore.ts`)**
  - **Action:** Create the `ProcessingJobStore` service tag and a `ProcessingJobStoreMock` layer.
  - **Emphasis:** The `ProcessingJobStore` interface will be fully defined with all required methods (`createJob`, `findJobByIdempotencyKey`, `updateJobStatus`). The mock implementation will use an in-memory `Map` and return placeholder effects (e.g., `Effect.succeed(job)`). This scaffolding is crucial as it allows handler logic to be written and type-checked against a stable, complete service interface, long before a real database is implemented.

## 3. Phase 2: Scaffolding the Declarative API Surface

**Goal:** Define the entire surface area of the API, including all public and internal endpoints and their data contracts. This creates a complete, type-safe blueprint of the API that can be validated before any business logic is written.

- **Step 2.1: Define All API Schemas (`src/schemas.ts`)**
  - **Action:** Create schemas for all request and response bodies.
  - **Emphasis:** This includes schemas for public responses (`JobAccepted`, `JobAlreadyExists`) and for the internal Pub/Sub push message format (`PubSubPushMessage`, which contains a base64 `data` string). This enforces the API's public and internal contracts from the start, leveraging types from `@puredialog/domain` for request payloads.

- **Step 2.2: Define the Complete API Structure (`src/api.ts`)**
  - **Action:** Define the `PureDialogApi` with all its groups and endpoints.
  - **Emphasis:** This file will be fully implemented in this step. It will define the `Health`, `Jobs` (public), and `Internal` groups, and all their corresponding endpoints (`status`, `createJob`, `jobUpdate`). Each endpoint will be fully configured with its request payload schema, success response schemas, and error schemas. This provides a complete, verifiable definition of the API surface.

## 4. Phase 3: Scaffolding Handlers and Service Layers

**Goal:** Create the handler files and layers with correctly-typed, placeholder implementations. This wires up the dependency injection graph and ensures the application is structurally sound and compiles correctly.

- **Step 3.1: Scaffold Public Jobs Handler (`src/handlers/jobs.ts`)**
  - **Action:** Create the `jobsLive` layer using `HttpApiBuilder.group`.
  - **Emphasis:** The handler function for `createJob` will be implemented with the correct signature, requiring `ProcessingJobStore` and `PubSubClient` in its context. The initial implementation can be a placeholder (e.g., `Effect.die("Not implemented")`), but the scaffolding ensures that the dependency injection is correctly configured and type-checked from day one.

- **Step 3.2: Scaffold Internal Push Handlers (`src/handlers/internal.ts`)**
  - **Action:** Create the `internalLive` layer for the push subscription endpoints.
  - **Emphasis:** The `jobUpdateHandler` will be implemented with a correct signature that requires `ProcessingJobStore` and `MessageAdapter`. The initial logic will be a placeholder. This step is key to scaffolding the event-ingestion part of the API, ensuring the types for decoding and processing Pub/Sub messages are wired up correctly.

## 5. Phase 4: Implementing Business Logic

- **Action:** Fill in the placeholder logic in the handlers created in Phase 3.
- **Details:**
  - **`jobs.ts`:** Implement the full idempotency check, persistence, and publishing logic.
  - **`internal.ts`:** Implement the full Pub/Sub message decoding, validation, and status update logic.

## 6. Phase 5: Final Assembly and Verification

- **Action:** Implement the main entry point and integration tests.
- **Details:**
  - **`server.ts` & `index.ts`:** Compose the final application `Layer`, providing all the live and mock services to the handler layers, and launch the application.
  - **`test/api.integration.test.ts`:** Implement integration tests that verify the behavior of both the public and internal endpoints, simulating both direct HTTP calls and Pub/Sub push requests.
