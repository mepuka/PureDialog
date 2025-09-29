import type { Core } from "@puredialog/domain"
import { Jobs } from "@puredialog/domain"
import { generateIdempotencyKey, idempotencyKeyToString } from "@puredialog/storage"
import { Effect } from "effect"
import { randomUUID } from "node:crypto"
import type { CreateJobRequest } from "../http/schemas.js"

const generateJobId = (): Core.JobId => `job_${randomUUID()}` as Core.JobId
const generateRequestId = (): Core.RequestId => `req_${randomUUID()}` as Core.RequestId

export const createTranscriptionJob = (
  payload: CreateJobRequest
): Effect.Effect<Jobs.TranscriptionJob> =>
  Effect.sync(() => {
    const jobId = generateJobId()
    const requestId = generateRequestId()
    const now = new Date()

    let idempotencyKey = payload.idempotencyKey

    if (!idempotencyKey) {
      idempotencyKey = idempotencyKeyToString(generateIdempotencyKey("/jobs", payload.media))
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
      idempotencyKey,
      metadata: {
        priority: "normal",
        source: "api"
      }
    })
  })
