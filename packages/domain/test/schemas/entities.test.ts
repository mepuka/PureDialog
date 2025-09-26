/**
 * Critical Domain Entity Validation Tests
 *
 * Tests for core domain entities including TranscriptionJob, MediaMetadata,
 * MediaResource discriminated unions, and complex entity validation.
 * Priority 1: Critical for data integrity and business logic validation.
 */

import { assert, describe, it } from "@effect/vitest"
import { DateTime, Effect, Schema } from "effect"
import { TranscriptionJob } from "../../src/schemas/entities.js"
import type { TranscriptId } from "../../src/schemas/ids.js"
import type { LanguageCode } from "../../src/schemas/media.js"
import { MediaMetadata, MediaResource, YouTubeVideoResource } from "../../src/schemas/media.js"
import type { JobStatus } from "../../src/schemas/status.js"
import {
  createTestJobId,
  createTestMediaResourceId,
  createTestRequestId,
  createTestYouTubeChannelId,
  createTestYouTubeVideo,
  createTestYouTubeVideoId
} from "../utils/mock-factories.js"

describe("TranscriptionJob Entity Validation", () => {
  const createValidTranscriptionJob = () =>
    TranscriptionJob.make({
      id: createTestJobId(),
      requestId: createTestRequestId(),
      media: {
        type: "youtube" as const,
        data: createTestYouTubeVideo()
      },
      status: "Queued" as const,
      attempts: 0,
      createdAt: new Date("2024-01-01T10:00:00Z"),
      updatedAt: new Date("2024-01-01T10:00:00Z")
    })

  it.effect("creates valid TranscriptionJob with required fields", () =>
    Effect.gen(function*() {
      const job = yield* Effect.succeed(createValidTranscriptionJob())

      // Verify all required fields are present and valid
      assert.strictEqual(job.id, "test-job-123")
      assert.strictEqual(job.requestId, "test-request-456")
      assert.strictEqual(job.status, "Queued")
      assert.strictEqual(job.attempts, 0)
      assert.isTrue(job.createdAt instanceof Date)
      assert.isTrue(job.updatedAt instanceof Date)

      // Verify media resource structure
      assert.strictEqual(job.media.type, "youtube")
      assert.strictEqual(job.media.data.id, "dQw4w9WgXcQ")
    }))

  it.effect("validates optional fields behavior", () =>
    Effect.gen(function*() {
      const job = yield* Effect.succeed(createValidTranscriptionJob())

      // Optional fields should be undefined by default
      assert.isUndefined(job.transcriptId)
      assert.isUndefined(job.error)
      assert.isUndefined(job.transcriptionContext)
      assert.isUndefined(job.metadata)

      // Test with optional fields set
      const jobWithOptionals = yield* Effect.succeed(TranscriptionJob.make({
        ...job,
        transcriptId: "test-transcript-123" as TranscriptId,
        error: "Processing failed",
        metadata: { priority: "high" }
      }))

      assert.strictEqual(jobWithOptionals.transcriptId, "test-transcript-123")
      assert.strictEqual(jobWithOptionals.error, "Processing failed")
      assert.strictEqual(jobWithOptionals.metadata?.priority, "high")
    }))

  it.effect("validates JobStatus enum values", () =>
    Effect.gen(function*() {
      const validStatuses: Array<JobStatus> = [
        "Queued",
        "MetadataReady",
        "Processing",
        "Completed",
        "Failed",
        "Cancelled"
      ]

      for (const status of validStatuses) {
        const job = TranscriptionJob.make({
          ...createValidTranscriptionJob(),
          status
        })
        assert.strictEqual(job.status, status)
      }
    }))

  it.effect("validates attempts field constraints", () =>
    Effect.gen(function*() {
      // Valid attempts values
      const validAttempts = [0, 1, 5, 10]

      for (const attempts of validAttempts) {
        const job = TranscriptionJob.make({
          ...createValidTranscriptionJob(),
          attempts
        })
        assert.strictEqual(job.attempts, attempts)
      }
    }))

  it.effect("rejects invalid JobStatus values", () =>
    Effect.gen(function*() {
      const invalidStatuses = ["pending", "COMPLETED", "in-progress", ""]

      for (const status of invalidStatuses) {
        const result = yield* Effect.exit(
          Effect.sync(() =>
            TranscriptionJob.make({
              ...createValidTranscriptionJob(),
              status: status as JobStatus
            })
          )
        )
        assert.isTrue(result._tag === "Failure")
      }
    }))
})

