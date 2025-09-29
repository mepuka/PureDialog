import { HttpApiBuilder } from "@effect/platform"
import { Jobs } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { Index } from "@puredialog/storage"
import { Effect, Layer } from "effect"
import { PureDialogApi } from "./api.js"

/**
 * GCS Event payload structure from Eventarc.
 */
interface GcsEvent {
  readonly bucket: string
  readonly name: string
  readonly generation: string
  readonly eventTime: string
  readonly eventType: string
}

/**
 * Extract GCS event data from Eventarc PubSub message.
 * Eventarc wraps GCS events in PubSub messages with the event data in attributes.
 */
const extractGcsEventFromPubSub = (pubsubMessage: any): GcsEvent => {
  const attributes = pubsubMessage.message?.attributes || {}
  return {
    bucket: attributes.bucketId || "",
    name: attributes.objectName || "",
    generation: attributes.objectGeneration || "",
    eventTime: attributes.eventTime || new Date().toISOString(),
    eventType: attributes.eventType || ""
  }
}

/**
 * Handle external notifications for completed jobs.
 * In the new architecture: write domain events to GCS event store instead of PubSub.
 */
const handleCompletedJobNotification = (jobId: string, eventTime: Date) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig

    // Create domain event for job completion
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobId as any,
      requestId: "external-notification" as any, // Placeholder for external notifications
      from: "Processing",
      to: "Completed",
      occurredAt: eventTime
    })

    // Write domain event to GCS event store (instead of PubSub)
    const eventId = `${Date.now()}_job_completed`
    const eventPath = Index.event(jobId as any, eventId)
    yield* storage.putObject(config.bucket, eventPath, domainEvent)

    yield* Effect.logInfo(`Stored domain event in GCS: JobStatusChanged to Completed`, {
      jobId,
      eventPath,
      eventTime: eventTime.toISOString()
    })

    return domainEvent
  })

/**
 * Handle notification events from Eventarc for external broadcasting.
 * Only processes jobs/Completed/* events to notify external systems.
 */
const handleNotificationEvent = (gcsEvent: GcsEvent) =>
  Effect.gen(function*() {
    const filePath = gcsEvent.name
    const eventTime = new Date(gcsEvent.eventTime)

    yield* Effect.logInfo("Processing notification event from Eventarc", {
      bucket: gcsEvent.bucket,
      path: filePath,
      eventTime: eventTime.toISOString()
    })

    // Extract jobId from jobs/Completed/{jobId}.json pattern
    const completedJobMatch = filePath.match(/^jobs\/Completed\/([^/]+)\.json$/)

    if (completedJobMatch) {
      const jobId = completedJobMatch[1]
      yield* handleCompletedJobNotification(jobId, eventTime)
    } else {
      yield* Effect.logDebug(`Ignoring non-completed job event: ${filePath}`)
    }

    return { processed: true }
  })

/**
 * Handler for State-Triggered Choreography notifications.
 * Only handles external notifications when jobs complete.
 */
const internalLayer = HttpApiBuilder.group(
  PureDialogApi,
  "internal",
  (handlers) =>
    handlers.handle("notifications", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(
          `Received notification push message: ${payload.message?.messageId || "unknown"}`
        )

        // Extract GCS event from Eventarc PubSub wrapper
        const gcsEvent = extractGcsEventFromPubSub(payload)
        const result = yield* handleNotificationEvent(gcsEvent)

        return {
          received: true,
          processed: result.processed,
          timestamp: new Date().toISOString()
        }
      }).pipe(
        Effect.catchAll((error: unknown) =>
          Effect.gen(function*() {
            yield* Effect.logError("Unexpected error processing notification event", error)
            return {
              received: true,
              processed: false,
              reason: "Unexpected error"
            }
          })
        )
      ))
).pipe(Layer.provide(Layer.merge(IngestionLayer.CloudStorageLayer, Config.CloudStorageConfigLayer)))

export { internalLayer }
