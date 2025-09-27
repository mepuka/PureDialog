import type { PubSubError } from "@puredialog/ingestion"
import { Data } from "effect"

/**
 * Database error for API-specific persistence operations.
 */
class DatabaseError extends Data.TaggedError("DatabaseError")<{
  readonly message: string
  readonly operation: string
  readonly details?: unknown
}> {}

export type ApiError = DatabaseError | PubSubError
export { DatabaseError }
