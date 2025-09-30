import { CloudEvents, Core, Jobs } from "@puredialog/domain"
import { pipe, Schema } from "effect"
import { JobPathParser } from "./paths.js"

/**
 * Parse job info from a GCS CloudEvent subject field.
 * Extracts the job status and ID from paths like "objects/jobs/Queued/job_123.json"
 * Uses Effect-based error handling with our sophisticated path parser.
 */
type ToGcsJobFinalizedEvent = Schema.Schema.Type<typeof ToGcsJobFinalizedEvent>
const ToGcsJobFinalizedEvent = Schema.Struct({
  jobId: Core.JobId,
  status: Jobs.JobStatus,
  eventId: CloudEvents.CloudEventsAttributes.fields.id,
  eventTime: Schema.Date,
  gcsObject: CloudEvents.Gcs.GcsObjectMetadata
})

/**
 * Transform a GCS CloudEvent into a clean domain object with parsed job info.
 * This is a one-way transformation (decode only).
 */
export const GcsJobFinalizedEvent = (
  cloudEvent: CloudEvents.Gcs.GcsObjectFinalizedEvent
) =>
  pipe(
    Schema.decodeUnknownSync(JobPathParser)(cloudEvent.data.name),
    ([_, status, jobId]) =>
      Schema.decodeUnknownSync(ToGcsJobFinalizedEvent)(ToGcsJobFinalizedEvent.make({
        jobId: Core.JobId.make(jobId) as Core.JobId,
        status: status as Jobs.JobStatus as Jobs.JobStatus,
        eventId: cloudEvent.id,
        eventTime: cloudEvent.time,
        gcsObject: cloudEvent.data
      }))
  )
