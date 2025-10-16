/**
 * Test data factories for TranscriptionJob entities
 */
export const createTestMediaResource = () => ({
  type: "youtube",
  data: {
    id: "dQw4w9WgXcQ",
    title: "Test Video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
})
export const createAlternateMediaResource = () => ({
  type: "youtube",
  data: {
    id: "9bZkp7q19f0",
    title: "Different Test Video",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0"
  }
})
export const createTestJob = (overrides = {}) => {
  const now = new Date()
  return {
    id: "job_test_12345",
    requestId: "req_test_67890",
    media: createTestMediaResource(),
    status: "Queued",
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
export const createJobWithStatus = (status) => createTestJob({ status })
export const createJobWithIdempotencyKey = (key) => createTestJob({ idempotencyKey: key })
export const createJobWithMedia = (media) => createTestJob({ media })
export const createProcessingJob = () =>
  createTestJob({
    status: "Processing",
    attempts: 1,
    updatedAt: new Date(Date.now() + 1000)
  })
export const createCompletedJob = (transcriptId) =>
  createTestJob({
    status: "Completed",
    transcriptId: transcriptId || "transcript_test_abc",
    updatedAt: new Date(Date.now() + 5000)
  })
export const createFailedJob = (error) =>
  createTestJob({
    status: "Failed",
    error: error || "Test transcription failure",
    attempts: 3,
    updatedAt: new Date(Date.now() + 3000)
  })
export const createJobWithoutIdempotencyKey = () => {
  const job = createTestJob()
  delete job.idempotencyKey
  return job
}
// Additional fixture functions expected by tests
export const createQueuedJob = (overrides = {}) => createTestJob({ status: "Queued", ...overrides })
/**
 * Generate multiple test jobs for batch testing
 */
export const createTestJobs = (count) =>
  Array.from({ length: count }, (_, i) =>
    createTestJob({
      id: `job_test_${i.toString().padStart(5, "0")}`,
      requestId: `req_test_${i.toString().padStart(5, "0")}`,
      idempotencyKey: `test-key-${i}:jobs:hash${i}`
    }))
/**
 * Job state validation helpers
 */
export const assertJobEquals = (actual, expected) => {
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
export const assertJobHasFields = (job, fields) => {
  Object.entries(fields).forEach(([key, value]) => {
    const actualValue = job[key]
    if (actualValue !== value) {
      throw new Error(`Job field ${key} mismatch: ${actualValue} !== ${value}`)
    }
  })
}
// # sourceMappingURL=jobs.js.map
