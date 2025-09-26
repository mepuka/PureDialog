import { Schema } from "effect"

import { JobId, RequestId } from "./ids.js"
import { Transcript } from "./transcript.js"

export const TranscriptionJobAccepted = Schema.Struct({
  jobId: JobId,
  requestId: RequestId
})
export type TranscriptionJobAccepted = Schema.Schema.Type<typeof TranscriptionJobAccepted>

export const TranscriptionJobError = Schema.Struct({
  error: Schema.String.pipe(Schema.nonEmptyString()),
  requestId: Schema.optional(RequestId)
})
export type TranscriptionJobError = Schema.Schema.Type<typeof TranscriptionJobError>

export const TranscriptionJobResponse = Schema.Union(
  TranscriptionJobAccepted,
  TranscriptionJobError
)
export type TranscriptionJobResponse = Schema.Schema.Type<typeof TranscriptionJobResponse>

/** Response schema for the transcription service. */
export const TranscriptionServiceResponse = Schema.Struct({
  jobId: JobId,
  transcript: Transcript,
  processingMetadata: Schema.Struct({
    processingTimeMs: Schema.Number,
    promptCompilationTime: Schema.Number,
    inferenceTime: Schema.Number
  })
})
export type TranscriptionServiceResponse = Schema.Schema.Type<typeof TranscriptionServiceResponse>
