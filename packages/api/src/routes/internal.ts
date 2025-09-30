import { HttpApiBuilder, HttpApiError, KeyValueStore } from "@effect/platform"
import type { CloudEvents } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { GcsJobFinalizedEvent, Index } from "@puredialog/storage"
import { Effect, Layer, Match, Schema } from "effect"
import { pureDialogApi } from "../http/api.js"
import { InternalNotificationResponse } from "../http/schemas.js"

/**
 * Unified event processing result
 */
const EventProcessingResult = Schema.Struct({
  eventType: Schema.String,
  jobId: Schema.String,
  status: Jobs.JobStatus,
  eventId: Schema.String,
  processed: Schema.Boolean,
  stored: Schema.Boolean,
  message: Schema.String
})
type EventProcessingResult = Schema.Schema.Type<typeof EventProcessingResult>

/**
 * Store a job event in both GCS (immutable log) and KV store (quick access)
 */
const storeJobEvent = (
  event: GcsJobFinalizedEvent,
  domainEvent: Jobs.JobStatusChanged
) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig
    const kv = yield* KeyValueStore.KeyValueStore

    // Store in GCS for immutable event log
    const eventPath = Index.event(event.jobId, event.eventId)
    yield* storage.putObject(config.bucket, eventPath, domainEvent)

    // Store in KV for quick access (key: jobId, value: latest event)
    const kvStore = kv.forSchema(Jobs.JobStatusChanged)
    yield* kvStore.set(event.jobId, domainEvent)

    yield* Effect.logInfo("Stored job event", {
      jobId: event.jobId,
      status: event.status,
      eventId: event.eventId,
      gcsPath: eventPath,
      kvKey: event.jobId
    })
  })

/**
 * Handle a job transitioning to Queued state
 */
const handleQueuedJob = (event: GcsJobFinalizedEvent) =>
  Effect.gen(function*() {
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: event.jobId,
      requestId: "external-notification" as any,
      from: "Queued",
      to: "Queued",
      occurredAt: event.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobQueued",
      jobId: event.jobId,
      status: "Queued",
      eventId: event.eventId,
      processed: true,
      stored: true,
      message: "Job queued for processing"
    })
  })

/**
 * Handle a job transitioning to Processing state
 */
const handleProcessingJob = (event: GcsJobFinalizedEvent) =>
  Effect.gen(function*() {
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: event.jobId,
      requestId: "external-notification" as any,
      from: "Queued",
      to: "Processing",
      occurredAt: event.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobProcessing",
      jobId: event.jobId,
      status: "Processing",
      eventId: event.eventId,
      processed: true,
      stored: true,
      message: "Job started processing"
    })
  })

/**
 * Handle a job transitioning to Completed state
 */
const handleCompletedJob = (event: GcsJobFinalizedEvent) =>
  Effect.gen(function*() {
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: event.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Completed",
      occurredAt: event.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCompleted",
      jobId: event.jobId,
      status: "Completed",
      eventId: event.eventId,
      processed: true,
      stored: true,
      message: "Job completed successfully"
    })
  })

/**
 * Handle a job transitioning to Failed state
 */
const handleFailedJob = (event: GcsJobFinalizedEvent) =>
  Effect.gen(function*() {
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: event.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Failed",
      occurredAt: event.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobFailed",
      jobId: event.jobId,
      status: "Failed",
      eventId: event.eventId,
      processed: true,
      stored: true,
      message: "Job failed during processing"
    })
  })

/**
 * Handle a job transitioning to Cancelled state
 */
const handleCancelledJob = (event: GcsJobFinalizedEvent) =>
  Effect.gen(function*() {
    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: event.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Cancelled",
      occurredAt: event.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCancelled",
      jobId: event.jobId,
      status: "Cancelled",
      eventId: event.eventId,
      processed: true,
      stored: true,
      message: "Job was cancelled"
    })
  })

/**
 * Process a GCS CloudEvent notification from Eventarc.
 * Routes to appropriate handler based on job status union type.
 */
const handleNotification = (cloudEvent: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    // Parse the CloudEvent into a job-specific event
    const event = yield* Schema.decodeUnknown(GcsJobFinalizedEvent)(cloudEvent)

    // Use Match for the job status union type
    return yield* Match.value(event.status).pipe(
      Match.when("Queued", () => handleQueuedJob(event)),
      Match.when("Processing", () => handleProcessingJob(event)),
      Match.when("Completed", () => handleCompletedJob(event)),
      Match.when("Failed", () => handleFailedJob(event)),
      Match.when("Cancelled", () => handleCancelledJob(event)),
      Match.when("MetadataReady", () =>
        Effect.fail(
          new HttpApiError.InternalServerError().pipe(
            Effect.tap(() => Effect.logError("MetadataReady state is internal only"))
          )
        )),
      Match.exhaustive
    )
  })

/**
 * Internal routes handler for Eventarc notifications.
 * Receives GCS CloudEvents and processes all job state transitions.
 */
export const internalRoutes = HttpApiBuilder.group(
  pureDialogApi,
  "internal",
  (handlers) =>
    handlers.handle("notifications", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo("Received Eventarc notification", {
          eventId: payload.id,
          eventType: payload.type,
          subject: payload.subject
        })

        const result = yield* handleNotification(payload)

        // Map event processing result to unified API response
        return Schema.encodeUnknownSync(InternalNotificationResponse)({
          received: true,
          processed: result.processed,
          reason: result.message
        })
      }).pipe(
        Effect.catchAll((error) =>
          Effect.gen(function*() {
            yield* Effect.logError("Failed to process Eventarc notification", error)
            return Schema.encodeUnknownSync(InternalNotificationResponse)({
              received: true,
              processed: false,
              reason: "Unexpected error"
            })
          })
        )
      ))
).pipe(
  Layer.provide(
    Layer.mergeAll(IngestionLayer.CloudStorageLayer, Config.CloudStorageConfigLayer, KeyValueStore.layerMemory)
  )
)
