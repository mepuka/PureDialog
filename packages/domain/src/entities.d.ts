import { Schema } from "effect";
/** The main entity representing the transcription work to be done. */
export declare const TranscriptionJob: Schema.Struct<{
    id: Schema.brand<typeof Schema.String, "JobId">;
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    media: Schema.Union<[typeof import("./media-resources").YouTubeVideoResource, typeof import("./media-resources").YouTubeChannelResource]>;
    status: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
    attempts: typeof Schema.Number;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
    transcriptId: Schema.optional<Schema.brand<typeof Schema.String, "TranscriptId">>;
    error: Schema.optional<typeof Schema.String>;
}>;
export type TranscriptionJob = Schema.Schema.Type<typeof TranscriptionJob>;
