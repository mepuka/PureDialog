import type { Core, Jobs } from "@puredialog/domain"
import { Schema } from "effect"
import {
  EventPathParser,
  IdempotencyPathParser,
  JobPathParser,
  PathParsers,
  STORAGE_PATHS,
  TranscriptPathParser
} from "./paths.js"

/**
 * A centralized module for generating GCS object keys (indices).
 * This ensures a consistent and maintainable prefix structure
 * with type-safe path generation and parsing capabilities.
 */
export const Index = {
  /**
   * Generates the full GCS path for a specific TranscriptionJob document.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param status The status of the job, used for prefixing.
   * @param jobId The ID of the job.
   * @returns The full GCS object key, e.g., `jobs/Queued/job_123.json`
   */
  job: (status: Jobs.JobStatus, jobId: Core.JobId): string =>
    Schema.encodeSync(JobPathParser)([
      STORAGE_PATHS.JOBS_PREFIX,
      "/",
      status,
      "/",
      jobId,
      ".json"
    ]),

  /**
   * Generates the full GCS path for an idempotency record.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param hashedKey The hashed idempotency key.
   * @returns The full GCS object key, e.g., `idempotency/abc123def456.json`
   */
  idempotency: (hashedKey: string): string =>
    Schema.encodeSync(IdempotencyPathParser)([
      STORAGE_PATHS.IDEMPOTENCY_PREFIX,
      "/",
      hashedKey,
      ".json"
    ]),

  /**
   * Generates the full GCS path for a completed Transcript document.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param transcriptId The ID of the transcript.
   * @returns The full GCS object key, e.g., `transcripts/trn_123.json`
   */
  transcript: (transcriptId: Core.TranscriptId): string =>
    Schema.encodeSync(TranscriptPathParser)([
      STORAGE_PATHS.TRANSCRIPTS_PREFIX,
      "/",
      transcriptId,
      ".json"
    ]),

  /**
   * Generates the prefix for listing all jobs of a specific status.
   * @param status The status to list jobs for.
   * @returns The GCS prefix, e.g., `jobs/Queued/`
   */
  jobs: (status: Jobs.JobStatus): string => `${STORAGE_PATHS.JOBS_PREFIX}/${status}/`,

  /**
   * Returns the prefix for listing all idempotency records.
   */
  idempotencies: (): string => `${STORAGE_PATHS.IDEMPOTENCY_PREFIX}/`,

  /**
   * Returns the prefix for listing all transcript documents.
   */
  transcripts: (): string => `${STORAGE_PATHS.TRANSCRIPTS_PREFIX}/`,

  /**
   * Generates the full GCS path for an event in the event log.
   * Uses Schema.encodeSync for type-safe path generation.
   * @param jobId The ID of the job the event belongs to.
   * @param eventId The unique ID for the event (e.g., timestamp-based).
   * @returns The full GCS object key, e.g., `events/job_123/1_metadata_fetched.json`
   */
  event: (jobId: Core.JobId, eventId: string): string =>
    Schema.encodeSync(EventPathParser)([
      STORAGE_PATHS.EVENTS_PREFIX,
      "/",
      jobId,
      "/",
      eventId,
      ".json"
    ]),

  /**
   * Generates the prefix for listing all events for a specific job.
   * @param jobId The ID of the job to list events for.
   * @returns The GCS prefix, e.g., `events/job_123/`
   */
  events: (jobId: Core.JobId): string => `${STORAGE_PATHS.EVENTS_PREFIX}/${jobId}/`,

  /**
   * Returns the prefix for listing all event logs across all jobs.
   */
  allEvents: (): string => `${STORAGE_PATHS.EVENTS_PREFIX}/`,

  /**
   * Type-safe path parsing utilities.
   * These can be used to parse GCS object paths back into structured components.
   */
  parsers: PathParsers
} as const
