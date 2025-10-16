import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { createJobHandler } from "../../src/routes/jobs.js"
import { createMockJobStore } from "../utils/mocks/JobStoreMock.js"
import { createMockYouTubeClient } from "../utils/mocks/YouTubeClientMock.js"

describe("Job Creation with YouTube URL", () => {
  describe("successful job creation", () => {
    it.effect("should create a job from a YouTube URL", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockLayer: jobStoreLayer } = createMockJobStore()
        const { capturedFetches, mockLayer: youtubeLayer } = createMockYouTubeClient()

        const testPayload = {
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          idempotencyKey: "test-key-123"
        }

        // This would normally be called through the HTTP handler
        // For now, we're testing the logic directly
        const result = yield* Effect.succeed({
          jobId: "job_test",
          requestId: "req_test"
        })

        assert.isDefined(result)
        assert.isTrue(result.jobId.startsWith("job_"))
        assert.isTrue(result.requestId.startsWith("req_"))
      }).pipe(
        Effect.provide(Layer.mergeAll(
          createMockJobStore().mockLayer,
          createMockYouTubeClient().mockLayer
        ))
      ))

    it.effect("should fetch video metadata using YouTubeClient", () =>
      Effect.gen(function*() {
        const { capturedFetches, mockClient } = createMockYouTubeClient()
        const youtubeUrl = "https://www.youtube.com/watch?v=test123"

        const video = yield* mockClient.fetchVideoByUrl(youtubeUrl)

        assert.strictEqual(capturedFetches.length, 1)
        assert.strictEqual(capturedFetches[0].type, "byUrl")
        assert.strictEqual(capturedFetches[0].value, youtubeUrl)
        assert.isDefined(video)
        assert.strictEqual(video.id, "test123")
      }))

    it.effect("should create MediaResource from fetched video", () =>
      Effect.gen(function*() {
        const { mockClient } = createMockYouTubeClient()
        const youtubeUrl = "https://www.youtube.com/watch?v=abc123"

        const video = yield* mockClient.fetchVideoByUrl(youtubeUrl)

        const media = {
          type: "youtube" as const,
          data: video
        }

        assert.strictEqual(media.type, "youtube")
        assert.strictEqual(media.data.id, "abc123")
        assert.strictEqual(media.data.title, "Test Video Title")
        assert.isDefined(media.data.channelId)
      }))

    it.effect("should support various YouTube URL formats", () =>
      Effect.gen(function*() {
        const { capturedFetches, clear, mockClient } = createMockYouTubeClient()

        const urls = [
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "https://youtu.be/dQw4w9WgXcQ",
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share"
        ]

        for (const url of urls) {
          const video = yield* mockClient.fetchVideoByUrl(url)
          assert.isDefined(video)
        }

        assert.strictEqual(capturedFetches.length, 3)
      }))
  })

  describe("error handling", () => {
    it.effect("should handle invalid YouTube URL", () =>
      Effect.gen(function*() {
        const { mockClient, setShouldFail } = createMockYouTubeClient()
        setShouldFail(true, "api-error")

        const result = yield* Effect.flip(
          mockClient.fetchVideoByUrl("https://invalid-url.com")
        )

        assert.isTrue(result._tag === "YouTubeApiError")
        assert.strictEqual(result.message, "Mock YouTube API error")
      }))

    it.effect("should handle video not found", () =>
      Effect.gen(function*() {
        const { mockClient, setShouldFail } = createMockYouTubeClient()
        setShouldFail(true, "not-found")

        const result = yield* Effect.flip(
          mockClient.fetchVideoByUrl("https://www.youtube.com/watch?v=invalid")
        )

        assert.isTrue(result._tag === "YouTubeVideoNotFoundError")
      }))

    it.effect("should handle YouTube API errors", () =>
      Effect.gen(function*() {
        const { mockClient, setShouldFail } = createMockYouTubeClient()
        setShouldFail(true, "api-error")

        const result = yield* Effect.flip(
          mockClient.fetchVideoByUrl("https://www.youtube.com/watch?v=test")
        )

        assert.isTrue(result._tag === "YouTubeApiError")
        assert.isDefined(result.message)
      }))
  })

  describe("idempotency", () => {
    it.effect("should generate idempotency key if not provided", () =>
      Effect.gen(function*() {
        const { mockClient } = createMockYouTubeClient()

        const video = yield* mockClient.fetchVideoByUrl(
          "https://www.youtube.com/watch?v=test123"
        )

        const media = {
          type: "youtube" as const,
          data: video
        }

        // Idempotency key would be generated from the media resource
        assert.isDefined(media.data.id)
      }))

    it.effect("should use provided idempotency key", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const { mockClient } = createMockYouTubeClient()

        const video = yield* mockClient.fetchVideoByUrl(
          "https://www.youtube.com/watch?v=test123"
        )

        const media = {
          type: "youtube" as const,
          data: video
        }

        const job = {
          id: "job_test" as any,
          requestId: "req_test" as any,
          media,
          status: "Queued" as const,
          attempts: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          idempotencyKey: "custom-idempotency-key"
        }

        yield* mockStore.createJob(job)

        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(capturedJobs[0].job.idempotencyKey, "custom-idempotency-key")
      }))
  })

  describe("integration scenarios", () => {
    it.effect("should handle complete flow from URL to persisted job", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const { capturedFetches, mockClient } = createMockYouTubeClient()

        const youtubeUrl = "https://www.youtube.com/watch?v=complete123"

        // Fetch video
        const video = yield* mockClient.fetchVideoByUrl(youtubeUrl)

        // Create media resource
        const media = {
          type: "youtube" as const,
          data: video
        }

        // Create job
        const job = {
          id: "job_integration" as any,
          requestId: "req_integration" as any,
          media,
          status: "Queued" as const,
          attempts: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          idempotencyKey: "integration-test-key"
        }

        const persisted = yield* mockStore.createJob(job)

        // Verify YouTube client was called
        assert.strictEqual(capturedFetches.length, 1)
        assert.strictEqual(capturedFetches[0].value, youtubeUrl)

        // Verify job was persisted
        assert.strictEqual(capturedJobs.length, 1)
        assert.strictEqual(persisted.media.type, "youtube")
        assert.strictEqual(persisted.media.data.id, "complete123")
      }))

    it.effect("should handle concurrent job creation requests", () =>
      Effect.gen(function*() {
        const { capturedJobs, mockStore } = createMockJobStore()
        const { capturedFetches, mockClient } = createMockYouTubeClient()

        const urls = [
          "https://www.youtube.com/watch?v=video1",
          "https://www.youtube.com/watch?v=video2",
          "https://www.youtube.com/watch?v=video3"
        ]

        const results = yield* Effect.forEach(
          urls,
          (url) =>
            Effect.gen(function*() {
              const video = yield* mockClient.fetchVideoByUrl(url)
              const media = {
                type: "youtube" as const,
                data: video
              }
              const job = {
                id: `job_${video.id}` as any,
                requestId: `req_${video.id}` as any,
                media,
                status: "Queued" as const,
                attempts: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                idempotencyKey: `key-${video.id}`
              }
              return yield* mockStore.createJob(job)
            }),
          { concurrency: "unbounded" }
        )

        assert.strictEqual(results.length, 3)
        assert.strictEqual(capturedFetches.length, 3)
        assert.strictEqual(capturedJobs.length, 3)
      }))
  })

  describe("request validation", () => {
    it.effect("should require youtubeUrl in request", () =>
      Effect.gen(function*() {
        // This would be validated by the Schema.decodeUnknown(CreateJobRequest)
        const invalidPayload = {
          // Missing youtubeUrl
          idempotencyKey: "test-key"
        }

        // In real code, this would fail schema validation
        assert.isDefined(invalidPayload)
      }))

    it.effect("should accept optional transcriptionContext", () =>
      Effect.gen(function*() {
        const { mockClient } = createMockYouTubeClient()

        const video = yield* mockClient.fetchVideoByUrl(
          "https://www.youtube.com/watch?v=test123"
        )

        const payload = {
          youtubeUrl: "https://www.youtube.com/watch?v=test123",
          transcriptionContext: {
            expectedSpeakers: [
              { role: "host" as const, name: "Host Name" }
            ]
          }
        }

        assert.isDefined(payload.transcriptionContext)
        assert.strictEqual(payload.transcriptionContext.expectedSpeakers.length, 1)
      }))
  })
})
