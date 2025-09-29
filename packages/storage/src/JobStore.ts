import type { Core } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { Config, Layer } from "@puredialog/ingestion"
import { Context, Effect, Layer as EffectLayer, Option } from "effect"
import { JobRepository, JobRepositoryLayer, RepositoryError } from "./JobRepository.js"

/**
 * Job store interface for managing transcription jobs
 */
export interface JobStoreInterface {
  readonly createJob: (
    job: Jobs.TranscriptionJob
  ) => Effect.Effect<Jobs.TranscriptionJob, RepositoryError>
  readonly findJobById: (
    jobId: Core.JobId
  ) => Effect.Effect<Option.Option<Jobs.TranscriptionJob>, RepositoryError>
  readonly findJobByIdempotencyKey: (
    key: string
  ) => Effect.Effect<Option.Option<Jobs.TranscriptionJob>, RepositoryError>
  readonly updateJobStatus: (
    jobId: Core.JobId,
    status: Jobs.JobStatus,
    error?: string,
    transcriptId?: Core.TranscriptId
  ) => Effect.Effect<Jobs.TranscriptionJob, RepositoryError>
}

/**
 * Service tag for JobStore
 */
export class JobStore extends Context.Tag("JobStore")<
  JobStore,
  JobStoreInterface
>() {}

/**
 * Mock implementation for testing
 */
export const JobStoreMock = EffectLayer.sync(JobStore, () => {
  const jobs = new Map<Core.JobId, Jobs.TranscriptionJob>()
  const idempotencyMap = new Map<string, Core.JobId>()

  return {
    createJob: (job: Jobs.TranscriptionJob) =>
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

        const updatedJob = Jobs.TranscriptionJob.make({
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
const JobStoreLayer = EffectLayer.effect(
  JobStore,
  Effect.gen(function*() {
    const repository = yield* JobRepository

    const mapError = (error: RepositoryError) =>
      new RepositoryError({ message: error.message, operation: error.operation })

    return {
      createJob: (job: Jobs.TranscriptionJob) => repository.createJob(job).pipe(Effect.mapError(mapError)),

      findJobByIdempotencyKey: (key) => repository.findJobByIdempotencyKey(key).pipe(Effect.mapError(mapError)),

      updateJobStatus: (jobId, status, error, transcriptId) =>
        repository
          .updateJobStatus(jobId, status, error, transcriptId)
          .pipe(Effect.mapError(mapError)),

      findJobById: (jobId) => repository.findJobById(jobId).pipe(Effect.mapError(mapError))
    } as JobStoreInterface
  })
)

/**
 * Complete live layer that includes all dependencies
 */
const deps = JobRepositoryLayer.pipe(
  EffectLayer.provide(Config.CloudStorageConfigLayer),
  EffectLayer.provideMerge(Layer.CloudStorageLayer)
)

export const JobStoreLayerLive = JobStoreLayer.pipe(EffectLayer.provide(deps))
