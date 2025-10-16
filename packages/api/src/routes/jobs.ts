import { HttpApiBuilder, HttpApiError } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import type { Media } from "@puredialog/domain"
import { YouTube } from "@puredialog/domain"
import { JobStore } from "@puredialog/storage"
import type { RepositoryError } from "@puredialog/storage"
import { Effect, Schema } from "effect"
import { pureDialogApi } from "../http/api.js"
import { CreateJobRequest, JobAccepted } from "../http/schemas.js"
import { createTranscriptionJob } from "../services/job-creation.js"

const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const store = yield* JobStore
    const youtubeClient = yield* YouTube.YouTubeClient

    const request = yield* Schema.decodeUnknown(CreateJobRequest)(payload)

    // Fetch YouTube video metadata from URL
    const video = yield* youtubeClient.fetchVideoByUrl(request.youtubeUrl).pipe(
      Effect.mapError((error) => {
        if (error._tag === "YouTubeVideoNotFoundError") {
          return new HttpApiError.BadRequest()
        }
        return new HttpApiError.InternalServerError()
      })
    )

    // Create MediaResource from fetched video data
    const media: Media.MediaResource = {
      type: "youtube",
      data: video
    }

    // Create job with the media resource
    const job = yield* createTranscriptionJob({
      media,
      idempotencyKey: request.idempotencyKey ?? undefined,
      transcriptionContext: request.transcriptionContext ?? undefined
    })

    const persisted = yield* store.createJob(job)

    yield* Effect.logInfo("Job persisted to queued state", {
      jobId: persisted.id,
      videoId: video.id,
      videoTitle: video.title
    })

    return JobAccepted.make({
      jobId: persisted.id,
      requestId: persisted.requestId
    })
  }).pipe(
    Effect.catchTag("ParseError", (err) =>
      HttpApiDecodeError.make({
        message: err.message,
        issues: []
      })),
    Effect.catchTag("RepositoryError", (error: RepositoryError) =>
      Effect.logError("Failed to persist job", {
        error: error.message,
        operation: error.operation
      }).pipe(
        Effect.zipRight(new HttpApiError.InternalServerError())
      ))
  )

export const jobRoutes = HttpApiBuilder.group(
  pureDialogApi,
  "jobs",
  (handlers) => handlers.handle("createJob", ({ payload }) => createJobHandler(payload))
)
