import { HttpApiBuilder } from "@effect/platform"
import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import type { PubSubError } from "@puredialog/ingestion"
import { PubSubClient, PubSubClientLive } from "@puredialog/ingestion"
import { Effect, Layer, Option } from "effect"
import { PureDialogApi } from "../api.js"
import type { RepositoryError } from "../errors.js"
import { JobConflictError } from "../errors.js"
import type { CreateJobRequest } from "../schemas.js"
import { JobStore } from "../services/JobStore.js"
import { createTranscriptionJob } from "../utils/job-creation.js"

/**
 * Handler implementation for the 'jobs' group.
 */

const createJobHandler = (payload: CreateJobRequest) =>
  Effect.gen(function*() {
    const store = yield* JobStore
    const pubsub = yield* PubSubClient
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

    // 3. Persist the new job.
    const persistedJob = yield* store.createJob(job) // 4. Publish the job to the ingestion queue.

    yield* pubsub
      .publishWorkMessage(persistedJob)

    return persistedJob
  }).pipe(
    Effect.catchTags({
      RepositoryError: (error: RepositoryError) =>
        Effect.fail(
          new HttpApiDecodeError({
            message: error.message,
            issues: []
          })
        ),
      PubSubError: (error: PubSubError) =>
        Effect.fail(
          new HttpApiDecodeError({
            message: error.message,
            issues: []
          })
        ),
      JobConflictError: (error: JobConflictError) =>
        Effect.fail(
          JobConflictError.make({
            idempotencyKey: error.idempotencyKey,
            message: error.message,
            cause: undefined
          })
        )
    })
  )

const jobsApiLayer = HttpApiBuilder.group(
  PureDialogApi,
  "jobs",
  (handlers) => handlers.handle("createJob", (request) => createJobHandler(request.payload))
).pipe(Layer.provide(PubSubClientLive))

export { jobsApiLayer }
