import type { HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { HttpClient } from "@effect/platform"
import { NodeHttpClient } from "@effect/platform-node"
import type { YouTubeChannelId as ChannelId, YouTubeVideoId as VideoId } from "@puredialog/domain"
import { extractChannelId, extractVideoId } from "@puredialog/domain"
import { Chunk, Context, Duration, Effect, Layer, Option, Schedule } from "effect"
import { YoutubeConfig, YoutubeConfigLive } from "./config.js"
import { YoutubeApiError } from "./errors.js"
import { makeChannelRequest, makeVideoRequest } from "./internal/requests.js"
import { decodeChannelResponse, decodeVideoResponse, extractChannels, extractVideos } from "./internal/responses.js"
import type { RawChannel, RawVideo } from "./internal/responses.js"
import { transformHttpError } from "./internal/retry.js"

/**
 * Low-level YouTube API Client
 *
 * Returns raw API responses that should be transformed by adapters.
 * This keeps the client focused on API communication.
 */
export class YoutubeApiClient extends Context.Tag("YoutubeApiClient")<
  YoutubeApiClient,
  {
    // Single resource operations - return raw API data
    readonly getVideoRaw: (id: VideoId) => Effect.Effect<RawVideo, YoutubeApiError>
    readonly getChannelRaw: (id: ChannelId) => Effect.Effect<RawChannel, YoutubeApiError>

    // URL-based operations
    readonly getVideoByUrl: (url: string) => Effect.Effect<RawVideo, YoutubeApiError>
    readonly getChannelByUrl: (url: string) => Effect.Effect<RawChannel, YoutubeApiError>

    // Batch operations
    readonly getVideosRaw: (ids: Array<VideoId>) => Effect.Effect<Array<RawVideo>, YoutubeApiError>
    readonly getChannelsRaw: (ids: Array<ChannelId>) => Effect.Effect<Array<RawChannel>, YoutubeApiError>
  }
>() {}

const makeYoutubeApiClient = Effect.gen(function*() {
  const httpClient = yield* HttpClient.HttpClient
  const config = yield* YoutubeConfig

  // Create a preconfigured retry function using the config
  const configuredRetry = <A, R>(effect: Effect.Effect<A, YoutubeApiError, R>) => {
    const backoffMs = Duration.toMillis(config.retryBackoff)
    const schedule = Schedule.exponential(Duration.millis(backoffMs)).pipe(
      Schedule.intersect(Schedule.recurs(config.retryAttempts - 1)),
      Schedule.whileInputEffect((error: YoutubeApiError) =>
        Effect.succeed(
          error.type === "NetworkError"
            || (error.type === "ApiError" && error.context?.status === 429)
            || (error.type === "ApiError"
              && (error.context?.status as number) >= 500)
        )
      )
    )
    return effect.pipe(Effect.retry(schedule))
  }

  const executeRequest = <T>(
    request: HttpClientRequest.HttpClientRequest,
    decoder: (
      res: HttpClientResponse.HttpClientResponse
    ) => Effect.Effect<T, YoutubeApiError>
  ) =>
    httpClient.execute(request).pipe(
      Effect.flatMap(decoder),
      Effect.catchTag("RequestError", (error) => Effect.fail(transformHttpError(error))),
      Effect.catchTag("ResponseError", (error) => Effect.fail(transformHttpError(error))),
      configuredRetry
    )

  // Single video operation - returns raw data
  const getVideoRaw = (id: VideoId) =>
    makeVideoRequest([id], config).pipe(
      (req) => executeRequest(req, decodeVideoResponse),
      Effect.flatMap(extractVideos),
      Effect.flatMap((rawVideos) =>
        Effect.if(rawVideos.length === 0, {
          onTrue: () => Effect.fail(YoutubeApiError.apiError(404, `Video not found: ${id}`)),
          onFalse: () => Effect.succeed(rawVideos[0] as RawVideo)
        })
      )
    )

  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getVideo"),
  //   Effect.annotateCurrentSpan("youtube.video.id", id)
  // )

  // Video by URL operation
  const getVideoByUrl = (url: string) =>
    Effect.gen(function*() {
      const videoIdOption = extractVideoId(url)
      if (Option.isNone(videoIdOption)) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(url, "Unable to extract video ID")
        )
      }
      return yield* getVideoRaw(videoIdOption.value as VideoId)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getVideoByUrl"),
  //   Effect.annotateCurrentSpan("youtube.video.url", url)
  // )

  // Batch video operation
  const getVideosRaw = (ids: Array<VideoId>) =>
    Effect.gen(function*() {
      if (ids.length === 0) return []

      // Use chunking for robust batching
      const batches = Chunk.fromIterable(ids).pipe(Chunk.chunksOf(50))

      const batchResults = yield* Effect.forEach(
        batches,
        (batch) =>
          Effect.gen(function*() {
            const batchArray = Chunk.toArray(batch)
            const request = makeVideoRequest(batchArray, config)
            const response = yield* executeRequest(request, decodeVideoResponse)
            const rawVideos = yield* extractVideos(response)
            return rawVideos.map((video) => video as RawVideo)
          }),
        { concurrency: 10 }
      )

      // Flatten all batch results into single array
      return batchResults.flat()
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getVideos"),
  //   Effect.annotateCurrentSpan("youtube.batch.count", ids.length),
  //   Effect.annotateCurrentSpan("youtube.batch.chunks", Chunk.fromIterable(ids).pipe(Chunk.chunksOf(50), Chunk.size))
  // )

  // Single channel operation
  const getChannelRaw = (id: ChannelId) =>
    Effect.gen(function*() {
      const request = makeChannelRequest([id], config)
      const response = yield* executeRequest(request, decodeChannelResponse)
      const rawChannels = yield* extractChannels(response)

      if (rawChannels.length === 0) {
        return yield* Effect.fail(
          YoutubeApiError.apiError(404, `Channel not found: ${id}`)
        )
      }

      return rawChannels[0] as RawChannel
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getChannel"),
  //   Effect.annotateCurrentSpan("youtube.channel.id", id)
  // )

  // Channel by URL operation
  const getChannelByUrl = (url: string) =>
    Effect.gen(function*() {
      const channelIdOption = extractChannelId(url)
      if (Option.isNone(channelIdOption)) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(
            url,
            "Unable to extract channel ID or custom URLs not supported"
          )
        )
      }
      return yield* getChannelRaw(channelIdOption.value as ChannelId)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getChannelByUrl"),
  //   Effect.annotateCurrentSpan("youtube.channel.url", url)
  // )

  // Batch channel operation
  const getChannelsRaw = (ids: Array<ChannelId>) =>
    Effect.gen(function*() {
      if (ids.length === 0) return []

      // Use chunking for robust batching
      const batches = Chunk.fromIterable(ids).pipe(Chunk.chunksOf(50))

      const batchResults = yield* Effect.forEach(
        batches,
        (batch) =>
          Effect.gen(function*() {
            const batchArray = Chunk.toArray(batch)
            const request = makeChannelRequest(batchArray, config)
            const response = yield* executeRequest(request, decodeChannelResponse)
            const rawChannels = yield* extractChannels(response)
            return rawChannels.map((channel) => channel as RawChannel)
          }),
        { concurrency: 10 }
      )

      // Flatten all batch results into single array
      return batchResults.flat()
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getChannels"),
  //   Effect.annotateCurrentSpan("youtube.batch.count", ids.length),
  //   Effect.annotateCurrentSpan("youtube.batch.chunks", Chunk.fromIterable(ids).pipe(Chunk.chunksOf(50), Chunk.size))
  // )

  return {
    getVideoRaw,
    getVideoByUrl,
    getVideosRaw,
    getChannelRaw,
    getChannelByUrl,
    getChannelsRaw
  } as const
})

// Layer implementation
export const YoutubeApiClientLive = Layer.effect(
  YoutubeApiClient,
  makeYoutubeApiClient
).pipe(
  Layer.provide(YoutubeConfigLive),
  Layer.provideMerge(NodeHttpClient.layer)
)
