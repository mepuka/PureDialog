import type { HttpServerResponse } from "@effect/platform"
import { HttpApiBuilder } from "@effect/platform"
import type { Jobs } from "@puredialog/domain"
import { JobStore, type RepositoryError } from "@puredialog/storage"
import { Effect, Option } from "effect"
import { JobConflictError } from "../errors.js"
import { type CreateJobRequest, JobAccepted } from "../schemas.js"
import { createTranscriptionJob } from "../utils/job-creation.js"
import { PureDialogApi } from "./api.js"

/**
 * Handler implementation for the 'jobs' group.
 */

const createJobHandler = (
  payload: CreateJobRequest
) =>
  Effect.gen(function*() {
    const store = yield* JobStore

    // 1. Create the job entity from the request payload using the schema transform.
    const job = yield* createTranscriptionJob(payload)

    // 2. Check for an existing job using the idempotency key from the created job.
    if (job.idempotencyKey) {
      const existingJob = yield* store.findJobByIdempotencyKey(
        job.idempotencyKey
      )

      if (Option.isSome(existingJob)) {
        yield* Effect.logInfo(
          `Job already exists for idempotency key, returning conflict.`
        )
        // Fail with a typed error. The HttpApi layer will map this to a 409 response.
        return yield* JobConflictError.make({
          idempotencyKey: job.idempotencyKey,
          message: "A job with this idempotency key already exists.",
          cause: undefined
        })
      }
    }

    // 3. Persist the new job to jobs/Queued/ - this triggers the workflow via Eventarc
    const persistedJob = yield* store.createJob(job)

    yield* Effect.logInfo("Job created and placed in Queued state - workflow will start automatically", {
      jobId: persistedJob.id,
      status: persistedJob.status
    })

    return JobAccepted.make(persistedJob)
  })

const jobsApiLayer = HttpApiBuilder.group(
  PureDialogApi,
  "jobs",
  (handlers) => handlers.handle("createJob", (request) => createJobHandler(request.payload))
)

export { jobsApiLayer }
