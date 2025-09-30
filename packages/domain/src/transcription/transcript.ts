import { Schema } from "effect"
import { JobId, TranscriptId } from "../core/ids.js"
import { TimestampString } from "../core/types.js"
import { LLMArtifactId } from "../llm/ids.js"
import { MediaResource } from "../media/resources.js"
import { SpeakerRole } from "../media/speakers.js"
import { TranscriptionContext } from "./context.js"
import { InferenceConfig } from "./inference.js"
import { GenerationPrompt } from "./prompts.js"

/**
 * Transcript-related types and schemas
 */

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

  // LLM artifact reference for full execution traceability
  llmArtifactId: LLMArtifactId,

  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
export type Transcript = Schema.Schema.Type<typeof Transcript>
