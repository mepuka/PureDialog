import { YouTube } from "@puredialog/domain"
import { Effect, Layer } from "effect"

/**
 * Create a test YouTube video object
 */
const createTestYouTubeVideo = (videoId: string): YouTube.YouTubeVideo => ({
  id: videoId as YouTube.YouTubeVideoId,
  title: "Test Video Title",
  description: "Test video description",
  publishedAt: new Date("2024-01-01T00:00:00Z") as any,
  channelId: "UCtest123" as YouTube.YouTubeChannelId,
  channelTitle: "Test Channel",
  thumbnails: [
    {
      default: {
        _tag: "Some",
        value: {
          url: "https://example.com/thumb.jpg",
          width: { _tag: "Some", value: 120 },
          height: { _tag: "Some", value: 90 }
        }
      },
      medium: { _tag: "None" },
      high: { _tag: "None" },
      standard: { _tag: "None" },
      maxres: { _tag: "None" }
    }
  ],
  duration: 300,
  viewCount: 1000,
  likeCount: 100,
  commentCount: 10,
  tags: ["test", "video"]
})

/**
 * Create a mock YouTube client for testing
 */
export const createMockYouTubeClient = () => {
  const capturedFetches: Array<{
    type: "byId" | "byUrl"
    value: string
    timestamp: Date
  }> = []

  let shouldFail = false
  let failureType: "api-error" | "not-found" = "api-error"

  const setShouldFail = (fail: boolean, type: "api-error" | "not-found" = "api-error") => {
    shouldFail = fail
    failureType = type
  }

  const mockImplementation: YouTube.YouTubeClient = {
    fetchVideo: (videoId: YouTube.YouTubeVideoId) =>
      Effect.gen(function*() {
        capturedFetches.push({
          type: "byId",
          value: videoId,
          timestamp: new Date()
        })

        if (shouldFail) {
          if (failureType === "not-found") {
            return yield* Effect.fail(new YouTube.YouTubeVideoNotFoundError({ videoId }))
          }
          return yield* Effect.fail(
            new YouTube.YouTubeApiError({
              message: "Mock YouTube API error",
              videoId,
              cause: new Error("Mock error")
            })
          )
        }

        return createTestYouTubeVideo(videoId)
      }),

    fetchVideoByUrl: (url: string) =>
      Effect.gen(function*() {
        capturedFetches.push({
          type: "byUrl",
          value: url,
          timestamp: new Date()
        })

        if (shouldFail) {
          if (failureType === "not-found") {
            return yield* Effect.fail(
              new YouTube.YouTubeVideoNotFoundError({ videoId: "unknown" as YouTube.YouTubeVideoId })
            )
          }
          return yield* Effect.fail(
            new YouTube.YouTubeApiError({
              message: "Mock YouTube API error",
              cause: new Error("Mock error")
            })
          )
        }

        // Extract video ID from URL for mock purposes
        const videoId = url.includes("v=")
          ? url.split("v=")[1].split("&")[0]
          : url.split("/").pop() || "dQw4w9WgXcQ"

        return createTestYouTubeVideo(videoId)
      })
  }

  const clear = () => {
    capturedFetches.length = 0
    shouldFail = false
    failureType = "api-error"
  }

  const mockLayer = Layer.succeed(YouTube.YouTubeClient, mockImplementation)

  return {
    mockClient: mockImplementation,
    mockLayer,
    capturedFetches,
    setShouldFail,
    clear
  }
}
