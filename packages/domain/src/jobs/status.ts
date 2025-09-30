import { Match, Schema } from "effect"
import type { TranscriptId } from "../core/ids.js"
import type { MediaMetadata } from "../media/metadata.js"
import {
  type ActiveJob,
  CancelledJob,
  CompletedJob,
  type FailedJob,
  MetadataReadyJob,
  ProcessingJob,
  type QueuedJob,
  type TranscriptionJob
} from "./entities.js"

/**
 * Job status types and type-safe transition helpers.
 * The discriminated union pattern in entities.ts enforces valid states at compile time.
 */

/**
 * Simple status literal for storage paths and event logging.
 * The type system now enforces valid states via job schemas.
 *
 * @category status
 */
export const JobStatus = Schema.Literal(
  "Queued",
  "MetadataReady",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled"
)
export type JobStatus = Schema.Schema.Type<typeof JobStatus>

/**
 * Extract status string from a job instance using Match module.
 * Used primarily for storage paths and event logging.
 *
 * @example
 * ```ts
 * import { getJobStatus, QueuedJob } from "@puredialog/domain/Jobs"
 *
 * const job = QueuedJob.make({ ... })
 * const status = getJobStatus(job)  // "Queued"
 * ```
 *
 * @category status
 */
export const getJobStatus = (job: TranscriptionJob): JobStatus =>
  Match.value(job).pipe(
    Match.tag("QueuedJob", () => "Queued" as const),
    Match.tag("MetadataReadyJob", () => "MetadataReady" as const),
    Match.tag("ProcessingJob", () => "Processing" as const),
    Match.tag("CompletedJob", () => "Completed" as const),
    Match.tag("FailedJob", () => "Failed" as const),
    Match.tag("CancelledJob", () => "Cancelled" as const),
    Match.exhaustive
  )

/**
 * Type-safe state transition functions using Schema constructors.
 * Compiler enforces that you provide all required fields for next state.
 *
 * @category transitions
 */
export const JobTransitions = {
  /**
   * Enrich queued job with metadata.
   * Transition: QueuedJob → MetadataReadyJob
   *
   * @example
   * ```ts
   * import { JobTransitions, QueuedJob } from "@puredialog/domain/Jobs"
   *
   * const queued = QueuedJob.make({ ... })
   * const enriched = JobTransitions.enrichWithMetadata(queued, metadata)
   * // enriched is MetadataReadyJob - compiler knows it has metadata!
   * ```
   */
  enrichWithMetadata: (job: QueuedJob, metadata: MediaMetadata): MetadataReadyJob =>
    MetadataReadyJob.make({
      ...job,
      metadata,
      metadataFetchedAt: new Date(),
      updatedAt: new Date()
    }),

  /**
   * Start processing a metadata-ready job.
   * Transition: MetadataReadyJob → ProcessingJob
   *
   * @example
   * ```ts
   * import { JobTransitions, MetadataReadyJob } from "@puredialog/domain/Jobs"
   *
   * const ready = MetadataReadyJob.make({ ... })
   * const processing = JobTransitions.startProcessing(ready)
   * // processing is ProcessingJob - has metadata and processingStartedAt
   * ```
   */
  startProcessing: (job: MetadataReadyJob): ProcessingJob =>
    ProcessingJob.make({
      ...job,
      processingStartedAt: new Date(),
      updatedAt: new Date()
    }),

  /**
   * Complete a processing job with transcript.
   * Transition: ProcessingJob → CompletedJob
   *
   * @example
   * ```ts
   * import { JobTransitions, ProcessingJob } from "@puredialog/domain/Jobs"
   *
   * const processing = ProcessingJob.make({ ... })
   * const completed = JobTransitions.complete(processing, transcriptId)
   * // completed is CompletedJob - compiler enforces transcriptId exists
   * ```
   */
  complete: (job: ProcessingJob, transcriptId: TranscriptId): CompletedJob =>
    CompletedJob.make({
      ...job,
      transcriptId,
      completedAt: new Date(),
      updatedAt: new Date()
    }),

  /**
   * Fail any active job.
   * Transition: ActiveJob → FailedJob
   *
   * @example
   * ```ts
   * import { JobTransitions, QueuedJob } from "@puredialog/domain/Jobs"
   *
   * const job = QueuedJob.make({ ... })
   * const failed = JobTransitions.fail(job, "Error message")
   * // failed is FailedJob - error field is required
   * ```
   */
  fail: (job: ActiveJob, error: string): FailedJob =>
    Match.value(job).pipe(
      Match.tag("QueuedJob", (j) => ({
        ...j,
        _tag: "FailedJob" as const,
        error,
        failedAt: new Date(),
        updatedAt: new Date()
      })),
      Match.tag("MetadataReadyJob", (j) => ({
        ...j,
        _tag: "FailedJob" as const,
        error,
        failedAt: new Date(),
        updatedAt: new Date()
      })),
      Match.tag("ProcessingJob", (j) => ({
        ...j,
        _tag: "FailedJob" as const,
        error,
        failedAt: new Date(),
        updatedAt: new Date()
      })),
      Match.exhaustive
    ),

  /**
   * Cancel any active job.
   * Transition: ActiveJob → CancelledJob
   *
   * @example
   * ```ts
   * import { JobTransitions, QueuedJob } from "@puredialog/domain/Jobs"
   *
   * const job = QueuedJob.make({ ... })
   * const cancelled = JobTransitions.cancel(job, "User cancelled")
   * // cancelled is CancelledJob
   * ```
   */
  cancel: (job: ActiveJob, reason: string): CancelledJob =>
    CancelledJob.make({
      ...job,
      cancellationReason: reason,
      cancelledAt: new Date(),
      updatedAt: new Date()
    })
} as const
