import { Data } from "effect"

export class TranscriptionError extends Data.TaggedError("TranscriptionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class GoogleApiError extends Data.TaggedError("GoogleApiError")<{
  readonly message: string
  readonly cause?: unknown
  readonly status?: number
}> {}

export type LLMError = TranscriptionError | GoogleApiError
