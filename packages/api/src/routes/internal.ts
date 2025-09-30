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
  event: CloudEvents.Gcs.GcsObjectFinalizedEvent,
  domainEvent: Jobs.JobStatusChanged
) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig
    const kv = yield* KeyValueStore.KeyValueStore

    const jobEvent = GcsJobFinalizedEvent(event)

    // Store in GCS for immutable event log
    const eventPath = Index.event(jobEvent.jobId, jobEvent.eventId)

    yield* storage.putObject(config.bucket, eventPath, domainEvent)

    // Store in KV for quick access (key: jobId, value: latest event)
    const kvStore = kv.forSchema(Jobs.JobStatusChanged)
    yield* kvStore.set(jobEvent.jobId, domainEvent)

    yield* Effect.logInfo("Stored job event", {
      jobId: jobEvent.jobId,
      status: jobEvent.status,
      eventId: jobEvent.eventId,
      gcsPath: eventPath,
      kvKey: jobEvent.jobId
    })
  })

/**
 * Handle a job transitioning to Queued state
 */
const handleQueuedJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobEvent.jobId,
      requestId: "external-notification" as any,
      from: "Queued",
      to: "Queued",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobQueued",
      jobId: jobEvent.jobId,
      status: "Queued",
      eventId: jobEvent.eventId,
      processed: true,
      stored: true,
      message: "Job queued for processing"
    })
  })

/**
 * Handle a job transitioning to Processing state
 */
const handleProcessingJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobEvent.jobId,
      requestId: "external-notification" as any,
      from: "Queued",
      to: "Processing",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobProcessing",
      jobId: jobEvent.jobId,
      status: "Processing",
      eventId: jobEvent.eventId,
      processed: true,
      stored: true,
      message: "Job started processing"
    })
  })

/**
 * Handle a job transitioning to Completed state
 */
const handleCompletedJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobEvent.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Completed",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCompleted",
      jobId: jobEvent.jobId,
      status: "Completed",
      eventId: jobEvent.eventId,
      processed: true,
      stored: true,
      message: "Job completed successfully"
    })
  })

/**
 * Handle a job transitioning to Failed state
 */
const handleFailedJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobEvent.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Failed",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobFailed",
      jobId: jobEvent.jobId,
      status: "Failed",
      eventId: jobEvent.eventId,
      processed: true,
      stored: true,
      message: "Job failed during processing"
    })
  })

/**
 * Handle a job transitioning to Cancelled state
 */
const handleCancelledJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: jobEvent.jobId,
      requestId: "external-notification" as any,
      from: "Processing",
      to: "Cancelled",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(event, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCancelled",
      jobId: jobEvent.jobId,
      status: "Cancelled",
      eventId: jobEvent.eventId,
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
    const event = GcsJobFinalizedEvent(cloudEvent)
    yield* Effect.logInfo("Decoded job event", {
      jobId: event.jobId,
      status: event.status,
      eventId: event.eventId
    })

    // Use Match for the job status union type
    return yield* Match.value(event.status).pipe(
      Match.when("Queued", () => handleQueuedJob(cloudEvent)),
      Match.when("Processing", () => handleProcessingJob(cloudEvent)),
      Match.when("Completed", () => handleCompletedJob(cloudEvent)),
      Match.when("Failed", () => handleFailedJob(cloudEvent)),
      Match.when("Cancelled", () => handleCancelledJob(cloudEvent)),
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
