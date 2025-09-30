import { Data } from "effect"
import type { Core } from "../index.js"

/**
 * Worker processing errors
 */
export class WorkerProcessingError extends Data.TaggedError("WorkerProcessingError")<{
  readonly message: string
  readonly jobId: Core.JobId
  readonly phase: "decode" | "validate" | "fetch" | "process" | "persist"
  readonly retryable: boolean
  readonly cause?: unknown
}> {}

export class CloudEventDecodeError extends Data.TaggedError("CloudEventDecodeError")<{
  readonly message: string
  readonly eventId?: string
  readonly cause?: unknown
}> {}

export class StateTransitionError extends Data.TaggedError("StateTransitionError")<{
  readonly message: string
  readonly jobId: Core.JobId
  readonly currentState: string
  readonly expectedState: string
}> {}
