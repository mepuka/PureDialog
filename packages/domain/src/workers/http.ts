import { Schema } from "effect"
import { Core } from "../index.js"

/**
 * Worker health check response
 */
export const WorkerHealthResponse = Schema.Struct({
  status: Schema.Literal("healthy", "degraded", "unhealthy"),
  service: Schema.String,
  version: Schema.String,
  timestamp: Schema.DateFromString,
  checks: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.Struct({
        status: Schema.Literal("pass", "fail"),
        message: Schema.optional(Schema.String)
      })
    })
  )
})

export type WorkerHealthResponse = Schema.Schema.Type<typeof WorkerHealthResponse>

/**
 * Worker CloudEvents request body
 * This is what Eventarc Pipelines POST to worker endpoints
 */
export const WorkerCloudEventRequest = Schema.Struct({
  // CloudEvents envelope
  id: Schema.String,
  source: Schema.String,
  specversion: Schema.Literal("1.0"),
  type: Schema.String,
  datacontenttype: Schema.optional(Schema.String),
  subject: Schema.optional(Schema.String),
  time: Schema.optional(Schema.DateFromString),

  // GCS event data
  data: Schema.Unknown // Parsed based on type/subject
})

export type WorkerCloudEventRequest = Schema.Schema.Type<typeof WorkerCloudEventRequest>

/**
 * Worker processing response
 */
export const WorkerProcessingResponse = Schema.Struct({
  status: Schema.Literal("accepted", "processed", "skipped", "failed"),
  jobId: Core.JobId,
  message: Schema.String,
  processingTimeMs: Schema.optional(Schema.Number),
  metadata: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown }))
})

export type WorkerProcessingResponse = Schema.Schema.Type<typeof WorkerProcessingResponse>

/**
 * Worker error response
 */
export const WorkerErrorResponse = Schema.Struct({
  status: Schema.Literal("error"),
  error: Schema.String,
  details: Schema.optional(Schema.Unknown),
  retryable: Schema.Boolean,
  jobId: Schema.optional(Core.JobId)
})

export type WorkerErrorResponse = Schema.Schema.Type<typeof WorkerErrorResponse>
