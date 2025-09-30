import { Core, Media, Transcription } from "@puredialog/domain"
import { Schema } from "effect"

/**
 * Health check response
 */
export const HealthStatus = Schema.Struct({
  status: Schema.Literal("Ok")
})
export type HealthStatus = Schema.Schema.Type<typeof HealthStatus>

/**
 * Request schema for creating a new transcription job.
 * This is the only non-Google event derived type in the API.
 */
export const CreateJobRequest = Schema.Struct({
  media: Media.MediaResource,
  idempotencyKey: Schema.optional(Schema.String),
  transcriptionContext: Schema.optional(Transcription.TranscriptionContext)
})
export type CreateJobRequest = Schema.Schema.Type<typeof CreateJobRequest>

/**
 * Response schema for a successfully accepted job (202).
 */
export const JobAccepted = Schema.Struct({
  jobId: Core.JobId,
  requestId: Core.RequestId
})
export type JobAccepted = Schema.Schema.Type<typeof JobAccepted>

/**
 * Response for internal event notifications.
 * Used by Eventarc to track event processing.
 */
export const InternalNotificationResponse = Schema.Struct({
  received: Schema.Boolean,
  processed: Schema.Boolean,
  reason: Schema.optional(Schema.String)
})
export type InternalNotificationResponse = Schema.Schema.Type<typeof InternalNotificationResponse>
