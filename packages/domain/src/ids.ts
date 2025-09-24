import { Schema } from "effect";

/** A unique identifier for a processing job. */
export const JobId = Schema.String.pipe(Schema.brand("JobId"));
export type JobId = Schema.Schema.Type<typeof JobId>;

export const RequestId = Schema.String.pipe(Schema.brand("RequestId"));
export type RequestId = Schema.Schema.Type<typeof RequestId>;

/** A unique identifier for a transcript artifact. */
export const TranscriptId = Schema.String.pipe(Schema.brand("TranscriptId"));
export type TranscriptId = Schema.Schema.Type<typeof TranscriptId>;

/** A unique identifier for a media resource. */
export const MediaResourceId = Schema.String.pipe(
  Schema.brand("MediaResourceId")
);
export type MediaResourceId = Schema.Schema.Type<typeof MediaResourceId>;
