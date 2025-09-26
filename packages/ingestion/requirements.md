# Ingestion Package Refactor: Requirements

## 1. Overview

This document outlines the requirements for refactoring the `@puredialog/ingestion` package. The primary goal is to align the package with the established architectural principles of the project, particularly those defined in the `@patterns/` directory and `AGENTS.md`. The refactor will improve the package's robustness, maintainability, observability, and adherence to idiomatic Effect-TS patterns without altering its external-facing functionality.

## 2. Functional Requirements

These requirements define what the system *must do* after the refactor.

- **FR-1: Robust Batch Processing:** The `YoutubeApiClient` must be capable of processing batch requests (`getVideos`, `getChannels`) for any number of IDs. If the number of IDs exceeds the API limit (50), the client must automatically split the request into multiple, concurrent, rate-limited batches and return the aggregated result, rather than failing.

- **FR-2: Formalized Pub/Sub Service:** The package must provide a formal, injectable `PubSubClient` service. This service will act as the sole entry point for all Pub/Sub interactions, abstracting away the underlying Google Cloud SDK.

- **FR-3: Pub/Sub Service Interface:** The `PubSubClient` must expose a high-level, domain-oriented API with the following methods:
    - `publishEvent(event: DomainEvent): Effect.Effect<string, PubSubPublishError>`
    - `publishWorkMessage(job: TranscriptionJob): Effect.Effect<string, PubSubPublishError>`

- **FR-4: Safe Resource Management:** The `PubSubClient` implementation must manage the lifecycle of the underlying Google Cloud Pub/Sub SDK client. It must guarantee that the client connection is safely acquired on startup and gracefully closed on application shutdown or scope disposal.

## 3. Non-Functional Requirements (NFRs)

These requirements define *how* the system must be built and are critical for long-term quality and maintainability.

### NFR-1: Code Organization & Maintainability

- **NFR-1.1 (Separation of Concerns):** The package must enforce a strict separation of concerns. Logic for external API clients (`youtube`, `pubsub`), data transformation (`adapters`), and pure utilities must reside in distinct, clearly-defined modules.

- **NFR-1.2 (Centralized Adapters):** All data transformation logic from an external data model (e.g., Google YouTube API response) to the internal `@puredialog/domain` model must be centralized within the `adapters/` directory. There must be a single, unambiguous data flow: `External Client -> Adapter -> Domain`.

### NFR-2: Type Safety & Effect Pattern Adherence

- **NFR-2.1 (No Unsafe Casts):** The codebase must be free of unsafe type assertions (`as any`, `as unknown`). All type conversions must be handled through type-safe methods (e.g., array spreading `[...]` for readonly-to-mutable conversion).

- **NFR-2.2 (Service-Oriented Architecture):** All providers of external functionality (`YoutubeApiClient`, `PubSubClient`) must be implemented as Effect `Services` defined by a `Context.Tag` and provided via a `Layer`.

- **NFR-2.3 (Resource-Safe Layers):** Services that manage connections or other resources that require cleanup must be provided via a `Layer.scoped` to ensure adherence to the Resource Management patterns (`effect-resource-management-patterns.md`).

- **NFR-2.4 (Idiomatic Effect Code):** All asynchronous and sequential workflows must use `Effect.gen` for clarity and composition, as per `effect-composition-control-flow-patterns.md`.

- **NFR-2.5 (Structured Errors):** All errors originating from this package must be structured, typed errors extending `Data.TaggedError`, as per `effect-error-management-patterns.md`.

### NFR-3: Observability

- **NFR-3.1 (Distributed Tracing):** All primary operations that involve I/O (e.g., API calls, message publishing) must be wrapped in a traceable span using `Effect.withSpan`. The span name must clearly identify the operation (e.g., `YoutubeApiClient.getVideos`, `PubSubClient.publishEvent`).

- **NFR-3.2 (Contextual Annotation):** Spans and logs must be enriched with relevant contextual information using `Effect.annotateCurrentSpan` and `Effect.annotateLogs`. This includes identifiers like `youtube.video.id`, `pubsub.topic.name`, and `job.id` to facilitate debugging and analysis.

### NFR-4: Configurability

- **NFR-4.1 (Configurable Retry Policy):** The retry mechanism for the `YoutubeApiClient` must be configurable through the `YoutubeConfig` service. This includes, at a minimum, the maximum number of retries and the base for the backoff schedule.

## 4. Out of Scope

- This refactor will **not** introduce any new business features or change the external-facing API contracts of existing services.
- This refactor will **not** change the underlying third-party libraries used for YouTube (`@effect/platform/HttpClient`) or Pub/Sub (`@google-cloud/pubsub`).
- This refactor will **not** alter the domain model defined in the `@puredialog/domain` package.
