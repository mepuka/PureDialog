import { Schema } from "@effect/schema";
import { JobId, MediaResourceId } from "./ids";
import { SpeakerRole } from "./transcript";

/**
 * A specific, branded type for ISO 639-1 language codes (e.g., "en", "es").
 */
export const LanguageCode = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/),
  Schema.brand("LanguageCode")
);
export type LanguageCode = Schema.Schema.Type<typeof LanguageCode>;

/**
 * A structured representation of a single speaker identified in the media.
 * This is a core entity within the metadata.
 */
export const Speaker = Schema.Struct({
  // A unique identifier for this speaker within the context of this job (e.g., "S1", "S2")
  id: Schema.String.pipe(Schema.nonEmpty()),
  role: SpeakerRole,
  name: Schema.optional(Schema.String),
  // Providing a structured object for affiliation is more extensible
  affiliation: Schema.optional(
    Schema.Struct({
      name: Schema.String,
      url: Schema.optional(Schema.String.pipe(Schema.pattern(/^https?:\/\//))),
    })
  ),
  bio: Schema.optional(Schema.String),
});
export type Speaker = Schema.Schema.Type<typeof Speaker>;

/**
 * The canonical MediaMetadata entity.
 * This is the complete, structured context extracted from a MediaResource
 * before the transcription process begins.
 */
export const MediaMetadata = Schema.Struct({
  mediaResourceId: MediaResourceId,
  jobId: JobId,
  title: Schema.String.pipe(Schema.nonEmpty()),
  summary: Schema.optional(Schema.String),
  // Keywords/tags provide crucial context for the ASR model's vocabulary.
  tags: Schema.Array(Schema.String),
  // The specific industry or topic domain is vital for improving accuracy.
  domain: Schema.Array(Schema.String),
  speakers: Schema.Array(Speaker),
  language: LanguageCode,
  durationSec: Schema.Number.pipe(Schema.positive()),
  // represents any links found in the media resource (links in youtube description, etc.)
  links: Schema.optional(Schema.String.pipe(Schema.pattern(/^https?:\/\//))), //
  createdAt: Schema.Date,
});
export type MediaMetadata = Schema.Schema.Type<typeof MediaMetadata>;
