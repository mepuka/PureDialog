import { Schema } from "effect"
import { JobId, RequestId } from "../core/ids.js"
import { Transcript } from "../transcription/transcript.js"
import { QueuedJob } from "./entities.js"
import { JobStatus } from "./status.js"

/**
 * Domain events for job lifecycle tracking.
 * These events are written to GCS event log for audit trail.
 */

/**
 * Event types for job lifecycle.
 *
 * @category events
 */
export const JobEventType = Schema.Literal(
  "JobQueued",
  "JobFailed",
  "JobStatusChanged",
  "TranscriptComplete"
)
export type JobEventType = Schema.Schema.Type<typeof JobEventType>

/**
 * Event emitted when a new job is created and queued.
 *
 * @example
 * ```ts
 * import { JobQueued } from "@puredialog/domain/Jobs"
 *
 * const event = JobQueued.make({
 *   job: queuedJob,
 *   occurredAt: new Date()
 * })
 * ```
 *
 * @category events
 */
export const JobQueued = Schema.TaggedStruct("JobQueued", {
  job: QueuedJob,
  occurredAt: Schema.Date
})
export type JobQueued = Schema.Schema.Type<typeof JobQueued>

/**
 * Event emitted when transcript processing is complete.
 *
 * @example
 * ```ts
 * import { TranscriptComplete } from "@puredialog/domain/Jobs"
 *
 * const event = TranscriptComplete.make({
 *   jobId: JobId("job_123"),
 *   requestId: RequestId("req_456"),
 *   transcript,
 *   occurredAt: new Date()
 * })
 * ```
 *
 * @category events
 */
export const TranscriptComplete = Schema.TaggedStruct("TranscriptComplete", {
  jobId: JobId,
  requestId: RequestId,
  transcript: Transcript,
  occurredAt: Schema.Date
})
export type TranscriptComplete = Schema.Schema.Type<typeof TranscriptComplete>

/**
 * Event emitted when a job fails.
 *
 * @example
 * ```ts
 * import { JobFailed } from "@puredialog/domain/Jobs"
 *
 * const event = JobFailed.make({
 *   jobId: JobId("job_123"),
 *   requestId: RequestId("req_456"),
 *   error: "Error message",
 *   attempts: 3,
 *   occurredAt: new Date()
 * })
 * ```
 *
 * @category events
 */
export const JobFailed = Schema.TaggedStruct("JobFailed", {
  jobId: JobId,
  requestId: RequestId,
  error: Schema.String,
  attempts: Schema.Number,
  occurredAt: Schema.Date
})
export type JobFailed = Schema.Schema.Type<typeof JobFailed>

/**
 * Event emitted when a job transitions between states.
 *
 * @example
 * ```ts
 * import { JobStatusChanged } from "@puredialog/domain/Jobs"
 *
 * const event = JobStatusChanged.make({
 *   jobId: JobId("job_123"),
 *   requestId: RequestId("req_456"),
 *   from: "Queued",
 *   to: "MetadataReady",
 *   occurredAt: new Date()
 * })
 * ```
 *
 * @category events
 */
export const JobStatusChanged = Schema.TaggedStruct("JobStatusChanged", {
  jobId: JobId,
  requestId: RequestId,
  from: JobStatus,
  to: JobStatus,
  occurredAt: Schema.Date
})
export type JobStatusChanged = Schema.Schema.Type<typeof JobStatusChanged>

/**
 * Union of all job domain events.
 *
 * @category events
 */
export type DomainEvent = Schema.Schema.Type<typeof DomainEvent>
export const DomainEvent = Schema.Union(JobQueued, TranscriptComplete, JobFailed, JobStatusChanged)
