# Ingestion Package Refactor: Implementation Plan

## 1. Overview

This document provides a concrete, step-by-step implementation plan for executing the refactor of the `@puredialog/ingestion` package, as specified in the `design.md` document. The plan is broken down into logical phases to ensure changes are made in a controlled and verifiable manner.

## 2. Prerequisites

- **Branch:** All work should be done on a new git branch, e.g., `refactor/ingestion-package`.

## 3. Phase 1: Enhance Core YouTube Client

**Goal:** Improve the robustness, configurability, and observability of the existing `YoutubeApiClient`.

- **Step 1.1: Update YouTube Configuration**
    - **File:** `packages/ingestion/src/youtube/config.ts`
    - **Action:** Add `retryAttempts: number` and `retryBackoff: Duration.Duration` to the `YoutubeConfigInterface`.
    - **Action:** Update the `makeConfig` Effect to load these new values from `Config`, using sensible defaults.

- **Step 1.2: Implement Configurable Retry Policy**
    - **File:** `packages/ingestion/src/youtube/internal/retry.ts`
    - **Action:** Modify the `withRetry` function and/or `youtubeRetrySchedule` to access `YoutubeConfig` from the Effect context.
    - **Action:** Use the `retryAttempts` and `retryBackoff` values from the service to drive the `Schedule` instead of hardcoded values.

- **Step 1.3: Implement Robust Batching**
    - **File:** `packages/ingestion/src/youtube/client.ts`
    - **Action:** In the `getVideos` and `getChannels` methods, import `Chunk` from `effect`.
    - **Action:** Use `Chunk.fromIterable(ids).pipe(Chunk.chunksOf(50))` to split the input IDs into API-compliant batches.
    - **Action:** Replace the existing logic with `Effect.forEach(batches, (batch) => ..., { concurrency: 10 })` to execute these batches concurrently.
    - **Action:** Ensure the results from all batches are flattened into a single `Array<YouTubeVideo | YouTubeChannel>` before being returned.

- **Step 1.4: Add Observability to YouTube Client**
    - **File:** `packages/ingestion/src/youtube/client.ts`
    - **Action:** Wrap the core logic of each public method (`getVideo`, `getChannel`, `getVideos`, `getChannels`) with `Effect.withSpan("YoutubeApiClient.METHOD_NAME")`.
    - **Action:** Inside each method, use `Effect.annotateCurrentSpan` to add relevant context, such as `"youtube.video.id"` or `"youtube.batch.count"`.

## 4. Phase 2: Centralize Adapters & Structure

**Goal:** Enforce the architectural boundary between external data models and the internal domain.

- **Step 2.1: Create Formal `YoutubeAdapter` Service**
    - **File:** `packages/ingestion/src/adapters/youtube.ts` (rename from `youtube-adapter.ts`)
    - **Action:** Define the `YoutubeAdapter` service tag and interface as specified in the design document.
    - **Action:** Create the `YoutubeAdapterLive` layer, which will contain the transformation logic.

- **Step 2.2: Consolidate Transformation Logic**
    - **Action:** Move the `transformVideo` and `transformChannel` functions from `packages/ingestion/src/youtube/utils.ts` into the implementation of the `YoutubeAdapterLive` layer.
    - **Action:** Update the adapter to use the more robust `Schema.transformOrFail` pattern that was in the original `youtube-adapter.ts`.
    - **Action:** Delete the now-empty transformation functions from `youtube/utils.ts`.

- **Step 2.3: Update `YoutubeApiClient` Dependencies**
    - **File:** `packages/ingestion/src/youtube/client.ts`
    - **Action:** Add `YoutubeAdapter` to the context (`R`) of the `makeYoutubeApiClient` Effect.
    - **Action:** In the implementation, `yield*` the `YoutubeAdapter` service.
    - **Action:** Replace all calls to the old `transformVideo` with calls to `adapter.toDomainVideo`.
    - **Action:** Update the `YoutubeApiClientLive` layer to be provided with the `YoutubeAdapterLive` layer (`Layer.provide(YoutubeApiClientLive, YoutubeAdapterLive)`).

- **Step 2.4: Eliminate Unsafe Type Casts**
    - **File:** `packages/ingestion/src/adapters/youtube.ts`
    - **Action:** During Step 2.2, ensure the `as unknown as` cast for `tags` is replaced with a safe `[...youtubeVideo.tags]` spread.

## 5. Phase 3: Implement Pub/Sub Service

**Goal:** Abstract Pub/Sub interactions into a first-class, resource-safe Effect service.

- **Step 3.1: Define `PubSubClient` Service**
    - **File:** `packages/ingestion/src/pubsub/client.ts` (new file)
    - **Action:** Define the `class PubSubClient extends Context.Tag(...)` with the `publishEvent` and `publishWorkMessage` methods.

- **Step 3.2: Implement `PubSubClientLive` Scoped Layer**
    - **File:** `packages/ingestion/src/pubsub/client.ts`
    - **Action:** Implement `PubSubClientLive` using `Layer.scoped`.
    - **Action:** The `acquire` effect will instantiate the Google Pub/Sub client (`new PubSub()`).
    - **Action:** The `release` effect will call `client.close()` on the acquired client.