describe("MediaMetadata Entity Validation", () => {
  const createValidMediaMetadata = () => ({
    mediaResourceId: createTestMediaResourceId(),
    jobId: createTestJobId(),
    title: "Test Interview: The Future of AI",
    format: "one_on_one_interview" as const,
    tags: ["AI", "Technology", "Interview"],
    domain: ["Technology", "Artificial Intelligence"],
    speakers: [
      { role: "host" as const, name: "John Host" },
      { role: "guest" as const, name: "Jane Expert" }
    ],
    language: "en" as LanguageCode,
    speakerCount: 2,
    durationSec: 3600,
    links: ["https://example.com/resource"],
    createdAt: "2024-01-01T12:00:00Z"
  })

  it.effect("creates valid MediaMetadata with all required fields", () =>
    Effect.gen(function*() {
      const metadata = yield* Schema.decode(MediaMetadata)(createValidMediaMetadata())

      assert.strictEqual(metadata.title, "Test Interview: The Future of AI")
      assert.strictEqual(metadata.format, "one_on_one_interview")
      assert.strictEqual(metadata.language, "en")
      assert.strictEqual(metadata.speakerCount, 2)
      assert.strictEqual(metadata.durationSec, 3600)
      assert.isTrue(Array.isArray(metadata.tags))
      assert.isTrue(Array.isArray(metadata.domain))
      assert.isTrue(Array.isArray(metadata.speakers))
      assert.isTrue(Array.isArray(metadata.links))
    }))

  it.effect("validates MediaFormat enum values", () =>
    Effect.gen(function*() {
      const validFormats = [
        "one_on_one_interview",
        "lecture",
        "panel_discussion",
        "tv_intervew",
        "radio_interview"
      ]

      for (const format of validFormats) {
        const metadataData = {
          ...createValidMediaMetadata(),
          format
        }
        const metadata = yield* Schema.decode(MediaMetadata)(metadataData)
        assert.strictEqual(metadata.format, format)
      }
    }))

  it.effect("validates required array fields have minimum items", () =>
    Effect.gen(function*() {
      const baseMetadata = createValidMediaMetadata()

      // Test empty arrays should fail
      const emptyArrayTests = [
        { field: "tags", value: [] },
        { field: "domain", value: [] },
        { field: "speakers", value: [] }
      ]

      for (const { field, value } of emptyArrayTests) {
        const invalidMetadata = { ...baseMetadata, [field]: value }
        const result = yield* Effect.exit(Schema.decode(MediaMetadata)(invalidMetadata))
        assert.isTrue(result._tag === "Failure")
      }
    }))

  it.effect("validates positive numeric constraints", () =>
    Effect.gen(function*() {
      const baseMetadata = createValidMediaMetadata()

      // Valid positive values
      const validValues = [1, 10, 3600, 7200]
      for (const value of validValues) {
        const metadata = yield* Schema.decode(MediaMetadata)({
          ...baseMetadata,
          speakerCount: value,
          durationSec: value
        })
        assert.strictEqual(metadata.speakerCount, value)
        assert.strictEqual(metadata.durationSec, value)
      }

      // Invalid non-positive values
      const invalidValues = [0, -1, -10]
      for (const value of invalidValues) {
        const speakerResult = yield* Effect.exit(
          Schema.decode(MediaMetadata)({
            ...baseMetadata,
            speakerCount: value
          })
        )
        const durationResult = yield* Effect.exit(
          Schema.decode(MediaMetadata)({
            ...baseMetadata,
            durationSec: value
          })
        )

        assert.isTrue(speakerResult._tag === "Failure")
        assert.isTrue(durationResult._tag === "Failure")
      }
    }))

  it.effect("validates link URL patterns", () =>
    Effect.gen(function*() {
      const baseMetadata = createValidMediaMetadata()

      // Valid URLs
      const validUrls = [
        "https://example.com",
        "http://test.org/path",
        "https://youtube.com/watch?v=abc123",
        "http://localhost:3000/api"
      ]

      for (const url of validUrls) {
        const metadata = yield* Schema.decode(MediaMetadata)({
          ...baseMetadata,
          links: [url]
        })
        assert.strictEqual(metadata.links[0], url)
      }

      // Invalid URLs
      const invalidUrls = [
        "ftp://example.com",
        "example.com",
        "mailto:test@example.com",
        "not-a-url",
        ""
      ]

      for (const url of invalidUrls) {
        const result = yield* Effect.exit(
          Schema.decode(MediaMetadata)({
            ...baseMetadata,
            links: [url]
          })
        )
        assert.isTrue(result._tag === "Failure")
      }
    }))

  it.effect("validates Speaker structure within metadata", () =>
    Effect.gen(function*() {
      const baseMetadata = createValidMediaMetadata()

      // Test complete speaker information
      const fullSpeaker = {
        role: "guest" as const,
        name: "Dr. Jane Smith",
        affiliation: {
          name: "AI Research Institute",
          url: "https://airesearch.org"
        },
        bio: "Leading researcher in artificial intelligence"
      }

      const metadata = yield* Schema.decode(MediaMetadata)({
        ...baseMetadata,
        speakers: [fullSpeaker]
      })

      assert.strictEqual(metadata.speakers[0].role, "guest")
      assert.strictEqual(metadata.speakers[0].name, "Dr. Jane Smith")
      assert.strictEqual(metadata.speakers[0].affiliation?.name, "AI Research Institute")
      assert.strictEqual(metadata.speakers[0].bio, "Leading researcher in artificial intelligence")
    }))

  it.effect("validates optional fields behavior", () =>
    Effect.gen(function*() {
      const minimalMetadata = {
        mediaResourceId: createTestMediaResourceId(),
        jobId: createTestJobId(),
        title: "Minimal Test",
        format: "lecture" as const,
        tags: ["test"],
        domain: ["education"],
        speakers: [{ role: "host" as const }],
        language: "en" as LanguageCode,
        speakerCount: 1,
        durationSec: 1800,
        links: [],
        createdAt: new Date().toISOString()
      }

      const metadata = yield* Schema.decode(MediaMetadata)(minimalMetadata)

      // Optional fields should be undefined
      assert.isUndefined(metadata.organization)
      assert.isUndefined(metadata.summary)
      assert.isUndefined(metadata.speakers[0].name)
      assert.isUndefined(metadata.speakers[0].affiliation)
      assert.isUndefined(metadata.speakers[0].bio)
    }))
})

