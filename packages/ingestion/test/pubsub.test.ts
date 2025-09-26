import { assert, describe, it } from "@effect/vitest"
import { PubSub } from "@google-cloud/pubsub"
import {
  JobId,
  JobQueued,
  LanguageCode,
  MediaMetadata,
  MediaResourceId,
  RequestId,
  TranscriptionJob,
  YouTubeVideo,
  YouTubeVideoId,
  YouTubeVideoResource
} from "@puredialog/domain"
import { Effect } from "effect"
import {
  decodeDomainEvent,
  decodeWorkMessage,
  encodeDomainEvent,
  encodeWorkMessage
} from "../src/pubsub/MessageAdapter.js"

const emulatorEndpoint = process.env.PUBSUB_EMULATOR_HOST ?? "127.0.0.1:8085"
const projectId = "pubsub-test-project"

const toError = (cause: unknown): Error => cause instanceof Error ? cause : new Error(String(cause))

const createSampleJob = () =>
  TranscriptionJob.make({
    id: JobId.make("job-0001"),
    requestId: RequestId.make("req-0001"),
    media: YouTubeVideoResource.make({
      type: "youtube",
      id: MediaResourceId.make("media-0001"),
      metadata: MediaMetadata.make({
        mediaResourceId: MediaResourceId.make("media-0001"),
        jobId: JobId.make("job-0001"),
        title: "Sample Interview",
        format: "one_on_one_interview",
        tags: [],
        domain: [],
        speakers: [
          { role: "host" }
        ],
        language: LanguageCode.make("en"),
        speakerCount: 1,
        durationSec: 1800,
        links: [],
        createdAt: new Date("2024-01-01T00:00:00Z")
      }),
      data: YouTubeVideo.make({
        id: YouTubeVideoId.make("a1B2c3D4e5F"),
        title: "Sample Video",
        duration: 1800,
        channelId: "UCabcdefghijklmnopqrstuvwx",
        tags: [],
        channelTitle: "PureDialog"
      })
    }),
    status: "Queued",
    attempts: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z")
  })

const createJobQueuedEvent = () =>
  JobQueued.make({
    job: createSampleJob(),
    occurredAt: new Date("2024-01-01T00:05:00Z")
  })

describe("Pub/Sub MessageAdapter integration", () => {
  it.effect("roundtrips a domain event through the emulator", () =>
    Effect.gen(function*() {
      const pubsub = new PubSub({ projectId, apiEndpoint: emulatorEndpoint })
      const topicName = `domain-events-${Date.now()}`
      const subscriptionName = `${topicName}-sub`

      const [topic] = yield* Effect.tryPromise({
        try: () => pubsub.createTopic(topicName),
        catch: toError
      })

      const [subscription] = yield* Effect.tryPromise({
        try: () => topic.createSubscription(subscriptionName, { ackDeadlineSeconds: 10 }),
        catch: toError
      })

      const event = createJobQueuedEvent()
      console.log("event", event)
      const encoded = yield* encodeDomainEvent(event)

      yield* Effect.tryPromise({
        try: () => topic.publishMessage({ data: encoded.data, attributes: encoded.attributes }),
        catch: toError
      })

      const [pullResponse] = yield* Effect.tryPromise({
        try: () => subscription.pull({ maxMessages: 1, returnImmediately: true }),
        catch: toError
      })

      const received = pullResponse.receivedMessages?.[0]
      if (!received || !received.message?.data) {
        return yield* Effect.fail(new Error("Expected message from Pub/Sub emulator"))
      }

      const decoded = yield* decodeDomainEvent({
        data: Buffer.from(received.message.data),
        attributes: received.message.attributes ?? {}
      })

      assert.deepStrictEqual(decoded, event)
      assert.strictEqual(received.message.attributes?.eventType, "JobQueued")

      if (received.ackId) {
        yield* Effect.tryPromise({
          try: () => subscription.acknowledge([received.ackId]),
          catch: toError
        })
      }

      yield* Effect.tryPromise({
        try: () => subscription.delete(),
        catch: toError
      })
      yield* Effect.tryPromise({
        try: () => topic.delete(),
        catch: toError
      })
      yield* Effect.tryPromise({
        try: () => pubsub.close(),
        catch: toError
      })
    }))
})

it.effect("roundtrips a work message through the emulator", () =>
  Effect.gen(function*() {
    const pubsub = new PubSub({ projectId, apiEndpoint: emulatorEndpoint })
    const topicName = `work-messages-${Date.now()}`
    const subscriptionName = `${topicName}-sub`

    const [topic] = yield* Effect.tryPromise({
      try: () => pubsub.createTopic(topicName),
      catch: toError
    })

    const [subscription] = yield* Effect.tryPromise({
      try: () => topic.createSubscription(subscriptionName, { ackDeadlineSeconds: 10 }),
      catch: toError
    })

    const job = createSampleJob()
    const encoded = yield* encodeWorkMessage(job)

    yield* Effect.tryPromise({
      try: () => topic.publishMessage({ data: encoded.data, attributes: encoded.attributes }),
      catch: toError
    })

    const [pullResponse] = yield* Effect.tryPromise({
      try: () => subscription.pull({ maxMessages: 1, returnImmediately: true }),
      catch: toError
    })

    const received = pullResponse.receivedMessages?.[0]
    if (!received || !received.message?.data) {
      return yield* Effect.fail(new Error("Expected message from Pub/Sub emulator"))
    }

    const decodedJob = yield* decodeWorkMessage({
      data: Buffer.from(received.message.data),
      attributes: received.message.attributes ?? {}
    })

    assert.deepStrictEqual(decodedJob, job)
    assert.strictEqual(received.message.attributes?.eventType, "WorkMessage")

    if (received.ackId) {
      yield* Effect.tryPromise({
        try: () => subscription.acknowledge([received.ackId]),
        catch: toError
      })
    }

    yield* Effect.tryPromise({
      try: () => subscription.delete(),
      catch: toError
    })
    yield* Effect.tryPromise({
      try: () => topic.delete(),
      catch: toError
    })
    yield* Effect.tryPromise({
      try: () => pubsub.close(),
      catch: toError
    })
  }))
