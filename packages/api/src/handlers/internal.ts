import { HttpApiBuilder } from "@effect/platform"
import type { DomainEvent, TranscriptId, TranscriptionJob } from "@puredialog/domain"
import type { MessageEncodingError } from "@puredialog/ingestion"
import { MessageAdapter, MessageAdapterLive } from "@puredialog/ingestion"
import { Effect, Layer, Match, Option } from "effect"

import { PureDialogApi } from "../api.js"
import type { RepositoryError } from "../errors.js"
import { JobNotFound } from "../errors.js"
import { JobStore } from "../services/index.js"

/**
 * Handle transcription completion side-effects.
 */
const handleTranscriptionCompletion = (
  job: TranscriptionJob,
  transcriptId: TranscriptId
) =>
  Effect.logInfo(`Transcription completed for job: ${job.id}`, {
    jobId: job.id,
    transcriptId,
    duration: Date.now() - job.createdAt.getTime()
  })

export const processEvent = (event: DomainEvent) => {
  if (event._tag === "JobQueued" || event._tag === "WorkMessage") {
    return Effect.void
  }

  return Effect.gen(function*() {
    const jobStore = yield* JobStore
    const job = yield* jobStore.findJobById(event.jobId).pipe(
      Effect.flatMap(
        Option.match({
          onSome: (job) => Effect.succeed(job),
          onNone: () => Effect.fail(new JobNotFound({ jobId: event.jobId, message: "Job not found" }))
        })
      )
    )

    return yield* Match.value(event).pipe(
      Match.tag("JobFailed", (e) => jobStore.updateJobStatus(job.id, "Failed", e.error)),
      // TODO: handlde "handle dlq"
      Match.tag("TranscriptComplete", (e) =>
        jobStore
          .updateJobStatus(job.id, "Completed", undefined, e.transcript.id)
          .pipe(
            Effect.tap((updatedJob) => handleTranscriptionCompletion(updatedJob, e.transcript.id))
          )),
      Match.tag("JobStatusChanged", (e) => jobStore.updateJobStatus(job.id, e.to)),
      Match.exhaustive
    )
  })
}

/**
 * Handler for Pub/Sub push messages.
 */
const internalLayer = HttpApiBuilder.group(PureDialogApi, "internal", (handlers) =>
  Effect.gen(function*() {
    const messageAdapter = yield* MessageAdapter

    return handlers.handle("jobUpdate", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(
          `Received job update push message: ${payload.message.messageId}`
        )

        const domainEvent = yield* messageAdapter.decodeDomainEvent(
          payload.message
        )

        yield* processEvent(domainEvent)

        return { received: true, processed: true }
      }).pipe(
        Effect.catchTags({
          JobNotFound: (e: JobNotFound) =>
            Effect.logWarning(e.message, e).pipe(
              Effect.andThen(() =>
                Effect.succeed({
                  received: true,
                  processed: false,
                  reason: e.message
                })
              )
            ),
          MessageEncodingError: (e: MessageEncodingError) =>
            Effect.logWarning("Failed to decode message", e).pipe(
              Effect.andThen(() =>
                Effect.succeed({
                  received: true,
                  processed: false,
                  reason: "Message encoding error"
                })
              )
            ),
          RepositoryError: (e: RepositoryError) =>
            Effect.logError("Database error during job update", e).pipe(
              Effect.andThen(() =>
                Effect.succeed({
                  received: true,
                  processed: false,
                  reason: "Database error"
                })
              )
            )
        })
      ))
  })).pipe(Layer.provide(MessageAdapterLive))

export { internalLayer }
