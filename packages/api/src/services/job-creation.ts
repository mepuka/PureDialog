import type { Core } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type { CreateJobRequest } from "../http/schemas.js"

const generateJobId = (): Core.JobId => `job_${randomUUID()}` as Core.JobId
const generateRequestId = (): Core.RequestId => `req_${randomUUID()}` as Core.RequestId

/**
 * Create a new QueuedJob from an API request.
 * Uses proper Schema constructors for type safety.
 */
export const createTranscriptionJob = (
  payload: CreateJobRequest
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
