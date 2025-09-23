import { Schema } from "@effect/schema";
import { TranscriptionJob } from "./entities";
import { Transcript } from "./transcript";
import { JobId, RequestId } from "./ids";
import { JobStatus } from "./status";

// --- Event Schemas for Serialization ---

export type JobQueued = Schema.Schema.Type<typeof JobQueued>;
export const JobQueued = Schema.TaggedStruct("JobQueued", {
  job: TranscriptionJob,
  occurredAt: Schema.Date,
});

export type TranscriptComplete = Schema.Schema.Type<typeof TranscriptComplete>;
export const TranscriptComplete = Schema.TaggedStruct("TranscriptComplete", {
  jobId: JobId,
  requestId: RequestId,
  transcript: Transcript,
  occurredAt: Schema.Date,
});

export type JobFailed = Schema.Schema.Type<typeof JobFailed>;
export const JobFailed = Schema.TaggedStruct("JobFailed", {
  jobId: JobId,
  requestId: RequestId,
  error: Schema.String,
  attempts: Schema.Number,
  occurredAt: Schema.Date,
});

export type JobStatusChanged = Schema.Schema.Type<typeof JobStatusChanged>;
export const JobStatusChanged = Schema.TaggedStruct("JobStatusChanged", {
  jobId: JobId,
  requestId: RequestId,
  from: JobStatus,
  to: JobStatus,
  occurredAt: Schema.Date,
});

/** Union schema for all domain events. */
export const DomainEvent = Schema.Union(
  JobQueued,
  TranscriptComplete,
  JobFailed,
  JobStatusChanged
);
