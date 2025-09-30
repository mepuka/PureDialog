import { Schema } from "effect"
import { JobId, RequestId, TranscriptId } from "../core/ids.js"
import { MediaMetadata } from "../media/metadata.js"
import { MediaResource } from "../media/resources.js"
import { TranscriptionContext } from "../transcription/context.js"

/**
 * Job entity types using discriminated union pattern for type-safe state transitions.
 * Each stage in the pipeline is a separate schema with progressively enriched fields.
 */

/**
 * Common fields shared by all job states.
 * This is the immutable core of a transcription job.
 */
const BaseJobFields = {
  id: JobId,
  requestId: RequestId,
  media: MediaResource,
  attempts: Schema.Number,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
  transcriptionContext: Schema.optional(TranscriptionContext),
  idempotencyKey: Schema.optional(Schema.String)
}

/**
 * Stage 1: Job is queued, awaiting metadata enrichment.
 * This is the initial state when a job is created.
 *
 * @example
 * ```ts
 * import { QueuedJob } from "@puredialog/domain/Jobs"
 *
 * const job = QueuedJob.make({
 *   id: JobId("job_123"),
 *   requestId: RequestId("req_456"),
 *   media: { type: "youtube", data: { id: "abc123" } },
 *   attempts: 0,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * })
 * ```
 *
 * @category entities
 */
export class QueuedJob extends Schema.TaggedClass<QueuedJob>()("QueuedJob", BaseJobFields) {}

/**
 * Stage 2: Metadata has been fetched and enriched.
 * Adds required metadata field - job cannot progress without it.
 *
 * @example
 * ```ts
 * import { MetadataReadyJob } from "@puredialog/domain/Jobs"
 *
 * const enrichJob = (queued: QueuedJob, metadata: MediaMetadata) =>
 *   MetadataReadyJob.make({
 *     ...queued,
 *     _tag: "MetadataReadyJob",
 *     metadata,
 *     metadataFetchedAt: new Date()
 *   })
 * ```
 *
 * @category entities
 */
export class MetadataReadyJob extends Schema.TaggedClass<MetadataReadyJob>()("MetadataReadyJob", {
  ...BaseJobFields,
  metadata: MediaMetadata,
  metadataFetchedAt: Schema.Date
}) {}

/**
 * Stage 3: Transcription is actively being processed.
 * Adds processing tracking fields.
 *
 * @example
 * ```ts
 * import { ProcessingJob } from "@puredialog/domain/Jobs"
 *
 * const startProcessing = (ready: MetadataReadyJob) =>
 *   ProcessingJob.make({
 *     ...ready,
 *     _tag: "ProcessingJob",
 *     processingStartedAt: new Date()
 *   })
 * ```
 *
 * @category entities
 */
export class ProcessingJob extends Schema.TaggedClass<ProcessingJob>()("ProcessingJob", {
  ...BaseJobFields,
  metadata: MediaMetadata,
  metadataFetchedAt: Schema.Date,
  processingStartedAt: Schema.Date
}) {}

/**
 * Stage 4: Transcription completed successfully.
 * Adds required transcriptId and completion timestamp.
 * Terminal state - no further transitions allowed.
 *
 * @example
 * ```ts
 * import { CompletedJob } from "@puredialog/domain/Jobs"
 *
 * const completeJob = (processing: ProcessingJob, transcriptId: TranscriptId) =>
 *   CompletedJob.make({
 *     ...processing,
 *     _tag: "CompletedJob",
 *     transcriptId,
 *     completedAt: new Date()
 *   })
 * ```
 *
 * @category entities
 */
export class CompletedJob extends Schema.TaggedClass<CompletedJob>()("CompletedJob", {
  ...BaseJobFields,
  metadata: MediaMetadata,
  metadataFetchedAt: Schema.Date,
  processingStartedAt: Schema.Date,
  transcriptId: TranscriptId,
  completedAt: Schema.Date
}) {}

