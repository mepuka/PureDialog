import { Schema } from "effect";
/** A unique identifier for a processing job. */
export const JobId = Schema.String.pipe(Schema.brand("JobId"));
export const RequestId = Schema.String.pipe(Schema.brand("RequestId"));
/** A unique identifier for a transcript artifact. */
export const TranscriptId = Schema.String.pipe(Schema.brand("TranscriptId"));
/** A unique identifier for a media resource. */
export const MediaResourceId = Schema.String.pipe(Schema.brand("MediaResourceId"));
