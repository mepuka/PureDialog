import { CloudEvents, Core, Jobs } from "@puredialog/domain"
import { ParseResult, Schema } from "effect"
import { GcsPathParser } from "./paths.js"

/**
 * A schema that parses the GCS object path from a CloudEvent subject.
 * It filters for paths that are recognized as 'job' paths and extracts the job components.
 * This is a one-way transformation (decode only).
 */
const JobInfoFromSubject = Schema.String.pipe(
  Schema.transformOrFail(
    Schema.Struct({
      status: Jobs.JobStatus,
      jobId: Core.JobId
    }),
    {
      decode: (subject, _, ast) => {
        const path = subject.startsWith("objects/")
          ? subject.slice("objects/".length)
          : subject

        const result = Schema.decodeUnknownSync(GcsPathParser)(path)

        if (result.type !== "job") {
          return ParseResult.fail(
            new ParseResult.Unexpected(ast, `Expected a job path, but got ${result.type}`)
          )
        }

        return ParseResult.succeed({
          status: result.status as Jobs.JobStatus,
          jobId: result.jobId as Core.JobId
        })
      },
      encode: (_, __, ast) =>
        ParseResult.fail(
          new ParseResult.Forbidden(
            ast,
            "Encoding from JobInfo to a subject string is not supported."
          )
        )
    }
  )
)

/**
 * A schema representing a valid GCS object finalization event for a transcription job.
 * It ensures the event type is correct and that the subject contains a valid job path.
 * The result of parsing is a clean object with the essential job info.
 */

// The 'From' schema represents the raw incoming CloudEvent with a valid job subject.
const FromGcsJobFinalizedEvent = CloudEvents.Gcs.GcsObjectFinalizedEvent.pipe(
  Schema.extend(
    Schema.Struct({
      subject: JobInfoFromSubject
    })
  )
)

// The 'To' schema represents our desired, clean, domain-focused object.
const ToGcsJobFinalizedEvent = Schema.Struct({
  jobId: Core.JobId,
  status: Jobs.JobStatus,
  eventId: CloudEvents.CloudEventsAttributes.fields.id,
  eventTime: Schema.Date,
  gcsObject: CloudEvents.Gcs.GcsObjectMetadata
})

// The final schema transforms the raw event into the clean domain object.
// This is a one-way transformation (decode only).
export const GcsJobFinalizedEvent = Schema.transformOrFail(
  FromGcsJobFinalizedEvent,
  ToGcsJobFinalizedEvent,
  {
    strict: true,
    decode: ({ data, id, subject, time }) =>
      ParseResult.encodeUnknown(ToGcsJobFinalizedEvent)({
        jobId: subject.jobId,
        status: subject.status,
        eventId: id,
        eventTime: time ?? new Date(), // Provide a default if time is missing
        gcsObject: data
      }),
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
