import { Data } from "effect"

export class MessageEncodingError extends Data.TaggedError("MessageEncodingError")<{
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {}

export type PubSubErrorType =
  | "SchemaValidation"
  | "ClientError"
  | "RetryExceeded"

export class PubSubError extends Data.TaggedError("PubSubError")<{
  readonly type: PubSubErrorType
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static schemaValidation(schema: string, cause: unknown) {
    return new PubSubError({
      type: "SchemaValidation",
      message: `Failed to encode message for schema ${schema}`,
      cause,
      context: { schema }
    })
  }

  static clientFailure(topic: string, cause: unknown) {
    return new PubSubError({
      type: "ClientError",
      message: `Failed to publish message to topic ${topic}`,
      cause,
      context: { topic }
    })
  }

  static retryExceeded(topic: string, attempts: number, cause: unknown) {
    return new PubSubError({
      type: "RetryExceeded",
      message: `Exceeded ${attempts} publish attempts for topic ${topic}`,
      cause,
      context: { topic, attempts }
    })
  }
}
