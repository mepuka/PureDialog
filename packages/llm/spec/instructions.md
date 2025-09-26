# Feature: LLM Prompting Service

## 1. Feature Overview

This feature will create a robust, Effect-native prompting service for interacting with Google's Gemini LLM. It will translate the existing imperative SDK logic into a powerful, concurrent, and schema-driven solution using the `effect/ai` and `effect/ai-google` libraries.

The service will be responsible for generating production-quality, verbatim video transcripts with precise speaker diarization, adhering strictly to a provided JSON schema.

## 2. Core Logic & Prompts

The service will encapsulate the logic for generating dynamic prompts and schemas based on speaker configurations.

### 2.1. Transcription Prompt Generation

The service must construct a detailed system instruction prompt for the Gemini model.

**Objective**: Create a verbatim transcript with precise speaker diarization for a dynamic number of speakers.

**Core Instructions**:

1.  **Speaker Diarization**:
    *   Identify a dynamic number of primary speakers from a provided list.
    *   Use speaker descriptions to aid in identification.
    *   Label each dialogue segment with the correct speaker from the provided list ONLY. If a voice cannot be confidently matched, it must be assigned to the most likely speaker from the list.

2.  **Transcription Accuracy (Verbatim Style)**:
    *   Transcribe speech exactly as spoken, including filler words, false starts, and repetitions.
    *   Do not paraphrase, summarize, or correct grammar.
    *   Use proper capitalization and punctuation to reflect speaker delivery.

3.  **Timestamping Protocol**:
    *   Provide a timestamp in `[MM:SS]` format at the beginning of EVERY new dialogue entry.
    *   Create a new entry whenever the speaker changes.
    *   For long monologues, insert a new timestamped entry at logical pauses, approximately every 1-2 minutes.

4.  **Handling Non-Speech Elements**:
    *   The transcript must ONLY contain verbatim spoken dialogue.
    *   Do not include non-speech sounds like `[laughs]` or `[applause]`.
    *   Use `[unintelligible]` sparingly for indecipherable speech.
    *   Do not describe visual elements.

5.  **Technical Context Awareness**:
    *   The model should be aware that the video input is low-resolution and compressed, focusing primarily on the audio track for analysis.

**Internal Thinking Process for the Model**:

1.  **Determine Video Length**: Scan to the end to find the final timestamp as an anchor.
2.  **Initial Speaker Pass**: Scan the video to map voices to the provided speaker roles.
3.  **Detailed Transcription**: Transcribe sequentially, assigning speakers and timestamps.
4.  **Review and Refine**: Verify timestamp format, sequence, and speaker label consistency.

**Output Format**:
*   The entire output MUST be a single, valid JSON array conforming to the provided schema.
*   The response must not contain any introductory text or markdown formatting.

### 2.2. Transcript Schema Definition

The service must define a strict JSON schema that the Gemini model must follow. The speaker names in the schema will be populated dynamically.

The schema will be an array of objects with the following properties:
- `timestamp`: A string in `MM:SS` format.
- `speaker`: A string that must be one of the provided speaker names (enum).
- `dialogue`: A string containing the verbatim transcribed text.

All properties are required.

## 3. User Stories

- As a developer, I want a declarative, Effect-native service to interact with the Gemini API for easy composition.
- As a developer, I want the service to automatically handle concurrency, rate limiting, and retries.
- As a developer, I want the service to validate LLM output against a predefined schema.
- As a user, I need this service to function correctly to transcribe videos.

## 4. Acceptance Criteria

- Implemented using `effect/ai` and `effect/ai-google`.
- Generates a transcript from a video based on the logic in this document.
- Handles API errors with a retry strategy.
- Manages concurrency to avoid exceeding API rate limits.
- Validates the LLM's output against the defined schema.
- Supports streaming responses.
- The implementation is modular, well-organized, and follows project coding patterns.

## 5. Constraints

- Must use the Effect-TS ecosystem.
- Must be compatible with existing `@puredialog/domain` types.
- Must be designed for testability.

## 6. Dependencies

- `@effect/ai`
- `@effect/ai-google`
- `@puredialog/domain`

## 7. Out of Scope

- UI for displaying the transcript.
- Video ingestion logic.
