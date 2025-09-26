import type { HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { HttpClient } from "@effect/platform"
import { NodeHttpClient } from "@effect/platform-node"
import type {
  YouTubeChannel as Channel,
  YouTubeChannelId as ChannelId,
  YouTubeVideo as Video,
  YouTubeVideoId as VideoId
} from "@puredialog/domain"
import { Chunk, Context, Duration, Effect, Layer, Schedule } from "effect"
import { YoutubeAdapter, YoutubeAdapterLive } from "../adapters/youtube.js"
import { YoutubeConfig, YoutubeConfigLive } from "./config.js"
import { YoutubeApiError } from "./errors.js"
import { makeChannelRequest, makeVideoRequest } from "./internal/requests.js"
import { decodeChannelResponse, decodeVideoResponse, extractChannels, extractVideos } from "./internal/responses.js"
import type { RawChannel, RawVideo } from "./internal/responses.js"
import { transformHttpError } from "./internal/retry.js"
import { extractChannelId, extractVideoId } from "./utils.js"

export class YoutubeApiClient extends Context.Tag("YoutubeApiClient")<
  YoutubeApiClient,
  {
    // Single resource operations
    readonly getVideo: (id: VideoId) => Effect.Effect<Video, YoutubeApiError>
    readonly getChannel: (
      id: ChannelId
    ) => Effect.Effect<Channel, YoutubeApiError>

    // URL-based operations
    readonly getVideoByUrl: (
      url: string
    ) => Effect.Effect<Video, YoutubeApiError>
    readonly getChannelByUrl: (
      url: string
    ) => Effect.Effect<Channel, YoutubeApiError>

    // Batch operations
    readonly getVideos: (
      ids: Array<VideoId>
    ) => Effect.Effect<Array<Video>, YoutubeApiError>
    readonly getChannels: (
      ids: Array<ChannelId>
    ) => Effect.Effect<Array<Channel>, YoutubeApiError>
  }
>() {}

const makeYoutubeApiClient = Effect.gen(function*() {
  const httpClient = yield* HttpClient.HttpClient
  const config = yield* YoutubeConfig
  const adapter = yield* YoutubeAdapter

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

  // Single video operation
  const getVideo = (id: VideoId) =>
    Effect.gen(function*() {
      const request = makeVideoRequest([id], config)
      const response = yield* executeRequest(request, decodeVideoResponse)
      const rawVideos = yield* extractVideos(response)

      if (rawVideos.length === 0) {
        return yield* Effect.fail(
          YoutubeApiError.apiError(404, `Video not found: ${id}`)
        )
      }

      return adapter.transformRawVideo(rawVideos[0] as RawVideo)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getVideo"),
  //   Effect.annotateCurrentSpan("youtube.video.id", id)
  // )

  // Video by URL operation
  const getVideoByUrl = (url: string) =>
    Effect.gen(function*() {
      const videoId = extractVideoId(url)
      if (!videoId) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(url, "Unable to extract video ID")
        )
      }
      return yield* getVideo(videoId as VideoId)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getVideoByUrl"),
  //   Effect.annotateCurrentSpan("youtube.video.url", url)
  // )

  // Batch video operation
  const getVideos = (ids: Array<VideoId>) =>
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
            return rawVideos.map((video) => adapter.transformRawVideo(video as RawVideo))
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
  const getChannel = (id: ChannelId) =>
    Effect.gen(function*() {
      const request = makeChannelRequest([id], config)
      const response = yield* executeRequest(request, decodeChannelResponse)
      const rawChannels = yield* extractChannels(response)

      if (rawChannels.length === 0) {
        return yield* Effect.fail(
          YoutubeApiError.apiError(404, `Channel not found: ${id}`)
        )
      }

      return adapter.transformRawChannel(rawChannels[0] as RawChannel)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getChannel"),
  //   Effect.annotateCurrentSpan("youtube.channel.id", id)
  // )

  // Channel by URL operation
  const getChannelByUrl = (url: string) =>
    Effect.gen(function*() {
      const channelId = extractChannelId(url)
      if (!channelId) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(
            url,
            "Unable to extract channel ID or custom URLs not supported"
          )
        )
      }
      return yield* getChannel(channelId as ChannelId)
    })
  // TODO: Add observability back after fixing type issues
  // .pipe(
  //   Effect.withSpan("YoutubeApiClient.getChannelByUrl"),
  //   Effect.annotateCurrentSpan("youtube.channel.url", url)
  // )

  // Batch channel operation
  const getChannels = (ids: Array<ChannelId>) =>
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
            return rawChannels.map((channel) => adapter.transformRawChannel(channel as RawChannel))
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
    getVideo,
    getVideoByUrl,
    getVideos,
    getChannel,
    getChannelByUrl,
    getChannels
  } as const
})

// Layer implementation
export const YoutubeApiClientLive = Layer.effect(
  YoutubeApiClient,
  makeYoutubeApiClient
).pipe(
  Layer.provide(YoutubeConfigLive),
  Layer.provide(YoutubeAdapterLive),
  Layer.provideMerge(NodeHttpClient.layer)
)
