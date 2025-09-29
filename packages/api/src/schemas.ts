import { Jobs, Media, Transcription } from "@puredialog/domain"
import { Schema } from "effect"

// --- Public API Schemas ---

/**
 * Request schema for creating a new transcription job.
 */
export type CreateJobRequest = Schema.Schema.Type<typeof CreateJobRequest>
export const CreateJobRequest = Schema.Struct({
  media: Media.MediaResource,
  idempotencyKey: Schema.optional(Schema.String),
  transcriptionContext: Schema.optional(Transcription.TranscriptionContext)
})

/**
 * Response schema for a successfully accepted job (202).
 */
export const JobAccepted = Jobs.TranscriptionJob
export type JobAccepted = Schema.Schema.Type<typeof JobAccepted>

/**
 * Response schema for a job that already exists (409).
 */
export const JobConflict = Jobs.TranscriptionJob
export type JobConflict = Schema.Schema.Type<typeof JobConflict>

/**
 * Health check response.
 */
export type HealthStatus = Schema.Schema<typeof HealthStatus>
export const HealthStatus = Schema.Struct({
  status: Schema.Literal("healthy"),
  timestamp: Schema.Date,
  services: Schema.Struct({
    pubsub: Schema.Literal("connected", "disconnected"),
    storage: Schema.Literal("connected", "disconnected")
  })
})

// --- Internal API Schemas ---

/**
 * Pub/Sub push message format as received from Google Cloud Pub/Sub.
 */
export type PubSubPushMessage = Schema.Schema<typeof PubSubPushMessage>
export const PubSubPushMessage = Schema.Struct({
  message: Schema.Struct({
    data: Schema.instanceOf(Buffer), // base64 encoded
    messageId: Schema.String,
    publishTime: Schema.DateFromString,
    attributes: Schema.Record({ key: Schema.String, value: Schema.String })
  }),
  subscription: Schema.String
})

/**
 * Response for the internal job update handler.
 */
export type InternalUpdateResponse = Schema.Schema<typeof InternalUpdateResponse>
export const InternalUpdateResponse = Schema.Struct({
  received: Schema.Boolean,
  processed: Schema.Boolean,
  reason: Schema.optional(Schema.String)
})
