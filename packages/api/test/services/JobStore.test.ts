import { assert, describe, it } from "@effect/vitest"
import { Effect, Option } from "effect"
import { createJobWithIdempotencyKey, createProcessingJob, createQueuedJob } from "../utils/fixtures/jobs.js"
import { createMockJobStore } from "../utils/mocks/JobStoreMock.js"

describe("JobStore", () => {
  describe("createJob", () => {
    it.effect("should create a new job successfully", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        const result = yield* mockStore.createJob(job)

        assert.deepStrictEqual(result, job)
        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(capturedJobs[0].operation, "create")
        assert.strictEqual(capturedJobs[0].job.id, job.id)
      }))

    it.effect("should handle idempotency collision and return existing job", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const idempotencyKey = "test-idempotency-key"
        const existingJob = createJobWithIdempotencyKey(idempotencyKey)
        const newJob = createJobWithIdempotencyKey(idempotencyKey, {
          id: "job_new" as any,
          requestId: "req_new" as any
        })

        // Create the existing job first
        yield* mockStore.createJob(existingJob)

        // Try to create a new job with the same idempotency key
        const result = yield* mockStore.createJob(newJob)

        assert.deepStrictEqual(result, existingJob)
        assert.strictEqual(capturedJobs.length, 2) // One create, one collision detection
        assert.strictEqual(capturedJobs[1].operation, "create")
        assert.strictEqual(capturedJobs[1].job.id, existingJob.id)
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "createJob")

        const job = createQueuedJob()

        const result = yield* mockStore.createJob(job).pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("findJobById", () => {
    it.effect("should find an existing job by ID", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)

        const result = yield* mockStore.findJobById(job.id)

        assert.isTrue(Option.isSome(result))
        assert.strictEqual(Option.getOrNull(result)?.id, job.id)
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findById")
        assert.strictEqual(capturedQueries[0].key, job.id)
      }))

    it.effect("should return none for non-existent job", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const nonExistentJobId = "job_nonexistent" as any

        const result = yield* mockStore.findJobById(nonExistentJobId)

        assert.isTrue(Option.isNone(result))
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findById")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "findJobById")

        const result = yield* mockStore.findJobById("job_test" as any).pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("findJobByIdempotencyKey", () => {
    it.effect("should find an existing job by idempotency key", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const idempotencyKey = "test-idempotency-key"
        const job = createJobWithIdempotencyKey(idempotencyKey)

        yield* mockStore.createJob(job)

        const result = yield* mockStore.findJobByIdempotencyKey(idempotencyKey)

        assert.isTrue(Option.isSome(result))
        assert.strictEqual(Option.getOrNull(result)?.id, job.id)
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findByIdempotencyKey")
        assert.strictEqual(capturedQueries[0].key, idempotencyKey)
      }))

    it.effect("should return none for non-existent idempotency key", () =>
      Effect.gen(function*() {
        const { capturedQueries, mockStore } = createMockJobStore()
        const nonExistentKey = "non-existent-key"

        const result = yield* mockStore.findJobByIdempotencyKey(nonExistentKey)

        assert.isTrue(Option.isNone(result))
        assert.strictEqual(capturedQueries.length, 1)
        assert.strictEqual(capturedQueries[0].operation, "findByIdempotencyKey")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "findJobByIdempotencyKey")

        const result = yield* mockStore.findJobByIdempotencyKey("test-key").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("updateJobStatus", () => {
    it.effect("should update job status successfully", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)

        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Processing")

        assert.strictEqual(updatedJob.status, "Processing")
        assert.isDefined(updatedJob.updatedAt)
        assert.isTrue(updatedJob.updatedAt.getTime() > job.createdAt.getTime())

        assert.strictEqual(capturedUpdates.length, 1)
        assert.strictEqual(capturedUpdates[0].jobId, job.id)
        assert.strictEqual(capturedUpdates[0].newStatus, "Processing")

        assert.strictEqual(capturedJobs.length, 2) // Create + Update
        assert.strictEqual(capturedJobs[1].operation, "update")
      }))

    it.effect("should update job with error message", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const job = createProcessingJob()

        yield* mockStore.createJob(job)

        const errorMessage = "Processing failed"
        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Failed", errorMessage)

        assert.strictEqual(updatedJob.status, "Failed")
        assert.strictEqual(updatedJob.error, errorMessage)
      }))

    it.effect("should update job with transcript ID", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const job = createProcessingJob()
        const transcriptId = "trn_test123" as any

        yield* mockStore.createJob(job)

        const updatedJob = yield* mockStore.updateJobStatus(job.id, "Completed", undefined, transcriptId)

        assert.strictEqual(updatedJob.status, "Completed")
        assert.strictEqual(updatedJob.transcriptId, transcriptId)
      }))

    it.effect("should fail when job not found", () =>
      Effect.gen(function*() {
        const { mockStore } = createMockJobStore()
        const nonExistentJobId = "job_nonexistent" as any

        const result = yield* mockStore.updateJobStatus(nonExistentJobId, "Failed").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))

    it.effect("should fail when configured to fail", () =>
      Effect.gen(function*() {
        const { mockStore, setShouldFail } = createMockJobStore()
        setShouldFail(true, "updateJobStatus")

        const job = createQueuedJob()
        yield* mockStore.createJob(job)

        const result = yield* mockStore.updateJobStatus(job.id, "Processing").pipe(
          Effect.exit
        )

        assert.isTrue(result._tag === "Failure")
      }))
  })

  describe("integration scenarios", () => {
    it.effect("should handle complete job lifecycle", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        // Create job
        const createdJob = yield* mockStore.createJob(job)
        assert.strictEqual(createdJob.status, "Queued")
        assert.strictEqual(capturedJobs.length, 1)

        // Update to processing
        const processingJob = yield* mockStore.updateJobStatus(job.id, "Processing")
        assert.strictEqual(processingJob.status, "Processing")
        assert.strictEqual(capturedUpdates.length, 1)

        // Update to completed with transcript
        const transcriptId = "trn_test123" as any
        const completedJob = yield* mockStore.updateJobStatus(job.id, "Completed", undefined, transcriptId)
        assert.strictEqual(completedJob.status, "Completed")
        assert.strictEqual(completedJob.transcriptId, transcriptId)
        assert.strictEqual(capturedUpdates.length, 2)

        // Verify final state
        const finalJob = yield* mockStore.findJobById(job.id)
        assert.isTrue(Option.isSome(finalJob))
        assert.strictEqual(Option.getOrNull(finalJob)?.status, "Completed")
        assert.strictEqual(Option.getOrNull(finalJob)?.transcriptId, transcriptId)
      }))

    it.effect("should handle concurrent operations correctly", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const jobs = [
          createQueuedJob({ id: "job_1" as any, idempotencyKey: "key1:jobs:hash1" }),
          createQueuedJob({ id: "job_2" as any, idempotencyKey: "key2:jobs:hash2" }),
          createQueuedJob({ id: "job_3" as any, idempotencyKey: "key3:jobs:hash3" })
        ]

        // Create multiple jobs concurrently
        const results = yield* Effect.forEach(jobs, (job) => mockStore.createJob(job), {
          concurrency: "unbounded"
        })

        assert.strictEqual(results.length, 3)
        assert.strictEqual(capturedJobs.length, 3)

        // Verify all jobs were created
        for (const job of jobs) {
          const found = yield* mockStore.findJobById(job.id)
          assert.isTrue(Option.isSome(found))
        }
      }))
  })

  describe("state capture and validation", () => {
    it.effect("should capture all operations with timestamps", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedQueries, capturedUpdates, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        // Perform various operations
        yield* mockStore.createJob(job)
        yield* mockStore.findJobById(job.id)
        yield* mockStore.findJobByIdempotencyKey(job.idempotencyKey || "")
        yield* mockStore.updateJobStatus(job.id, "Processing")

        // Verify all operations were captured with timestamps
        assert.strictEqual(capturedJobs.length, 2) // Create + Update
        assert.strictEqual(capturedQueries.length, 2) // Two finds
        assert.strictEqual(capturedUpdates.length, 1) // One update

        // Verify timestamps are set
        for (const capture of [...capturedJobs, ...capturedQueries, ...capturedUpdates]) {
          assert.isDefined(capture.timestamp)
          assert.isTrue(capture.timestamp instanceof Date)
        }
      }))

    it.effect("should clear state when requested", () =>
      Effect.gen(function*() {
        const { capturedJobs, capturedQueries, capturedUpdates, clear, mockStore } = createMockJobStore()
        const job = createQueuedJob()

        yield* mockStore.createJob(job)
        yield* mockStore.findJobById(job.id)

        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(capturedQueries.length, 1)

        clear()

        assert.strictEqual(capturedJobs.length, 0)
        assert.strictEqual(capturedQueries.length, 0)
        assert.strictEqual(capturedUpdates.length, 0)
      }))
  })
})
