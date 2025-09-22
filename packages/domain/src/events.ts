import { Schema } from "@effect/schema";
import { Data } from "effect";
import { DiarizedTranscript, Job, MediaMetadata } from "./entities";
import { JobStatus } from "./status";
import { JobId, UserId } from "./ids";

// --- Domain Events using Tagged Structs ---

/** Domain events as a tagged enum for better pattern matching. */
export type DomainEvent = Data.TaggedEnum<{
  JobQueued: {
    readonly job: Job;
    readonly occurredAt: Date;
  };
  MetadataReady: {
    readonly jobId: JobId;
    readonly userId: UserId;
    readonly metadata: MediaMetadata;
    readonly occurredAt: Date;
  };
  TranscriptComplete: {
    readonly jobId: JobId;
    readonly userId: UserId;
    readonly transcript: DiarizedTranscript;
    readonly occurredAt: Date;
  };
  JobFailed: {
    readonly jobId: JobId;
    readonly userId: UserId;
    readonly error: string;
    readonly finalAttemptCount: number;
    readonly occurredAt: Date;
  };
  JobStatusChanged: {
    readonly jobId: JobId;
    readonly userId: UserId;
    readonly from: JobStatus;
    readonly to: JobStatus;
    readonly occurredAt: Date;
  };
}>;

/** Event constructors and utilities. */
export const {
  JobQueued,
  MetadataReady,
  TranscriptComplete,
  JobFailed,
  JobStatusChanged,
  $is,
  $match,
} = Data.taggedEnum<DomainEvent>();

// --- Event Schemas for Serialization ---

export const JobQueuedSchema = Schema.Struct({
  _tag: Schema.Literal("JobQueued"),
  job: Job,
  occurredAt: Schema.Date,
});

export const MetadataReadySchema = Schema.Struct({
  _tag: Schema.Literal("MetadataReady"),
  jobId: JobId,
  userId: UserId,
  metadata: MediaMetadata,
  occurredAt: Schema.Date,
});

export const TranscriptCompleteSchema = Schema.Struct({
  _tag: Schema.Literal("TranscriptComplete"),
  jobId: JobId,
  userId: UserId,
  transcript: DiarizedTranscript,
  occurredAt: Schema.Date,
});

export const JobFailedSchema = Schema.Struct({
  _tag: Schema.Literal("JobFailed"),
  jobId: JobId,
  userId: UserId,
  error: Schema.String,
  finalAttemptCount: Schema.Number,
  occurredAt: Schema.Date,
});

export const JobStatusChangedSchema = Schema.Struct({
  _tag: Schema.Literal("JobStatusChanged"),
  jobId: JobId,
  userId: UserId,
  from: JobStatus,
  to: JobStatus,
  occurredAt: Schema.Date,
});

/** Union schema for all domain events. */
export const DomainEventSchema = Schema.Union(
  JobQueuedSchema,
  MetadataReadySchema,
  TranscriptCompleteSchema,
  JobFailedSchema,
  JobStatusChangedSchema
);
