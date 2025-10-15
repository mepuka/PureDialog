import { HttpApiBuilder } from "@effect/platform"
import { CloudEvents, Core, Jobs, Workers } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { Index, JobPathParser } from "@puredialog/storage"
import { Effect, Option, Schema } from "effect"
import { TranscriptionWorkerApi } from "../http/api.js"
import { generateTranscript, TranscriptGenerationError, UnsupportedMediaTypeError } from "../services/transcribe.js"

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
    const metadata = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(CloudEvents.Gcs.GcsObjectMetadata)(event.data),
      catch: (cause) => cause as Error
    })

    const path = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(JobPathParser)(metadata.name),
      catch: (cause) => cause as Error
    })

    const [, , status, , rawJobId] = path
    const jobId = Schema.decodeUnknownSync(Core.JobId)(rawJobId)

    if (status !== "Processing") {
      return toWorkerResponse(jobId, "skipped", `Job in ${status} state cannot be completed`)
    }

    const storage = yield* IngestionLayer.CloudStorageService
    const config = yield* Config.CloudStorageConfig

    const processingPath = Index.jobPath("Processing", jobId)
    const maybeJob = yield* storage.getObject(config.bucket, processingPath, Jobs.ProcessingJob)

    if (Option.isNone(maybeJob)) {
      return toWorkerResponse(jobId, "skipped", "Processing job no longer available")
    }

    const { completedJob, transcript } = yield* generateTranscript(maybeJob.value)

    const completedPath = Index.jobPath("Completed", completedJob.id)
    yield* storage.putObject(config.bucket, completedPath, completedJob)
    yield* storage.deleteObject(config.bucket, processingPath).pipe(
      Effect.catchAll(() => Effect.void)
    )

    const transcriptPath = Index.transcript(transcript.id)
    yield* storage.putObject(config.bucket, transcriptPath, transcript)

    const statusEventId = `${Date.now()}_completed`
    const statusChanged = Jobs.JobStatusChanged.make({
      jobId: completedJob.id,
      requestId: completedJob.requestId,
      from: "Processing",
      to: "Completed",
      occurredAt: new Date()
    })
    yield* storage.putObject(config.bucket, Index.event(completedJob.id, statusEventId), statusChanged)

    const transcriptEventId = `${Date.now()}_transcript`
    const transcriptComplete = Jobs.TranscriptComplete.make({
      jobId: completedJob.id,
      requestId: completedJob.requestId,
      transcript,
      occurredAt: new Date()
    })
    yield* storage.putObject(config.bucket, Index.event(completedJob.id, transcriptEventId), transcriptComplete)

    const elapsed = Date.now() - start

    return toWorkerResponse(
      completedJob.id,
      "processed",
      "Job completed with transcript",
      elapsed
    )
  }).pipe(
    Effect.catchAll((error) => {
      if (error instanceof UnsupportedMediaTypeError) {
        return Effect.succeed(
          toWorkerError(undefined, `Unsupported media type: ${error.mediaType}`, false, error)
        )
      }

      if (error instanceof TranscriptGenerationError) {
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
  TranscriptionWorkerApi,
  "events",
  (handlers) => handlers.handle("ingest", ({ payload }) => processEvent(payload))
)
