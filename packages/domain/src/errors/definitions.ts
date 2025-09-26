import { Data, Schema } from "effect"
import type { JobId, RequestId } from "../schemas/ids.js"

// --- Base Error Categories ---

/** Domain-specific error for media resource issues. */
export class MediaResourceError extends Data.TaggedError("MediaResourceError")<{
  readonly message: string
  readonly source: "youtube" | "upload" | "url"
  readonly resourceId?: string
}> {}

/** Domain-specific error for transcription processing. */
export class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
  readonly message: string
  readonly jobId: JobId
  readonly phase: "metadata" | "processing" | "parsing" | "validation"
  readonly retryable: boolean
}> {}

/** Domain-specific error for configuration issues. */
export class ConfigurationError extends Data.TaggedError("ConfigurationError")<{
  readonly message: string
  readonly field: string
  readonly expectedFormat?: string
}> {}

/** Domain-specific error for validation failures. */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly field: string
  readonly value: unknown
  readonly constraint: string
}> {}

/** Domain-specific error for streaming issues. */
export class StreamingError extends Data.TaggedError("StreamingError")<{
  readonly message: string
  readonly jobId: JobId
  readonly chunkIndex?: number
  readonly partialData?: string
}> {}

/** Domain-specific error for authentication/authorization. */
export class AuthorizationError extends Data.TaggedError("AuthorizationError")<{
  readonly message: string
  readonly requestId?: RequestId
  readonly resource: string
  readonly action: string
}> {}

// --- Error Union Types ---

/** All domain errors for pattern matching. */
export type DomainError =
  | MediaResourceError
  | TranscriptionError
  | ConfigurationError
  | ValidationError
  | StreamingError
  | AuthorizationError

// --- Error Schemas for Serialization ---

/** Schema for media resource errors. */
export const MediaResourceErrorSchema = Schema.Struct({
  _tag: Schema.Literal("MediaResourceError"),
  message: Schema.String,
  source: Schema.Literal("youtube", "upload", "url"),
  resourceId: Schema.optional(Schema.String)
})

/** Schema for transcription errors. */
export const TranscriptionErrorSchema = Schema.Struct({
  _tag: Schema.Literal("TranscriptionError"),
  message: Schema.String,
  jobId: Schema.String, // JobId as string for serialization
  phase: Schema.Literal("metadata", "processing", "parsing", "validation"),
  retryable: Schema.Boolean
})

/** Schema for configuration errors. */
export const ConfigurationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("ConfigurationError"),
  message: Schema.String,
  field: Schema.String,
  expectedFormat: Schema.optional(Schema.String)
})

/** Schema for validation errors. */
export const ValidationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("ValidationError"),
  message: Schema.String,
  field: Schema.String,
  value: Schema.Unknown,
  constraint: Schema.String
})

/** Schema for streaming errors. */
export const StreamingErrorSchema = Schema.Struct({
  _tag: Schema.Literal("StreamingError"),
  message: Schema.String,
  jobId: Schema.String, // JobId as string for serialization
  chunkIndex: Schema.optional(Schema.Number),
  partialData: Schema.optional(Schema.String)
})

/** Schema for authorization errors. */
export const AuthorizationErrorSchema = Schema.Struct({
  _tag: Schema.Literal("AuthorizationError"),
  message: Schema.String,
  requestId: Schema.optional(Schema.String), // RequestId as string for serialization
  resource: Schema.String,
  action: Schema.String
})

/** Union schema for all domain errors. */
export const DomainErrorSchema = Schema.Union(
  MediaResourceErrorSchema,
  TranscriptionErrorSchema,
  ConfigurationErrorSchema,
  ValidationErrorSchema,
  StreamingErrorSchema,
  AuthorizationErrorSchema
)

export type DomainErrorSchema = Schema.Schema.Type<typeof DomainErrorSchema>