- **Step 3.3: Implement Client Methods & Add Observability**
    - **File:** `packages/ingestion/src/pubsub/client.ts`
    - **Action:** Implement the logic for `publishEvent` and `publishWorkMessage`. These methods will use the existing `MessageAdapter` to encode the domain objects before publishing.
    - **Action:** Wrap the logic for each method in an `Effect.withSpan` and use `Effect.annotateCurrentSpan` to add contextual information (e.g., topic name, event type).

## 6. Phase 4: Comprehensive Testing Strategy

**Goal:** Implement focused, high-quality tests that validate core functionality and integration patterns.

### 6.1 YouTube Client Testing

- **Step 4.1: Create YouTube API Test Utilities**
    - **File:** `packages/ingestion/test/youtube/test-utils.ts` (new file)
    - **Action:** Create mock YouTube API responses following the patterns in `patterns/generic-testing.md`:
    ```typescript
    export const createMockYoutubeApiClient = () => {
      const apiCalls: Array<{ method: string; params: unknown }> = []
      
      const mockClient: YoutubeApiClient = {
        getVideo: (id) => Effect.gen(function* () {
          apiCalls.push({ method: 'getVideo', params: { id } })
          return createTestVideo(id)
        }),
        getVideos: (ids) => Effect.gen(function* () {
          apiCalls.push({ method: 'getVideos', params: { ids } })
          return ids.map(createTestVideo)
        }),
        // ... other methods
      }
      
      return { mockClient, apiCalls }
    }
    ```

- **Step 4.2: Unit Tests for YouTube Client**
    - **File:** `packages/ingestion/test/youtube/client.test.ts` (new file)
    - **Action:** Test batching logic with large arrays (>50 items) to verify chunking works correctly
    - **Action:** Test retry behavior using `TestClock` to control timing
    - **Action:** Test observability spans are created with correct annotations

- **Step 4.3: YouTube Adapter Tests**
    - **File:** `packages/ingestion/test/adapters/youtube.test.ts` (new file)
    - **Action:** Test transformation from raw YouTube API responses to domain objects
    - **Action:** Test error handling for malformed API responses
    - **Action:** Test type safety improvements (no unsafe casts)

### 6.2 PubSub Testing with Emulator

- **Step 4.4: Enhanced PubSub Test Layer**
    - **File:** `packages/ingestion/test/pubsub/test-layer.ts` (new file)
    - **Action:** Create proper layer-based PubSub testing following the pattern:
    ```typescript
    export const createTestPubSubLayer = () => {
      const publishedMessages: Array<{ topic: string; message: PubSubMessage }> = []
      
      const mockPubSubClient: PubSubClient = {
        publishEvent: (event) => Effect.gen(function* () {
          publishedMessages.push({ topic: 'events', message: yield* encodeDomainEvent(event) })
          return `message-${Date.now()}`
        }),
        publishWorkMessage: (job) => Effect.gen(function* () {
          publishedMessages.push({ topic: 'work', message: yield* encodeWorkMessage(job) })
          return `message-${Date.now()}`
        })
      }
      
      const testLayer = Layer.succeed(PubSubClient, mockPubSubClient)
      
      return { testLayer, publishedMessages }
    }
    ```

- **Step 4.5: PubSub Service Tests**
    - **File:** `packages/ingestion/test/pubsub/client.test.ts` (new file)
    - **Action:** Test service lifecycle (acquire/release) using Layer.scoped patterns
    - **Action:** Test message publishing with proper encoding/decoding
    - **Action:** Test error handling and retry scenarios

- **Step 4.6: PubSub Emulator Integration Tests**
    - **File:** `packages/ingestion/test/pubsub/emulator-integration.test.ts` (enhance existing)
    - **Action:** Refactor existing test to use proper layer patterns
    - **Action:** Add test utilities for emulator setup/teardown:
    ```typescript
    const createEmulatorTestLayer = () => 
      Layer.scoped(
        PubSubClient,
        Effect.gen(function* () {
          const pubsub = yield* Effect.acquireUseRelease(
            Effect.sync(() => new PubSub({ 
              projectId: "test-project", 
              apiEndpoint: process.env.PUBSUB_EMULATOR_HOST ?? "127.0.0.1:8085"
            })),
            (client) => Effect.succeed(createRealPubSubClient(client)),
            (client) => Effect.promise(() => client.close())
          )
          return pubsub
        })
      )
    ```

### 6.3 Integration and End-to-End Testing

- **Step 4.7: Service Integration Tests**
    - **File:** `packages/ingestion/test/integration/youtube-pubsub.test.ts` (new file)
    - **Action:** Test complete flow: YouTube API call → domain transformation → PubSub publishing
    - **Action:** Use layer composition to test real service integration

- **Step 4.8: Error Scenario Testing**
    - **File:** `packages/ingestion/test/error-scenarios.test.ts` (new file)
    - **Action:** Test network failures, malformed responses, timeout scenarios
    - **Action:** Use Effect error handling patterns to verify proper error propagation

