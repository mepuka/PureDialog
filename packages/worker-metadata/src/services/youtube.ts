import type { YouTube } from "@puredialog/domain"
import { Context, Data, Effect, Layer, Schema } from "effect"
import { MetadataWorkerConfig } from "../config.js"

export interface YoutubeVideoDetails {
  readonly id: YouTube.YouTubeVideoId
  readonly title: string
  readonly description: string
  readonly publishedAt: Date
  readonly channelId: YouTube.YouTubeChannelId
  readonly channelTitle: string
  readonly tags: ReadonlyArray<string>
  readonly durationSeconds: number
}

export class YoutubeApiError extends Data.TaggedError("YoutubeApiError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class YoutubeClient extends Context.Tag("YoutubeClient")<
  YoutubeClient,
  {
    readonly fetchVideo: (
      videoId: YouTube.YouTubeVideoId
    ) => Effect.Effect<YoutubeVideoDetails, YoutubeApiError>
  }
>() {}

const parseDurationSeconds = (isoDuration: string): number => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(isoDuration)
  if (!match) {
    return 0
  }

  const hours = match[1] ? Number.parseInt(match[1], 10) : 0
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0
  const seconds = match[3] ? Number.parseInt(match[3], 10) : 0

  return hours * 3600 + minutes * 60 + seconds
}

const youtubeResponseSchema = Schema.Struct({
  items: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      snippet: Schema.Struct({
        title: Schema.String,
        description: Schema.String,
        publishedAt: Schema.String,
        channelId: Schema.String,
        channelTitle: Schema.String,
        tags: Schema.optional(Schema.Array(Schema.String))
      }),
      contentDetails: Schema.Struct({
        duration: Schema.String
      })
    })
  )
})

type YoutubeApiResponse = Schema.Schema.Type<typeof youtubeResponseSchema>

export const YoutubeClientLive = Layer.effect(
  YoutubeClient,
  Effect.gen(function*() {
    const config = yield* MetadataWorkerConfig

    const fetchVideo = (videoId: YouTube.YouTubeVideoId) =>
      Effect.gen(function*() {
        const url = new URL("https://www.googleapis.com/youtube/v3/videos")
        url.searchParams.set("part", "snippet,contentDetails")
        url.searchParams.set("id", videoId)
        url.searchParams.set("key", config.youtubeApiKey)

        const response = yield* Effect.tryPromise({
          try: () => fetch(url, { method: "GET" }),
          catch: (cause) => new YoutubeApiError({ message: "Failed to call YouTube API", cause })
        })

        if (!response.ok) {
          return yield* Effect.fail(
            new YoutubeApiError({
              message: `YouTube API responded with ${response.status}`
            })
          )
        }

        const json = (yield* Effect.tryPromise({
          try: () => response.json() as Promise<unknown>,
          catch: (cause) => new YoutubeApiError({ message: "Failed to parse YouTube API response", cause })
        })) as unknown

        const parsed = yield* Effect.try({
          try: () => Schema.decodeUnknownSync(youtubeResponseSchema)(json) as YoutubeApiResponse,
          catch: (cause) => new YoutubeApiError({ message: "Invalid YouTube API response", cause })
        })

        const [item] = parsed.items
        if (!item) {
          return yield* Effect.fail(
            new YoutubeApiError({ message: "YouTube API returned no results for video" })
          )
        }

        return {
          id: item.id as YouTube.YouTubeVideoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: new Date(item.snippet.publishedAt),
          channelId: item.snippet.channelId as YouTube.YouTubeChannelId,
          channelTitle: item.snippet.channelTitle,
          tags: item.snippet.tags ?? [],
          durationSeconds: parseDurationSeconds(item.contentDetails.duration)
        } satisfies YoutubeVideoDetails
      })

    return { fetchVideo }
  })
)
