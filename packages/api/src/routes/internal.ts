import { HttpApiBuilder } from "@effect/platform"
import type { CloudEvents } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { GcsJobFinalizedEvent, Index } from "@puredialog/storage"
import { Effect, Layer, Match, Option, Schema } from "effect"
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
  jobEvent: ReturnType<typeof GcsJobFinalizedEvent>,
  domainEvent: Jobs.JobStatusChanged
) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig

    const eventPath = Index.event(jobEvent.jobId, jobEvent.eventId)

    yield* storage.putObject(config.bucket, eventPath, domainEvent)

    yield* Effect.logInfo("Stored job event", {
      jobId: jobEvent.jobId,
      status: jobEvent.status,
      eventId: jobEvent.eventId,
      gcsPath: eventPath
    })
  })

/**
 * Handle a job transitioning to Completed state
 */
const handleCompletedJob = (event: CloudEvents.Gcs.GcsObjectFinalizedEvent) =>
  Effect.gen(function*() {
    const jobEvent = GcsJobFinalizedEvent(event)

    const jobSnapshot = yield* loadJobSnapshot(jobEvent)

    if (Option.isNone(jobSnapshot)) {
      yield* Effect.logError("Completed job snapshot missing", {
        jobId: jobEvent.jobId,
        status: jobEvent.status
      })

      return EventProcessingResult.make({
        eventType: "JobCompleted",
        jobId: jobEvent.jobId,
        status: "Completed",
        eventId: jobEvent.eventId,
        processed: false,
        stored: false,
        message: "Completed job not found in storage"
      })
    }

    const job = jobSnapshot.value

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: job.id,
      requestId: job.requestId,
      from: "Processing",
      to: "Completed",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(jobEvent, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCompleted",
      jobId: job.id,
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

    const jobSnapshot = yield* loadJobSnapshot(jobEvent)

    if (Option.isNone(jobSnapshot)) {
      yield* Effect.logError("Failed job snapshot missing", {
        jobId: jobEvent.jobId,
        status: jobEvent.status
      })

      return EventProcessingResult.make({
        eventType: "JobFailed",
        jobId: jobEvent.jobId,
        status: "Failed",
        eventId: jobEvent.eventId,
        processed: false,
        stored: false,
        message: "Failed job not found in storage"
      })
    }

    const job = jobSnapshot.value

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: job.id,
      requestId: job.requestId,
      from: "Processing",
      to: "Failed",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(jobEvent, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobFailed",
      jobId: job.id,
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

    const jobSnapshot = yield* loadJobSnapshot(jobEvent)

    if (Option.isNone(jobSnapshot)) {
      yield* Effect.logError("Cancelled job snapshot missing", {
        jobId: jobEvent.jobId,
        status: jobEvent.status
      })

      return EventProcessingResult.make({
        eventType: "JobCancelled",
        jobId: jobEvent.jobId,
        status: "Cancelled",
        eventId: jobEvent.eventId,
        processed: false,
        stored: false,
        message: "Cancelled job not found in storage"
      })
    }

    const job = jobSnapshot.value

    const domainEvent = Jobs.JobStatusChanged.make({
      jobId: job.id,
      requestId: job.requestId,
      from: "Processing",
      to: "Cancelled",
      occurredAt: jobEvent.eventTime
    })

    yield* storeJobEvent(jobEvent, domainEvent)

    return EventProcessingResult.make({
      eventType: "JobCancelled",
      jobId: job.id,
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
      Match.when("Completed", () => handleCompletedJob(cloudEvent)),
      Match.when("Failed", () => handleFailedJob(cloudEvent)),
      Match.when("Cancelled", () => handleCancelledJob(cloudEvent)),
      Match.orElse(() =>
        Effect.logInfo("Skipping notification for non-terminal state", {
          status: event.status
        }).pipe(Effect.as(EventProcessingResult.make({
          eventType: `Job${event.status}`,
          jobId: event.jobId,
          status: event.status,
          eventId: event.eventId,
          processed: false,
          stored: false,
          message: "Skipped non-terminal state"
        })))
      )
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
    Layer.mergeAll(IngestionLayer.CloudStorageLayer, Config.CloudStorageConfigLayer)
  )
)
const jobSchemaForStatus = (status: Jobs.JobStatus) => {
  switch (status) {
    case "Queued":
      return Jobs.QueuedJob
    case "MetadataReady":
      return Jobs.MetadataReadyJob
    case "Processing":
      return Jobs.ProcessingJob
    case "Completed":
      return Jobs.CompletedJob
    case "Failed":
      return Jobs.FailedJob
    case "Cancelled":
      return Jobs.CancelledJob
  }
}

const loadJobSnapshot = (
  jobEvent: ReturnType<typeof GcsJobFinalizedEvent>
) =>
  Effect.gen(function*() {
    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig
    const schema = jobSchemaForStatus(jobEvent.status)

    if (!schema) {
      return Option.none()
    }

    const jobPath = Index.jobPath(jobEvent.status, jobEvent.jobId)
    return yield* storage.getObject(config.bucket, jobPath, schema)
  })