/**
 * Terminal State: Job failed during processing.
 * Adds required error message and failure timestamp.
 * May have metadata if failure occurred after enrichment.
 *
 * @example
 * ```ts
 * import { FailedJob } from "@puredialog/domain/Jobs"
 *
 * const failJob = (job: QueuedJob | MetadataReadyJob | ProcessingJob, error: string) =>
 *   FailedJob.make({
 *     ...job,
 *     _tag: "FailedJob",
 *     metadata: "metadata" in job ? job.metadata : undefined,
 *     error,
 *     failedAt: new Date()
 *   })
 * ```
 *
 * @category entities
 */
export class FailedJob extends Schema.TaggedClass<FailedJob>()("FailedJob", {
  ...BaseJobFields,
  metadata: Schema.optional(MediaMetadata),
  metadataFetchedAt: Schema.optional(Schema.Date),
  processingStartedAt: Schema.optional(Schema.Date),
  error: Schema.String,
  failedAt: Schema.Date
}) {}

/**
 * Terminal State: Job was cancelled by user or system.
 * May have metadata if cancellation occurred after enrichment.
 *
 * @example
 * ```ts
 * import { CancelledJob } from "@puredialog/domain/Jobs"
 *
 * const cancelJob = (job: ActiveJob, reason: string) =>
 *   CancelledJob.make({
 *     ...job,
 *     _tag: "CancelledJob",
 *     metadata: "metadata" in job ? job.metadata : undefined,
 *     cancellationReason: reason,
 *     cancelledAt: new Date()
 *   })
 * ```
 *
 * @category entities
 */
export class CancelledJob extends Schema.TaggedClass<CancelledJob>()("CancelledJob", {
  ...BaseJobFields,
  metadata: Schema.optional(MediaMetadata),
  metadataFetchedAt: Schema.optional(Schema.Date),
  processingStartedAt: Schema.optional(Schema.Date),
  cancellationReason: Schema.String,
  cancelledAt: Schema.Date
}) {}

/**
 * Union of all possible job states.
 * This is the main type to use when job state is unknown.
 * Use discriminated union pattern matching on `_tag` to narrow types.
 *
 * @example
 * ```ts
 * import { TranscriptionJob } from "@puredialog/domain/Jobs"
 *
 * const handleJob = (job: TranscriptionJob) => {
 *   switch (job._tag) {
 *     case "QueuedJob":
 *       return fetchMetadata(job)
 *     case "MetadataReadyJob":
 *       return startTranscription(job)
 *     case "ProcessingJob":
 *       return checkProgress(job)
 *     case "CompletedJob":
 *       return deliverResults(job)
 *     case "FailedJob":
 *       return handleFailure(job)
 *     case "CancelledJob":
 *       return cleanup(job)
 *   }
 * }
 * ```
 *
 * @category entities
 */
export type TranscriptionJob =
  | QueuedJob
  | MetadataReadyJob
  | ProcessingJob
  | CompletedJob
  | FailedJob
  | CancelledJob

export const TranscriptionJob = Schema.Union(
  QueuedJob,
  MetadataReadyJob,
  ProcessingJob,
  CompletedJob,
  FailedJob,
  CancelledJob
)

/**
 * Active jobs are those that can still progress (not terminal).
 *
 * @category type-guards
 */
export type ActiveJob = QueuedJob | MetadataReadyJob | ProcessingJob

/**
 * Terminal jobs cannot progress further.
 *
 * @category type-guards
 */
export type TerminalJob = CompletedJob | FailedJob | CancelledJob

/**
 * Type guard for active jobs.
 *
 * @category type-guards
 */
export const isActiveJob = (job: TranscriptionJob): job is ActiveJob =>
  job._tag === "QueuedJob" ||
  job._tag === "MetadataReadyJob" ||
  job._tag === "ProcessingJob"

/**
 * Type guard for terminal jobs.
 *
 * @category type-guards
 */
export const isTerminalJob = (job: TranscriptionJob): job is TerminalJob =>
  job._tag === "CompletedJob" ||
  job._tag === "FailedJob" ||
  job._tag === "CancelledJob"
