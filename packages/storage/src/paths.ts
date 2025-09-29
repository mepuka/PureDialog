import type { Core, Jobs } from "@puredialog/domain"
import { Schema } from "effect"

/**
 * Shared path constants for storage operations and Eventarc integration.
 * These constants ensure consistency between application code and infrastructure.
 */
export const STORAGE_PATHS = {
  JOBS_PREFIX: "jobs",
  TRANSCRIPTS_PREFIX: "transcripts",
  IDEMPOTENCY_PREFIX: "idempotency",
  EVENTS_PREFIX: "events"
} as const

/**
 * Schema-based path parsers for type-safe path generation and parsing.
 * These provide both validation and structured parsing of GCS object paths.
 */

// Job path schema: "jobs/{status}/{jobId}.json"
export const JobPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.JOBS_PREFIX),
  "/",
  Schema.String, // JobStatus
  "/",
  Schema.String, // JobId
  ".json"
)

export type JobPathTuple = Schema.Schema.Type<typeof JobPathParser>
// Type: readonly ["jobs", "/", string, "/", string, ".json"]

// Transcript path schema: "transcripts/{transcriptId}.json"
export const TranscriptPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.TRANSCRIPTS_PREFIX),
  "/",
  Schema.String, // TranscriptId
  ".json"
)

export type TranscriptPathTuple = Schema.Schema.Type<typeof TranscriptPathParser>
// Type: readonly ["transcripts", "/", string, ".json"]

// Idempotency path schema: "idempotency/{hashedKey}.json"
export const IdempotencyPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.IDEMPOTENCY_PREFIX),
  "/",
  Schema.String, // HashedKey
  ".json"
)

export type IdempotencyPathTuple = Schema.Schema.Type<typeof IdempotencyPathParser>
// Type: readonly ["idempotency", "/", string, ".json"]

// Event log path schema: "events/{jobId}/{eventId}.json"
export const EventPathParser = Schema.TemplateLiteralParser(
  Schema.Literal(STORAGE_PATHS.EVENTS_PREFIX),
  "/",
  Schema.String, // JobId
  "/",
  Schema.String, // EventId
  ".json"
)

export type EventPathTuple = Schema.Schema.Type<typeof EventPathParser>
// Type: readonly ["events", "/", string, "/", string, ".json"]

/**
 * Eventarc path patterns that mirror our Schema parsers.
 * Used in Pulumi infrastructure code for trigger configuration.
 */
export const EVENTARC_PATTERNS = {
  JOB_EVENTS: `${STORAGE_PATHS.JOBS_PREFIX}/{status}/{jobId}.json`,
  TRANSCRIPT_EVENTS: `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/{transcriptId}.json`,
  EVENT_LOG: `${STORAGE_PATHS.EVENTS_PREFIX}/{jobId}/{eventId}.json`
} as const

/**
 * Union schema that can parse any valid GCS path.
 * Returns a discriminated union based on the path pattern.
 */
