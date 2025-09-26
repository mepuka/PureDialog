# Domain Package Refactoring Plan (Revised)

This document outlines a plan to refactor the `domain` package for better organization, clarity, and robustness, incorporating feedback on domain modeling.

## 1. High-Level Goals

*   **Improve File/Folder Organization:** Structure files based on their concern (schemas, types, errors) to make the domain easier to navigate and understand.
*   **Clarify Domain Concepts:** Introduce a `TranscriptionContext` to distinguish between *a priori* information and extracted metadata, and formalize the contracts for transcription and feedback.
*   **Consolidate and Simplify Schemas:** Reduce redundancy and improve the composition of schemas.
*   **Decouple Domain Concerns:** Ensure entities like `Transcript` and `Feedback` are disaggregated, with relationships handled by reference (ID) rather than embedding.

## 2. Proposed File/Folder Structure

The current flat structure will be reorganized into the following:

```
/packages/domain/src
├───index.ts
├───errors/
│   ├───index.ts
│   ├───definitions.ts
│   └───schemas.ts
├───schemas/
│   ├───index.ts
│   ├───context.ts
│   ├───entities.ts
│   ├───events.ts
│   ├───feedback.ts
│   ├───ids.ts
│   ├───inference.ts
│   ├───media.ts
│   ├───prompts.ts
│   ├───requests.ts
│   ├───responses.ts
│   ├───speakers.ts
│   ├───status.ts
│   └───transcript.ts
└───types/
    └───... (mirroring the schemas structure)
```

## 3. Core Schema and Type Refactoring

### 3.1. New Domain Concept: `TranscriptionContext`

**Problem:** The domain model doesn't distinguish between information known *before* processing a media file and metadata extracted *from* it.

**Plan:**

1.  **Introduce `TranscriptionContext`:** Create a schema in `schemas/context.ts` to serve as a "template" for a transcription job, based on user input.
2.  **Update `CreateTranscriptionJobRequest`:** This request object in `schemas/requests.ts` will now require the `TranscriptionContext`.

### 3.2. Media Resources and Metadata

**Problem:** `MediaMetadata` is overloaded, mixing contextual information with extracted data.

**Plan:**

1.  **Separate `Speaker`:** Move `SpeakerRole` and `Speaker` definitions into `schemas/speakers.ts`.
2.  **Redefine `MediaMetadata`:** In `schemas/media.ts`, `MediaMetadata` will now strictly represent data *extracted* from a source (e.g., YouTube API).
3.  **Refine `TranscriptionJob`:** The `TranscriptionJob` entity in `schemas/entities.ts` will hold both the initial `TranscriptionContext` and the eventual `MediaMetadata` as separate fields.

### 3.3. Transcript (`transcript.ts`)

**Plan:**

1.  **Retain `TimestampString`:** The `HH:MM:SS` string format is a requirement for the transcription prompt and will be kept.
2.  **Remove `TranscriptSegment`:** This is a duplicate of `DialogueTurn` and will be removed.
3.  **Relocate `ModelOutputChunk`:** This DTO will be moved to the `llm` package.

## 4. Broader Domain Model Enhancements

### 4.1. Formalizing Transcription Service Contracts

**Plan:**

1.  **Define `TranscriptionServiceRequest`:** In `schemas/requests.ts`, create a schema that bundles all necessary information to start a transcription.
2.  **Define `TranscriptionServiceResponse`:** In `schemas/responses.ts`, create a schema for the LLM's output.

### 4.2. Capturing Inference and Prompt Details

**Problem:** The final `Transcript` doesn't record which prompt or model configuration was used to generate it, which is critical for reproducibility.

**Plan:**

1.  **Create `InferenceConfig` Schema:** In `schemas/inference.ts`, define the configuration used for an LLM generation.

    ```typescript
    export const InferenceConfig = Schema.Struct({
      model: Schema.String,
      temperature: Schema.Number
    });
    ```

2.  **Create `GenerationPrompt` Schema:** In `schemas/prompts.ts`, define a schema to track the exact, dynamically compiled prompt used for generation.

    ```typescript
    export const GenerationPrompt = Schema.Struct({
      // Identifies the base template used for compilation
      templateId: Schema.String,
      // The final, full prompt text sent to the LLM
      compiledText: Schema.String
    });
    ```

### 4.3. Decoupling Quality and Feedback Mechanisms

**Problem:** There is no formal way to capture user feedback for a transcript, and it should not be directly embedded in the `Transcript` object.

**Plan:**

1.  **Define `TranscriptionFeedback` as a Standalone Entity:** In `schemas/feedback.ts`, define a schema for capturing user-submitted ratings. This entity is explicitly *not* part of the `Transcript` but references it by ID, maintaining a clean separation of concerns.

    ```typescript
    export const TranscriptionFeedback = Schema.Struct({
      transcriptId: TranscriptId, // Links to the transcript
      rating: Schema.Int.pipe(Schema.between(1, 5)),
      suggestedCorrections: Schema.optional(Schema.Array(DialogueTurn)),
      comments: Schema.optional(Schema.String),
      submittedAt: Schema.Date
    });
    ```

### 4.4. Updating the `Transcript` Entity

**Plan:** The `Transcript` schema in `schemas/transcript.ts` will be updated to be a clean, disaggregated entity focused on the generated output and its direct context.

```typescript
export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  mediaResource: MediaResource,
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  turns: Schema.Array(DialogueTurn),
  // New fields for traceability
  inferenceConfig: InferenceConfig,
  prompt: GenerationPrompt, // The exact prompt used
  createdAt: Schema.Date,
  updatedAt: Schema.Date
});
```

## 5. Deletions and Consolidations

*   **`media-resource-metadata.ts` & `media-resources.ts`:** To be deleted after their contents are merged.
*   **`TranscriptSegment`:** To be deleted from `transcript.ts`.
*   **`ModelOutputChunk`:** To be moved from `transcript.ts` to the `llm` package.

## 6. Execution Steps

1.  **Branch:** Create a new git branch for this refactoring.
2.  **Directory Structure:** Implement the new directory structure.
3.  **Implement New Schemas:** Create the schemas for `TranscriptionContext`, `InferenceConfig`, `GenerationPrompt`, and `TranscriptionFeedback`.
4.  **Refactor Core Schemas:** Apply the planned changes to `Media`, `Transcript`, `TranscriptionJob`, and the service request/response types.
5.  **Update Imports:** Fix all import statements across the entire project.
6.  **Run Tests:** Run all tests to ensure no regressions.
7.  **Commit:** Commit the changes.