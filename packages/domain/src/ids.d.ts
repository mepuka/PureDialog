import { Schema } from "effect";
/** A unique identifier for a processing job. */
export declare const JobId: Schema.brand<typeof Schema.String, "JobId">;
export type JobId = Schema.Schema.Type<typeof JobId>;
export declare const RequestId: Schema.brand<typeof Schema.String, "RequestId">;
export type RequestId = Schema.Schema.Type<typeof RequestId>;
/** A unique identifier for a transcript artifact. */
export declare const TranscriptId: Schema.brand<typeof Schema.String, "TranscriptId">;
export type TranscriptId = Schema.Schema.Type<typeof TranscriptId>;
/** A unique identifier for a media resource. */
export declare const MediaResourceId: Schema.brand<typeof Schema.String, "MediaResourceId">;
export type MediaResourceId = Schema.Schema.Type<typeof MediaResourceId>;
