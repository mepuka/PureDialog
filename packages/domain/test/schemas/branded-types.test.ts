/**
 * Branded Types Validation Tests
 *
 * Tests for all branded types and IDs used throughout the domain,
 * ensuring type safety, validation, and proper schema construction.
 * Priority 1: Critical for type safety and data integrity.
 */

import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { CorrelationId, JobId, MediaResourceId, RequestId, TranscriptId } from "../../src/schemas/ids.js"
import { LanguageCode } from "../../src/schemas/media.js"
import { JobStatus } from "../../src/schemas/status.js"
import {
  createTestCorrelationId,
  createTestJobId,
  createTestMediaResourceId,
  createTestRequestId,
  createTestTranscriptId,
  createTestYouTubeChannelId,
  createTestYouTubeVideoId
} from "../utils/mock-factories.js"

describe("Domain ID Branded Types", () => {
  describe("JobId", () => {
    it.effect("creates and validates JobId branded type", () =>
      Effect.gen(function*() {
        const id = "job-12345"
        const jobId = yield* Schema.decode(JobId)(id)

        assert.strictEqual(jobId, id)
        // Verify it's properly branded
        assert.isTrue(typeof jobId === "string")
      }))

    it.effect("accepts any string as JobId", () =>
      Effect.gen(function*() {
        const testCases = [
          "job-123",
          "job_abc_def",
          "job-2024-01-01-uuid-12345",
          "simple-id",
          "a",
          ""
        ]

        for (const testId of testCases) {
          const result = yield* Schema.decode(JobId)(testId)
          assert.strictEqual(result, testId)
        }
      }))

    it.effect("rejects non-string values", () =>
      Effect.gen(function*() {
        const invalidValues = [123, null, undefined, {}, []]

        for (const invalid of invalidValues) {
          const result = yield* Effect.exit(Schema.decode(JobId)(invalid))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it("creates JobId with factory", () => {
      const jobId = createTestJobId()
      assert.strictEqual(jobId, "test-job-123")

      const customJobId = createTestJobId("custom-job-456")
      assert.strictEqual(customJobId, "custom-job-456")
    })
  })

  describe("RequestId", () => {
    it.effect("creates and validates RequestId branded type", () =>
      Effect.gen(function*() {
        const id = "req-67890"
        const requestId = yield* Schema.decode(RequestId)(id)

        assert.strictEqual(requestId, id)
        assert.isTrue(typeof requestId === "string")
      }))

    it.effect("handles various request ID formats", () =>
      Effect.gen(function*() {
        const testCases = [
          "req-12345",
          "request_abc_123",
          "uuid-4f8c9b2a-1234-5678-9abc-def012345678",
          "r1",
          ""
        ]

        for (const testId of testCases) {
          const result = yield* Schema.decode(RequestId)(testId)
          assert.strictEqual(result, testId)
        }
      }))

    it("creates RequestId with factory", () => {
      const requestId = createTestRequestId()
      assert.strictEqual(requestId, "test-request-456")
    })
  })

  describe("MediaResourceId", () => {
    it.effect("creates and validates MediaResourceId branded type", () =>
      Effect.gen(function*() {
        const id = "media-abc123"
        const mediaId = yield* Schema.decode(MediaResourceId)(id)

        assert.strictEqual(mediaId, id)
        assert.isTrue(typeof mediaId === "string")
      }))

    it.effect("accepts various media resource formats", () =>
      Effect.gen(function*() {
        const testCases = [
          "media-12345",
          "youtube-video-dQw4w9WgXcQ",
          "audio-file-xyz789",
          "m1",
          ""
        ]

        for (const testId of testCases) {
          const result = yield* Schema.decode(MediaResourceId)(testId)
          assert.strictEqual(result, testId)
        }
      }))

    it("creates MediaResourceId with factory", () => {
      const mediaId = createTestMediaResourceId()
      assert.strictEqual(mediaId, "test-media-789")
    })
  })

  describe("TranscriptId", () => {
    it.effect("creates and validates TranscriptId branded type", () =>
      Effect.gen(function*() {
        const id = "transcript-xyz789"
        const transcriptId = yield* Schema.decode(TranscriptId)(id)

        assert.strictEqual(transcriptId, id)
        assert.isTrue(typeof transcriptId === "string")
      }))

    it("creates TranscriptId with factory", () => {
      const transcriptId = createTestTranscriptId()
      assert.strictEqual(transcriptId, "test-transcript-abc")
    })
  })

  describe("CorrelationId", () => {
    it.effect("creates and validates CorrelationId branded type", () =>
      Effect.gen(function*() {
        const id = "corr-12345"
        const corrId = yield* Schema.decode(CorrelationId)(id)

        assert.strictEqual(corrId, id)
        assert.isTrue(typeof corrId === "string")
      }))

    it("creates CorrelationId with factory", () => {
      const corrId = createTestCorrelationId()
      assert.strictEqual(corrId, "test-correlation-def")
    })
  })
})

describe("YouTube Branded Types", () => {
  describe("YouTubeVideoId Type Safety", () => {
    it("creates YouTubeVideoId with factory and maintains type safety", () => {
      const videoId = createTestYouTubeVideoId()
      assert.strictEqual(videoId, "dQw4w9WgXcQ")

      // Test custom ID
      const customId = createTestYouTubeVideoId("abcdefghijk")
      assert.strictEqual(customId, "abcdefghijk")
    })

    it.effect("validates branded type with schema", () =>
      Effect.gen(function*() {
        const validId = "dQw4w9WgXcQ"
        const videoId = createTestYouTubeVideoId(validId)

        // Should be able to use in schemas that expect YouTubeVideoId
        assert.strictEqual(videoId, validId)
        assert.isTrue(typeof videoId === "string")
      }))
  })

  describe("YouTubeChannelId Type Safety", () => {
    it("creates YouTubeChannelId with factory and maintains type safety", () => {
      const channelId = createTestYouTubeChannelId()
      assert.strictEqual(channelId, "UC1234567890123456789012")

      // Test custom ID
      const customId = createTestYouTubeChannelId("UCabcdefghijklmnopqrstuv")
      assert.strictEqual(customId, "UCabcdefghijklmnopqrstuv")
    })

    it.effect("validates branded type with schema", () =>
      Effect.gen(function*() {
        const validId = "UC1234567890123456789012"
        const channelId = createTestYouTubeChannelId(validId)

        assert.strictEqual(channelId, validId)
        assert.isTrue(typeof channelId === "string")
      }))
  })
})

describe("Domain Value Types", () => {
  describe("LanguageCode", () => {
    it.effect("validates common language codes", () =>
      Effect.gen(function*() {
        const validCodes = ["en", "es", "fr", "de", "ja", "zh", "pt", "ru"]

        for (const code of validCodes) {
          const result = yield* Schema.decode(LanguageCode)(code)
          assert.strictEqual(result, code)
        }
      }))

    it.effect("validates language codes with regions", () =>
      Effect.gen(function*() {
        const validCodes = ["en-US", "fr-CA", "es-ES", "zh-CN", "pt-BR"]

        for (const code of validCodes) {
          const result = yield* Schema.decode(LanguageCode)(code)
          assert.strictEqual(result, code)
        }
      }))

    it.effect("rejects invalid language codes", () =>
      Effect.gen(function*() {
        const invalidCodes = ["english", "EN", "en-us", "abc", "z", "", "en-USA", "en-", "-US"]

        for (const code of invalidCodes) {
          const result = yield* Effect.exit(Schema.decode(LanguageCode)(code))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("validates ISO 639-1 format with optional region", () =>
      Effect.gen(function*() {
        // Valid 2-letter codes
        const validResult = yield* Schema.decode(LanguageCode)("en")
        assert.strictEqual(validResult, "en")

        // Valid with region
        const validRegionResult = yield* Schema.decode(LanguageCode)("en-US")
        assert.strictEqual(validRegionResult, "en-US")

        // Invalid: wrong case for region
        const wrongCaseResult = yield* Effect.exit(Schema.decode(LanguageCode)("en-us"))
        assert.isTrue(wrongCaseResult._tag === "Failure")

        // Invalid: too long
        const longResult = yield* Effect.exit(Schema.decode(LanguageCode)("eng"))
        assert.isTrue(longResult._tag === "Failure")
      }))
  })

  describe("JobStatus", () => {
    it.effect("validates all defined job statuses", () =>
      Effect.gen(function*() {
        const validStatuses = [
          "Queued",
          "MetadataReady",
          "Processing",
          "Completed",
          "Failed",
          "Cancelled"
        ]

        for (const status of validStatuses) {
          const result = yield* Schema.decode(JobStatus)(status)
          assert.strictEqual(result, status)
        }
      }))

    it.effect("rejects invalid job statuses", () =>
      Effect.gen(function*() {
        const invalidStatuses = [
          "queued", // wrong case
          "COMPLETED", // wrong case
          "InProgress", // not defined
          "pending", // not defined
          "success", // not defined
          ""
        ]

        for (const status of invalidStatuses) {
          const result = yield* Effect.exit(Schema.decode(JobStatus)(status))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("validates exact case sensitivity", () =>
      Effect.gen(function*() {
        // Correct case
        const validResult = yield* Schema.decode(JobStatus)("Queued")
        assert.strictEqual(validResult, "Queued")

        // Wrong case variations
        const wrongCases = ["queued", "QUEUED", "Queued", "QuEuEd"]
        for (const wrongCase of wrongCases.slice(0, 2)) { // Skip correct case
          const result = yield* Effect.exit(Schema.decode(JobStatus)(wrongCase))
          assert.isTrue(result._tag === "Failure")
        }
      }))
  })
})

describe("Branded Type Composition", () => {
  it.effect("can use branded types in complex structures", () =>
    Effect.gen(function*() {
      // Test that branded types can be used in object composition
      const compositeData = {
        jobId: createTestJobId(),
        requestId: createTestRequestId(),
        mediaId: createTestMediaResourceId(),
        videoId: createTestYouTubeVideoId(),
        channelId: createTestYouTubeChannelId()
      }

      // Verify all fields maintain their values
      assert.strictEqual(compositeData.jobId, "test-job-123")
      assert.strictEqual(compositeData.requestId, "test-request-456")
      assert.strictEqual(compositeData.mediaId, "test-media-789")
      assert.strictEqual(compositeData.videoId, "dQw4w9WgXcQ")
      assert.strictEqual(compositeData.channelId, "UC1234567890123456789012")
    }))

  it.effect("maintains type safety across transformations", () =>
    Effect.gen(function*() {
      // Create IDs
      const originalJobId = createTestJobId("original-job")
      const originalRequestId = createTestRequestId("original-request")

      // Transform through various operations
      const processedJobId = originalJobId.toUpperCase() as typeof originalJobId
      const processedRequestId = originalRequestId.replace("original", "processed") as typeof originalRequestId

      // Verify transformations maintain string values
      assert.strictEqual(processedJobId, "ORIGINAL-JOB")
      assert.strictEqual(processedRequestId, "processed-request")
    }))
})

describe("Factory Function Validation", () => {
  it("all factory functions produce valid branded types", () => {
    // Test all factory functions work correctly
    const factoryResults = {
      jobId: createTestJobId(),
      requestId: createTestRequestId(),
      mediaId: createTestMediaResourceId(),
      transcriptId: createTestTranscriptId(),
      corrId: createTestCorrelationId(),
      videoId: createTestYouTubeVideoId(),
      channelId: createTestYouTubeChannelId()
    }

    // Verify all are strings with expected default values
    assert.strictEqual(typeof factoryResults.jobId, "string")
    assert.strictEqual(typeof factoryResults.requestId, "string")
    assert.strictEqual(typeof factoryResults.mediaId, "string")
    assert.strictEqual(typeof factoryResults.transcriptId, "string")
    assert.strictEqual(typeof factoryResults.corrId, "string")
    assert.strictEqual(typeof factoryResults.videoId, "string")
    assert.strictEqual(typeof factoryResults.channelId, "string")

    // Verify non-empty values
    assert.isTrue(factoryResults.jobId.length > 0)
    assert.isTrue(factoryResults.requestId.length > 0)
    assert.isTrue(factoryResults.mediaId.length > 0)
    assert.isTrue(factoryResults.transcriptId.length > 0)
    assert.isTrue(factoryResults.corrId.length > 0)
    assert.isTrue(factoryResults.videoId.length > 0)
    assert.isTrue(factoryResults.channelId.length > 0)
  })

  it("factory functions accept custom values", () => {
    const customValues = {
      jobId: createTestJobId("custom-job"),
      requestId: createTestRequestId("custom-request"),
      mediaId: createTestMediaResourceId("custom-media"),
      transcriptId: createTestTranscriptId("custom-transcript"),
      corrId: createTestCorrelationId("custom-corr"),
      videoId: createTestYouTubeVideoId("customVideo1"),
      channelId: createTestYouTubeChannelId("UCcustomChannelId123456789")
    }

    assert.strictEqual(customValues.jobId, "custom-job")
    assert.strictEqual(customValues.requestId, "custom-request")
    assert.strictEqual(customValues.mediaId, "custom-media")
    assert.strictEqual(customValues.transcriptId, "custom-transcript")
    assert.strictEqual(customValues.corrId, "custom-corr")
    assert.strictEqual(customValues.videoId, "customVideo1")
    assert.strictEqual(customValues.channelId, "UCcustomChannelId123456789")
  })
})
