/**
 * YouTube Schema Validation Tests
 *
 * Tests for YouTube ID validation, URL parsing, schema transformation,
 * and all YouTube-related domain schemas following Effect patterns.
 * Priority 1: Critical for data integrity and input validation.
 */

import { assert, describe, it } from "@effect/vitest"
import { Effect, Option, Schema } from "effect"
import {
  extractChannelId,
  extractVideoId,
  isValidChannelId,
  isValidVideoId,
  isValidYoutubeAnyUrl,
  isValidYoutubeChannelUrl,
  isValidYoutubeUrl,
  parseChannelId,
  parseISO8601Duration,
  parseVideoId,
  safeExtractChannelId,
  safeExtractVideoId,
  videoIdToWatchUrl,
  YouTubeChannelId,
  YouTubeVideoId
} from "../../src/schemas/youtube.js"
import {
  createTestYouTubeChannel,
  createTestYouTubeChannelId,
  createTestYouTubeVideo,
  createTestYouTubeVideoId,
  TEST_DURATIONS,
  TEST_YOUTUBE_IDS,
  TEST_YOUTUBE_URLS
} from "../utils/mock-factories.js"

describe("YouTube ID Validation", () => {
  describe("YouTubeVideoId Schema", () => {
    it.effect("validates correct 11-character video IDs", () =>
      Effect.gen(function*() {
        for (const validId of TEST_YOUTUBE_IDS.validVideos) {
          const result = yield* Schema.decode(YouTubeVideoId)(validId)
          assert.strictEqual(result, validId)
        }
      }))

    it.effect("rejects video IDs with invalid length", () =>
      Effect.gen(function*() {
        const invalidIds = ["short", "toolongforvalidvideoid", ""]

        for (const invalidId of invalidIds) {
          const result = yield* Effect.exit(Schema.decode(YouTubeVideoId)(invalidId))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("rejects video IDs with invalid characters", () =>
      Effect.gen(function*() {
        const invalidIds = ["invalid@char", "dQw4w9WgXc#", "spaces in id"]

        for (const invalidId of invalidIds) {
          const result = yield* Effect.exit(Schema.decode(YouTubeVideoId)(invalidId))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("validates exact length requirement", () =>
      Effect.gen(function*() {
        const tooShort = "dQw4w9WgXc" // 10 characters
        const tooLong = "dQw4w9WgXcQQ" // 12 characters

        const shortResult = yield* Effect.exit(Schema.decode(YouTubeVideoId)(tooShort))
        const longResult = yield* Effect.exit(Schema.decode(YouTubeVideoId)(tooLong))

        assert.isTrue(shortResult._tag === "Failure")
        assert.isTrue(longResult._tag === "Failure")
      }))
  })

  describe("YouTubeChannelId Schema", () => {
    it.effect("validates correct UC-prefixed channel IDs", () =>
      Effect.gen(function*() {
        for (const validId of TEST_YOUTUBE_IDS.validChannels) {
          const result = yield* Schema.decode(YouTubeChannelId)(validId)
          assert.strictEqual(result, validId)
        }
      }))

    it.effect("rejects channel IDs without UC prefix", () =>
      Effect.gen(function*() {
        const invalidIds = ["XC1234567890123456789012", "AB1234567890123456789012"]

        for (const invalidId of invalidIds) {
          const result = yield* Effect.exit(Schema.decode(YouTubeChannelId)(invalidId))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("rejects channel IDs with invalid length", () =>
      Effect.gen(function*() {
        const invalidIds = ["UC123", "UC123456789012345678901234", ""]

        for (const invalidId of invalidIds) {
          const result = yield* Effect.exit(Schema.decode(YouTubeChannelId)(invalidId))
          assert.isTrue(result._tag === "Failure")
        }
      }))

    it.effect("validates exact UC prefix and length requirement", () =>
      Effect.gen(function*() {
        const validLength = "UC1234567890123456789012" // UC + 22 chars = 24 total
        const result = yield* Schema.decode(YouTubeChannelId)(validLength)
        assert.strictEqual(result, validLength)
      }))
  })

  describe("Predicate Functions", () => {
    it("validates video ID predicate function", () => {
      for (const validId of TEST_YOUTUBE_IDS.validVideos) {
        assert.isTrue(isValidVideoId(validId))
      }

      for (const invalidId of TEST_YOUTUBE_IDS.invalidVideos) {
        assert.isFalse(isValidVideoId(invalidId))
      }
    })

    it("validates channel ID predicate function", () => {
      for (const validId of TEST_YOUTUBE_IDS.validChannels) {
        assert.isTrue(isValidChannelId(validId))
      }

      for (const invalidId of TEST_YOUTUBE_IDS.invalidChannels) {
        assert.isFalse(isValidChannelId(invalidId))
      }
    })
  })
})

describe("YouTube URL Extraction", () => {
  describe("Video URL Patterns", () => {
    it.effect("extracts video ID from watch URLs", () =>
      Effect.gen(function*() {
        const testCases = [
          { url: TEST_YOUTUBE_URLS.watch, expected: "dQw4w9WgXcQ" },
          { url: TEST_YOUTUBE_URLS.watchWithParams, expected: "dQw4w9WgXcQ" }
        ]

        for (const { expected, url } of testCases) {
          const result = extractVideoId(url)
          assert.isTrue(Option.isSome(result))
          assert.strictEqual(result.value, expected)
        }
      }))

    it.effect("extracts video ID from short URLs", () =>
      Effect.gen(function*() {
        const testCases = [
          { url: TEST_YOUTUBE_URLS.short, expected: "dQw4w9WgXcQ" },
          { url: TEST_YOUTUBE_URLS.shortWithParams, expected: "dQw4w9WgXcQ" }
        ]

        for (const { expected, url } of testCases) {
          const result = extractVideoId(url)
          assert.isTrue(Option.isSome(result))
          assert.strictEqual(result.value, expected)
        }
      }))

    it.effect("extracts video ID from embed URLs", () =>
      Effect.gen(function*() {
        const testCases = [
          { url: TEST_YOUTUBE_URLS.embed, expected: "dQw4w9WgXcQ" },
          { url: TEST_YOUTUBE_URLS.embedWithParams, expected: "dQw4w9WgXcQ" }
        ]

        for (const { expected, url } of testCases) {
          const result = extractVideoId(url)
          assert.isTrue(Option.isSome(result))
          assert.strictEqual(result.value, expected)
        }
      }))

    it.effect("extracts video ID from mobile URLs", () =>
      Effect.gen(function*() {
        const result = extractVideoId(TEST_YOUTUBE_URLS.mobile)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, "dQw4w9WgXcQ")
      }))

    it.effect("returns None for invalid video URLs", () =>
      Effect.gen(function*() {
        const invalidUrls = [
          TEST_YOUTUBE_URLS.invalidVideoId,
          TEST_YOUTUBE_URLS.nonYoutube,
          TEST_YOUTUBE_URLS.malformed,
          TEST_YOUTUBE_URLS.empty
        ]

        for (const url of invalidUrls) {
          const result = extractVideoId(url)
          assert.isTrue(Option.isNone(result))
        }
      }))
  })

  describe("Channel URL Patterns", () => {
    it.effect("extracts channel ID from channel URLs", () =>
      Effect.gen(function*() {
        const testCases = [
          { url: TEST_YOUTUBE_URLS.channel, expected: "UC1234567890123456789012" },
          { url: TEST_YOUTUBE_URLS.channelWithParams, expected: "UC1234567890123456789012" }
        ]

        for (const { expected, url } of testCases) {
          const result = extractChannelId(url)
          assert.isTrue(Option.isSome(result))
          assert.strictEqual(result.value, expected)
        }
      }))

    it.effect("returns None for invalid channel URLs", () =>
      Effect.gen(function*() {
        const invalidUrls = [
          TEST_YOUTUBE_URLS.invalidChannelId,
          TEST_YOUTUBE_URLS.nonYoutube,
          TEST_YOUTUBE_URLS.malformed,
          TEST_YOUTUBE_URLS.empty
        ]

        for (const url of invalidUrls) {
          const result = extractChannelId(url)
          assert.isTrue(Option.isNone(result))
        }
      }))
  })

  describe("Safe Extraction with Schema Validation", () => {
    it.effect("validates video ID extraction with schema validation", () =>
      Effect.gen(function*() {
        const result = safeExtractVideoId(TEST_YOUTUBE_URLS.watch)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, "dQw4w9WgXcQ")
      }))

    it.effect("validates channel ID extraction with schema validation", () =>
      Effect.gen(function*() {
        const result = safeExtractChannelId(TEST_YOUTUBE_URLS.channel)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, "UC1234567890123456789012")
      }))

    it.effect("returns None for malformed IDs even if extracted", () =>
      Effect.gen(function*() {
        // URL with malformed video ID that might be extracted but fails validation
        const malformedUrl = "https://youtube.com/watch?v=shortid"
        const result = safeExtractVideoId(malformedUrl)
        assert.isTrue(Option.isNone(result))
      }))
  })
})

describe("YouTube URL Predicates", () => {
  it("validates YouTube video URL predicate", () => {
    const validUrls = [
      TEST_YOUTUBE_URLS.watch,
      TEST_YOUTUBE_URLS.short,
      TEST_YOUTUBE_URLS.embed,
      TEST_YOUTUBE_URLS.mobile
    ]

    for (const url of validUrls) {
      assert.isTrue(isValidYoutubeUrl(url))
    }

    const invalidUrls = [
      TEST_YOUTUBE_URLS.invalidVideoId,
      TEST_YOUTUBE_URLS.nonYoutube,
      TEST_YOUTUBE_URLS.malformed
    ]

    for (const url of invalidUrls) {
      assert.isFalse(isValidYoutubeUrl(url))
    }
  })

  it("validates YouTube channel URL predicate", () => {
    const validUrls = [TEST_YOUTUBE_URLS.channel, TEST_YOUTUBE_URLS.channelWithParams]

    for (const url of validUrls) {
      assert.isTrue(isValidYoutubeChannelUrl(url))
    }

    const invalidUrls = [
      TEST_YOUTUBE_URLS.invalidChannelId,
      TEST_YOUTUBE_URLS.nonYoutube,
      TEST_YOUTUBE_URLS.malformed
    ]

    for (const url of invalidUrls) {
      assert.isFalse(isValidYoutubeChannelUrl(url))
    }
  })

  it("validates any YouTube URL predicate", () => {
    const validUrls = [
      TEST_YOUTUBE_URLS.watch,
      TEST_YOUTUBE_URLS.short,
      TEST_YOUTUBE_URLS.channel
    ]

    for (const url of validUrls) {
      assert.isTrue(isValidYoutubeAnyUrl(url))
    }

    const invalidUrls = [
      TEST_YOUTUBE_URLS.nonYoutube,
      TEST_YOUTUBE_URLS.malformed,
      TEST_YOUTUBE_URLS.empty
    ]

    for (const url of invalidUrls) {
      assert.isFalse(isValidYoutubeAnyUrl(url))
    }
  })
})

describe("YouTube ID Parsing", () => {
  it.effect("parses valid video IDs with Option", () =>
    Effect.gen(function*() {
      for (const validId of TEST_YOUTUBE_IDS.validVideos) {
        const result = parseVideoId(validId)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, validId)
      }
    }))

  it.effect("returns None for invalid video IDs", () =>
    Effect.gen(function*() {
      for (const invalidId of TEST_YOUTUBE_IDS.invalidVideos) {
        const result = parseVideoId(invalidId)
        assert.isTrue(Option.isNone(result))
      }
    }))

  it.effect("parses valid channel IDs with Option", () =>
    Effect.gen(function*() {
      for (const validId of TEST_YOUTUBE_IDS.validChannels) {
        const result = parseChannelId(validId)
        assert.isTrue(Option.isSome(result))
        assert.strictEqual(result.value, validId)
      }
    }))

  it.effect("returns None for invalid channel IDs", () =>
    Effect.gen(function*() {
      for (const invalidId of TEST_YOUTUBE_IDS.invalidChannels) {
        const result = parseChannelId(invalidId)
        assert.isTrue(Option.isNone(result))
      }
    }))
})

describe("YouTube URL Generation", () => {
  it("converts video ID to watch URL", () => {
    const videoId = createTestYouTubeVideoId()
    const url = videoIdToWatchUrl(videoId)
    assert.strictEqual(url, `https://www.youtube.com/watch?v=${videoId}`)
  })

  it("generates valid URLs that can be parsed back", () => {
    const videoId = createTestYouTubeVideoId()
    const url = videoIdToWatchUrl(videoId)
    const extractedId = extractVideoId(url)

    assert.isTrue(Option.isSome(extractedId))
    assert.strictEqual(extractedId.value, videoId)
  })
})

describe("ISO8601 Duration Parsing", () => {
  it("parses valid duration strings correctly", () => {
    for (const [durationString, expectedSeconds] of Object.entries(TEST_DURATIONS.valid)) {
      const result = parseISO8601Duration(durationString)
      assert.strictEqual(result, expectedSeconds)
    }
  })

  it("returns 0 for invalid duration strings", () => {
    for (const invalidDuration of TEST_DURATIONS.invalid) {
      const result = parseISO8601Duration(invalidDuration)
      assert.strictEqual(result, 0)
    }
  })

  it("handles edge cases correctly", () => {
    const edgeCases = {
      "PT0S": 0,
      "PT1S": 1,
      "PT1M1S": 61,
      "PT1H1M1S": 3661
    }

    for (const [duration, expected] of Object.entries(edgeCases)) {
      const result = parseISO8601Duration(duration)
      assert.strictEqual(result, expected)
    }
  })
})

describe("YouTube Entity Creation", () => {
  it.effect("creates valid YouTube video with factory", () =>
    Effect.gen(function*() {
      const video = createTestYouTubeVideo()

      // Verify all required fields are present
      assert.strictEqual(video.id, "dQw4w9WgXcQ")
      assert.strictEqual(video.title, "Test Video Title")
      assert.strictEqual(video.channelId, "UC1234567890123456789012")
      assert.strictEqual(video.duration, 1800)
      assert.strictEqual(video.viewCount, 10000)
      assert.isTrue(Array.isArray(video.tags))
      assert.isTrue(Array.isArray(video.thumbnails))
    }))

  it.effect("creates valid YouTube channel with factory", () =>
    Effect.gen(function*() {
      const channel = createTestYouTubeChannel()

      // Verify all required fields are present
      assert.strictEqual(channel.id, "UC1234567890123456789012")
      assert.strictEqual(channel.title, "Test Channel")
      assert.strictEqual(channel.subscriberCount, 100000)
      assert.strictEqual(channel.videoCount, 250)
      assert.strictEqual(channel.viewCount, 5000000)
    }))

  it.effect("allows overriding factory defaults", () =>
    Effect.gen(function*() {
      const customVideo = createTestYouTubeVideo({
        title: "Custom Title",
        duration: 3600,
        viewCount: 50000
      })

      assert.strictEqual(customVideo.title, "Custom Title")
      assert.strictEqual(customVideo.duration, 3600)
      assert.strictEqual(customVideo.viewCount, 50000)
      // Other fields should remain default
      assert.strictEqual(customVideo.id, "dQw4w9WgXcQ")
    }))
})
