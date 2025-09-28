import type { JobStatus, TranscriptId } from "@puredialog/domain"
import { JobId, TranscriptionJob } from "@puredialog/domain"
import { CloudStorageConfig, CloudStorageService } from "@puredialog/ingestion"
import { Context, Data, Effect, Layer, Option } from "effect"
import { Index } from "./indices.js"
import { hashIdempotencyKey, idempotencyKeyFromString } from "./utils/idempotency.js"

// --- REPOSITORY INTERFACE ---
export interface JobRepositoryInterface {
  readonly save: (
    job: TranscriptionJob
  ) => Effect.Effect<TranscriptionJob, RepositoryError>

  readonly findById: (
    jobId: JobId
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>

  readonly findByIdempotencyKey: (
    key: string
  ) => Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError>

  readonly updateStatus: (
    jobId: JobId,
    newStatus: JobStatus,
    error?: string,
    transcriptId?: TranscriptId
  ) => Effect.Effect<TranscriptionJob, RepositoryError>
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
export const JobRepositoryLayer = Layer.effect(
  JobRepository,
  Effect.gen(function*() {
    const storage = yield* CloudStorageService
    const config = yield* CloudStorageConfig
    const bucket = config.bucket

    const save = (job: TranscriptionJob): Effect.Effect<TranscriptionJob, RepositoryError> =>
      Effect.gen(function*() {
        const path = Index.job(job.status, job.id)
        yield* storage.putObject(bucket, path, job)

        if (job.idempotencyKey) {
          const idempotencyKey = idempotencyKeyFromString(job.idempotencyKey)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)
          yield* storage.putObject(bucket, idempotencyPath, { jobId: job.id })
        }

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

    const findById = (jobId: JobId): Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError> => {
      const statuses: Array<JobStatus> = ["Queued", "Processing", "Completed", "Failed"]

      const checkStatus = (status: JobStatus) =>
        storage
          .getObject(bucket, Index.job(status, jobId), TranscriptionJob)
          .pipe(Effect.catchAll(() => Effect.succeed(Option.none())))

      // Check each status prefix until the job is found
      return Effect.forEach(statuses, checkStatus, { concurrency: "unbounded" }).pipe(
        Effect.map((results) => Option.firstSomeOf(results)),
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

    const updateStatus = (
      jobId: JobId,
      newStatus: JobStatus,
      error?: string,
      transcriptId?: TranscriptId
    ): Effect.Effect<TranscriptionJob, RepositoryError> =>
      Effect.gen(function*() {
        const maybeJob = yield* findById(jobId)
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

        const newJob = TranscriptionJob.make({
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
      save,
      findById,
      findByIdempotencyKey: (keyString: string): Effect.Effect<Option.Option<TranscriptionJob>, RepositoryError> =>
        Effect.gen(function*() {
          const idempotencyKey = idempotencyKeyFromString(keyString)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)
          const maybeJobId = yield* storage.getObject(
            bucket,
            idempotencyPath,
            JobId
          )

          if (Option.isNone(maybeJobId)) {
            return Option.none()
          }

          return yield* findById(maybeJobId.value)
        }).pipe(
          Effect.mapError(
            (cause) =>
              new RepositoryError({
                operation: "findByIdempotencyKey",
                message: "Failed to find job by idempotency key",
                cause
              })
          )
        ),
      updateStatus
    }
  })
)
