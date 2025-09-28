import type { DomainEvent, TranscriptionJob } from "@puredialog/domain"
import { Context, Effect, Layer } from "effect"
import { PubSubConfig, PubSubConfigLive } from "./Config.js"
import { PubSubError } from "./errors.js"
import { MessageAdapter, MessageAdapterLive, PubSubService, PubSubServiceLive } from "./internal/index.js"

/** High-level Pub/Sub client focused on domain-oriented operations */
export class PubSubClient extends Context.Tag("PubSubClient")<
  PubSubClient,
  {
    readonly publishEvent: (
      event: DomainEvent
    ) => Effect.Effect<string, PubSubError>
    readonly publishWorkMessage: (
      job: TranscriptionJob
    ) => Effect.Effect<string, PubSubError>
  }
>() {}

const make = Effect.gen(function*() {
  const config = yield* PubSubConfig
  const service = yield* PubSubService
  const adapter = yield* MessageAdapter

  const publishEvent: (
    event: DomainEvent
  ) => Effect.Effect<string, PubSubError> = (event) =>
    adapter.encodeDomainEvent(event).pipe(
      Effect.flatMap((message) => service.publish(config.topics.events, message)),
      Effect.tap(() => Effect.annotateCurrentSpan("pubsub.topic.name", config.topics.events)),
      Effect.tap(() => Effect.annotateCurrentSpan("pubsub.event.type", (event as any)._tag)),
      Effect.withSpan("PubSubClient.publishEvent"),
      Effect.mapError((cause) => PubSubError.schemaValidation("DomainEvent", cause))
    )

  const publishWorkMessage: (
    job: TranscriptionJob
  ) => Effect.Effect<string, PubSubError> = (job) =>
    adapter.encodeWorkMessage(job).pipe(
      Effect.flatMap((message) => service.publish(config.topics.work, message)),
      Effect.tap(() => Effect.annotateCurrentSpan("pubsub.topic.name", config.topics.work)),
      Effect.tap(() => Effect.annotateCurrentSpan("pubsub.event.type", "WorkMessage")),
      Effect.withSpan("PubSubClient.publishWorkMessage"),
      Effect.mapError((cause) => PubSubError.schemaValidation("TranscriptionJob", cause))
    )

  return {
    publishEvent,
    publishWorkMessage
  } as const
})

export const PubSubClientLayer = Layer.effect(PubSubClient, make)

const deps = Layer.mergeAll(
  MessageAdapterLive,
  PubSubServiceLive,
  PubSubConfigLive
)

export const PubSubClientLive = PubSubClientLayer.pipe(Layer.provide(deps))
