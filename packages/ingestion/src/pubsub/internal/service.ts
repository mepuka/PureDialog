import { PubSub } from "@google-cloud/pubsub"
import { Context, Effect, Layer, Schedule } from "effect"
import { isEmulator, PubSubConfig, type PubSubConfigInterface, PubSubConfigLive } from "../Config.js"
import { PubSubError } from "../errors.js"
import type { PubSubMessage } from "./types.js"

/** PubSub Service Interface */
export class PubSubService extends Context.Tag("PubSubService")<
  PubSubService,
  {
    readonly publish: (
      topicName: string,
      message: PubSubMessage
    ) => Effect.Effect<string, PubSubError>
    readonly close: () => Effect.Effect<void, never>
  }
>() {}

/** Create PubSub client with proper configuration */
const createPubSubClient = (config: PubSubConfigInterface): Effect.Effect<PubSub> => {
  const clientConfig: ConstructorParameters<typeof PubSub>[0] | undefined = isEmulator(config)
    ? {
      projectId: config.projectId,
      apiEndpoint: config.emulatorHost as string
    }
    : {
      projectId: config.projectId
    }

  return Effect.succeed(new PubSub(clientConfig))
}

/** Create retry schedule based on config */
const createRetrySchedule = (config: PubSubConfigInterface) =>
  Schedule.exponential(config.retries.backoff).pipe(
    Schedule.intersect(Schedule.recurs(config.retries.attempts - 1)),
    Schedule.whileInputEffect((error: PubSubError) =>
      Effect.succeed(
        // Retry on client errors and transient failures
        error.type === "ClientError" || error.type === "RetryExceeded"
      )
    )
  )

/** Make PubSub service implementation */
const makePubSubService = Effect.gen(function*() {
  const config = yield* PubSubConfig
  const pubsubClient = yield* createPubSubClient(config)
  const retrySchedule = createRetrySchedule(config)

  // Publish message with retry logic
  const publish = (topicName: string, message: PubSubMessage) =>
    Effect.gen(function*() {
      const topic = pubsubClient.topic(topicName)

      const publishOperation = Effect.tryPromise({
        try: () =>
          topic.publishMessage({
            data: message.data,
            attributes: message.attributes
          }),
        catch: (cause) => PubSubError.clientFailure(topicName, cause)
      })

      return yield* publishOperation.pipe(Effect.retry(retrySchedule))
    })

  // Create subscription if it doesn't exist

  // Close client connection
  const close = () =>
    Effect.tryPromise({
      try: () => pubsubClient.close(),
      catch: (cause) => PubSubError.clientFailure("Failed to close PubSub client", cause)
    }).pipe(Effect.ignore)

  return {
    publish,
    close
  } as const
})

/** PubSub Service Layer with resource management */
export const PubSubServiceLive = Layer.scoped(
  PubSubService,
  Effect.gen(function*() {
    const service = yield* makePubSubService

    // Register cleanup on scope close
    yield* Effect.addFinalizer(() => service.close())

    return service
  })
).pipe(Layer.provide(PubSubConfigLive))

/** Helper functions for common operations */

/** Publish domain event to events topic */
export const publishEvent = (message: PubSubMessage) =>
  Effect.gen(function*() {
    const service = yield* PubSubService
    const config = yield* PubSubConfig
    return yield* service.publish(config.topics.events, message)
  })

/** Publish work message to work topic */
export const publishWork = (message: PubSubMessage) =>
  Effect.gen(function*() {
    const service = yield* PubSubService
    const config = yield* PubSubConfig
    return yield* service.publish(config.topics.work, message)
  })

/** Publish to DLQ topic */
export const publishToDlq = (message: PubSubMessage) =>
  Effect.gen(function*() {
    const service = yield* PubSubService
    const config = yield* PubSubConfig
    return yield* service.publish(config.topics.dlq, message)
  })
