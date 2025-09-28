import type { JobId, JobStatus, TranscriptId, TranscriptionJob } from "@puredialog/domain"
import { RepositoryError } from "@puredialog/storage"
import { JobStore, type ProcessingJobStoreInterface } from "@puredialog/storage"
import { Effect, Layer, Option } from "effect"

/**
 * Mock JobStore with state capture for testing
 */

export interface JobCapture {
  readonly operation: "create" | "update"
  readonly job: TranscriptionJob
  readonly timestamp: Date
}

export interface QueryCapture {
  readonly operation: "findById" | "findByIdempotencyKey"
  readonly key: string
  readonly timestamp: Date
}

export interface UpdateCapture {
  readonly jobId: JobId
  readonly newStatus: JobStatus
  readonly error?: string
  readonly transcriptId?: TranscriptId
  readonly timestamp: Date
}

export const createMockJobStore = () => {
  const jobs = new Map<JobId, TranscriptionJob>()
  const idempotencyMap = new Map<string, JobId>()
  const capturedJobs: Array<JobCapture> = []
  const capturedQueries: Array<QueryCapture> = []
  const capturedUpdates: Array<UpdateCapture> = []

  let shouldFail = false
  let failingOperation: string | null = null

  const setShouldFail = (fail: boolean, operation?: string) => {
    shouldFail = fail
    failingOperation = operation || null
  }

  const mockImplementation: ProcessingJobStoreInterface = {
    createJob: (job: TranscriptionJob) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "createJob")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for createJob",
              operation: "createJob"
            })
          )
        }

        capturedJobs.push({
          operation: "create",
          job,
          timestamp: new Date()
        })

        // Check for existing job with same idempotency key
        if (job.idempotencyKey) {
          const existingJobId = idempotencyMap.get(job.idempotencyKey)
          if (existingJobId) {
            const existingJob = jobs.get(existingJobId)
            if (existingJob) {
              // Only capture once for collision detection, not duplicate create
              capturedJobs[capturedJobs.length - 1] = {
                operation: "create",
                job: existingJob,
                timestamp: new Date()
              }
              return existingJob
            }
          }
        }

        jobs.set(job.id, job)
        if (job.idempotencyKey) {
          idempotencyMap.set(job.idempotencyKey, job.id)
        }

        return job
      }),

    findJobById: (jobId: JobId) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "findJobById")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for findJobById",
              operation: "findJobById"
            })
          )
        }

        capturedQueries.push({
          operation: "findById",
          key: jobId,
          timestamp: new Date()
        })

        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    findJobByIdempotencyKey: (keyString: string) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "findJobByIdempotencyKey")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for findJobByIdempotencyKey",
              operation: "findJobByIdempotencyKey"
            })
          )
        }

        capturedQueries.push({
          operation: "findByIdempotencyKey",
          key: keyString,
          timestamp: new Date()
        })

        const jobId = idempotencyMap.get(keyString)
        if (!jobId) {
          return Option.none()
        }

        const job = jobs.get(jobId)
        return Option.fromNullable(job)
      }),

    updateJobStatus: (jobId: JobId, status: JobStatus, error?: string, transcriptId?: TranscriptId) =>
      Effect.gen(function*() {
        if (shouldFail && (!failingOperation || failingOperation === "updateJobStatus")) {
          return yield* Effect.fail(
            new RepositoryError({
              message: "Mock failure for updateJobStatus",
              operation: "updateJobStatus"
            })
          )
        }

        capturedUpdates.push({
          jobId,
          newStatus: status,
          error,
          transcriptId,
          timestamp: new Date()
        })

        const existingJob = jobs.get(jobId)

        if (!existingJob) {
          return yield* Effect.fail(
            new RepositoryError({
              message: `Job not found: ${jobId}`,
              operation: "updateStatus"
            })
          )
        }

        const updatedJob: TranscriptionJob = {
          ...existingJob,
          status,
          updatedAt: new Date(Date.now() + 1), // Ensure updatedAt is newer
          ...(error !== undefined && { error }),
          ...(transcriptId !== undefined && { transcriptId })
        }

        jobs.set(jobId, updatedJob)

        capturedJobs.push({
          operation: "update",
          job: updatedJob,
          timestamp: new Date()
        })

        return updatedJob
      })
  }

  const clear = () => {
    jobs.clear()
    idempotencyMap.clear()
    capturedJobs.length = 0
    capturedQueries.length = 0
    capturedUpdates.length = 0
  }

  // Create the Layer for dependency injection
  const mockLayer = Layer.succeed(JobStore, mockImplementation)

  return {
    mockStore: mockImplementation,
    mockLayer,
    capturedJobs,
    capturedQueries,
    capturedUpdates,
    setShouldFail,
    clear
  }
}

/**
 * Create a mock that simulates specific failure scenarios
 */
export const createFailingJobStoreMock = () => {
  const { ...baseMock } = createMockJobStore()

  const failingImplementation: ProcessingJobStoreInterface = {
    ...baseMock.mockImplementation,

    createJob: (_job: TranscriptionJob) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during job creation",
          operation: "createJob"
        })
      ),

    findJobById: (_jobId: JobId) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during job lookup",
          operation: "findJobById"
        })
      ),

    findJobByIdempotencyKey: (_key: string) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during idempotency lookup",
          operation: "findJobByIdempotencyKey"
        })
      ),

    updateJobStatus: (_jobId: JobId, _status: JobStatus) =>
      Effect.fail(
        new RepositoryError({
          message: "Mock database error during status update",
          operation: "updateJobStatus"
        })
      )
  }

  const failingMockLayer = Layer.succeed(JobStore, failingImplementation)

  return {
    ...baseMock,
    mockImplementation: failingImplementation,
    mockLayer: failingMockLayer
  }
}
