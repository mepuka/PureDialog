/**
 * YouTube Adapter Transformation Tests
 *
 * Tests for YouTube API to domain transformations, focusing on data accuracy,
 * error handling, validation, and all transformation pathways.
 * Priority 1: Critical for API integration and data consistency.
 */

import { assert, describe, it } from "@effect/vitest"
import type { youtube_v3 } from "@googleapis/youtube"
import { DateTime, Effect, Option } from "effect"
import { YouTubeAdapter, YouTubeAdapterError, YouTubeAdapterLive } from "../../src/adapters/youtube.js"

describe("YouTube Adapter - API Video Transformations", () => {
  const createMockApiVideo = (overrides: Partial<youtube_v3.Schema$Video> = {}): youtube_v3.Schema$Video => ({
    id: "dQw4w9WgXcQ",
    snippet: {
      title: "Test Video Title",
      description: "Test video description with detailed content",
      publishedAt: "2024-01-01T12:00:00Z",
      channelId: "UC1234567890123456789012",
      channelTitle: "Test Channel",
      thumbnails: {
        default: { url: "https://example.com/thumb_default.jpg", width: 120, height: 90 },
        medium: { url: "https://example.com/thumb_medium.jpg", width: 320, height: 180 },
        high: { url: "https://example.com/thumb_high.jpg", width: 480, height: 360 }
      },
      tags: ["test", "video", "sample"]
    },
    contentDetails: {
      duration: "PT30M45S"
    },
    statistics: {
      viewCount: "10000",
      likeCount: "500",
      commentCount: "25"
    },
    ...overrides
  })

  it.effect("transforms complete API video to domain successfully", () =>
    Effect.gen(function*() {
      const apiVideo = createMockApiVideo()
      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(apiVideo)

      assert.strictEqual(domainVideo.id, "dQw4w9WgXcQ")
      assert.strictEqual(domainVideo.title, "Test Video Title")
      assert.strictEqual(domainVideo.description, "Test video description with detailed content")
      assert.strictEqual(domainVideo.channelId, "UC1234567890123456789012")
      assert.strictEqual(domainVideo.channelTitle, "Test Channel")
      assert.strictEqual(domainVideo.duration, 1845) // 30*60 + 45 = 1845 seconds
      assert.strictEqual(domainVideo.viewCount, 10000)
      assert.strictEqual(domainVideo.likeCount, 500)
      assert.strictEqual(domainVideo.commentCount, 25)
      assert.isTrue(Array.isArray(domainVideo.tags))
      assert.strictEqual(domainVideo.tags.length, 3)
      assert.isTrue(Array.isArray(domainVideo.thumbnails))
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("handles missing optional fields gracefully", () =>
    Effect.gen(function*() {
      const minimalApiVideo = {
        id: "dQw4w9WgXcQ",
        snippet: {
          title: "Minimal Video",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012"
          // Missing description, channelTitle, thumbnails, tags
        },
        contentDetails: {
          duration: "PT5M30S"
        }
        // Missing statistics completely
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(minimalApiVideo)

      assert.strictEqual(domainVideo.id, "dQw4w9WgXcQ")
      assert.strictEqual(domainVideo.title, "Minimal Video")
      assert.strictEqual(domainVideo.description, "") // Default empty string
      assert.strictEqual(domainVideo.channelTitle, "") // Default empty string
      assert.strictEqual(domainVideo.duration, 330) // 5*60 + 30 = 330 seconds
      assert.strictEqual(domainVideo.viewCount, 0) // Default zero
      assert.strictEqual(domainVideo.likeCount, 0) // Default zero
      assert.strictEqual(domainVideo.commentCount, 0) // Default zero
      assert.isTrue(Array.isArray(domainVideo.tags))
      assert.strictEqual(domainVideo.tags.length, 0) // Empty array
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("validates duration parsing edge cases", () =>
    Effect.gen(function*() {
      const testCases = [
        { input: "PT30M0S", expected: 1800 },
        { input: "PT1H30M45S", expected: 5445 },
        { input: "PT45S", expected: 45 },
        { input: "PT0S", expected: 0 },
        { input: "", expected: 0 }, // Invalid duration defaults to 0
        { input: "invalid", expected: 0 }
      ]

      const adapter = yield* YouTubeAdapter

      for (const { expected, input } of testCases) {
        const apiVideo = createMockApiVideo({
          contentDetails: { duration: input }
        })

        const domainVideo = yield* adapter.toDomainVideo(apiVideo)
        assert.strictEqual(domainVideo.duration, expected, `Failed for duration: ${input}`)
      }
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("handles thumbnail transformation correctly", () =>
    Effect.gen(function*() {
      const apiVideo = createMockApiVideo({
        snippet: {
          title: "Thumbnail Test",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012",
          thumbnails: {
            default: { url: "https://example.com/default.jpg", width: 120, height: 90 },
            medium: { url: "https://example.com/medium.jpg" }, // Missing width/height
            high: undefined, // Missing thumbnail
            standard: { url: "https://example.com/standard.jpg", width: 640, height: 480 },
            maxres: { url: "https://example.com/maxres.jpg", width: 1280, height: 720 }
          }
        }
      })

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.toDomainVideo(apiVideo)

      assert.isTrue(Array.isArray(domainVideo.thumbnails))
      assert.strictEqual(domainVideo.thumbnails.length, 1)

      const thumbnails = domainVideo.thumbnails[0]

      // Test default thumbnail
      assert.isTrue(Option.isSome(thumbnails.default))
      if (Option.isSome(thumbnails.default)) {
        assert.strictEqual(thumbnails.default.value.url, "https://example.com/default.jpg")
        assert.isTrue(Option.isSome(thumbnails.default.value.width))
        assert.strictEqual(thumbnails.default.value.width.value, 120)
      }

      // Test medium thumbnail (missing dimensions)
      assert.isTrue(Option.isSome(thumbnails.medium))
      if (Option.isSome(thumbnails.medium)) {
        assert.strictEqual(thumbnails.medium.value.url, "https://example.com/medium.jpg")
        assert.isTrue(Option.isNone(thumbnails.medium.value.width))
      }

      // Test missing thumbnail
      assert.isTrue(Option.isNone(thumbnails.high))
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("rejects API video with missing required fields", () =>
    Effect.gen(function*() {
      const adapter = yield* YouTubeAdapter

      // Missing ID
      const noIdResult = yield* Effect.exit(
        adapter.toDomainVideo({ snippet: { title: "Test" } } as any)
      )
      assert.isTrue(noIdResult._tag === "Failure")

      // Missing snippet
      const noSnippetResult = yield* Effect.exit(
        adapter.toDomainVideo({ id: "test123" } as any)
      )
      assert.isTrue(noSnippetResult._tag === "Failure")

      // Null/undefined video
      const nullResult = yield* Effect.exit(
        adapter.toDomainVideo(null as any)
      )
      assert.isTrue(nullResult._tag === "Failure")
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - API Channel Transformations", () => {
  const createMockApiChannel = (overrides: Partial<youtube_v3.Schema$Channel> = {}): youtube_v3.Schema$Channel => ({
    id: "UC1234567890123456789012",
    snippet: {
      title: "Test Channel",
      description: "Test channel description",
      publishedAt: "2020-01-01T00:00:00Z",
      thumbnails: {
        default: { url: "https://example.com/channel_default.jpg", width: 88, height: 88 },
        medium: { url: "https://example.com/channel_medium.jpg", width: 240, height: 240 }
      }
    },
    statistics: {
      subscriberCount: "100000",
      videoCount: "250",
      viewCount: "5000000"
    },
    ...overrides
  })

  it.effect("transforms complete API channel to domain successfully", () =>
    Effect.gen(function*() {
      const apiChannel = createMockApiChannel()
      const adapter = yield* YouTubeAdapter
      const domainChannel = yield* adapter.toDomainChannel(apiChannel)

      assert.strictEqual(domainChannel.id, "UC1234567890123456789012")
      assert.strictEqual(domainChannel.title, "Test Channel")
      assert.strictEqual(domainChannel.description, "Test channel description")
      assert.strictEqual(domainChannel.subscriberCount, 100000)
      assert.strictEqual(domainChannel.videoCount, 250)
      assert.strictEqual(domainChannel.viewCount, 5000000)
      assert.isDefined(domainChannel.thumbnails)
      assert.isDefined(domainChannel.publishedAt)
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("handles missing channel statistics gracefully", () =>
    Effect.gen(function*() {
      const channelWithoutStats = createMockApiChannel({
        statistics: undefined // Missing all statistics
      })

      const adapter = yield* YouTubeAdapter
      const domainChannel = yield* adapter.toDomainChannel(channelWithoutStats)

      assert.strictEqual(domainChannel.subscriberCount, 0)
      assert.strictEqual(domainChannel.videoCount, 0)
      assert.strictEqual(domainChannel.viewCount, 0)
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("rejects API channel with missing required fields", () =>
    Effect.gen(function*() {
      const adapter = yield* YouTubeAdapter

      // Missing ID
      const noIdResult = yield* Effect.exit(
        adapter.toDomainChannel({ snippet: { title: "Test" } } as any)
      )
      assert.isTrue(noIdResult._tag === "Failure")

      // Missing snippet
      const noSnippetResult = yield* Effect.exit(
        adapter.toDomainChannel({ id: "UC123" } as any)
      )
      assert.isTrue(noSnippetResult._tag === "Failure")
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - MediaResource Transformations", () => {
  it.effect("transforms API video to MediaResource directly", () =>
    Effect.gen(function*() {
      const apiVideo = {
        id: "testVideo123",
        snippet: {
          title: "MediaResource Test Video",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012"
        },
        contentDetails: { duration: "PT10M0S" },
        statistics: { viewCount: "1000" }
      }

      const adapter = yield* YouTubeAdapter
      const mediaResource = yield* adapter.apiVideoToMediaResource(apiVideo)

      assert.strictEqual(mediaResource.type, "youtube")
      assert.strictEqual(mediaResource.data.id, "testVideo123")
      assert.strictEqual(mediaResource.data.title, "MediaResource Test Video")
      assert.strictEqual(mediaResource.data.duration, 600) // 10 minutes
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("transforms API channel to MediaResource directly", () =>
    Effect.gen(function*() {
      const apiChannel = {
        id: "UC1234567890123456789012",
        snippet: {
          title: "MediaResource Test Channel",
          publishedAt: "2020-01-01T00:00:00Z"
        },
        statistics: { subscriberCount: "50000" }
      }

      const adapter = yield* YouTubeAdapter
      const mediaResource = yield* adapter.apiChannelToMediaResource(apiChannel)

      assert.strictEqual(mediaResource.type, "youtube#channel")
      assert.strictEqual(mediaResource.data.id, "UC1234567890123456789012")
      assert.strictEqual(mediaResource.data.title, "MediaResource Test Channel")
      assert.strictEqual(mediaResource.data.subscriberCount, 50000)
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("converts domain video to MediaResource", () =>
    Effect.gen(function*() {
      const domainVideo = {
        id: "domainVideo123" as any,
        title: "Domain Video Test",
        description: "Test description",
        publishedAt: DateTime.unsafeFromDate(new Date("2024-01-01T12:00:00Z")),
        channelId: "UC1234567890123456789012" as any,
        channelTitle: "Test Channel",
        thumbnails: [],
        duration: 1200,
        viewCount: 2000,
        likeCount: 100,
        commentCount: 10,
        tags: ["domain", "test"]
      }

      const adapter = yield* YouTubeAdapter
      const mediaResource = adapter.toMediaResourceVideo(domainVideo)

      assert.strictEqual(mediaResource.type, "youtube")
      assert.strictEqual(mediaResource.data.id, "domainVideo123")
      assert.strictEqual(mediaResource.data.title, "Domain Video Test")
      assert.strictEqual(mediaResource.data.duration, 1200)
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - Validation", () => {
  it.effect("validates video with all required fields", () =>
    Effect.gen(function*() {
      const validVideo = {
        id: "validVideo123",
        snippet: {
          title: "Valid Video",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012"
        }
      }

      const adapter = yield* YouTubeAdapter
      const result = yield* adapter.validateVideo(validVideo)

      assert.strictEqual(result.id, "validVideo123")
      assert.strictEqual(result.snippet?.title, "Valid Video")
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("rejects invalid video data", () =>
    Effect.gen(function*() {
      const adapter = yield* YouTubeAdapter

      // Test null video
      const nullResult = yield* Effect.exit(adapter.validateVideo(null as any))
      assert.isTrue(nullResult._tag === "Failure")

      // Test missing ID
      const noIdResult = yield* Effect.exit(
        adapter.validateVideo({ snippet: { title: "Test" } } as any)
      )
      assert.isTrue(noIdResult._tag === "Failure")

      // Test missing snippet
      const noSnippetResult = yield* Effect.exit(
        adapter.validateVideo({ id: "test123" } as any)
      )
      assert.isTrue(noSnippetResult._tag === "Failure")
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("validates channel with all required fields", () =>
    Effect.gen(function*() {
      const validChannel = {
        id: "UC1234567890123456789012",
        snippet: {
          title: "Valid Channel",
          publishedAt: "2020-01-01T00:00:00Z"
        }
      }

      const adapter = yield* YouTubeAdapter
      const result = yield* adapter.validateChannel(validChannel)

      assert.strictEqual(result.id, "UC1234567890123456789012")
      assert.strictEqual(result.snippet?.title, "Valid Channel")
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - Raw Data Transformations", () => {
  it.effect("transforms raw video data to domain type", () =>
    Effect.gen(function*() {
      const rawVideo = {
        id: "rawVideo123",
        snippet: {
          title: "Raw Video Test",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012",
          description: "Raw video description"
        },
        contentDetails: { duration: "PT15M30S" },
        statistics: { viewCount: "3000", likeCount: "150" }
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = yield* adapter.transformRawVideoToDomain(rawVideo)

      assert.strictEqual(domainVideo.id, "rawVideo123")
      assert.strictEqual(domainVideo.title, "Raw Video Test")
      assert.strictEqual(domainVideo.description, "Raw video description")
      assert.strictEqual(domainVideo.duration, 930) // 15*60 + 30 = 930
      assert.strictEqual(domainVideo.viewCount, 3000)
      assert.strictEqual(domainVideo.likeCount, 150)
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("transforms raw channel data to domain type", () =>
    Effect.gen(function*() {
      const rawChannel = {
        id: "UC1234567890123456789012",
        snippet: {
          title: "Raw Channel Test",
          publishedAt: "2020-01-01T00:00:00Z",
          description: "Raw channel description"
        },
        statistics: {
          subscriberCount: "75000",
          videoCount: "180",
          viewCount: "2500000"
        }
      }

      const adapter = yield* YouTubeAdapter
      const domainChannel = yield* adapter.transformRawChannelToDomain(rawChannel)

      assert.strictEqual(domainChannel.id, "UC1234567890123456789012")
      assert.strictEqual(domainChannel.title, "Raw Channel Test")
      assert.strictEqual(domainChannel.description, "Raw channel description")
      assert.strictEqual(domainChannel.subscriberCount, 75000)
      assert.strictEqual(domainChannel.videoCount, 180)
      assert.strictEqual(domainChannel.viewCount, 2500000)
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("transforms raw data directly to MediaResource", () =>
    Effect.gen(function*() {
      const rawVideo = {
        id: "mediaVideo123",
        snippet: {
          title: "Media Video Test",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012"
        },
        contentDetails: { duration: "PT8M0S" }
      }

      const adapter = yield* YouTubeAdapter
      const mediaResource = yield* adapter.transformRawVideoToMediaResource(rawVideo)

      assert.strictEqual(mediaResource.type, "youtube")
      assert.strictEqual(mediaResource.data.id, "mediaVideo123")
      assert.strictEqual(mediaResource.data.title, "Media Video Test")
      assert.strictEqual(mediaResource.data.duration, 480) // 8 minutes
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - Error Handling", () => {
  it.effect("produces appropriate error types for different failures", () =>
    Effect.gen(function*() {
      const adapter = yield* YouTubeAdapter

      // Test missing required field error
      const missingFieldResult = yield* Effect.exit(
        adapter.toDomainVideo({ snippet: { title: "Test" } } as any)
      )
      assert.isTrue(missingFieldResult._tag === "Failure")
      if (missingFieldResult._tag === "Failure" && missingFieldResult.cause._tag === "Fail") {
        const error = missingFieldResult.cause.error
        assert.isTrue(error instanceof YouTubeAdapterError)
        assert.isTrue(error.message.includes("Missing required field"))
      }

      // Test invalid data error
      const invalidDataResult = yield* Effect.exit(
        adapter.validateVideo(null as any)
      )
      assert.isTrue(invalidDataResult._tag === "Failure")
      if (invalidDataResult._tag === "Failure" && invalidDataResult.cause._tag === "Fail") {
        const error = invalidDataResult.cause.error
        assert.isTrue(error instanceof YouTubeAdapterError)
        assert.isTrue(error.message.includes("Invalid API data"))
      }
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("preserves error context for debugging", () =>
    Effect.gen(function*() {
      const adapter = yield* YouTubeAdapter
      const invalidVideo = { someField: "invalid" }

      const result = yield* Effect.exit(
        adapter.toDomainVideo(invalidVideo as any)
      )

      assert.isTrue(result._tag === "Failure")
      if (result._tag === "Failure" && result.cause._tag === "Fail") {
        const error = result.cause.error
        assert.isTrue(error instanceof YouTubeAdapterError)
        assert.isDefined(error.context)
        assert.isDefined(error.context?.data)
      }
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})

describe("YouTube Adapter - Legacy Synchronous Functions", () => {
  it.effect("legacy transformRawVideo works synchronously", () =>
    Effect.gen(function*() {
      const rawVideo = {
        id: "legacyVideo123",
        snippet: {
          title: "Legacy Video Test",
          publishedAt: "2024-01-01T12:00:00Z",
          channelId: "UC1234567890123456789012"
        },
        contentDetails: { duration: "PT5M0S" }
      }

      const adapter = yield* YouTubeAdapter
      const domainVideo = adapter.transformRawVideo(rawVideo)

      assert.strictEqual(domainVideo.id, "legacyVideo123")
      assert.strictEqual(domainVideo.title, "Legacy Video Test")
      assert.strictEqual(domainVideo.duration, 300) // 5 minutes
    }).pipe(Effect.provide(YouTubeAdapterLive)))

  it.effect("legacy transformRawChannel works synchronously", () =>
    Effect.gen(function*() {
      const rawChannel = {
        id: "UC1234567890123456789012",
        snippet: {
          title: "Legacy Channel Test",
          publishedAt: "2020-01-01T00:00:00Z"
        },
        statistics: { subscriberCount: "25000" }
      }

      const adapter = yield* YouTubeAdapter
      const domainChannel = adapter.transformRawChannel(rawChannel)

      assert.strictEqual(domainChannel.id, "UC1234567890123456789012")
      assert.strictEqual(domainChannel.title, "Legacy Channel Test")
      assert.strictEqual(domainChannel.subscriberCount, 25000)
    }).pipe(Effect.provide(YouTubeAdapterLive)))
})
