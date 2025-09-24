# LLM Prompting Service - Implementation Plan

## Phase 1: Scaffolding and Pure Modules

-   [ ] **Step 1.1**: Create the directory structure `packages/gemini/src`.
-   [ ] **Step 1.2**: Create the `packages/gemini/src/config.ts` file and define the `GeminiConfig` using `Config` and `Duration`.
    -   **Patterns**: `effect-configuration-patterns.md`
-   [ ] **Step 1.3**: Create the `packages/gemini/src/errors.ts` file and define the `GeminiError` tagged enum using `Data.TaggedError`.
    -   **Patterns**: `effect-error-management-patterns.md`
-   [ ] **Step 1.4**: Create the `packages/gemini/src/prompt.ts` file and add a placeholder function for building the system instruction.
-   [ ] **Step 1.5**: Create the `packages/gemini/src/schema.ts` file and define the adapter schema for the model output using `Schema`.
    -   **Patterns**: `effect-schema-coding-patterns.md`
-   [ ] **Step 1.6**: Create the `packages/gemini/src/adapters.ts` file, define the `SpeakerConfig` schema, and add placeholder functions for the adapters.
    -   **Patterns**: `effect-schema-coding-patterns.md`
-   [ ] **Step 1.7**: Create the `packages/gemini/src/service.ts` file and define the `GeminiTranscription` service interface using `Context.Tag`.
    -   **Patterns**: `effect-service-layer-patterns.md`

## Phase 2: Live Implementation

-   [ ] **Step 2.1**: Implement the `GeminiTranscriptionLive` layer in `packages/gemini/src/service.ts`.
    -   **Patterns**: `effect-layer-overview.md`, `effect-service-layer-patterns.md`
-   [ ] **Step 2.2**: Implement the one-shot `transcribe` method, using `Effect.gen` for the main flow.
    -   **Patterns**: `effect-composition-control-flow-patterns.md`
-   [ ] **Step 2.3**: Implement the `stream` method, using `Stream.fromAsyncIterable` to wrap the provider's streaming response.
    -   **Patterns**: `effect-creation-patterns.md`
-   [ ] **Step 2.4**: Add logging to the service methods using `Effect.withLogSpan` and `Effect.annotateLogs`.
    -   **Patterns**: `effect-observability-patterns.md`
-   [ ] **Step 2.5**: Implement the retry logic using `Effect.retry` with `Schedule.exponential` and `Schedule.recurs`, using the `backoff` and `maxRetries` from `GeminiConfig`.
    -   **Patterns**: `effect-matching-retrying-patterns.md`

## Phase 3: Integration and Validation

-   [ ] **Step 3.1**: Implement the `toDomainTranscript` adapter function using `Schema.transformOrFail` to convert the LLM output to the domain `Transcript` type.
    -   **Patterns**: `effect-schema-transformation-patterns.md`
-   [ ] **Step 3.2**: Implement the `normalizeTimestamp` and `mapSpeaker` adapter functions, using `Schema.transformOrFail`.
    -   **Patterns**: `effect-schema-transformation-patterns.md`
-   [ ] **Step 3.3**: Integrate the adapters into the `transcribe` and `stream` methods.
-   [ ] **Step 3.4**: Add validation using `Schema.parseJson` to the `transcribe` and `stream` methods.
    -   **Patterns**: `effect-schema-transformation-patterns.md`

## Phase 4: Testing

-   [ ] **Step 4.1**: Add pure tests for the prompt builder, schema builder, and adapters.
-   [ ] **Step 4.2**: Add Effect tests for decoding valid and invalid JSON using `Schema.decodeUnknown`.
-   [ ] **Step 4.3**: Add Effect tests for the `transcribe` and `stream` methods with a fake client `Layer`.
    -   **Patterns**: `generic-testing.md`
-   [ ] **Step 4.4**: Add Effect tests for the retry logic using `TestClock`.
    -   **Patterns**: `generic-testing.md` (TestClock)
