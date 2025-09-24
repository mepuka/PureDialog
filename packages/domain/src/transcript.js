import { Schema } from "effect";
import { JobId, TranscriptId } from "./ids";
/**
 * A precise, branded type for HH:MM:SS timestamps.
 * This ensures consistency and prevents assignment of arbitrary strings.
 */
export const Timestamp = Schema.String.pipe(Schema.pattern(/^(\d{2,}):([0-5]\d):([0-5]\d)$/, {
    message: () => "Timestamp must be in HH:MM:SS format.",
}), Schema.brand("Timestamp"));
/**
 * Defines the specific speaker roles in your primary use case (1-on-1 interviews).
 * More precise and safer than a generic string. Can be extended later.
 */
export const SpeakerRole = Schema.Literal("host", "guest");
/**
 * Represents a single, parsed "turn" in the dialogue.
 * This is the core, structured building block of the transcript.
 */
export const DialogueTurn = Schema.Struct({
    timestamp: Timestamp,
    speaker: SpeakerRole,
    text: Schema.String.pipe(Schema.nonEmptyString()),
});
/**
 * The canonical, final Transcript entity.
 * This is the primary artifact stored in your database and used by downstream services.
 * It contains the structured, parsed turns as its main payload.
 */
export const Transcript = Schema.Struct({
    id: TranscriptId,
    jobId: JobId,
    // The full, raw text is stored for auditing and potential reprocessing.
    rawText: Schema.String.pipe(Schema.nonEmptyString()),
    // The structured turns are the primary, queryable data.
    turns: Schema.Array(DialogueTurn),
    createdAt: Schema.Date,
    updatedAt: Schema.Date,
});
/**
 * DTO (Data Transfer Object) for a raw chunk of text streamed from the ASR model.
 * This is an adapter-level concern, not a core domain entity. It represents the
 * temporary shape of the data in transit from the Gemini service.
 */
export const ModelOutputChunk = Schema.Struct({
    jobId: JobId,
    rawChunk: Schema.String,
    isComplete: Schema.Boolean,
    receivedAt: Schema.Date,
});
