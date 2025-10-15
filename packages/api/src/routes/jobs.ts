import { HttpApiBuilder, HttpApiError } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { JobStore } from "@puredialog/storage"
import type { RepositoryError } from "@puredialog/storage"
import { Effect, Schema } from "effect"
import { pureDialogApi } from "../http/api.js"
import { CreateJobRequest, JobAccepted } from "../http/schemas.js"
import { createTranscriptionJob } from "../services/job-creation.js"

const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const store = yield* JobStore

    const request = yield* Schema.decodeUnknown(CreateJobRequest)(payload)

    const job = yield* createTranscriptionJob(request)

    const persisted = yield* store.createJob(job)

    yield* Effect.logInfo("Job persisted to queued state", {
      jobId: persisted.id
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
