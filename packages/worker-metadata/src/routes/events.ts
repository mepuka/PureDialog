import { HttpApiBuilder } from "@effect/platform"
import { CloudEvents, Core, Jobs, Workers } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { Index, JobPathParser } from "@puredialog/storage"
import { Effect, Option, Schema } from "effect"
import { MetadataWorkerApi } from "../http/api.js"
import { enrichQueuedJob, UnsupportedMediaTypeError } from "../services/enrichment.js"
import { YoutubeApiError } from "../services/youtube.js"

const toWorkerResponse = (
  jobId: Core.JobId,
  status: Workers.Http.WorkerProcessingResponse["status"],
  message: string,
  processingTimeMs?: number
) => {
  const base = { status, jobId, message }

  return Workers.Http.WorkerProcessingResponse.make(
    processingTimeMs !== undefined ? { ...base, processingTimeMs } : base
  )
}

const toWorkerError = (
  jobId: Core.JobId | undefined,
  error: string,
  retryable: boolean,
  details?: unknown
) => {
  const base: {
    status: "error"
    error: string
    retryable: boolean
    jobId?: Core.JobId
    details?: unknown
  } = {
    status: "error",
    error,
    retryable
  }

  if (jobId) {
    base.jobId = jobId
  }

  if (details !== undefined) {
    base.details = details
  }

  return Workers.Http.WorkerErrorResponse.make(base)
}

const processEvent = (event: Workers.Http.WorkerCloudEventRequest) =>
  Effect.gen(function*() {
    const start = Date.now()
    const objectMetadata = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(CloudEvents.Gcs.GcsObjectMetadata)(event.data),
      catch: (cause) => cause as Error
    })

    const path = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(JobPathParser)(objectMetadata.name),
      catch: (cause) => cause as Error
    })

    const [, , status, , rawJobId] = path
    const jobId = Schema.decodeUnknownSync(Core.JobId)(rawJobId)

    if (status !== "Queued") {
      return toWorkerResponse(jobId, "skipped", `Job already in ${status} state`)
    }

    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig

    const queuedPath = Index.jobPath("Queued", jobId)
    const maybeJob = yield* storage.getObject(config.bucket, queuedPath, Jobs.QueuedJob)

    if (Option.isNone(maybeJob)) {
      return toWorkerResponse(jobId, "skipped", "Queued job no longer available")
    }

    const processingJob = yield* enrichQueuedJob(maybeJob.value)

    const processingPath = Index.jobPath("Processing", processingJob.id)
    yield* storage.putObject(config.bucket, processingPath, processingJob)
    yield* storage.deleteObject(config.bucket, queuedPath).pipe(
      Effect.catchAll(() => Effect.void)
    )

    const eventId = `${Date.now()}_processing`
    const statusChanged = Jobs.JobStatusChanged.make({
      jobId: processingJob.id,
      requestId: processingJob.requestId,
      from: "Queued",
      to: "Processing",
      occurredAt: new Date()
    })
    yield* storage.putObject(config.bucket, Index.event(processingJob.id, eventId), statusChanged)

    const elapsed = Date.now() - start
    return toWorkerResponse(
      processingJob.id,
      "processed",
      "Job promoted to processing",
      elapsed
    )
  }).pipe(
    Effect.catchAll((error) => {
      if (error instanceof UnsupportedMediaTypeError) {
        return Effect.succeed(
          toWorkerError(undefined, `Unsupported media type: ${error.mediaType}`, false, error)
        )
      }

      if (error instanceof YoutubeApiError) {
        return Effect.succeed(
          toWorkerError(undefined, error.message, true, error.cause)
        )
      }

      return Effect.succeed(
        toWorkerError(undefined, error instanceof Error ? error.message : "Unknown error", true)
      )
    })
  )

export const eventRoutes = HttpApiBuilder.group(
  MetadataWorkerApi,
  "events",
  (handlers) => handlers.handle("ingest", ({ payload }) => processEvent(payload))
)
