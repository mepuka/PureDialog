# Domain Package Refactoring Plan

This document outlines a plan to refactor the `domain` package for better organization, clarity, and robustness.

## 1. High-Level Goals

*   **Improve File/Folder Organization:** Structure files based on their concern (schemas, types, errors) to make the domain easier to navigate and understand.
*   **Consolidate and Simplify Schemas:** Reduce redundancy and improve the composition of schemas.
*   **Enhance Type Safety:** Introduce more specific and robust types where possible.
*   **Decouple Schemas from Types:** Separate the `Schema` definitions from the plain TypeScript `type` and `class` definitions.

## 2. Proposed File/Folder Structure

The current flat structure will be reorganized into the following:

```
/packages/domain/src
├───index.ts
├───errors/
│   ├───index.ts
│   ├───definitions.ts       // TaggedError class definitions
│   └───schemas.ts           // Schema definitions for errors
├───schemas/
│   ├───index.ts
│   ├───entities.ts
│   ├───events.ts
│   ├───ids.ts
│   ├───media.ts             // Consolidated media-resource and metadata
│   ├───requests.ts
│   ├───responses.ts
│   ├───status.ts
│   └───transcript.ts
└───types/
    ├───index.ts
    ├───entities.ts
    ├───events.ts
    ├───ids.ts
    ├───media.ts
    ├───requests.ts
    ├───responses.ts
    ├───status.ts
    └───transcript.ts
```

**Action Items:**

1.  Create the new directories: `errors`, `schemas`, `types`.
2.  Move existing files into the appropriate new directories.
3.  Create `index.ts` files within each new directory to export their contents.
4.  Update the root `index.ts` to re-export from the new sub-directories.

## 3. Schema and Type Refactoring

### 3.1. Media Resources and Metadata (`media-resources.ts`, `media-resource-metadata.ts` -> `schemas/media.ts`, `types/media.ts`)

**Problem:** `MediaMetadata` is tightly coupled to `MediaResource`, and the distinction between `YouTubeVideoResource` and `YouTubeChannelResource` adds boilerplate. The `Speaker` schema is also located in `media-resource-metadata.ts` but is conceptually a top-level entity.

**Plan:**

1.  **Move `Speaker`:** Move the `Speaker` schema and type to their own files, `schemas/speaker.ts` and `types/speaker.ts`. This will also require creating a `speakers.ts` file and moving `SpeakerRole` into it.
2.  **Consolidate Media Schemas:** Create `schemas/media.ts`.
    *   Merge `media-resource-metadata.ts` and `media-resources.ts` into this new file.
    *   Redefine `MediaResource` to be a more generic, discriminated union. Instead of separate classes for `YouTubeVideoResource` and `YouTubeChannelResource`, create a single `MediaResource` schema with a `type` discriminator.
    *   The `MediaMetadata` will be a separate, composable schema that is included in the `MediaResource`.
3.  **Create Media Types:** Create `types/media.ts` with the corresponding TypeScript types.

**Example of new `MediaResource` schema:**

```typescript
// In schemas/media.ts
export const MediaResource = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("youtube_video"),
    id: MediaResourceId,
    metadata: MediaMetadata,
    data: YouTubeVideo
  }),
  Schema.Struct({
    type: Schema.Literal("youtube_channel"),
    id: MediaResourceId,
    metadata: MediaMetadata,
    data: YouTubeChannel
  })
);
```

### 3.2. Transcript (`transcript.ts`)

**Problem:** `DialogueTurn` and `TranscriptSegment` are identical. `ModelOutputChunk` is a DTO and does not belong in the core domain.

**Plan:**

1.  **Remove `TranscriptSegment`:** It is redundant. Use `DialogueTurn` everywhere.
2.  **Relocate `ModelOutputChunk`:** Move `ModelOutputChunk` to the `llm` package, as it represents the data structure coming from the language model, not a core domain entity.
3.  **Strengthen Timestamp:** The `TimestampString` is good, but we can create a `Timestamp` schema that is a `Schema.Number` representing seconds, and use `transform` to convert to and from the `HH:MM:SS` string format. This makes it easier to work with durations.

### 3.3. Errors (`errors.ts`)

**Problem:** `errors.ts` mixes `Data.TaggedError` definitions with `Schema` definitions.

**Plan:**

1.  **Separate Definitions and Schemas:**
    *   Move all `class ... extends Data.TaggedError` definitions to `errors/definitions.ts`.
    *   Move all `...Schema` definitions to `errors/schemas.ts`.
2.  **Improve Error Schemas:** The current error schemas use `Schema.String` for branded IDs. They should use the actual branded ID schemas and then be transformed to strings during serialization if needed. This improves type safety within the application.

## 4. Deletions and Consolidations

*   **`media-resource-metadata.ts`:** To be deleted after its contents are merged into `schemas/media.ts` and `types/media.ts`.
*   **`media-resources.ts`:** To be deleted after its contents are merged into `schemas/media.ts` and `types/media.ts`.
*   **`TranscriptSegment`:** To be deleted from `transcript.ts`.
*   **`ModelOutputChunk`:** To be moved from `transcript.ts` to the `llm` package.

## 5. Execution Steps

1.  **Branch:** Create a new git branch for this refactoring.
2.  **Directory Structure:** Implement the new directory structure as outlined in section 2.
3.  **Move and Rename:** Move the existing files to their new locations.
4.  **Refactor Media:** Apply the changes outlined in section 3.1.
5.  **Refactor Transcript:** Apply the changes outlined in section 3.2.
6.  **Refactor Errors:** Apply the changes outlined in section 3.3.
7.  **Update Imports:** Fix all import statements across the entire project that are affected by these changes.
8.  **Run Tests:** Run all tests to ensure that the refactoring has not introduced any regressions.
9.  **Commit:** Commit the changes with a clear and descriptive commit message.
