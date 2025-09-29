import type { Core } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type { CreateJobRequest } from "../schemas.js"

/**
 * Standard ID Format Patterns:
 * - JobId: job_${uuid}
 * - RequestId: req_${uuid}
 * - TranscriptId: trn_${uuid}
 * - MediaResourceId: res_${uuid}
 * - CorrelationId: cor_${uuid}
 */

/**
 * Generate unique job ID with standard prefix
 */
export const generateJobId = (): Core.JobId => `job_${randomUUID()}` as Core.JobId

/**
 * Generate unique request ID with standard prefix
 */
export const generateRequestId = (): Core.RequestId => `req_${randomUUID()}` as Core.RequestId

/**
 * Generate unique transcript ID with standard prefix
 */
export const generateTranscriptId = (): Core.TranscriptId => `trn_${randomUUID()}` as Core.TranscriptId

export const createTranscriptionJob = (
  payload: CreateJobRequest
): Effect.Effect<Jobs.TranscriptionJob> =>
  Effect.sync(() => {
    const jobId = generateJobId()
    const requestId = generateRequestId()
    const now = new Date()

    let idempotencyKeyString: string | undefined = payload.idempotencyKey

    if (!idempotencyKeyString) {
      const idempotencyKey = generateIdempotencyKey("/jobs", payload.media)
      idempotencyKeyString = idempotencyKeyToString(idempotencyKey)
    }

    return new Jobs.TranscriptionJob({
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
