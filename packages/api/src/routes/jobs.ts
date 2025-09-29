import { HttpApiBuilder } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { JobStore } from "@puredialog/storage"
import { Effect, Option, Schema } from "effect"
import { JobConflictError } from "../errors.js"
import { pureDialogApi } from "../http/api.js"
import { CreateJobRequest, JobAccepted } from "../http/schemas.js"
import { createTranscriptionJob } from "../services/job-creation.js"

const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const store = yield* JobStore

    const request = yield* Schema.decodeUnknown(CreateJobRequest)(payload)

    const job = yield* createTranscriptionJob(request)

    if (job.idempotencyKey) {
      const existing = yield* store.findJobByIdempotencyKey(job.idempotencyKey)

      if (Option.isSome(existing)) {
        yield* Effect.logInfo("Idempotent collision detected", {
          idempotencyKey: job.idempotencyKey
        })

        return yield* JobConflictError.make({
          idempotencyKey: job.idempotencyKey,
          message: "A job with this idempotency key already exists.",
          cause: undefined
        })
      }
    }

    const persisted = yield* store.createJob(job)

    yield* Effect.logInfo("Job persisted to queued state", {
      jobId: persisted.id,
      status: persisted.status
    })

    return JobAccepted.make({
      jobId: persisted.id,
      requestId: persisted.requestId
    })
  }).pipe(Effect.catchTag("ParseError", (err) =>
    HttpApiDecodeError.make({
      message: err.message,
      issues: []
    })))

export const jobRoutes = HttpApiBuilder.group(
  pureDialogApi,
  "jobs",
  (handlers) => handlers.handle("createJob", ({ payload }) => createJobHandler(payload).pipe(Effect.orDie))
)
