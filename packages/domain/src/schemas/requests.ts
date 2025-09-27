import { Schema } from "effect"
import { TranscriptionContext } from "./context.js"
import { JobId } from "./ids.js"
import { InferenceConfig } from "./inference.js"
import { MediaResource } from "./media.js"

/** Specifies a resource to be processed from input text. */
export const ResourceRequest = Schema.Struct({
  /** Type of resource to extract and process */
  type: Schema.Literal("youtube"), // Future: "spotify", "podcast", etc.
  /** Optional specific identifier if known (e.g., video ID) */
  resourceId: Schema.optional(Schema.String),
  /** Optional additional processing options */
  options: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown }))
})
export type ResourceRequest = Schema.Schema.Type<typeof ResourceRequest>

/** Request to create a new transcription job. */
export const CreateTranscriptionJobRequest = Schema.Struct({
  resource: MediaResource,
  transcriptionContext: Schema.optional(TranscriptionContext)
})
export type CreateTranscriptionJobRequest = Schema.Schema.Type<
  typeof CreateTranscriptionJobRequest
>

/** Request schema for the transcription service that bundles all necessary information. */
export const TranscriptionServiceRequest = Schema.Struct({
  jobId: JobId,
  mediaResource: MediaResource,
  transcriptionContext: TranscriptionContext,
  inferenceConfig: InferenceConfig,
  promptTemplate: Schema.String // Template identifier
})
export type TranscriptionServiceRequest = Schema.Schema.Type<typeof TranscriptionServiceRequest>
