import { Schema } from "effect"
import { TranscriptionContext } from "./context.js"
import { JobId, TranscriptId } from "./ids.js"
import { InferenceConfig } from "./inference.js"
import { MediaResource } from "./media.js"
import { GenerationPrompt } from "./prompts.js"
import { SpeakerRole } from "./speakers.js"

/**
 * A precise, branded type for HH:MM:SS timestamps.
 * This ensures consistency and prevents assignment of arbitrary strings.
 */
export const TimestampString = Schema.String.pipe(
  Schema.pattern(/^(\d{2,}):([0-5]\d):([0-5]\d)$/, {
    message: () => "Timestamp must be in HH:MM:SS format."
  }),
  Schema.brand("Timestamp")
)
export type Timestamp = Schema.Schema.Type<typeof TimestampString>

/**
 * Represents a single, parsed "turn" in the dialogue.
 * This is the core, structured building block of the transcript.
 */
export const DialogueTurn = Schema.Struct({
  timestamp: TimestampString,
  speaker: SpeakerRole,
  text: Schema.String.pipe(Schema.nonEmptyString())
})
export type DialogueTurn = Schema.Schema.Type<typeof DialogueTurn>

/**
 * The canonical, final Transcript entity.
 * This is the primary artifact stored in your database and used by downstream services.
 * It contains the structured, parsed turns as its main payload.
 * Now includes full traceability for reproducibility.
 */
export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  mediaResource: MediaResource,
  // The full, raw text is stored for auditing and potential reprocessing.
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  // The structured turns are the primary, queryable data.
  turns: Schema.Array(DialogueTurn),

  // NEW: Traceability fields
  inferenceConfig: InferenceConfig,
  generationPrompt: GenerationPrompt,

  // Context used for generation
  transcriptionContext: TranscriptionContext,

  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
export type Transcript = Schema.Schema.Type<typeof Transcript>

// NOTE: ModelOutputChunk has been removed from domain package
// It should be moved to the LLM package as it's an adapter-level concern
