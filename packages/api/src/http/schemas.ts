import { Media, Transcription } from "@puredialog/domain"
import { Schema } from "effect"
import { JobId, RequestId } from "../../../domain/src/core/index.js"

export const HealthStatus = Schema.Struct({
  status: Schema.Literal("Ok")
  // services: Schema.Struct({
  //   pubsub: Schema.Literal("connected", "disconnected"),
  //   storage: Schema.Literal("connected", "disconnected")
  // })
})
export type HealthStatus = Schema.Schema.Type<typeof HealthStatus>

export const CreateJobRequest = Schema.Struct({
  media: Media.MediaResource,
  idempotencyKey: Schema.optional(Schema.String),
  transcriptionContext: Schema.optional(Transcription.TranscriptionContext)
})
export type CreateJobRequest = Schema.Schema.Type<typeof CreateJobRequest>

export const JobAccepted = Schema.Struct({
  jobId: JobId,
  requestId: RequestId
})
export type JobAccepted = Schema.Schema.Type<typeof JobAccepted>

export const PubSubPushMessage = Schema.Struct({
  message: Schema.Struct({
    data: Schema.String,
    messageId: Schema.String,
    publishTime: Schema.DateFromString,
    attributes: Schema.Record({ key: Schema.String, value: Schema.String })
  }),
  subscription: Schema.String
})
export type PubSubPushMessage = Schema.Schema.Type<typeof PubSubPushMessage>

export const InternalUpdateResponse = Schema.Struct({
  received: Schema.Boolean,
  processed: Schema.Boolean,
  reason: Schema.optional(Schema.String)
})
export type InternalUpdateResponse = Schema.Schema.Type<typeof InternalUpdateResponse>
