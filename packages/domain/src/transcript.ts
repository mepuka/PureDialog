import { Schema } from "effect"
import { JobId, TranscriptId } from "./ids.js"
import { MediaResource } from "./media-resources.js"
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
 * Defines the specific speaker roles in your primary use case (1-on-1 interviews).
 * More precise and safer than a generic string. Can be extended later.
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

export const TranscriptSegment = Schema.Struct({
  timestamp: TimestampString,
  speaker: SpeakerRole,
  text: Schema.String.pipe(Schema.nonEmptyString())
})
export type TranscriptSegment = Schema.Schema.Type<typeof TranscriptSegment>

/**
 * The canonical, final Transcript entity.
 * This is the primary artifact stored in your database and used by downstream services.
 * It contains the structured, parsed turns as its main payload.
 * // TODO: needs prompt version / inference config / rating
 */
export const Transcript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  mediaResource: MediaResource,
  // The full, raw text is stored for auditing and potential reprocessing.
  rawText: Schema.String.pipe(Schema.nonEmptyString()),
  // The structured turns are the primary, queryable data.
  turns: Schema.Array(DialogueTurn),
  createdAt: Schema.Date,
  updatedAt: Schema.Date
})
export type Transcript = Schema.Schema.Type<typeof Transcript>

/**
 * DTO (Data Transfer Object) for a raw chunk of text streamed from the ASR model.
 * This is an adapter-level concern, not a core domain entity. It represents the
 * temporary shape of the data in transit from the Gemini service.
 */
export const ModelOutputChunk = Schema.Struct({
  jobId: JobId,
  rawChunk: Schema.String,
  isComplete: Schema.Boolean,
  receivedAt: Schema.Date
})
export type ModelOutputChunk = Schema.Schema.Type<typeof ModelOutputChunk>