## 7. Phase 5: Development Scripts and Utilities

**Goal:** Provide practical scripts for development and testing against real APIs.

### 7.1 YouTube API Development Scripts

- **Step 5.1: Create YouTube API Test Script**
    - **File:** `packages/ingestion/scripts/test-youtube-api.ts` (new file)
    - **Action:** Create script to test real YouTube API calls:
    ```typescript
    #!/usr/bin/env tsx
    import { Effect, Layer } from "effect"
    import { YoutubeApiClient, YoutubeApiClientLive } from "../src/youtube/client.js"
    
    const testScript = Effect.gen(function* () {
      const client = yield* YoutubeApiClient
      
      // Test single video
      const video = yield* client.getVideo("dQw4w9WgXcQ" as VideoId)
      console.log("Video:", video.title)
      
      // Test batch videos (test chunking)
      const videoIds = Array.from({length: 75}, (_, i) => `test-id-${i}` as VideoId)
      const videos = yield* client.getVideos(videoIds)
      console.log(`Retrieved ${videos.length} videos`)
    }).pipe(
      Effect.provide(YoutubeApiClientLive),
      Effect.tapErrorCause(Effect.logError),
      Effect.runPromise
    )
    
    testScript()
    ```

- **Step 5.2: Add Package Scripts**
    - **File:** `packages/ingestion/package.json`
    - **Action:** Add scripts for development and testing:
    ```json
    {
      "scripts": {
        "test:youtube": "tsx scripts/test-youtube-api.ts",
        "test:pubsub": "PUBSUB_EMULATOR_HOST=127.0.0.1:8085 vitest test/pubsub/emulator-integration.test.ts",
        "emulator:start": "gcloud beta emulators pubsub start --host-port=127.0.0.1:8085 --quiet &",
        "emulator:stop": "pkill -f pubsub-emulator || true"
      }
    }
    ```

### 7.2 PubSub Development Utilities

- **Step 5.3: PubSub Testing Script**
    - **File:** `packages/ingestion/scripts/test-pubsub.ts` (new file)
    - **Action:** Script to test PubSub functionality:
    ```typescript
    #!/usr/bin/env tsx
    import { Effect, Layer } from "effect"
    import { PubSubClient, PubSubClientLive } from "../src/pubsub/client.js"
    import { createSampleJob, createJobQueuedEvent } from "../test/test-data.js"
    
    const testPubSub = Effect.gen(function* () {
      const client = yield* PubSubClient
      
      // Test event publishing
      const event = createJobQueuedEvent()
      const messageId = yield* client.publishEvent(event)
      console.log("Published event, message ID:", messageId)
      
      // Test work message publishing
      const job = createSampleJob()
      const workMessageId = yield* client.publishWorkMessage(job)
      console.log("Published work message, ID:", workMessageId)
    }).pipe(
      Effect.provide(PubSubClientLive),
      Effect.tapErrorCause(Effect.logError),
      Effect.runPromise
    )
    
    testPubSub()
    ```

## 8. Phase 6: Finalization and Verification

### 8.1 Quality Assurance

- **Step 6.1: Project-Wide Import Updates**
    - **Action:** Perform a project-wide search for any imports that may be broken due to file moves and renaming, and update them.

- **Step 6.2: Comprehensive Verification**
    - **Action:** Run `pnpm build` from the root of the project to ensure all type-checking passes.
    - **Action:** Run `pnpm test` from the root of the project to ensure all existing tests still pass.
    - **Action:** Run `pnpm lint:fix` to ensure code style compliance.
    - **Action:** Run new integration tests to verify end-to-end functionality.

### 8.2 Documentation Updates

- **Step 6.3: Update Package Documentation**
    - **File:** `packages/ingestion/README.md`
    - **Action:** Document new service interfaces, testing strategies, and development scripts.
    - **Action:** Add examples of using the new PubSubClient and enhanced YoutubeApiClient.

## 9. Testing Philosophy and Quality Focus

**Quality over Quantity:** This refactor emphasizes focused, high-value tests that:

1. **Test Critical Paths:** Focus on batching logic, error handling, and service integration
2. **Use Effect Testing Patterns:** Leverage `@effect/vitest`, `TestClock`, and layer-based testing
3. **Validate Architecture:** Ensure services work correctly together through integration tests
4. **Enable Development:** Provide practical scripts for testing against real APIs
5. **Maintainable Tests:** Use proper mocking patterns that don't break with internal changes

The testing strategy follows the established patterns in `patterns/generic-testing.md` and `patterns/layer-composition.md`, ensuring consistency with the broader codebase architecture.

## 10. Success Metrics

- **Functionality:** All existing functionality preserved, with enhanced error handling
- **Robustness:** YouTube batching handles arbitrary input sizes gracefully  
- **Observability:** Complete tracing and logging across all operations
- **Testability:** Comprehensive test coverage for critical paths and integration scenarios
- **Developer Experience:** Easy-to-use scripts for testing real API integration
- **Architecture:** Clean service boundaries with proper resource management