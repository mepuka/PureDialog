import { CloudEvents, Core, Jobs } from "@puredialog/domain"
import { ParseResult, Schema } from "effect"
import { GcsPathParser } from "./paths.js"

/**
 * Parse job info from a GCS CloudEvent subject field.
 * Extracts the job status and ID from paths like "objects/jobs/Queued/job_123.json"
 */
const parseJobFromSubject = (subject: string) => {
  const path = subject.startsWith("objects/")
    ? subject.slice("objects/".length)
    : subject

  const result = Schema.decodeUnknownSync(GcsPathParser)(path)

  if (result.type !== "job") {
    throw new Error(`Expected a job path, but got ${result.type}`)
  }

  return {
    status: result.status as Jobs.JobStatus,
    jobId: result.jobId as Core.JobId
  }
}

/**
 * The clean, domain-focused result of parsing a GCS job event.
 */
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
export const GcsJobFinalizedEvent = Schema.transformOrFail(
  CloudEvents.Gcs.GcsObjectFinalizedEvent,
  ToGcsJobFinalizedEvent,
  {
    strict: true,
    decode: (cloudEvent, options, ast) => {
      try {
        // Parse the job info from the subject
        const { jobId, status } = parseJobFromSubject(cloudEvent.subject)

        // Encode the result using the target schema
        return ParseResult.encodeUnknown(ToGcsJobFinalizedEvent)(
          {
            jobId,
            status,
            eventId: cloudEvent.id,
            eventTime: cloudEvent.time ?? new Date(),
            gcsObject: cloudEvent.data
          },
          options
        )
      } catch (error) {
        return ParseResult.fail(
          new ParseResult.Type(ast, cloudEvent, String(error))
        )
      }
    },
    encode: (_, __, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          "Encoding from a GcsJobFinalizedEvent to a raw CloudEvent is not supported."
        )
      )
  }
)

export type GcsJobFinalizedEvent = Schema.Schema.Type<typeof GcsJobFinalizedEvent>
