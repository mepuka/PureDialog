import { Schema } from "@effect/schema";
import { Chunk, Data } from "effect";
import { JobId, MetadataId, TranscriptId, UserId, VideoId } from "./ids.js";
import { JobStatus } from "./status.js";

// --- Media & Metadata ---

/** A YouTube video as a media source. */
const YouTubeVideo = Schema.Struct({
  _tag: Schema.Literal("YouTubeVideo"),
  videoId: VideoId,
  url: Schema.String,
});

/** A discriminated union of all supported media types. */
export const MediaResource = Schema.Union(YouTubeVideo);
export type MediaResource = Schema.Schema.Type<typeof MediaResource>;

/** Represents an identified speaker in the media. */
export const Speaker = Schema.Struct({
  id: Schema.String, // e.g., "SPEAKER_00", "SPEAKER_01"
  name: Schema.String, // Speaker name from configuration
  description: Schema.optional(Schema.String), // Speaker description/context
  role: Schema.optional(Schema.String), // e.g., "Host", "Guest"
});
export type Speaker = Schema.Schema.Type<typeof Speaker>;

/** YouTube-specific metadata with video details. */
const YouTubeMetadata = Schema.Struct({
  _tag: Schema.Literal("YouTubeMetadata"),
  id: MetadataId,
  jobId: JobId,
  videoId: VideoId,
  title: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  duration: Schema.optional(Schema.Number), // seconds
  speakers: Schema.Array(Speaker),
  language: Schema.optional(Schema.String).pipe(
    Schema.withConstructorDefault(() => "en-US")
  ),
});

/** Sum type for metadata that varies by media source. */
export const MediaMetadata = Schema.Union(YouTubeMetadata);
export type MediaMetadata = Schema.Schema.Type<typeof MediaMetadata>;

// --- Job & Status ---

/** The main entity representing the transcription work to be done. */
export const Job = Schema.Struct({
  id: JobId,
  userId: UserId,
  media: MediaResource,
  status: JobStatus,
  attempts: Schema.Number,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  metadataId: Schema.optional(MetadataId),
  transcriptId: Schema.optional(TranscriptId),
  error: Schema.optional(Schema.String),
});
export type Job = Schema.Schema.Type<typeof Job>;

// --- Transcript Schemas ---

/** Time format validation for MM:SS format. */
export const TimeFormat = Schema.String.pipe(
  Schema.pattern(/^([0-5]?[0-9]):([0-5][0-9])$/),
  Schema.brand("TimeFormat")
);
export type TimeFormat = Schema.Schema.Type<typeof TimeFormat>;

/** A transcript entry for structured parsing (when needed). */
export const TranscriptEntry = Schema.Struct({
  timestamp: TimeFormat, // MM:SS format
  speaker: Schema.String, // Speaker name (not ID)
  dialogue: Schema.String, // Verbatim transcribed text
});
export type TranscriptEntry = Schema.Schema.Type<typeof TranscriptEntry>;

/** Raw transcript output from Gemini (more accurate than structured). */
export const RawTranscriptOutput = Schema.Data(
  Schema.Struct({
    jobId: JobId,
    rawText: Schema.String, // Complete raw text from Gemini
    isComplete: Schema.Boolean,
    receivedAt: Schema.Date,
  })
);
export type RawTranscriptOutput = Schema.Schema.Type<
  typeof RawTranscriptOutput
>;

/** The complete transcript as raw text (primary format). */
export const RawTranscript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  rawText: Schema.String, // Complete raw transcript text
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});
export type RawTranscript = Schema.Schema.Type<typeof RawTranscript>;

/** Parsed transcript entries (derived from raw text when needed). */
export const ParsedTranscript = Schema.Array(TranscriptEntry);
export type ParsedTranscript = Schema.Schema.Type<typeof ParsedTranscript>;

/** Legacy diarized segment for backward compatibility. */
export const DiarizedSegment = Schema.Struct({
  speakerId: Schema.String,
  text: Schema.String,
  startSec: Schema.Number,
  endSec: Schema.Number,
});
export type DiarizedSegment = Schema.Schema.Type<typeof DiarizedSegment>;

/** The final transcript artifact supporting both raw and parsed formats. */
export const DiarizedTranscript = Schema.Struct({
  id: TranscriptId,
  jobId: JobId,
  rawText: Schema.String, // Primary: raw text from Gemini
  parsedEntries: Schema.optional(ParsedTranscript), // Secondary: parsed when needed
  segments: Schema.optional(Schema.Array(DiarizedSegment)), // Legacy format
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});
export type DiarizedTranscript = Schema.Schema.Type<typeof DiarizedTranscript>;
