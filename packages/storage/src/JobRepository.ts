import { Core, Jobs } from "@puredialog/domain"
import { Config, Layer } from "@puredialog/ingestion"
import { Context, Data, Effect, Layer as EffectLayer, Option, Schema } from "effect"
import { Index } from "./indices.js"
import { hashIdempotencyKey, idempotencyKeyFromString } from "./utils/idempotency.js"

// --- REPOSITORY INTERFACE ---
export interface JobRepositoryInterface {
  readonly createJob: (
    job: Jobs.TranscriptionJob
  ) => Effect.Effect<
    Jobs.TranscriptionJob,
    RepositoryError
  >

  readonly findJobById: (
    jobId: Core.JobId
  ) => Effect.Effect<
    Option.Option<Jobs.TranscriptionJob>,
    RepositoryError
  >

  readonly findJobByIdempotencyKey: (
    key: string
  ) => Effect.Effect<
    Option.Option<Jobs.TranscriptionJob>,
    RepositoryError
  >

  readonly updateJobStatus: (
    jobId: Core.JobId,
    newStatus: Jobs.JobStatus,
    error?: string,
    transcriptId?: Core.TranscriptId
  ) => Effect.Effect<
    Jobs.TranscriptionJob,
    RepositoryError
  >
}

// --- SERVICE TAG ---
export class JobRepository extends Context.Tag("JobRepository")<JobRepository, JobRepositoryInterface>() {}

// --- ERROR TYPE ---
export class RepositoryError extends Data.TaggedError("RepositoryError")<{
  readonly message: string
  readonly operation: string
  readonly cause?: unknown
}> {}

// --- LIVE IMPLEMENTATION ---
export const JobRepositoryLayer = EffectLayer.effect(
  JobRepository,
  Effect.gen(function*() {
    const storage = yield* Layer.CloudStorageService
    const config = yield* Config.CloudStorageConfig
    const bucket = config.bucket

    const createJob = (
      job: Jobs.TranscriptionJob
    ): Effect.Effect<
      Jobs.TranscriptionJob,
      RepositoryError
    > =>
      Effect.gen(function*() {
        const path = Index.job(job.status, job.id)
        yield* storage.putObject(bucket, path, job)

        if (job.idempotencyKey) {
          const idempotencyKey = idempotencyKeyFromString(job.idempotencyKey)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)
          yield* storage.putObject(bucket, idempotencyPath, { jobId: job.id })
        }

        // Write JobQueued domain event to event store
        const eventId = `${Date.now()}_job_queued`
        const eventPath = Index.event(job.id, eventId)
        const domainEvent = Jobs.JobQueued.make({
          job,
          occurredAt: new Date()
        })
        yield* storage.putObject(bucket, eventPath, domainEvent)

        yield* Effect.logInfo("Job saved with JobQueued event", {
          jobId: job.id,
          eventPath
        })

        return job
      }).pipe(
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "save",
              message: "Failed to save job",
              cause
            })
        )
      )

    const findJobById = (
      jobId: Core.JobId
    ): Effect.Effect<
      Option.Option<Jobs.TranscriptionJob>,
      RepositoryError
    > => {
      const statuses: Array<Jobs.JobStatus> = ["Queued", "Processing", "Completed", "Failed"]

      const checkStatus = (status: Jobs.JobStatus) =>
        storage
          .getObject(bucket, Index.job(status, jobId), Jobs.TranscriptionJob)
          .pipe(Effect.catchAll(() => Effect.succeed(Option.none())))

      // Check each status prefix until the job is found
      return Effect.forEach(statuses, checkStatus, { concurrency: "unbounded" }).pipe(
        Effect.map((results) => Option.firstSomeOf(results as Iterable<Option.Option<Jobs.TranscriptionJob>>)),
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "findById",
              message: "Failed to find job by ID",
              cause
            })
        )
      )
    }

    const findJobByIdempotencyKey = (
      keyString: string
    ): Effect.Effect<
      Option.Option<Jobs.TranscriptionJob>,
      RepositoryError,
      never
    > =>
      Effect.gen(function*() {
        const idempotencyKey = idempotencyKeyFromString(keyString)
        const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
        const idempotencyPath = Index.idempotency(hashedKey)

        // The idempotency record structure: { jobId: JobId }
        const maybeJobRecord = yield* storage.getObject(
          bucket,
          idempotencyPath,
          Schema.Struct({ jobId: Core.JobId })
        )

        if (Option.isNone(maybeJobRecord)) {
          return Option.none()
        }

        return yield* findJobById(maybeJobRecord.value.jobId)
      }).pipe(
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "findByIdempotencyKey",
              message: "Failed to find job by idempotency key",
              cause
            })
        )
      )

    const updateJobStatus = (
      jobId: Core.JobId,
      newStatus: Jobs.JobStatus,
      error?: string,
      transcriptId?: Core.TranscriptId
    ): Effect.Effect<
      Jobs.TranscriptionJob,
      RepositoryError
    > =>
      Effect.gen(function*() {
        const maybeJob = yield* findJobById(jobId)
        if (Option.isNone(maybeJob)) {
          return yield* Effect.fail(
            new RepositoryError({
              operation: "updateStatus",
              message: `Job not found: ${jobId}`
            })
          )
        }
        const oldJob = maybeJob.value
        const oldPath = Index.job(oldJob.status, jobId)

        const newJob = Jobs.TranscriptionJob.make({
          ...oldJob,
          status: newStatus,
          updatedAt: new Date(),
          ...(error !== undefined && { error }),
          ...(transcriptId !== undefined && { transcriptId })
        })
        const newPath = Index.job(newStatus, jobId)

        // Write-then-delete pattern for atomic status change
        yield* storage.putObject(bucket, newPath, newJob)
        yield* storage.deleteObject(bucket, oldPath).pipe(Effect.catchAll(() => Effect.void))

        // Write JobStatusChanged domain event to event store
        const eventId = `${Date.now()}_status_changed`
        const eventPath = Index.event(jobId, eventId)
        const domainEvent = Jobs.JobStatusChanged.make({
          jobId,
          requestId: newJob.requestId,
          from: oldJob.status,
          to: newStatus,
          occurredAt: new Date()
        })
        yield* storage.putObject(bucket, eventPath, domainEvent)

        yield* Effect.logInfo("Job status updated with domain event", {
          jobId,
          from: oldJob.status,
          to: newStatus,
          eventPath
        })

        return newJob
      }).pipe(
        Effect.mapError(
          (cause) =>
            new RepositoryError({
              operation: "updateStatus",
              message: "Failed to update job status",
              cause
            })
        )
      )

    return {
      createJob,
      findJobById,
      findJobByIdempotencyKey,
      updateJobStatus
    } as JobRepositoryInterface
  })
)
