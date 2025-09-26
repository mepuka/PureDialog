# LLM Prompting Service - Design

## 1. High-Level Architecture

The `llm-prompt` service will be a self-contained module within the `@packages/gemini` package. It will expose a `GeminiTranscription` service interface for transcribing media, with a corresponding `Layer` for its live implementation. This design allows for easy dependency injection and testability.

The service will be responsible for all interactions with the Gemini LLM, abstracting away the complexities of API calls, error handling, and data validation.

```mermaid
graph TD
    subgraph Application
        direction LR
        A[Other Services] --> B(GeminiTranscription)
    end

    subgraph Gemini Transcription Service
        direction LR
        B --> C{Gemini AI Client}
    end

    subgraph AI Provider (Google)
        direction LR
        C --> D[Gemini API]
    end
```

## 2. Core Components

### 2.1. The `GeminiTranscription` Interface

We will define a `GeminiTranscription` interface using `Context.Tag`. This will be the public-facing API of our service.

```typescript
// packages/gemini/src/service.ts
import { Context, Effect, Stream } from "effect";
import { SpeakerConfig } from "@puredialog/domain";
import { GeminiError } from "./errors";
import { LLMTranscript, LLMTranscriptChunk } from "./schema";

export class GeminiTranscription extends Context.Tag("GeminiTranscription")<GeminiTranscription, {
    transcribe(url: string, speakers: SpeakerConfig[], opts?: any): Effect.Effect<LLMTranscript, GeminiError>;
    stream(url: string, speakers: SpeakerConfig[], opts?: any): Stream.Stream<LLMTranscriptChunk, GeminiError>;
}> {}
```

### 2.2. The Live Implementation `Layer`

We will create a `GeminiTranscriptionLive` `Layer` that provides the live implementation of the `GeminiTranscription` service. This layer will depend on the `@effect/ai-google` client.

### 2.3. Configuration

We will use Effect's `Config` module to manage the service's configuration.

```typescript
// packages/gemini/src/config.ts
import { Config, Duration } from "effect";

export const GeminiConfig = Config.all({
    apiKey: Config.redacted("GEMINI_API_KEY"),
    model: Config.string("GEMINI_MODEL").pipe(
        Config.withDefault("gemini-2.5-flash")
    ),
    timeout: Config.duration("GEMINI_TIMEOUT").pipe(
        Config.withDefault(Duration.seconds(30))
    ),
    maxRetries: Config.number("GEMINI_MAX_RETRIES").pipe(
        Config.withDefault(3)
    ),
    backoff: Config.duration("GEMINI_BACKOFF").pipe(
        Config.withDefault(Duration.seconds(1))
    ),
});
```

### 2.4. Error Modeling

We will define a `GeminiError` tagged enum to represent all possible failure modes.

```typescript
// packages/gemini/src/errors.ts
import { Data } from "effect";

export type GeminiError = 
    | ConfigurationError
    | ApiError
    | NetworkError
    | RateLimitedError
    | ValidationError
    | CancelledError;

export class ConfigurationError extends Data.TaggedError("ConfigurationError")<{ message: string }> {}
export class ApiError extends Data.TaggedError("ApiError")<{ message: string }> {}
export class NetworkError extends Data.TaggedError("NetworkError")<{ message: string }> {}
export class RateLimitedError extends Data.TaggedError("RateLimitedError")<{ message: string }> {}
export class ValidationError extends Data.TaggedError("ValidationError")<{ message: string }> {}
export class CancelledError extends Data.TaggedError("CancelledError")<{ message: string }> {}
```

### 2.5. Prompt and Schema

-   `packages/gemini/src/prompt.ts`: A pure module to build the system instruction from `SpeakerConfig[]`.
-   `packages/gemini/src/schema.ts`: A pure module to define the adapter schema for the model output: `{ timestamp: string, speaker: string, dialogue: string }[]`.

### 2.6. Adapters

A pure module for converting the LLM output to the domain model.

```typescript
// packages/gemini/src/adapters.ts
import { Transcript, SpeakerRole } from "@puredialog/domain";
import { Schema } from "effect";

export const SpeakerConfig = Schema.Struct({
    name: Schema.String,
    description: Schema.String,
});

export const normalizeTimestamp = (timestamp: string): string => {
    // ... implementation using Effect's String module
};

export const mapSpeaker = (speaker: string): SpeakerRole => {
    // ... implementation
};

export const toDomainTranscript = (llmTranscript: any): Transcript => {
    // ... implementation
};
```

## 3. Effect Patterns

-   **Resource Management**: Use `Effect.acquireRelease` in the provider layer for any underlying client state.
-   **Streaming**: Wrap the provider stream as a `Stream` and map chunks. `Stream.fromAsyncIterable` will be useful here.
-   **Retries**: Use `Effect.retry` with `Schedule.exponential` and `Schedule.recurs`. The `backoff` and `maxRetries` will be sourced from the `GeminiConfig`.
-   **Logging**: Use `Effect.withLogSpan` and `Effect.annotateLogs` for observability. We will log the `jobId`, `model`, and other relevant parameters.
-   **Validation**: Use `Schema.parseJson` for robust decoding of the LLM output. We will also use `Schema.transformOrFail` to perform async transformations of the data.

## 4. Testing Plan

-   **Pure tests**: Test the prompt builder, schema builder, and adapters.
-   **Effect tests**: Test decoding, stream accumulation, and retry behavior with a fake client `Layer`.
-   **Clock**: Use `TestClock` for testing time-dependent logic like retries and timeouts.

## 5. Implementation Steps

1.  Add scaffolds for `config.ts`, `errors.ts`, `prompt.ts`, `schema.ts`, `adapters.ts`, and `service.ts`.
2.  Implement `GeminiTranscriptionLive` on top of `@effect/ai-google`.
3.  Add tests for adapters and schema decoding.
4.  Add tests for the service with a fake client.
