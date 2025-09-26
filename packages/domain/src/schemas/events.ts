import { Schema } from "effect"
import { TranscriptionJob } from "./entities.js"
import { JobId, RequestId } from "./ids.js"
import { JobStatus } from "./status.js"
import { Transcript } from "./transcript.js"

export const JobEventType = Schema.Literal(
  "JobQueued",
  "JobFailed",
  "JobStatusChanged",
  "TranscriptComplete",
  "WorkMessage"
)
export type JobEventType = Schema.Schema.Type<typeof JobEventType>

// --- Event Schemas for Serialization ---

export const JobQueued = Schema.TaggedStruct(
  "JobQueued",
  {
    job: TranscriptionJob,
    occurredAt: Schema.Date
  }
)
export type JobQueued = Schema.Schema.Type<typeof JobQueued>

export const TranscriptComplete = Schema.TaggedStruct(
  "TranscriptComplete",
  {
    jobId: JobId,
    requestId: RequestId,
    transcript: Transcript,
    occurredAt: Schema.Date
  }
)
export type TranscriptComplete = Schema.Schema.Type<typeof TranscriptComplete>

export const JobFailed = Schema.TaggedStruct(
  "JobFailed",
  {
    jobId: JobId,
    requestId: RequestId,
    error: Schema.String,
    attempts: Schema.Number,
    occurredAt: Schema.Date
  }
)
export type JobFailed = Schema.Schema.Type<typeof JobFailed>

export const JobStatusChanged = Schema.TaggedStruct(
  "JobStatusChanged",
  {
    jobId: JobId,
    requestId: RequestId,
    from: JobStatus,
    to: JobStatus,
    occurredAt: Schema.Date
  }
)
export type JobStatusChanged = Schema.Schema.Type<typeof JobStatusChanged>

export const WorkMessage = Schema.TaggedStruct(
  "WorkMessage",
  {
    job: TranscriptionJob,
    occurredAt: Schema.Date
  }
)
export type WorkMessage = Schema.Schema.Type<typeof WorkMessage>

export type DomainEvent = Schema.Schema.Type<typeof DomainEvent>
export const DomainEvent = Schema.Union(JobQueued, TranscriptComplete, JobFailed, JobStatusChanged, WorkMessage)
