# Ingestion Package Refactor: Design Document

## 1. Overview

This document presents the technical design for the refactoring of the `@puredialog/ingestion` package. It translates the goals outlined in `requirements.md` into a concrete implementation strategy, focusing on creating a more robust, observable, and idiomatic Effect-TS architecture.

## 2. High-Level Architecture

The refactored package will consist of two primary, independent, and injectable services: `YoutubeApiClient` and `PubSubClient`. The boundary between external data models and the internal domain will be strictly managed by a dedicated `YoutubeAdapter`.

### Component Diagram

```
+------------------------------------+
|           Application              |
| (e.g., API, Worker)                |
+------------------------------------+
     |                   |
     | depends on        | depends on
     V                   V
+-------------------+ +--------------------+
|  PubSubClient     | |  YoutubeApiClient  |
| (Service & Layer) | | (Service & Layer)  |
+-------------------+ +--------------------+
     |                   |         ^
     | uses              |         | depends on
     V                   |         |
+-------------------+    |    +--------------------+
| MessageAdapter    |    |    |  YoutubeAdapter    |
+-------------------+    |    |  (Service & Layer) |
     |                   |    +--------------------+
     | uses              |         |
     V                   |         | uses
+-------------------+    |         V
| @puredialog/domain|    |    +--------------------+
+-------------------+    |    | @effect/platform   |
                         |    |    /HttpClient     |
                         V    +--------------------+
                 +--------------------+
                 | External SDKs      |
                 | - @google-cloud/pubsub |
                 | - GoogleAPIs       |
                 +--------------------+
```

## 3. Component Design

### 3.1. `youtube` Module

The `youtube` module will be responsible for all interactions with the YouTube Data API.

#### 3.1.1. `YoutubeApiClient` Service

*   **Batch Processing (`getVideos`, `getChannels`):** To satisfy **FR-1**, the batch methods will be redesigned to handle arbitrarily large lists of IDs.

    *   **Design:** The incoming `Array<VideoId>` will be converted to a `Chunk<VideoId>`.
    *   `Chunk.chunksOf(50)` will be used to split the IDs into API-compliant batches.
    *   `Effect.forEach(batches, (batch) => ..., { concurrency: 10 })` will be used to execute these requests in parallel, with concurrency limited to 10 to avoid rate-limiting issues.

*   **Observability (`withSpan`):** To satisfy **NFR-3**, each public method will be wrapped in a trace span.

    *   **Design Snippet:**
        ```typescript
        const getVideo = (id: VideoId) =>
          Effect.gen(function*() {
            // ... logic
          }).pipe(
            Effect.withSpan("YoutubeApiClient.getVideo"),
            Effect.annotateCurrentSpan("youtube.video.id", id)
          );
        ```

*   **Dependencies:** The `YoutubeApiClientLive` layer will now explicitly require `YoutubeAdapter` in its context, in addition to `YoutubeConfig` and `HttpClient`.

#### 3.1.2. `YoutubeConfig` Service

*   **Design:** The `YoutubeConfigInterface` and its corresponding `Layer` will be updated to include a configurable retry policy, satisfying **NFR-4**.

    ```typescript
    export interface YoutubeConfigInterface {
      readonly apiKey: string;
      readonly baseUrl: string;
      readonly timeout: Duration.Duration;
      // New fields
      readonly retryAttempts: number;
      readonly retryBackoff: Duration.Duration;
    }
    ```

#### 3.1.3. `internal/retry.ts`

*   **Design:** The `withRetry` function will be modified to access `YoutubeConfig` from its context to use the new `retryAttempts` and `retryBackoff` values instead of hardcoded constants.

### 3.2. `pubsub` Module

The `pubsub` module will be refactored from a set of utilities into a complete, resource-managed service.

#### 3.2.1. `PubSubClient` Service

*   **Interface (`Context.Tag`):** A new `pubsub/client.ts` file will define the service interface as required by **FR-2** and **FR-3**.

    ```typescript
    export class PubSubClient extends Context.Tag("PubSubClient")<...>() {}
    ```

*   **Live Implementation (`Layer.scoped`):** The `PubSubClientLive` layer will be implemented using `Layer.scoped` to guarantee safe acquisition and release of the Google Pub/Sub client, satisfying **FR-4**.

    *   **Design Snippet:**
        ```typescript
        import { PubSub } from "@google-cloud/pubsub";

        export const PubSubClientLive = Layer.scoped(
          PubSubClient,
          Effect.gen(function*() {
            const config = yield* PubSubConfig;
            const client = yield* Effect.acquireUseRelease(
              Effect.sync(() => new PubSub({ projectId: config.projectId })),
              (client) => Effect.succeed(createPubSubClient(client)), // createPubSubClient returns the service implementation
              (client) => Effect.promise(() => client.close())
            );
            return client;
          })
        );
        ```

*   **Observability:** Methods within the `PubSubClient` implementation will be wrapped with `Effect.withSpan` and annotated with relevant attributes like `pubsub.topic.name` and `pubsub.event.type` (**NFR-3**).

### 3.3. `adapters` Module

This module will become the single, authoritative boundary for data transformation.

#### 3.3.1. `YoutubeAdapter` Service

*   **Design:** To formalize its role, the adapter logic will be exposed as a simple, injectable service in `adapters/youtube.ts`.

    ```typescript
    class YoutubeAdapter extends Context.Tag("YoutubeAdapter")<
      YoutubeAdapter,
      {
        readonly toDomainVideo: (apiVideo: unknown) => Effect.Effect<YouTubeVideo, ParseError>;
        readonly toDomainChannel: (apiChannel: unknown) => Effect.Effect<YouTubeChannel, ParseError>;
      }
    >() {}

    const YoutubeAdapterLive = Layer.succeed(
      YoutubeAdapter,
      { /* implementation of toDomainVideo etc. */ }
    );
    ```

*   **Logic Consolidation:** All transformation logic currently in `youtube/utils.ts` (`transformVideo`, `transformChannel`) will be moved into this adapter, satisfying **NFR-1.2**.

*   **Type Safety:** The `as unknown as` casts will be removed and replaced with safe alternatives, satisfying **NFR-2.1**.

## 4. Data & Error Flow

### 4.1. YouTube Ingestion Data Flow

```
Effect<YouTubeVideo, YoutubeApiError>
  |
  V
[YoutubeApiClient.getVideo]
  - Creates Span "YoutubeApiClient.getVideo"
  - Annotates with "youtube.video.id"
  - Calls executeRequest
  |
  V
[executeRequest]
  - Makes HTTP call via @effect/platform/HttpClient
  - Retries on failure based on YoutubeConfig
  - On success, decodes response with internal RawVideoSchema
  |
  V
[YoutubeAdapter.toDomainVideo]
  - Receives raw API object
  - Transforms data into domain format
  - Returns Effect<YouTubeVideo, ParseError>
  |
  V
Success: YouTubeVideo (domain object)
Failure: YoutubeApiError (tagged error)
```

### 4.2. Pub/Sub Publishing Data Flow

```
Effect<string, PubSubPublishError>
  |
  V
[PubSubClient.publishEvent]
  - Creates Span "PubSubClient.publishEvent"
  - Annotates with "pubsub.event.type"
  - Calls MessageAdapter
  |
  V
[MessageAdapter.encodeDomainEvent]
  - Encodes DomainEvent object to Schema
  - Converts to JSON string
  - Converts to Buffer
  |
  V
[Google Pub/Sub SDK]
  - Publishes Buffer to topic
  |
  V
Success: Message ID (string)
Failure: PubSubPublishError (tagged error)
```
