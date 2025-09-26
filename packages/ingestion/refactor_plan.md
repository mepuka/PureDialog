# Ingestion Package Refactoring Plan (Revised)

This document outlines a revised plan to refactor the `ingestion` package. The goal is to more deeply align the package with the principles of the Effect ecosystem, focusing on structured services, robust concurrency, resource safety, and observability as documented in the project's `@patterns/` directory.

## 1. Deeper Analysis of Effect Pattern Adherence

A second review against the project's established patterns reveals the following:

*   **Strengths:**
    *   **Service & Layer (`effect-service-layer-patterns.md`):** The `YoutubeApiClient` correctly uses a `Context.Tag` and is provided via a `Layer`, making it a well-defined, injectable service.
    *   **Configuration (`effect-configuration-patterns.md`):** Both `YoutubeConfig` and `PubSubConfig` use Effect's `Config` module idiomatically, with validation and support for redacted secrets.
    *   **Error Handling (`effect-error-management-patterns.md`):** The package correctly uses `Data.TaggedError` for structured errors and `Effect.catchTag` for handling them, avoiding anti-patterns like `try/catch` in generators.

*   **Areas for Deeper Refactoring:**
    *   **Resource Management (`effect-resource-management-patterns.md`):** The Pub/Sub client, which requires initialization and shutdown, is not managed as a resource. A `Layer.scoped` is needed to ensure its lifecycle is handled safely.
    *   **Concurrency (`effect-concurrency-patterns.md`):** The `YoutubeApiClient`'s batch operations (`getVideos`, `getChannels`) are not robust. They fail if more than 50 IDs are provided, instead of chunking the work and executing it concurrently.
    *   **Observability (`effect-observability-patterns.md`):** The package lacks any structured logging or tracing. There are no `Effect.log` calls or `Effect.withSpan` wrappers, making it a black box during execution.
    *   **Adapter Pattern (`AGENTS.md`):** The responsibility of converting YouTube API data into the domain model is currently split between `adapters/youtube-adapter.ts` and `youtube/utils.ts`, violating the principle of a single, clear boundary.

## 2. Revised Refactoring Plan

### 2.1. YouTube Client: Robustness and Observability

**Goal:** Make the `YoutubeApiClient` more resilient, observable, and strictly compliant with architectural rules.

**Action Items:**

1.  **Implement Robust Batching (Pattern 76 & 66):**
    *   Refactor the `getVideos` and `getChannels` methods in `youtube/client.ts`.
    *   Instead of failing on inputs larger than 50, use `Chunk.chunksOf(50)` to split the list of IDs into API-compliant batches.
    *   Use `Effect.forEach` with the `{ concurrency: 10 }` option to execute these batches in parallel, improving performance while respecting potential rate limits.

2.  **Add Observability (Pattern 82, 89, 90):**
    *   Wrap the core logic of each method in `YoutubeApiClient` (e.g., `getVideo`, `getVideos`) with `Effect.withSpan("YoutubeApiClient.getVideo")`.
    *   Within each span, use `Effect.annotateCurrentSpan` to add relevant attributes like `youtube.video.id` or `youtube.batch.size`.
    *   This will provide invaluable tracing data for debugging and performance monitoring.

3.  **Centralize the Adapter Logic (`AGENTS.md`):**
    *   Move the `transformVideo` and `transformChannel` functions from `youtube/utils.ts` exclusively into `adapters/youtube.ts` (renaming `youtube-adapter.ts`).
    *   The `YoutubeApiClient` will now depend on and call this adapter service, ensuring a clean data flow: `API Client -> Adapter -> Domain`.
    *   `youtube/utils.ts` will only contain pure functions like URL parsers, with no knowledge of Google API types.

4.  **Eliminate Unsafe Type Casts (`AGENTS.md`):**
    *   In the adapter's `encode` function, replace `youtubeVideo.tags as unknown as Array<string>` with the type-safe `[...youtubeVideo.tags]` to convert `ReadonlyArray` to `Array`.

### 2.2. Pub/Sub: From Utilities to a Managed Service

**Goal:** Elevate the Pub/Sub logic into a first-class, resource-safe, and injectable Effect service.

**Action Items:**

1.  **Introduce `PubSubClient` Service (Pattern 54):**
    *   In a new `pubsub/client.ts` file, define a `PubSubClient` service interface using `Context.Tag`.
    *   The interface will expose high-level methods like `publishEvent(event: DomainEvent)` and `publishWorkMessage(job: TranscriptionJob)`.

2.  **Implement a Scoped Layer (Pattern 55 & 77):**
    *   Create `PubSubClientLive` as a `Layer.scoped`.
    *   The `acquire` effect will be responsible for `new PubSub()` from the `@google-cloud/pubsub` SDK, creating the client instance.
    *   The `release` effect will be `(client) => Effect.promise(() => client.close())`, ensuring the connection is always gracefully terminated.
    *   This correctly models the Pub/Sub client as a managed resource, preventing leaks.

3.  **Implement Service Methods:**
    *   The `publishEvent` and `publishWorkMessage` methods within the layer will use the `message-adapter.ts` utilities to encode the domain objects before calling the underlying SDK's `publishMessage` method.
    *   This encapsulates all implementation details, presenting consumers with a clean, domain-oriented API.

4.  **Add Observability (Pattern 82, 89, 90):**
    *   Wrap the `publishEvent` and `publishWorkMessage` methods with `Effect.withSpan`.
    *   Annotate the spans with relevant data, such as `pubsub.topic.name`, `pubsub.event.type`, and `job.id`.

## 3. Summary of Execution Steps

1.  **Branch:** Create a new git branch for the refactoring.
2.  **YouTube Client - Batching:** Refactor `getVideos` and `getChannels` to use `Chunk.chunksOf` and `Effect.forEach` with concurrency.
3.  **Adapter Consolidation:** Move all YouTube-to-Domain transformation logic into `adapters/youtube.ts` and update the client to use it. Remove unsafe type casts.
4.  **Pub/Sub Service:** Create the `PubSubClient` service tag and the `PubSubClientLive` scoped layer in `pubsub/client.ts`, ensuring the SDK client is properly managed.
5.  **Observability:** Add `Effect.withSpan` and `Effect.annotateCurrentSpan` to both the `YoutubeApiClient` and the new `PubSubClient` methods.
6.  **Cleanup:** Update all imports and remove now-redundant files/functions.
7.  **Verification:** Run `pnpm build` and `pnpm test` to ensure all changes are sound.
8.  **Commit:** Commit the changes with a descriptive message.