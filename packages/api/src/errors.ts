import { Data, Schema } from "effect"

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static invalidMediaResource(message: string, media: unknown) {
    return new ValidationError({
      message,
      context: { media }
    })
  }

  static invalidUserKey(message: string, userKey: unknown) {
    return new ValidationError({
      message,
      context: { userKey }
    })
  }
}

// RepositoryError is now exported from @puredialog/storage

// --- Error Response Schemas ---

export class JobNotFound extends Schema.TaggedError<JobNotFound>()("JobNotFound", {
  message: Schema.String,
  jobId: Schema.String
}) {}

export class JobConflictError extends Schema.TaggedError<JobConflictError>()("JobConflictError", {
  idempotencyKey: Schema.String,
  message: Schema.String,
  cause: Schema.Unknown
}) {}
// PubSubError will be imported from @puredialog/ingestion
