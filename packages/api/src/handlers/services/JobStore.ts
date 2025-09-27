import type { JobId, JobStatus } from "@puredialog/domain"
import { TranscriptionJob } from "@puredialog/domain"
import { Context, Effect, Layer, Option } from "effect"
import { DatabaseError } from "../../errors.js"

/**
 * Service interface for persistence operations on ProcessingJob entities.
 */
interface ProcessingJobStore {
  readonly createJob: (job: TranscriptionJob) => Effect.Effect<TranscriptionJob, DatabaseError>
  readonly findJobByIdempotencyKey: (key: string) => Effect.Effect<Option.Option<TranscriptionJob>, DatabaseError>
  readonly updateJobStatus: (
    jobId: JobId,
    status: JobStatus,
    error?: string
  ) => Effect.Effect<TranscriptionJob, DatabaseError>
  readonly findJobById: (jobId: JobId) => Effect.Effect<Option.Option<TranscriptionJob>, DatabaseError>
}

/**
 * Service tag for ProcessingJobStore.
 */
const ProcessingJobStore = Context.GenericTag<ProcessingJobStore>("@puredialog/api/ProcessingJobStore")

/**
 * Mock implementation using in-memory Map for development and testing.
 */
const ProcessingJobStoreMock: Layer.Layer<ProcessingJobStore> = Layer.sync(ProcessingJobStore, () => {
  // In-memory storage for jobs
  const jobs = new Map<string, TranscriptionJob>()

  return {
    createJob: (job) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Creating job with idempotency key: ${job.id}`)

        // Store job by its string representation for lookup
        jobs.set(job.id, job)

        yield* Effect.logInfo(`Job created successfully: ${job.id}`)
        return job
      }),

    findJobByIdempotencyKey: (key) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by idempotency key: ${key}`)

        const job = jobs.get(key)
        const result = job ? Option.some(job) : Option.none()

        yield* Effect.logInfo(`Job lookup result: ${result._tag}`)
        return result
      }),

    updateJobStatus: (jobId, status, error) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Updating job status: ${jobId} -> ${status}`)

        const existingJob = jobs.get(jobId)

        if (!existingJob) {
          return yield* Effect.fail(
            new DatabaseError({
              message: `Job not found: ${jobId}`,
              cause: { jobId, status }
            })
          )
        }

        // Create updated job with new status and timestamp
        const updatedJob = new TranscriptionJob({
          ...existingJob,
          status,
          error: error || existingJob.error,
          updatedAt: new Date()
        })

        jobs.set(jobId, updatedJob)

        yield* Effect.logInfo(`Job status updated successfully: ${jobId}`)
        return updatedJob
      }),

    findJobById: (jobId) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by ID: ${jobId}`)

        const job = jobs.get(jobId)
        const result = job ? Option.some(job) : Option.none()

        yield* Effect.logInfo(`Job lookup result: ${result._tag}`)
        return result
      })
  }
})

export { ProcessingJobStore, ProcessingJobStoreMock }
