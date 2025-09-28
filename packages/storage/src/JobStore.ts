import type { JobId, JobStatus, TranscriptId } from "@puredialog/domain"
import { TranscriptionJob } from "@puredialog/domain"
import { CloudStorageConfigLive, CloudStorageServiceLive } from "@puredialog/ingestion"
import { Context, Effect, Layer, Option } from "effect"
import { JobRepository, JobRepositoryLayer, RepositoryError } from "./JobRepository.js"

/**
 * Job store interface for managing transcription jobs
 */
export interface ProcessingJobStoreInterface {
  readonly createJob: (
    job: TranscriptionJob
  ) => Effect.Effect<TranscriptionJob, RepositoryError>
  readonly findJobById: (
    jobId: JobId
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>
  readonly findJobByIdempotencyKey: (
    key: string
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>
  readonly updateJobStatus: (
    jobId: JobId,
    status: JobStatus,
    error?: string,
    transcriptId?: TranscriptId
  ) => Effect.Effect<TranscriptionJob, RepositoryError>
}

/**
 * Service tag for ProcessingJobStore
 */
export class JobStore extends Context.Tag("JobStore")<
  JobStore,
  ProcessingJobStoreInterface
>() {}

/**
 * Mock implementation for testing
 */
export const JobStoreMock = Layer.sync(JobStore, () => {
  const jobs = new Map<JobId, TranscriptionJob>()
  const idempotencyMap = new Map<string, JobId>()

  return {
    createJob: (job: TranscriptionJob) =>
      Effect.gen(function*() {
        if (job.idempotencyKey) {
          const existingJobId = idempotencyMap.get(job.idempotencyKey)
          if (existingJobId) {
            const existingJob = jobs.get(existingJobId)
            if (existingJob) {
              yield* Effect.logInfo(`Returning existing job: ${existingJob.id}`)
              return existingJob
            }
          }
        }

        yield* Effect.logInfo(`Creating job: ${job.id}`)

        jobs.set(job.id, job)
        if (job.idempotencyKey) {
          idempotencyMap.set(job.idempotencyKey, job.id)
        }

        return job
      }),

    findJobById: (jobId) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by ID: ${jobId}`)
        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    findJobByIdempotencyKey: (keyString: string) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Finding job by idempotency key: ${keyString}`)
        const jobId = idempotencyMap.get(keyString)
        if (!jobId) {
          return Option.none()
        }
        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    updateJobStatus: (jobId, status, error, transcriptId) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Updating job status: ${jobId} -> ${status}`)

        const existingJob = jobs.get(jobId)

        if (!existingJob) {
          return yield* Effect.fail(
            new RepositoryError({
              message: `Job not found: ${jobId}`,
              operation: "updateStatus"
            })
          )
        }

        const updatedJob = new TranscriptionJob({
          ...existingJob,
          status,
          error,
          transcriptId: transcriptId || existingJob.transcriptId,
          updatedAt: new Date()
        })

        jobs.set(jobId, updatedJob)

        yield* Effect.logInfo(`Job status updated: ${jobId} -> ${status}`)
        return updatedJob
      })
  }
})

/**
 * Live implementation using JobRepository
 */
const ProcessingJobStoreLayer = Layer.effect(
  JobStore,
  Effect.gen(function*() {
    const repository = yield* JobRepository

    const mapError = (error: RepositoryError) =>
      new RepositoryError({ message: error.message, operation: error.operation })

    return {
      createJob: (job: TranscriptionJob) => repository.save(job).pipe(Effect.mapError(mapError)),

      findJobByIdempotencyKey: (key) => repository.findByIdempotencyKey(key).pipe(Effect.mapError(mapError)),

      updateJobStatus: (jobId, status, error, transcriptId) =>
        repository
          .updateStatus(jobId, status, error, transcriptId)
          .pipe(Effect.mapError(mapError)),

      findJobById: (jobId) => repository.findById(jobId).pipe(Effect.mapError(mapError))
    }
  })
)

/**
 * Complete live layer that includes all dependencies
 */

const deps = JobRepositoryLayer.pipe(Layer.provide(CloudStorageConfigLive), Layer.provide(CloudStorageServiceLive))

export const StoreLayer = ProcessingJobStoreLayer.pipe(Layer.provide(deps))