describe("MediaResource Discriminated Union", () => {
  it.effect("validates YouTube video resource type", () =>
    Effect.gen(function*() {
      const youtubeResource = {
        type: "youtube" as const,
        data: {
          ...createTestYouTubeVideo(),
          publishedAt: "2024-01-01T12:00:00Z"
        }
      }

      const resource = yield* Schema.decode(MediaResource)(youtubeResource)

      assert.strictEqual(resource.type, "youtube")
      assert.strictEqual(resource.data.id, "dQw4w9WgXcQ")
      assert.strictEqual(resource.data.title, "Test Video Title")
    }))

  it.effect("validates YouTube channel resource type", () =>
    Effect.gen(function*() {
      const channelResource = {
        type: "youtube#channel" as const,
        data: {
          id: createTestYouTubeChannelId(),
          title: "Test Channel",
          description: "Test channel description",
          publishedAt: "2020-01-01T00:00:00Z",
          thumbnails: {
            default: undefined,
            medium: undefined,
            high: undefined,
            standard: undefined,
            maxres: undefined
          },
          subscriberCount: 1000,
          videoCount: 50,
          viewCount: 100000
        }
      }

      const resource = yield* Schema.decode(MediaResource)(channelResource)

      assert.strictEqual(resource.type, "youtube#channel")
      assert.strictEqual(resource.data.id, "UC1234567890123456789012")
      assert.strictEqual(resource.data.title, "Test Channel")
    }))

  it.effect("rejects invalid resource types", () =>
    Effect.gen(function*() {
      const invalidResources = [
        { type: "spotify", data: {} },
        { type: "podcast", data: {} },
        { type: "invalid", data: {} },
        { type: "", data: {} }
      ]

      for (const resource of invalidResources) {
        const result = yield* Effect.exit(Schema.decode(MediaResource)(resource))
        assert.isTrue(result._tag === "Failure")
      }
    }))

  it.effect("validates data field matches resource type", () =>
    Effect.gen(function*() {
      // Wrong data type for youtube resource
      const mismatchedResource = {
        type: "youtube" as const,
        data: {
          id: "not-a-youtube-video",
          title: "Invalid"
        }
      }

      const result = yield* Effect.exit(Schema.decode(MediaResource)(mismatchedResource))
      assert.isTrue(result._tag === "Failure")
    }))
})

