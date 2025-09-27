import type { JobId, RequestId } from "@puredialog/domain"
import { randomUUID } from "crypto"

/**
 * Generate unique job ID
 */
export const generateJobId = (): JobId => `job_${randomUUID()}` as JobId

/**
 * Generate unique request ID
 */
export const generateRequestId = (): RequestId => `req_${randomUUID()}` as RequestId
