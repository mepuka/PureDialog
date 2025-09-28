import type { JobId, JobStatus, MediaResource, RequestId, TranscriptId, TranscriptionJob } from "@puredialog/domain"

/**
 * Test data factories for TranscriptionJob entities
 */

export const createTestMediaResource = (): MediaResource => ({
  type: "youtube",
  data: {
    id: "dQw4w9WgXcQ",
    title: "Test Video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
})

export const createAlternateMediaResource = (): MediaResource => ({
  type: "youtube",
  data: {
    id: "9bZkp7q19f0",
    title: "Different Test Video",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0"
  }
})

export const createTestJob = (overrides: Partial<TranscriptionJob> = {}): TranscriptionJob => {
  const now = new Date()

  return {
    id: "job_test_12345" as JobId,
    requestId: "req_test_67890" as RequestId,
    media: createTestMediaResource(),
    status: "Queued" as JobStatus,
    attempts: 0,
    createdAt: now,
    updatedAt: now,
    transcriptionContext: {
      language: "en",
      customVocabulary: [],
      speakerDiarization: false
    },
    idempotencyKey: "test-key:jobs:abc123",
    ...overrides
  }
}

export const createJobWithStatus = (status: JobStatus): TranscriptionJob => createTestJob({ status })

export const createJobWithIdempotencyKey = (key: string): TranscriptionJob => createTestJob({ idempotencyKey: key })

export const createJobWithMedia = (media: MediaResource): TranscriptionJob => createTestJob({ media })

export const createProcessingJob = (): TranscriptionJob =>
  createTestJob({
    status: "Processing",
    attempts: 1,
    updatedAt: new Date(Date.now() + 1000)
  })

export const createCompletedJob = (transcriptId?: TranscriptId): TranscriptionJob =>
  createTestJob({
    status: "Completed",
    transcriptId: transcriptId || "transcript_test_abc" as TranscriptId,
    updatedAt: new Date(Date.now() + 5000)
  })

export const createFailedJob = (error?: string): TranscriptionJob =>
  createTestJob({
    status: "Failed",
    error: error || "Test transcription failure",
    attempts: 3,
    updatedAt: new Date(Date.now() + 3000)
  })

export const createJobWithoutIdempotencyKey = (): TranscriptionJob => {
  const job = createTestJob()
  delete job.idempotencyKey
  return job
}

// Additional fixture functions expected by tests
export const createQueuedJob = (overrides: Partial<TranscriptionJob> = {}): TranscriptionJob =>
  createTestJob({ status: "Queued", ...overrides })

/**
 * Generate multiple test jobs for batch testing
 */
export const createTestJobs = (count: number): Array<TranscriptionJob> =>
  Array.from({ length: count }, (_, i) =>
    createTestJob({
      id: `job_test_${i.toString().padStart(5, "0")}` as JobId,
      requestId: `req_test_${i.toString().padStart(5, "0")}` as RequestId,
      idempotencyKey: `test-key-${i}:jobs:hash${i}`
    }))

/**
 * Job state validation helpers
 */
export const assertJobEquals = (actual: TranscriptionJob, expected: TranscriptionJob): void => {
  if (actual.id !== expected.id) {
    throw new Error(`Job ID mismatch: ${actual.id} !== ${expected.id}`)
  }
  if (actual.status !== expected.status) {
    throw new Error(`Job status mismatch: ${actual.status} !== ${expected.status}`)
  }
  if (actual.idempotencyKey !== expected.idempotencyKey) {
    throw new Error(`Idempotency key mismatch: ${actual.idempotencyKey} !== ${expected.idempotencyKey}`)
  }
}

export const assertJobHasFields = (job: TranscriptionJob, fields: Partial<TranscriptionJob>): void => {
  Object.entries(fields).forEach(([key, value]) => {
    const actualValue = job[key as keyof TranscriptionJob]
    if (actualValue !== value) {
      throw new Error(`Job field ${key} mismatch: ${actualValue} !== ${value}`)
    }
  })
}