describe("YouTubeVideoResource Class Entity", () => {
  const createValidYouTubeVideoResource = () => ({
    type: "youtube" as const,
    id: createTestMediaResourceId(),
    metadata: {
      mediaResourceId: createTestMediaResourceId(),
      jobId: createTestJobId(),
      title: "YouTube Video Test",
      format: "one_on_one_interview" as const,
      tags: ["youtube", "test"],
      domain: ["technology"],
      speakers: [{ role: "host" as const }],
      language: "en" as LanguageCode,
      speakerCount: 1,
      durationSec: 1800,
      links: [],
      createdAt: new Date()
    },
    data: createTestYouTubeVideo()
  })

  it.effect("creates valid YouTubeVideoResource class instance", () =>
    Effect.gen(function*() {
      const resource = YouTubeVideoResource.make(createValidYouTubeVideoResource())

      assert.strictEqual(resource.type, "youtube")
      assert.strictEqual(resource.metadata.title, "YouTube Video Test")
      assert.strictEqual(resource.data.id, "dQw4w9WgXcQ")
      assert.strictEqual(resource.data.title, "Test Video Title")
    }))

  it.effect("validates complete resource with nested validation", () =>
    Effect.gen(function*() {
      const resourceData = createValidYouTubeVideoResource()
      const resource = YouTubeVideoResource.make(resourceData)

      // Verify metadata validation
      assert.isTrue(Array.isArray(resource.metadata.tags))
      assert.isTrue(resource.metadata.tags.length > 0)
      assert.isTrue(resource.metadata.speakerCount > 0)
      assert.isTrue(resource.metadata.durationSec > 0)

      // Verify YouTube data validation
      assert.strictEqual(resource.data.id.length, 11)
      assert.isTrue(resource.data.title.length > 0)
      assert.isTrue(resource.data.duration > 0)
    }))
})

describe("Entity Integration and Composition", () => {
  it.effect("validates complete TranscriptionJob with nested entities", () =>
    Effect.gen(function*() {
      const completeJob = TranscriptionJob.make({
        id: createTestJobId("integration-test"),
        requestId: createTestRequestId("integration-request"),
        media: {
          type: "youtube" as const,
          data: {
            id: createTestYouTubeVideoId("integra11id"),
            title: "Integration Test Video",
            description: "Testing complete entity composition",
            publishedAt: DateTime.unsafeFromDate(new Date("2024-01-01T15:00:00Z")),
            channelId: createTestYouTubeChannelId(),
            channelTitle: "Integration Test Channel",
            thumbnails: [],
            duration: 2400,
            viewCount: 5000,
            likeCount: 100,
            commentCount: 25,
            tags: ["integration", "test"]
          }
        },
        status: "Processing" as const,
        attempts: 1,
        createdAt: new Date("2024-01-01T14:00:00Z"),
        updatedAt: new Date("2024-01-01T15:00:00Z"),
        transcriptId: "integration-transcript-123" as TranscriptId,
        metadata: {
          priority: "normal"
        }
      })

      // Verify top-level job fields
      assert.strictEqual(completeJob.id, "integration-test")
      assert.strictEqual(completeJob.status, "Processing")
      assert.strictEqual(completeJob.attempts, 1)

      // Verify nested media resource
      assert.strictEqual(completeJob.media.type, "youtube")
      assert.strictEqual(completeJob.media.data.title, "Integration Test Video")
      assert.strictEqual(completeJob.media.data.duration, 2400)

      // Verify optional fields
      assert.strictEqual(completeJob.transcriptId, "integration-transcript-123")
      assert.strictEqual(completeJob.metadata?.priority, "normal")
    }))

  it.effect("validates entity relationships and constraints", () =>
    Effect.gen(function*() {
      // Test that entity IDs maintain consistency
      const mediaResourceId = createTestMediaResourceId("consistent-id")
      const jobId = createTestJobId("consistent-job")

      const metadata = {
        mediaResourceId,
        jobId,
        title: "Consistency Test",
        format: "lecture" as const,
        tags: ["consistency"],
        domain: ["testing"],
        speakers: [{ role: "host" as const }],
        language: "en" as LanguageCode,
        speakerCount: 1,
        durationSec: 1800,
        links: [],
        createdAt: new Date()
      }

      const videoResource = YouTubeVideoResource.make({
        type: "youtube" as const,
        id: mediaResourceId,
        metadata,
        data: createTestYouTubeVideo()
      })

      const job = TranscriptionJob.make({
        id: jobId,
        requestId: createTestRequestId(),
        media: {
          type: "youtube" as const,
          data: videoResource.data
        },
        status: "Queued" as const,
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Verify ID consistency
      assert.strictEqual(videoResource.id, mediaResourceId)
      assert.strictEqual(videoResource.metadata.jobId, jobId)
      assert.strictEqual(job.id, jobId)
    }))
})
