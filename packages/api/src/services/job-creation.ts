import type { Core, Media, Transcription } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"

export const generateJobId = (): Core.JobId => `job_${randomUUID()}` as Core.JobId
export const generateRequestId = (): Core.RequestId => `req_${randomUUID()}` as Core.RequestId

/**
 * Internal job creation payload with MediaResource
 */
export interface JobCreationPayload {
  readonly media: Media.MediaResource
  readonly idempotencyKey?: string | undefined
  readonly transcriptionContext?: Transcription.TranscriptionContext | undefined
}

/**
 * Create a new QueuedJob from a job creation payload.
 * Uses proper Schema constructors for type safety.
 */
export const createTranscriptionJob = (
  payload: JobCreationPayload
): Effect.Effect<Jobs.QueuedJob> =>
  Effect.sync(() => {
    const jobId = generateJobId()
    const requestId = generateRequestId()
    const now = new Date()

    let idempotencyKey = payload.idempotencyKey

    if (!idempotencyKey) {
      idempotencyKey = idempotencyKeyToString(generateIdempotencyKey("/jobs", payload.media))
    }

    // Use Schema constructor for type-safe job creation
    return Jobs.QueuedJob.make({
      id: jobId,
      requestId,
      media: payload.media,
      attempts: 0,
      createdAt: now,
      updatedAt: now,
      transcriptionContext: payload.transcriptionContext,
      idempotencyKey
    })
  })
