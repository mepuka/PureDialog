import type { JobId } from "@puredialog/domain"
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

export class RepositoryError extends Data.TaggedError("RepositoryError")<{
  readonly message: string
  readonly operation: string
  readonly jobId?: JobId
  readonly cause?: unknown
}> {
  static jobNotFound(jobId: JobId) {
    return new RepositoryError({
      message: `Job not found: ${jobId}`,
      operation: "findById",
      jobId
    })
  }
}

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
