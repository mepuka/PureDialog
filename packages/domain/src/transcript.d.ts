import { Schema } from "effect";
/**
 * A precise, branded type for HH:MM:SS timestamps.
 * This ensures consistency and prevents assignment of arbitrary strings.
 */
export declare const Timestamp: Schema.brand<Schema.filter<typeof Schema.String>, "Timestamp">;
export type Timestamp = Schema.Schema.Type<typeof Timestamp>;
/**
 * Defines the specific speaker roles in your primary use case (1-on-1 interviews).
 * More precise and safer than a generic string. Can be extended later.
 */
export declare const SpeakerRole: Schema.Literal<["host", "guest"]>;
export type SpeakerRole = Schema.Schema.Type<typeof SpeakerRole>;
/**
 * Represents a single, parsed "turn" in the dialogue.
 * This is the core, structured building block of the transcript.
 */
export declare const DialogueTurn: Schema.Struct<{
    timestamp: Schema.brand<Schema.filter<typeof Schema.String>, "Timestamp">;
    speaker: Schema.Literal<["host", "guest"]>;
    text: Schema.filter<typeof Schema.String>;
}>;
export type DialogueTurn = Schema.Schema.Type<typeof DialogueTurn>;
/**
 * The canonical, final Transcript entity.
 * This is the primary artifact stored in your database and used by downstream services.
 * It contains the structured, parsed turns as its main payload.
 */
export declare const Transcript: Schema.Struct<{
    id: Schema.brand<typeof Schema.String, "TranscriptId">;
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    rawText: Schema.filter<typeof Schema.String>;
    turns: Schema.Array$<Schema.Struct<{
        timestamp: Schema.brand<Schema.filter<typeof Schema.String>, "Timestamp">;
        speaker: Schema.Literal<["host", "guest"]>;
        text: Schema.filter<typeof Schema.String>;
    }>>;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
}>;
export type Transcript = Schema.Schema.Type<typeof Transcript>;
/**
 * DTO (Data Transfer Object) for a raw chunk of text streamed from the ASR model.
 * This is an adapter-level concern, not a core domain entity. It represents the
 * temporary shape of the data in transit from the Gemini service.
 */
export declare const ModelOutputChunk: Schema.Struct<{
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    rawChunk: typeof Schema.String;
    isComplete: typeof Schema.Boolean;
    receivedAt: typeof Schema.Date;
}>;
export type ModelOutputChunk = Schema.Schema.Type<typeof ModelOutputChunk>;
