import { Schema } from "effect";
import { TranscriptionJob } from "./entities";
import { JobId, RequestId } from "./ids";
import { JobStatus } from "./status";
import { Transcript } from "./transcript";
export const JobQueued = Schema.TaggedStruct("JobQueued", {
    job: TranscriptionJob,
    occurredAt: Schema.Date,
});
export const TranscriptComplete = Schema.TaggedStruct("TranscriptComplete", {
    jobId: JobId,
    requestId: RequestId,
    transcript: Transcript,
    occurredAt: Schema.Date,
});
export const JobFailed = Schema.TaggedStruct("JobFailed", {
    jobId: JobId,
    requestId: RequestId,
    error: Schema.String,
    attempts: Schema.Number,
    occurredAt: Schema.Date,
});
export const JobStatusChanged = Schema.TaggedStruct("JobStatusChanged", {
    jobId: JobId,
    requestId: RequestId,
    from: JobStatus,
    to: JobStatus,
    occurredAt: Schema.Date,
});
/** Union schema for all domain events. */
export const DomainEvent = Schema.Union(JobQueued, TranscriptComplete, JobFailed, JobStatusChanged);
