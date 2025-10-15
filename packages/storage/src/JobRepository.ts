import { Core, Jobs } from "@puredialog/domain"
import { Config, Layer } from "@puredialog/ingestion"
import { Context, Data, Effect, Layer as EffectLayer, Option, Schema } from "effect"
import { Index } from "./indices.js"
import { hashIdempotencyKey, idempotencyKeyFromString } from "./utils/idempotency.js"

// --- REPOSITORY INTERFACE ---
export interface JobRepositoryInterface {
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
    newStatus: Jobs.JobStatus,
    error?: string,
    transcriptId?: Core.TranscriptId
  ) => Effect.Effect<Jobs.TranscriptionJob, RepositoryError>
}

// --- SERVICE TAG ---
export class JobRepository extends Context.Tag("JobRepository")<
  JobRepository,
  JobRepositoryInterface
>() {}

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

    const isPreconditionFailed = (error: unknown) =>
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 412

    const createJob = (
      job: Jobs.QueuedJob
    ): Effect.Effect<Jobs.QueuedJob, RepositoryError> =>
      Effect.gen(function*() {
        const status = Jobs.getJobStatus(job)
        const path = Index.jobPath(status, job.id)

        if (job.idempotencyKey) {
          const idempotencyKey = idempotencyKeyFromString(job.idempotencyKey)
          const hashedKey = yield* hashIdempotencyKey(idempotencyKey)
          const idempotencyPath = Index.idempotency(hashedKey)

          const idempotencyWriteResult = yield* storage.putObject(
            bucket,
            idempotencyPath,
            { jobId: job.id },
            { ifGenerationMatch: 0 }
          ).pipe(
            Effect.map(() => "created" as const),
            Effect.catchAll((error) =>
              isPreconditionFailed(error) ?
                Effect.succeed<"created" | "existing">("existing") :
                Effect.fail(error)
            )
          )

          if (idempotencyWriteResult === "existing") {
            const existingRecord = yield* storage.getObject(
              bucket,
              idempotencyPath,
              Schema.Struct({ jobId: Core.JobId })
            )

            if (Option.isSome(existingRecord)) {
              const existingJob = yield* findJobById(existingRecord.value.jobId)
              if (Option.isSome(existingJob) && existingJob.value._tag === "QueuedJob") {
                return existingJob.value
              }
            }

            return yield* Effect.fail(
              new RepositoryError({
                operation: "save",
                message: "Job already exists for idempotency key but could not be loaded"
              })
            )
          }
        }

        const writeJobResult = yield* storage.putObject(
          bucket,
          path,
          job,
          { ifGenerationMatch: 0 }
        ).pipe(
          Effect.map(() => "created" as const),
          Effect.catchAll((error) =>
            isPreconditionFailed(error) ?
              Effect.succeed<"created" | "existing">("existing") :
              Effect.fail(error)
          )
        )

        if (writeJobResult === "existing") {
          const existingJob = yield* findJobById(job.id)
          if (Option.isSome(existingJob) && existingJob.value._tag === "QueuedJob") {
            return existingJob.value
          }

          return yield* Effect.fail(
            new RepositoryError({
              operation: "save",
              message: `Job already exists: ${job.id}`
            })
          )
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
    ): Effect.Effect<Option.Option<Jobs.TranscriptionJob>, RepositoryError> => {
      const statuses: Array<Jobs.JobStatus> = [
        "Queued",
        "MetadataReady",
        "Processing",
        "Completed",
        "Failed",
        "Cancelled"
      ]

      const checkStatus = (status: Jobs.JobStatus) =>
        storage
          .getObject(bucket, Index.jobPath(status, jobId), Jobs.TranscriptionJob)
          .pipe(Effect.catchAll(() => Effect.succeed(Option.none())))

      // Check each status prefix until the job is found
      return Effect.forEach(statuses, checkStatus, { concurrency: "unbounded" }).pipe(
        Effect.map(
          (results) => Option.firstSomeOf(results as Iterable<Option.Option<Jobs.TranscriptionJob>>)
        ),
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
    ): Effect.Effect<Option.Option<Jobs.TranscriptionJob>, RepositoryError, never> =>
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
    ): Effect.Effect<Jobs.TranscriptionJob, RepositoryError> =>
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
        const oldStatus = Jobs.getJobStatus(oldJob)
        const oldPath = Index.jobPath(oldStatus, jobId)

        // Create new job state based on transition
        let newJob: Jobs.TranscriptionJob

        if (newStatus === "Failed") {
          // Fail transition
          if (!Jobs.isActiveJob(oldJob)) {
            return yield* Effect.fail(
              new RepositoryError({
                operation: "updateStatus",
                message: `Cannot fail terminal job: ${jobId}`
              })
            )
          }
          newJob = Jobs.JobTransitions.fail(oldJob, error || "Unknown error")
        } else if (newStatus === "Cancelled") {
          // Cancel transition
          if (!Jobs.isActiveJob(oldJob)) {
            return yield* Effect.fail(
              new RepositoryError({
                operation: "updateStatus",
                message: `Cannot cancel terminal job: ${jobId}`
              })
            )
          }
          newJob = Jobs.JobTransitions.cancel(oldJob, error || "Cancelled by user")
        } else {
          // Regular state progression - just update timestamps
          // This is a temporary bridge for backward compatibility
          // Workers should use type-safe transitions directly
          newJob = {
            ...oldJob,
            _tag: newStatus === "Completed" ? "CompletedJob" : oldJob._tag,
            updatedAt: new Date(),
            ...(transcriptId && { transcriptId })
          } as Jobs.TranscriptionJob
        }

        const newPath = Index.jobPath(newStatus, jobId)

        // Write-then-delete pattern for atomic status change
        yield* storage.putObject(bucket, newPath, newJob)
        yield* storage.deleteObject(bucket, oldPath).pipe(Effect.catchAll(() => Effect.void))

        // Write JobStatusChanged domain event to event store
        const eventId = `${Date.now()}_status_changed`
        const eventPath = Index.event(jobId, eventId)
        const domainEvent = Jobs.JobStatusChanged.make({
          jobId,
          requestId: oldJob.requestId,
          from: oldStatus,
          to: newStatus,
          occurredAt: new Date()
        })
        yield* storage.putObject(bucket, eventPath, domainEvent)

        yield* Effect.logInfo("Job status updated with domain event", {
          jobId,
          from: oldStatus,
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
