import { HttpApiBuilder } from "@effect/platform"
import { Jobs } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { Index } from "@puredialog/storage"
import { Effect, Layer, Schema } from "effect"
import { pureDialogApi } from "../http/api.js"
import { PubSubPushMessage } from "../http/schemas.js"
import { InternalUpdateResponse } from "../schemas.js"

interface GcsEvent {
  readonly bucket: string
  readonly name: string
  readonly generation: string
  readonly eventTime: string
  readonly eventType: string
}

const extractGcsEvent = (payload: unknown): GcsEvent => {
  if (typeof payload !== "object" || payload === null) {
    return {
      bucket: "",
      name: "",
      generation: "",
      eventTime: new Date().toISOString(),
      eventType: ""
    }
  }

  const message = (payload as any).message ?? {}
  const attributes = message.attributes ?? {}

  return {
    bucket: attributes.bucketId ?? "",
    name: attributes.objectName ?? "",
    generation: attributes.objectGeneration ?? "",
    eventTime: attributes.eventTime ?? new Date().toISOString(),
    eventType: attributes.eventType ?? ""
  }
}

const handleCompletedJob = (jobId: string, eventTime: Date) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig

    const event = Jobs.JobStatusChanged.make({
      jobId: jobId as any,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Completed",
      occurredAt: eventTime
    })

    const eventId = `${Date.now()}_job_completed`
    const path = Index.event(jobId as any, eventId)

    yield* storage.putObject(config.bucket, path, event)

    yield* Effect.logInfo("Stored job completion event", {
      jobId,
      path,
      occurredAt: eventTime.toISOString()
    })

    return event
  })

const handleNotification = (event: GcsEvent) =>
  Effect.gen(function*() {
    const match = event.name.match(/^jobs\/Completed\/([^/]+)\.json$/)

    if (match) {
      const [, jobId] = match
      yield* handleCompletedJob(jobId, new Date(event.eventTime))
    } else {
      yield* Effect.logDebug("Skipping non-completion event", {
        path: event.name
      })
    }

    return { processed: true }
  })

export const internalRoutes = HttpApiBuilder.group(
  pureDialogApi,
  "internal",
  (handlers) =>
    handlers.handle("notifications", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo("Received Eventarc notification", {
          messageId: (payload as any)?.message?.messageId ?? "unknown"
        })

        const parsedPayload = yield* Schema.decodeUnknown(PubSubPushMessage)(payload).pipe(
          Effect.tapError((error) =>
            Effect.logWarning("Received invalid Eventarc payload", {
              error
            })
          ),
          Effect.orDie
        )

        const event = extractGcsEvent(parsedPayload)
        const result = yield* handleNotification(event)

        return Schema.encodeUnknownSync(InternalUpdateResponse)({
          received: true,
          processed: result.processed,
          reason: "Success"
        })
      }).pipe(
        Effect.catchAll((error) =>
          Effect.gen(function*() {
            yield* Effect.logError("Failed to process Eventarc notification", error)
            return {
              received: true,
              processed: false,
              reason: "Unexpected error"
            }
          })
        )
      ))
).pipe(Layer.provide(Layer.merge(IngestionLayer.CloudStorageLayer, Config.CloudStorageConfigLayer)))
