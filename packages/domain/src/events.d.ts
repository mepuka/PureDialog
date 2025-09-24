import { Schema } from "effect";
export type JobQueued = Schema.Schema.Type<typeof JobQueued>;
export declare const JobQueued: Schema.TaggedStruct<"JobQueued", {
  job: Schema.Struct<{
    id: Schema.brand<typeof Schema.String, "JobId">;
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    media: Schema.Union<
      [
        typeof import("./media-resources").YouTubeVideoResource,
        typeof import("./media-resources").YouTubeChannelResource,
      ]
    >;
    status: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
    attempts: typeof Schema.Number;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
    transcriptId: Schema.optional<Schema.brand<typeof Schema.String, "TranscriptId">>;
    error: Schema.optional<typeof Schema.String>;
  }>;
  occurredAt: typeof Schema.Date;
}>;
export type TranscriptComplete = Schema.Schema.Type<typeof TranscriptComplete>;
export declare const TranscriptComplete: Schema.TaggedStruct<"TranscriptComplete", {
  jobId: Schema.brand<typeof Schema.String, "JobId">;
  requestId: Schema.brand<typeof Schema.String, "RequestId">;
  transcript: Schema.Struct<{
    id: Schema.brand<typeof Schema.String, "TranscriptId">;
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    rawText: Schema.filter<typeof Schema.String>;
    turns: Schema.Array$<
      Schema.Struct<{
        timestamp: Schema.brand<Schema.filter<typeof Schema.String>, "Timestamp">;
        speaker: Schema.Literal<["host", "guest"]>;
        text: Schema.filter<typeof Schema.String>;
      }>
    >;
    createdAt: typeof Schema.Date;
    updatedAt: typeof Schema.Date;
  }>;
  occurredAt: typeof Schema.Date;
}>;
export type JobFailed = Schema.Schema.Type<typeof JobFailed>;
export declare const JobFailed: Schema.TaggedStruct<"JobFailed", {
  jobId: Schema.brand<typeof Schema.String, "JobId">;
  requestId: Schema.brand<typeof Schema.String, "RequestId">;
  error: typeof Schema.String;
  attempts: typeof Schema.Number;
  occurredAt: typeof Schema.Date;
}>;
export type JobStatusChanged = Schema.Schema.Type<typeof JobStatusChanged>;
export declare const JobStatusChanged: Schema.TaggedStruct<"JobStatusChanged", {
  jobId: Schema.brand<typeof Schema.String, "JobId">;
  requestId: Schema.brand<typeof Schema.String, "RequestId">;
  from: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
  to: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
  occurredAt: typeof Schema.Date;
}>;
/** Union schema for all domain events. */
export declare const DomainEvent: Schema.Union<[
  Schema.TaggedStruct<"JobQueued", {
    job: Schema.Struct<{
      id: Schema.brand<typeof Schema.String, "JobId">;
      requestId: Schema.brand<typeof Schema.String, "RequestId">;
      media: Schema.Union<
        [
          typeof import("./media-resources").YouTubeVideoResource,
          typeof import("./media-resources").YouTubeChannelResource,
        ]
      >;
      status: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
      attempts: typeof Schema.Number;
      createdAt: typeof Schema.Date;
      updatedAt: typeof Schema.Date;
      transcriptId: Schema.optional<Schema.brand<typeof Schema.String, "TranscriptId">>;
      error: Schema.optional<typeof Schema.String>;
    }>;
    occurredAt: typeof Schema.Date;
  }>,
  Schema.TaggedStruct<"TranscriptComplete", {
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    transcript: Schema.Struct<{
      id: Schema.brand<typeof Schema.String, "TranscriptId">;
      jobId: Schema.brand<typeof Schema.String, "JobId">;
      rawText: Schema.filter<typeof Schema.String>;
      turns: Schema.Array$<
        Schema.Struct<{
          timestamp: Schema.brand<Schema.filter<typeof Schema.String>, "Timestamp">;
          speaker: Schema.Literal<["host", "guest"]>;
          text: Schema.filter<typeof Schema.String>;
        }>
      >;
      createdAt: typeof Schema.Date;
      updatedAt: typeof Schema.Date;
    }>;
    occurredAt: typeof Schema.Date;
  }>,
  Schema.TaggedStruct<"JobFailed", {
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    error: typeof Schema.String;
    attempts: typeof Schema.Number;
    occurredAt: typeof Schema.Date;
  }>,
  Schema.TaggedStruct<"JobStatusChanged", {
    jobId: Schema.brand<typeof Schema.String, "JobId">;
    requestId: Schema.brand<typeof Schema.String, "RequestId">;
    from: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
    to: Schema.Literal<["Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled"]>;
    occurredAt: typeof Schema.Date;
  }>,
]>;
