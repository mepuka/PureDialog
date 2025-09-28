import { TranscriptionJob } from "@puredialog/domain"
import type { JobId, RequestId } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type { CreateJobRequest } from "../schemas.js"

/**
 * Generate unique job ID
 */
export const generateJobId = (): JobId => `job_${randomUUID()}` as JobId

/**
 * Generate unique request ID
 */
export const generateRequestId = (): RequestId => `req_${randomUUID()}` as RequestId

export const createTranscriptionJob = (
  payload: CreateJobRequest
): Effect.Effect<TranscriptionJob> =>
  Effect.sync(() => {
    const jobId = generateJobId()
    const requestId = generateRequestId()
    const now = new Date()

    let idempotencyKeyString: string | undefined = payload.idempotencyKey

    if (!idempotencyKeyString) {
      const idempotencyKey = generateIdempotencyKey("/jobs", payload.media)
      idempotencyKeyString = idempotencyKeyToString(idempotencyKey)
    }

    return new TranscriptionJob({
      id: jobId,
      requestId,
      media: payload.media,
      status: "Queued",
      attempts: 0,
      createdAt: now,
      updatedAt: now,
      transcriptionContext: payload.transcriptionContext,
      idempotencyKey: idempotencyKeyString,
      metadata: {
        priority: "normal",
        source: "api"
      }
    })
  })
