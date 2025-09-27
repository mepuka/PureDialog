import { Data } from "effect"

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

// PubSubError will be imported from @puredialog/ingestion
