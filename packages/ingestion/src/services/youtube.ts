/**
 * YouTube Service
 *
 * High-level service for YouTube operations using clean domain types.
 * This service orchestrates the client and adapter to provide a clean API.
 */

import type { MediaResource, YouTubeChannel, YouTubeChannelId, YouTubeVideo, YouTubeVideoId } from "@puredialog/domain"
import { Context, Effect, Layer } from "effect"
import { YouTubeAdapter, YouTubeAdapterLive } from "../adapters/youtube.js"
import { YoutubeApiClient, YoutubeApiClientLive } from "../youtube/client.js"

export class YouTubeService extends Context.Tag("YouTubeService")<
  YouTubeService,
  {
    // MediaResource operations (for ingestion pipeline)
    readonly getVideoAsMediaResource: (
      videoId: YouTubeVideoId
    ) => Effect.Effect<MediaResource, Error>
    readonly getChannelAsMediaResource: (
      channelId: YouTubeChannelId
    ) => Effect.Effect<MediaResource, Error>

    // Domain type operations (for direct usage)
    readonly getVideo: (
      videoId: YouTubeVideoId
    ) => Effect.Effect<YouTubeVideo, Error>
    readonly getChannel: (
      channelId: YouTubeChannelId
    ) => Effect.Effect<YouTubeChannel, Error>

    // URL-based operations
    readonly getVideoByUrl: (url: string) => Effect.Effect<YouTubeVideo, Error>
    readonly getChannelByUrl: (url: string) => Effect.Effect<YouTubeChannel, Error>

    // Batch operations
    readonly getVideos: (
      videoIds: Array<YouTubeVideoId>
    ) => Effect.Effect<Array<YouTubeVideo>, Error>
    readonly getChannels: (
      channelIds: Array<YouTubeChannelId>
    ) => Effect.Effect<Array<YouTubeChannel>, Error>
  }
>() {}

const make = Effect.gen(function*() {
  const client = yield* YoutubeApiClient
  const adapter = yield* YouTubeAdapter

  // MediaResource operations (for ingestion pipeline)
  const getVideoAsMediaResource = (videoId: YouTubeVideoId): Effect.Effect<MediaResource, Error> =>
    Effect.gen(function*() {
      const rawVideo = yield* client.getVideoRaw(videoId)
      const mediaResource = yield* adapter.transformRawVideoToMediaResource(rawVideo)
      return mediaResource
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube video: ${error}`))
    )

  const getChannelAsMediaResource = (channelId: YouTubeChannelId): Effect.Effect<MediaResource, Error> =>
    Effect.gen(function*() {
      const rawChannel = yield* client.getChannelRaw(channelId)
      const mediaResource = yield* adapter.transformRawChannelToMediaResource(rawChannel)
      return mediaResource
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube channel: ${error}`))
    )

  // Domain type operations (for direct usage)
  const getVideo = (videoId: YouTubeVideoId): Effect.Effect<YouTubeVideo, Error> =>
    Effect.gen(function*() {
      const rawVideo = yield* client.getVideoRaw(videoId)
      const domainVideo = yield* adapter.transformRawVideoToDomain(rawVideo)
      return domainVideo
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube video: ${error}`))
    )

  const getChannel = (channelId: YouTubeChannelId): Effect.Effect<YouTubeChannel, Error> =>
    Effect.gen(function*() {
      const rawChannel = yield* client.getChannelRaw(channelId)
      const domainChannel = yield* adapter.transformRawChannelToDomain(rawChannel)
      return domainChannel
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube channel: ${error}`))
    )

  // URL-based operations
  const getVideoByUrl = (url: string): Effect.Effect<YouTubeVideo, Error> =>
    Effect.gen(function*() {
      const rawVideo = yield* client.getVideoByUrl(url)
      const domainVideo = yield* adapter.transformRawVideoToDomain(rawVideo)
      return domainVideo
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube video by URL: ${error}`))
    )

  const getChannelByUrl = (url: string): Effect.Effect<YouTubeChannel, Error> =>
    Effect.gen(function*() {
      const rawChannel = yield* client.getChannelByUrl(url)
      const domainChannel = yield* adapter.transformRawChannelToDomain(rawChannel)
      return domainChannel
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube channel by URL: ${error}`))
    )

  // Batch operations
  const getVideos = (videoIds: Array<YouTubeVideoId>): Effect.Effect<Array<YouTubeVideo>, Error> =>
    Effect.gen(function*() {
      const rawVideos = yield* client.getVideosRaw(videoIds)
      const domainVideos = yield* Effect.forEach(
        rawVideos,
        (rawVideo) => adapter.transformRawVideoToDomain(rawVideo),
        { concurrency: 10 }
      )
      return domainVideos
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube videos: ${error}`))
    )

  const getChannels = (channelIds: Array<YouTubeChannelId>): Effect.Effect<Array<YouTubeChannel>, Error> =>
    Effect.gen(function*() {
      const rawChannels = yield* client.getChannelsRaw(channelIds)
      const domainChannels = yield* Effect.forEach(
        rawChannels,
        (rawChannel) => adapter.transformRawChannelToDomain(rawChannel),
        { concurrency: 10 }
      )
      return domainChannels
    }).pipe(
      Effect.mapError((error) => new Error(`Failed to get YouTube channels: ${error}`))
    )

  return {
    getVideoAsMediaResource,
    getChannelAsMediaResource,
    getVideo,
    getChannel,
    getVideoByUrl,
    getChannelByUrl,
    getVideos,
    getChannels
  } as const
})

export const YouTubeServiceLive = Layer.effect(YouTubeService, make).pipe(
  Layer.provide(Layer.merge(YoutubeApiClientLive, YouTubeAdapterLive))
)
