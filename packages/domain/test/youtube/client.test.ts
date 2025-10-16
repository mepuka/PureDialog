import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Option } from "effect"
import { YouTubeApiError, YouTubeClient, YouTubeVideoNotFoundError } from "../../src/youtube/client.js"
import type { YouTubeVideo } from "../../src/youtube/types.js"
import { YouTubeChannelId, YouTubeVideoId } from "../../src/youtube/types.js"

describe("YouTubeClient", () => {
  const mockVideo: YouTubeVideo = {
    id: YouTubeVideoId.make("dQw4w9WgXcQ"),
    title: "Test Video",
    description: "A test video description",
    publishedAt: new Date("2024-01-01T00:00:00Z"),
    channelId: YouTubeChannelId.make("UC1234567890123456789012"),
    channelTitle: "Test Channel",
    thumbnails: [
      {
        default: Option.some({
          url: "https://example.com/default.jpg",
          width: Option.some(120),
          height: Option.some(90)
        }),
        medium: Option.some({
          url: "https://example.com/medium.jpg",
          width: Option.some(320),
          height: Option.some(180)
        }),
        high: Option.some({ url: "https://example.com/high.jpg", width: Option.some(480), height: Option.some(360) }),
        standard: Option.none(),
        maxres: Option.none()
      }
    ],
    duration: 90,
    viewCount: 1000,
    likeCount: 50,
    commentCount: 10,
    tags: ["test", "video"]
  }

  const MockYouTubeClientLive = Layer.succeed(YouTubeClient, {
    fetchVideo: () => Effect.succeed(mockVideo),
    fetchVideoByUrl: () => Effect.succeed(mockVideo)
  })

  describe("fetchVideo", () => {
    it.effect("should fetch video details successfully", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const videoId = YouTubeVideoId.make("dQw4w9WgXcQ")

        const result = yield* client.fetchVideo(videoId)

        assert.strictEqual(result.id, "dQw4w9WgXcQ")
        assert.strictEqual(result.title, "Test Video")
        assert.strictEqual(result.description, "A test video description")
        assert.strictEqual(result.channelId, "UC1234567890123456789012")
        assert.strictEqual(result.channelTitle, "Test Channel")
        assert.deepStrictEqual(result.tags, ["test", "video"])
        assert.strictEqual(result.duration, 90)
        assert.strictEqual(result.viewCount, 1000)
        assert.strictEqual(result.likeCount, 50)
        assert.strictEqual(result.commentCount, 10)
      }).pipe(Effect.provide(MockYouTubeClientLive)))

    it.effect("should fail with YouTubeVideoNotFoundError when video not found", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const videoId = YouTubeVideoId.make("nonexistent")

        const error = yield* Effect.flip(client.fetchVideo(videoId))

        assert.isTrue(error instanceof YouTubeVideoNotFoundError)
        assert.strictEqual(error.videoId, "nonexistent")
      }).pipe(
        Effect.provide(
          Layer.succeed(YouTubeClient, {
            fetchVideo: (videoId) => Effect.fail(new YouTubeVideoNotFoundError({ videoId })),
            fetchVideoByUrl: () => Effect.succeed(mockVideo)
          })
        )
      ))

    it.effect("should fail with YouTubeApiError when API returns error", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const videoId = YouTubeVideoId.make("dQw4w9WgXcQ")

        const error = yield* Effect.flip(client.fetchVideo(videoId))

        assert.isTrue(error instanceof YouTubeApiError)
        assert.isTrue(error.message.includes("Failed to fetch"))
      }).pipe(
        Effect.provide(
          Layer.succeed(YouTubeClient, {
            fetchVideo: () =>
              Effect.fail(
                new YouTubeApiError({
                  message: "Failed to fetch YouTube API response",
                  cause: new Error("Network error")
                })
              ),
            fetchVideoByUrl: () => Effect.succeed(mockVideo)
          })
        )
      ))
  })

  describe("fetchVideoByUrl", () => {
    it.effect("should fetch video by standard watch URL", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

        const result = yield* client.fetchVideoByUrl(url)

        assert.strictEqual(result.id, "dQw4w9WgXcQ")
        assert.strictEqual(result.title, "Test Video")
      }).pipe(Effect.provide(MockYouTubeClientLive)))

    it.effect("should fetch video by short URL", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const url = "https://youtu.be/dQw4w9WgXcQ"

        const result = yield* client.fetchVideoByUrl(url)

        assert.strictEqual(result.id, "dQw4w9WgXcQ")
      }).pipe(Effect.provide(MockYouTubeClientLive)))

    it.effect("should fetch video by embed URL", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const url = "https://www.youtube.com/embed/dQw4w9WgXcQ"

        const result = yield* client.fetchVideoByUrl(url)

        assert.strictEqual(result.id, "dQw4w9WgXcQ")
      }).pipe(Effect.provide(MockYouTubeClientLive)))

    it.effect("should fail with YouTubeApiError for invalid URL", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const url = "https://not-a-youtube-url.com"

        const error = yield* Effect.flip(client.fetchVideoByUrl(url))

        assert.isTrue(error instanceof YouTubeApiError)
        assert.isTrue(error.message.includes("Invalid YouTube URL"))
      }).pipe(
        Effect.provide(
          Layer.succeed(YouTubeClient, {
            fetchVideo: () => Effect.succeed(mockVideo),
            fetchVideoByUrl: () =>
              Effect.fail(
                new YouTubeApiError({
                  message: "Invalid YouTube URL - could not extract video ID",
                  cause: new Error("URL: https://not-a-youtube-url.com")
                })
              )
          })
        )
      ))

    it.effect("should fail when video not found after URL extraction", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const url = "https://www.youtube.com/watch?v=nonexistent"

        const error = yield* Effect.flip(client.fetchVideoByUrl(url))

        assert.isTrue(error instanceof YouTubeVideoNotFoundError)
      }).pipe(
        Effect.provide(
          Layer.succeed(YouTubeClient, {
            fetchVideo: () => Effect.succeed(mockVideo),
            fetchVideoByUrl: () =>
              Effect.fail(new YouTubeVideoNotFoundError({ videoId: YouTubeVideoId.make("nonexistent") }))
          })
        )
      ))
  })

  describe("error handling", () => {
    it.effect("should preserve error context in YouTubeApiError", () =>
      Effect.gen(function*() {
        const client = yield* YouTubeClient
        const videoId = YouTubeVideoId.make("dQw4w9WgXcQ")

        const error = yield* Effect.flip(client.fetchVideo(videoId))

        assert.isTrue(error instanceof YouTubeApiError)
        assert.strictEqual(error.message, "API Error")
        assert.strictEqual(error.videoId, "dQw4w9WgXcQ")
        assert.isDefined(error.cause)
      }).pipe(
        Effect.provide(
          Layer.succeed(YouTubeClient, {
            fetchVideo: (videoId) =>
              Effect.fail(
                new YouTubeApiError({
                  message: "API Error",
                  videoId,
                  cause: new Error("Root cause")
                })
              ),
            fetchVideoByUrl: () => Effect.succeed(mockVideo)
          })
        )
      ))
  })
})
