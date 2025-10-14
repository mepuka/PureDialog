import type { Core, Jobs } from "@puredialog/domain"
import { JobStore } from "@puredialog/storage"
import type { JobStoreInterface, RepositoryError } from "@puredialog/storage"
import { Effect, Option } from "effect"
import { JobNotFound } from "../errors.js"

const ensureJobExists = (jobStore: JobStoreInterface, jobId: Core.JobId) =>
  Effect.gen(function*() {
    const maybeJob = yield* jobStore.findJobById(jobId)

    if (Option.isNone(maybeJob)) {
      return yield* Effect.fail(
        new JobNotFound({
          message: `Job not found: ${jobId}`,
          jobId
        })
      )
    }

    return maybeJob.value
  })

const mapRepositoryError = (error: RepositoryError, jobId: Core.JobId) =>
  error.message.includes("Job not found")
    ? new JobNotFound({
      message: error.message,
      jobId
    })
    : error

export const processEvent = (event: Jobs.DomainEvent) =>
  Effect.gen(function*() {
    const jobStore = yield* JobStore

    switch (event._tag) {
      case "JobQueued":
        return yield* jobStore.createJob(event.job)
      case "JobStatusChanged": {
        yield* ensureJobExists(jobStore, event.jobId)

        return yield* jobStore.updateJobStatus(event.jobId, event.to).pipe(
          Effect.mapError((error) => mapRepositoryError(error, event.jobId))
        )
      }
      case "TranscriptComplete": {
        yield* ensureJobExists(jobStore, event.jobId)

        return yield* jobStore.updateJobStatus(
          event.jobId,
          "Completed",
          undefined,
          event.transcript.id
        ).pipe(
          Effect.mapError((error) => mapRepositoryError(error, event.jobId))
        )
      }
      case "JobFailed": {
        yield* ensureJobExists(jobStore, event.jobId)

        return yield* jobStore.updateJobStatus(event.jobId, "Failed", event.error).pipe(
          Effect.mapError((error) => mapRepositoryError(error, event.jobId))
        )
      }
    }
  })
