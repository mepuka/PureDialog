import {
  JobId,
  JobStatus,
  MediaResource,
  TranscriptId,
  TranscriptionContext,
  TranscriptionJob
} from "@puredialog/domain"
import { Schema } from "effect"

// --- Public API Schemas ---

/**
 * Job creation request (uses domain types).
 */
const CreateJobRequest = Schema.Struct({
  media: MediaResource,
  idempotencyKey: Schema.String,

  transcriptionContext: Schema.optional(TranscriptionContext)
})

/**
 * Success response schemas for job creation.
 */
const JobAccepted = Schema.Struct({
  status: Schema.Literal("accepted"),
  statusCode: Schema.Literal(202),
  job: TranscriptionJob,
  message: Schema.String
})

const JobAlreadyExists = Schema.Struct({
  status: Schema.Literal("exists"),
  statusCode: Schema.Literal(409),
  job: TranscriptionJob,
  message: Schema.String
})

/**
 * Health check response.
 */
const HealthStatus = Schema.Struct({
  status: Schema.Literal("healthy"),
  timestamp: Schema.DateFromString,
  services: Schema.Struct({
    pubsub: Schema.Literal("connected"),
    storage: Schema.Literal("connected")
  })
})

// --- Internal API Schemas ---

/**
 * Pub/Sub push message format as received from Google Cloud Pub/Sub.
 */
const PubSubPushMessage = Schema.Struct({
  message: Schema.Struct({
    data: Schema.String, // base64 encoded
    messageId: Schema.String,
    publishTime: Schema.DateFromString
  }),
  subscription: Schema.String
})

/**
 * Job status update payload (decoded from data field of PubSub message).
 */
const JobUpdatePayload = Schema.Struct({
  jobId: JobId,
  status: JobStatus,
  error: Schema.optional(Schema.String),
  transcriptId: Schema.optional(TranscriptId)
})

export { CreateJobRequest, HealthStatus, JobAccepted, JobAlreadyExists, JobUpdatePayload, PubSubPushMessage }
