import { Schema } from "@effect/schema";

/** A unique identifier for a YouTube video (11 characters). */
export const VideoId = Schema.String.pipe(
  Schema.minLength(11),
  Schema.maxLength(11),
  Schema.pattern(/^[a-zA-Z0-9_-]+$/),
  Schema.brand("VideoId"),
);
export type VideoId = Schema.Schema.Type<typeof VideoId>;

/** A unique identifier for a processing job. */
export const JobId = Schema.String.pipe(Schema.brand("JobId"));
export type JobId = Schema.Schema.Type<typeof JobId>;

/** A unique identifier for a user. */
export const UserId = Schema.String.pipe(
  Schema.minLength(3),
  Schema.brand("UserId"),
);
export type UserId = Schema.Schema.Type<typeof UserId>;

/** A unique identifier for a metadata artifact. */
export const MetadataId = Schema.String.pipe(Schema.brand("MetadataId"));
export type MetadataId = Schema.Schema.Type<typeof MetadataId>;

/** A unique identifier for a transcript artifact. */
export const TranscriptId = Schema.String.pipe(Schema.brand("TranscriptId"));
export type TranscriptId = Schema.Schema.Type<typeof TranscriptId>;
