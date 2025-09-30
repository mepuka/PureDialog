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
    job: Jobs.QueuedJob
  ) => Effect.Effect<Jobs.QueuedJob, RepositoryError>
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
    createJob: (job: Jobs.QueuedJob) =>
      Effect.gen(function*() {
        if (job.idempotencyKey) {
          const existingJobId = idempotencyMap.get(job.idempotencyKey)
          if (existingJobId) {
            const existingJob = jobs.get(existingJobId)
            if (existingJob && existingJob._tag === "QueuedJob") {
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

        // Use type-safe transitions for status updates
        let updatedJob: Jobs.TranscriptionJob

        if (status === "Failed") {
          if (!Jobs.isActiveJob(existingJob)) {
            return yield* Effect.fail(
              new RepositoryError({
                message: `Cannot transition terminal job to Failed: ${jobId}`,
                operation: "updateStatus",
                cause: new Error(`Job is already in terminal state: ${existingJob._tag}`)
              })
            )
          }
          updatedJob = Jobs.JobTransitions.fail(existingJob, error || "Unknown error")
        } else if (status === "Cancelled") {
          if (!Jobs.isActiveJob(existingJob)) {
            return yield* Effect.fail(
              new RepositoryError({
                message: `Cannot transition terminal job to Cancelled: ${jobId}`,
                operation: "updateStatus",
                cause: new Error(`Job is already in terminal state: ${existingJob._tag}`)
              })
            )
          }
          updatedJob = Jobs.JobTransitions.cancel(existingJob, error || "Cancelled")
        } else if (status === "Completed") {
          // Completed requires specific transition from ProcessingJob
          if (existingJob._tag !== "ProcessingJob") {
            return yield* Effect.fail(
              new RepositoryError({
                message: `Cannot complete job that is not processing: ${jobId}`,
                operation: "updateStatus",
                cause: new Error(`Current state: ${existingJob._tag}`)
              })
            )
          }
          if (!transcriptId) {
            return yield* Effect.fail(
              new RepositoryError({
                message: `Cannot complete job without transcriptId: ${jobId}`,
                operation: "updateStatus"
              })
            )
          }
          updatedJob = Jobs.JobTransitions.complete(existingJob, transcriptId)
        } else {
          // For other statuses, preserve existing behavior
          return yield* Effect.fail(
            new RepositoryError({
              message: `Unsupported status transition: ${status}`,
              operation: "updateStatus",
              cause: new Error(`Current state: ${existingJob._tag}`)
            })
          )
        }

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

    return {
      createJob: (job: Jobs.QueuedJob) => repository.createJob(job),

      findJobByIdempotencyKey: (key) => repository.findJobByIdempotencyKey(key),

      updateJobStatus: (jobId, status, error, transcriptId) =>
        repository.updateJobStatus(jobId, status, error, transcriptId),

      findJobById: (jobId) => repository.findJobById(jobId)
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
