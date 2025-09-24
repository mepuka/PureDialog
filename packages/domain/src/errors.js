import { Schema } from "effect";
import { Data } from "effect";
// --- Base Error Categories ---
/** Domain-specific error for media resource issues. */
export class MediaResourceError extends Data.TaggedError("MediaResourceError") {
}
/** Domain-specific error for transcription processing. */
export class TranscriptionError extends Data.TaggedError("TranscriptionError") {
}
/** Domain-specific error for configuration issues. */
export class ConfigurationError extends Data.TaggedError("ConfigurationError") {
}
/** Domain-specific error for validation failures. */
export class ValidationError extends Data.TaggedError("ValidationError") {
}
/** Domain-specific error for streaming issues. */
export class StreamingError extends Data.TaggedError("StreamingError") {
}
/** Domain-specific error for authentication/authorization. */
export class AuthorizationError extends Data.TaggedError("AuthorizationError") {
}
// --- Error Schemas for Serialization ---
/** Schema for media resource errors. */
export const MediaResourceErrorSchema = Schema.Struct({
    _tag: Schema.Literal("MediaResourceError"),
    message: Schema.String,
    source: Schema.Literal("youtube", "upload", "url"),
    resourceId: Schema.optional(Schema.String),
});
/** Schema for transcription errors. */
export const TranscriptionErrorSchema = Schema.Struct({
    _tag: Schema.Literal("TranscriptionError"),
    message: Schema.String,
    jobId: Schema.String, // JobId as string for serialization
    phase: Schema.Literal("metadata", "processing", "parsing", "validation"),
    retryable: Schema.Boolean,
});
/** Schema for configuration errors. */
export const ConfigurationErrorSchema = Schema.Struct({
    _tag: Schema.Literal("ConfigurationError"),
    message: Schema.String,
    field: Schema.String,
    expectedFormat: Schema.optional(Schema.String),
});
/** Schema for validation errors. */
export const ValidationErrorSchema = Schema.Struct({
    _tag: Schema.Literal("ValidationError"),
    message: Schema.String,
    field: Schema.String,
    value: Schema.Unknown,
    constraint: Schema.String,
});
/** Schema for streaming errors. */
export const StreamingErrorSchema = Schema.Struct({
    _tag: Schema.Literal("StreamingError"),
    message: Schema.String,
    jobId: Schema.String, // JobId as string for serialization
    chunkIndex: Schema.optional(Schema.Number),
    partialData: Schema.optional(Schema.String),
});
/** Schema for authorization errors. */
export const AuthorizationErrorSchema = Schema.Struct({
    _tag: Schema.Literal("AuthorizationError"),
    message: Schema.String,
    requestId: Schema.optional(Schema.String), // RequestId as string for serialization
    resource: Schema.String,
    action: Schema.String,
});
/** Union schema for all domain errors. */
export const DomainErrorSchema = Schema.Union(MediaResourceErrorSchema, TranscriptionErrorSchema, ConfigurationErrorSchema, ValidationErrorSchema, StreamingErrorSchema, AuthorizationErrorSchema);
