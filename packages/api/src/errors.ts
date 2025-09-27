import { Data } from "effect"

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

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

// PubSubError will be imported from @puredialog/ingestion
