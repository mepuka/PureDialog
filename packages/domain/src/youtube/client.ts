import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Context, Data, Effect, Layer, Option, Schema } from "effect"
import { YouTubeConfig } from "./config.js"
import type { YouTubeChannelId, YouTubeVideo, YouTubeVideoId } from "./types.js"
import { extractVideoId } from "./utilities.js"

/**
 * Error thrown when YouTube API returns an error
 */
export class YouTubeApiError extends Data.TaggedError("YouTubeApiError")<{
  readonly message: string
  readonly videoId?: string
  readonly cause?: unknown
}> {}

/**
 * Error thrown when a YouTube video is not found (404)
 */
export class YouTubeVideoNotFoundError extends Data.TaggedError("YouTubeVideoNotFoundError")<{
  readonly videoId: YouTubeVideoId
}> {}

/**
 * Schema for YouTube API thumbnail response
 */
const YouTubeApiThumbnailSchema = Schema.Struct({
  url: Schema.String,
  width: Schema.optional(Schema.Number),
  height: Schema.optional(Schema.Number)
})

/**
 * Schema for YouTube API thumbnails response
 */
const YouTubeApiThumbnailsSchema = Schema.Struct({
  default: Schema.optional(YouTubeApiThumbnailSchema),
  medium: Schema.optional(YouTubeApiThumbnailSchema),
  high: Schema.optional(YouTubeApiThumbnailSchema),
  standard: Schema.optional(YouTubeApiThumbnailSchema),
  maxres: Schema.optional(YouTubeApiThumbnailSchema)
})

/**
 * Schema for YouTube API statistics response
 */
const YouTubeApiStatisticsSchema = Schema.Struct({
  viewCount: Schema.optional(Schema.String),
  likeCount: Schema.optional(Schema.String),
  commentCount: Schema.optional(Schema.String)
})

/**
 * Schema for YouTube API video item response
 */
const YouTubeApiItemSchema = Schema.Struct({
  id: Schema.String,
  snippet: Schema.Struct({
    title: Schema.String,
    description: Schema.String,
    publishedAt: Schema.DateTimeUtc,
    channelId: Schema.String,
    channelTitle: Schema.String,
    thumbnails: YouTubeApiThumbnailsSchema,
    tags: Schema.optional(Schema.Array(Schema.String))
  }),
  contentDetails: Schema.Struct({
    duration: Schema.String
  }),
  statistics: Schema.optional(YouTubeApiStatisticsSchema)
})

/**
 * Schema for YouTube API response
 */
const YouTubeApiResponseSchema = Schema.Struct({
  items: Schema.Array(YouTubeApiItemSchema)
})

/**
 * Parse ISO8601 duration to seconds
 */
const parseDurationSeconds = (isoDuration: string): number => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(isoDuration)
  if (!match) return 0
  const hours = match[1] ? Number.parseInt(match[1], 10) : 0
  const minutes = match[2] ? Number.parseInt(match[2], 10) : 0
  const seconds = match[3] ? Number.parseInt(match[3], 10) : 0
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Transform API thumbnail to domain thumbnail with proper Option types
 */
const transformThumbnail = (
  apiThumbnail: Schema.Schema.Type<typeof YouTubeApiThumbnailSchema> | undefined
) => {
  if (!apiThumbnail) return Option.none()

  return Option.some({
    url: apiThumbnail.url,
    width: Option.fromNullable(apiThumbnail.width),
    height: Option.fromNullable(apiThumbnail.height)
  })
}

/**
 * Transform YouTube API item to domain YouTubeVideo
 */
const transformApiItemToVideo = (item: Schema.Schema.Type<typeof YouTubeApiItemSchema>): YouTubeVideo => {
  const thumbnailsArray = [
    {
      default: transformThumbnail(item.snippet.thumbnails.default),
      medium: transformThumbnail(item.snippet.thumbnails.medium),
      high: transformThumbnail(item.snippet.thumbnails.high),
      standard: transformThumbnail(item.snippet.thumbnails.standard),
      maxres: transformThumbnail(item.snippet.thumbnails.maxres)
    }
  ]

  return {
    id: item.id as YouTubeVideoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    channelId: item.snippet.channelId as YouTubeChannelId,
    channelTitle: item.snippet.channelTitle,
    thumbnails: thumbnailsArray,
    duration: parseDurationSeconds(item.contentDetails.duration),
    viewCount: item.statistics?.viewCount ? Number.parseInt(item.statistics.viewCount, 10) : 0,
    likeCount: item.statistics?.likeCount ? Number.parseInt(item.statistics.likeCount, 10) : 0,
    commentCount: item.statistics?.commentCount ? Number.parseInt(item.statistics.commentCount, 10) : 0,
    tags: item.snippet.tags ?? []
  }
}

/**
 * YouTube API client service
 */
export class YouTubeClient extends Context.Tag("@puredialog/domain/YouTubeClient")<
  YouTubeClient,
  {
    readonly fetchVideo: (
      videoId: YouTubeVideoId
    ) => Effect.Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>

    readonly fetchVideoByUrl: (
      url: string
    ) => Effect.Effect<YouTubeVideo, YouTubeApiError | YouTubeVideoNotFoundError>
  }
>() {}

/**
 * Live layer implementation for YouTubeClient
 */
export const YouTubeClientLive = Layer.effect(
  YouTubeClient,
  Effect.gen(function*() {
    const config = yield* YouTubeConfig
    const httpClient = yield* HttpClient.HttpClient

    const fetchVideo = (videoId: YouTubeVideoId) =>
      Effect.gen(function*() {
        const apiResponse = yield* HttpClientRequest.get("https://www.googleapis.com/youtube/v3/videos").pipe(
          HttpClientRequest.setUrlParams({
            part: "snippet,contentDetails,statistics",
            id: videoId,
            key: config.apiKey
          }),
          httpClient.execute,
          Effect.flatMap(HttpClientResponse.filterStatusOk),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(YouTubeApiResponseSchema)),
          Effect.mapError(
            (cause) =>
              new YouTubeApiError({
                message: "Failed to fetch YouTube API response",
                videoId,
                cause
              })
          )
        )

        const [item] = apiResponse.items
        if (!item) {
          return yield* Effect.fail(new YouTubeVideoNotFoundError({ videoId }))
        }

        return transformApiItemToVideo(item)
      })

    const fetchVideoByUrl = (url: string) =>
      Effect.gen(function*() {
        const videoIdOption = extractVideoId(url)

        if (Option.isNone(videoIdOption)) {
          return yield* Effect.fail(
            new YouTubeApiError({
              message: "Invalid YouTube URL - could not extract video ID",
              cause: new Error(`URL: ${url}`)
            })
          )
        }

        return yield* fetchVideo(videoIdOption.value)
      })

    return { fetchVideo, fetchVideoByUrl }
  })
).pipe(Layer.provide(FetchHttpClient.layer))
