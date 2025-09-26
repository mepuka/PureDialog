import { Data } from "effect"

export class MessageEncodingError extends Data.TaggedError("MessageEncodingError")<{
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {}

export type PubSubPublishErrorType =
  | "SchemaValidation"
  | "ClientError"
  | "RetryExceeded"

export class PubSubPublishError extends Data.TaggedError("PubSubPublishError")<{
  readonly type: PubSubPublishErrorType
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static schemaValidation(schema: string, cause: unknown) {
    return new PubSubPublishError({
      type: "SchemaValidation",
      message: `Failed to encode message for schema ${schema}`,
      cause,
      context: { schema }
    })
  }

  static clientFailure(topic: string, cause: unknown) {
    return new PubSubPublishError({
      type: "ClientError",
      message: `Failed to publish message to topic ${topic}`,
      cause,
      context: { topic }
    })
  }

  static retryExceeded(topic: string, attempts: number, cause: unknown) {
    return new PubSubPublishError({
      type: "RetryExceeded",
      message: `Exceeded ${attempts} publish attempts for topic ${topic}`,
      cause,
      context: { topic, attempts }
    })
  }
}