export const GcsPathParser = Schema.Union(
  // Transform job path parser to include discriminator
  Schema.transform(
    JobPathParser,
    Schema.Struct({
      type: Schema.Literal("job"),
      status: Schema.String,
      jobId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "job" as const,
        status: tuple[2], // JobStatus at index 2
        jobId: tuple[4], // JobId at index 4
        originalPath: Schema.encodeSync(JobPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(JobPathParser)(originalPath)
    }
  ),
  // Transform transcript path parser to include discriminator
  Schema.transform(
    TranscriptPathParser,
    Schema.Struct({
      type: Schema.Literal("transcript"),
      transcriptId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "transcript" as const,
        transcriptId: tuple[2], // TranscriptId at index 2
        originalPath: Schema.encodeSync(TranscriptPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(TranscriptPathParser)(originalPath)
    }
  ),
  // Transform idempotency path parser to include discriminator
  Schema.transform(
    IdempotencyPathParser,
    Schema.Struct({
      type: Schema.Literal("idempotency"),
      hashedKey: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "idempotency" as const,
        hashedKey: tuple[2], // HashedKey at index 2
        originalPath: Schema.encodeSync(IdempotencyPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(IdempotencyPathParser)(originalPath)
    }
  ),
  // Transform event log path parser to include discriminator
  Schema.transform(
    EventPathParser,
    Schema.Struct({
      type: Schema.Literal("event"),
      jobId: Schema.String,
      eventId: Schema.String,
      originalPath: Schema.String
    }),
    {
      strict: true,
      decode: (tuple) => ({
        type: "event" as const,
        jobId: tuple[2], // JobId at index 2
        eventId: tuple[4], // EventId at index 4
        originalPath: Schema.encodeSync(EventPathParser)(tuple)
      }),
      encode: ({ originalPath }) => Schema.decodeUnknownSync(EventPathParser)(originalPath)
    }
  )
)

export type GcsPathParseResult = Schema.Schema.Type<typeof GcsPathParser>

/**
 * Type-safe path utilities for parsing GCS object paths.
 */
export const PathParsers = {
  /**
   * Universal parser that returns a discriminated union result.
   * Uses Schema.decodeUnknownSync with the union schema.
   */
  parseGcsPath: Schema.decodeUnknownSync(GcsPathParser),

  /**
   * Parse a job path into structured components.
   * @param path - GCS object path like "jobs/Queued/job_123.json"
   * @returns Parsed tuple: ["jobs", "/", "Queued", "/", "job_123", ".json"]
   */
  parseJobPath: Schema.decodeUnknownSync(JobPathParser),

  /**
   * Parse a transcript path into structured components.
   * @param path - GCS object path like "transcripts/trn_123.json"
   * @returns Parsed tuple: ["transcripts", "/", "trn_123", ".json"]
   */
  parseTranscriptPath: Schema.decodeUnknownSync(TranscriptPathParser),

  /**
   * Parse an idempotency path into structured components.
   * @param path - GCS object path like "idempotency/abc123.json"
   * @returns Parsed tuple: ["idempotency", "/", "abc123", ".json"]
   */
  parseIdempotencyPath: Schema.decodeUnknownSync(IdempotencyPathParser),

  /**
   * Parse an event log path into structured components.
   * @param path - GCS object path like "events/job-123/1_metadata_fetched.json"
   * @returns Parsed tuple: ["events", "/", "job-123", "/", "1_metadata_fetched", ".json"]
   */
  parseEventPath: Schema.decodeUnknownSync(EventPathParser),

  /**
   * Extract job status and ID from a parsed job path tuple.
   */
  extractJobComponents: (tuple: JobPathTuple): { status: Jobs.JobStatus; jobId: Core.JobId } => ({
    status: tuple[2] as Jobs.JobStatus,
    jobId: tuple[4] as Core.JobId
  }),

  /**
   * Extract transcript ID from a parsed transcript path tuple.
   */
  extractTranscriptComponents: (tuple: TranscriptPathTuple): { transcriptId: Core.TranscriptId } => ({
    transcriptId: tuple[2] as Core.TranscriptId
  }),

  /**
   * Extract hashed key from a parsed idempotency path tuple.
   */
  extractIdempotencyComponents: (tuple: IdempotencyPathTuple): { hashedKey: string } => ({
    hashedKey: tuple[2]
  }),

  /**
   * Extract job ID and event ID from a parsed event path tuple.
   */
  extractEventComponents: (tuple: EventPathTuple): { jobId: Core.JobId; eventId: string } => ({
    jobId: tuple[2] as Core.JobId,
    eventId: tuple[4]
  })
} as const

/**
 * Type-safe path pattern validation.
 */
export type JobEventPattern = typeof EVENTARC_PATTERNS.JOB_EVENTS
export type TranscriptEventPattern = typeof EVENTARC_PATTERNS.TRANSCRIPT_EVENTS
