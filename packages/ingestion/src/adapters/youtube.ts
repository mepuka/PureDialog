/**
 * YouTube Adapter
 *
 * Clean adapters for transforming YouTube API types to domain types and MediaResource.
 * This is the boundary between external APIs and our domain model.
 */

import type { youtube_v3 } from "@googleapis/youtube"
import type { MediaResource, YouTubeChannel, YouTubeChannelId, YouTubeVideo, YouTubeVideoId } from "@puredialog/domain"
import { parseISO8601Duration } from "@puredialog/domain"
import { Context, Data, Effect, Layer, Option, Schema } from "effect"

/**
 * Error for YouTube API conversion issues
 */
export class YouTubeAdapterError extends Data.TaggedError("YouTubeAdapterError")<{
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static invalidApiData(message: string, data?: unknown) {
    return new YouTubeAdapterError({
      message: `Invalid API data: ${message}`,
      context: { data }
    })
  }

  static missingRequiredField(field: string, data?: unknown) {
    return new YouTubeAdapterError({
      message: `Missing required field: ${field}`,
      context: { field, data }
    })
  }

  static transformationFailed(message: string, cause?: unknown) {
    return new YouTubeAdapterError({
      message: `Transformation failed: ${message}`,
      cause,
      context: { operation: "transformation" }
    })
  }
}

/**
 * YouTube Adapter Service
 */
/**
 * YouTube API to Domain transformation interface
 */
export class YouTubeAdapter extends Context.Tag("YouTubeAdapter")<
  YouTubeAdapter,
  {
    // Domain transformations
    readonly toDomainVideo: (
      apiVideo: youtube_v3.Schema$Video
    ) => Effect.Effect<YouTubeVideo, YouTubeAdapterError>
    readonly toDomainChannel: (
      apiChannel: youtube_v3.Schema$Channel
    ) => Effect.Effect<YouTubeChannel, YouTubeAdapterError>

    // MediaResource transformations
    readonly toMediaResourceVideo: (video: YouTubeVideo) => MediaResource
    readonly toMediaResourceChannel: (channel: YouTubeChannel) => MediaResource
    readonly apiVideoToMediaResource: (
      apiVideo: youtube_v3.Schema$Video
    ) => Effect.Effect<MediaResource, YouTubeAdapterError>
    readonly apiChannelToMediaResource: (
      apiChannel: youtube_v3.Schema$Channel
    ) => Effect.Effect<MediaResource, YouTubeAdapterError>

    // Validation
    readonly validateVideo: (
      apiVideo: youtube_v3.Schema$Video
    ) => Effect.Effect<youtube_v3.Schema$Video, YouTubeAdapterError>
    readonly validateChannel: (
      apiChannel: youtube_v3.Schema$Channel
    ) => Effect.Effect<youtube_v3.Schema$Channel, YouTubeAdapterError>

    // Raw data transformations (from client responses)
    readonly transformRawVideoToDomain: (rawVideo: any) => Effect.Effect<YouTubeVideo, YouTubeAdapterError>
    readonly transformRawChannelToDomain: (rawChannel: any) => Effect.Effect<YouTubeChannel, YouTubeAdapterError>
    readonly transformRawVideoToMediaResource: (rawVideo: any) => Effect.Effect<MediaResource, YouTubeAdapterError>
    readonly transformRawChannelToMediaResource: (rawChannel: any) => Effect.Effect<MediaResource, YouTubeAdapterError>

    // Legacy synchronous transforms for backward compatibility
    readonly transformRawVideo: (rawVideo: any) => YouTubeVideo
    readonly transformRawChannel: (rawChannel: any) => YouTubeChannel
  }
>() {}

/**
 * Converts YouTube API Video to domain YouTubeVideo
 */
const toDomainVideo = (apiVideo: youtube_v3.Schema$Video): Effect.Effect<YouTubeVideo, YouTubeAdapterError> =>
  Effect.gen(function*() {
    if (!apiVideo.id || !apiVideo.snippet) {
      return yield* Effect.fail(
        YouTubeAdapterError.missingRequiredField("id or snippet", apiVideo)
      )
    }

    const statistics = apiVideo.statistics || {}

    // Transform thumbnails to Option-based structure
    const transformThumbnail = (thumb?: youtube_v3.Schema$Thumbnail) =>
      thumb ?
        Option.some({
          url: thumb.url || "",
          width: Option.fromNullable(thumb.width),
          height: Option.fromNullable(thumb.height)
        }) :
        Option.none()

    const thumbnails = [{
      default: transformThumbnail(apiVideo.snippet.thumbnails?.default),
      medium: transformThumbnail(apiVideo.snippet.thumbnails?.medium),
      high: transformThumbnail(apiVideo.snippet.thumbnails?.high),
      standard: transformThumbnail(apiVideo.snippet.thumbnails?.standard),
      maxres: transformThumbnail(apiVideo.snippet.thumbnails?.maxres)
    }]

    // Create domain object using proper types
    const domainVideo: YouTubeVideo = {
      id: apiVideo.id as YouTubeVideoId,
      title: apiVideo.snippet.title || "",
      description: apiVideo.snippet.description || "",
      publishedAt: Schema.decodeSync(Schema.DateTimeUtc)(apiVideo.snippet.publishedAt || new Date().toISOString()),
      channelId: apiVideo.snippet.channelId as YouTubeChannelId,
      channelTitle: apiVideo.snippet.channelTitle || "",
      thumbnails,
      duration: parseISO8601Duration(apiVideo.contentDetails?.duration || "PT0S"),
      viewCount: parseInt(statistics.viewCount || "0", 10),
      likeCount: parseInt(statistics.likeCount || "0", 10),
      commentCount: parseInt(statistics.commentCount || "0", 10),
      tags: apiVideo.snippet.tags || []
    }

    return domainVideo
  })

/**
 * Converts YouTube API Channel to domain YouTubeChannel
 */
const toDomainChannel = (apiChannel: youtube_v3.Schema$Channel): Effect.Effect<YouTubeChannel, YouTubeAdapterError> =>
  Effect.gen(function*() {
    if (!apiChannel.id || !apiChannel.snippet) {
      return yield* Effect.fail(
        YouTubeAdapterError.missingRequiredField("id or snippet", apiChannel)
      )
    }

    const statistics = apiChannel.statistics || {}

    // Transform thumbnails to Option-based structure (reuse function)
    const transformThumbnail = (thumb?: youtube_v3.Schema$Thumbnail) =>
      thumb ?
        Option.some({
          url: thumb.url || "",
          width: Option.fromNullable(thumb.width),
          height: Option.fromNullable(thumb.height)
        }) :
        Option.none()

    const thumbnails = {
      default: transformThumbnail(apiChannel.snippet.thumbnails?.default),
      medium: transformThumbnail(apiChannel.snippet.thumbnails?.medium),
      high: transformThumbnail(apiChannel.snippet.thumbnails?.high),
      standard: transformThumbnail(apiChannel.snippet.thumbnails?.standard),
      maxres: transformThumbnail(apiChannel.snippet.thumbnails?.maxres)
    }

    // Create domain object using proper types
    const domainChannel: YouTubeChannel = {
      id: apiChannel.id as YouTubeChannelId,
      title: apiChannel.snippet.title || "",
      description: apiChannel.snippet.description || "",
      publishedAt: Schema.decodeSync(Schema.DateTimeUtc)(apiChannel.snippet.publishedAt || new Date().toISOString()),
      thumbnails,
      subscriberCount: parseInt(statistics.subscriberCount || "0", 10),
      videoCount: parseInt(statistics.videoCount || "0", 10),
      viewCount: parseInt(statistics.viewCount || "0", 10)
    }

    return domainChannel
  })

/**
 * Validates YouTube API Video has required fields
 */
const validateVideoFields = (
  apiVideo: youtube_v3.Schema$Video
): Effect.Effect<youtube_v3.Schema$Video, YouTubeAdapterError> =>
  Effect.gen(function*() {
    if (!apiVideo) {
      return yield* Effect.fail(YouTubeAdapterError.invalidApiData("Video is null or undefined"))
    }
    if (!apiVideo.id) {
      return yield* Effect.fail(YouTubeAdapterError.missingRequiredField("id", apiVideo))
    }
    if (!apiVideo.snippet) {
      return yield* Effect.fail(YouTubeAdapterError.missingRequiredField("snippet", apiVideo))
    }
    return apiVideo
  })

/**
 * Validates YouTube API Channel has required fields
 */
const validateChannelFields = (
  apiChannel: youtube_v3.Schema$Channel
): Effect.Effect<youtube_v3.Schema$Channel, YouTubeAdapterError> =>
  Effect.gen(function*() {
    if (!apiChannel) {
      return yield* Effect.fail(YouTubeAdapterError.invalidApiData("Channel is null or undefined"))
    }
    if (!apiChannel.id) {
      return yield* Effect.fail(YouTubeAdapterError.missingRequiredField("id", apiChannel))
    }
    if (!apiChannel.snippet) {
      return yield* Effect.fail(YouTubeAdapterError.missingRequiredField("snippet", apiChannel))
    }
    return apiChannel
  })

/**
 * Converts domain YouTubeVideo to MediaResource
 */
const toMediaResourceVideo = (video: YouTubeVideo): MediaResource => ({
  type: "youtube" as const,
  data: video
})

/**
 * Converts domain YouTubeChannel to MediaResource
 */
const toMediaResourceChannel = (channel: YouTubeChannel): MediaResource => ({
  type: "youtube#channel" as const,
  data: channel
})

/**
 * Converts YouTube API Video directly to MediaResource
 */
const apiVideoToMediaResource = (
  apiVideo: youtube_v3.Schema$Video
): Effect.Effect<MediaResource, YouTubeAdapterError> =>
  Effect.gen(function*() {
    const video = yield* toDomainVideo(apiVideo)
    return toMediaResourceVideo(video)
  })

/**
 * Converts YouTube API Channel directly to MediaResource
 */
const apiChannelToMediaResource = (
  apiChannel: youtube_v3.Schema$Channel
): Effect.Effect<MediaResource, YouTubeAdapterError> =>
  Effect.gen(function*() {
    const channel = yield* toDomainChannel(apiChannel)
    return toMediaResourceChannel(channel)
  })

/**
 * Transform raw YouTube API video data to domain type
 * Handles the RawVideo type from the client responses
 */
const transformRawVideoToDomain = (rawVideo: any): Effect.Effect<YouTubeVideo, YouTubeAdapterError> => {
  // Convert the raw API video to the expected format and then transform
  const apiVideo: youtube_v3.Schema$Video = {
    id: rawVideo.id,
    snippet: rawVideo.snippet,
    contentDetails: rawVideo.contentDetails,
    statistics: rawVideo.statistics
  }

  return toDomainVideo(apiVideo)
}

/**
 * Transform raw YouTube API channel data to domain type
 * Handles the RawChannel type from the client responses
 */
const transformRawChannelToDomain = (rawChannel: any): Effect.Effect<YouTubeChannel, YouTubeAdapterError> => {
  // Convert the raw API channel to the expected format and then transform
  const apiChannel: youtube_v3.Schema$Channel = {
    id: rawChannel.id,
    snippet: rawChannel.snippet,
    statistics: rawChannel.statistics
  }

  return toDomainChannel(apiChannel)
}

/**
 * Transform raw YouTube API video data directly to MediaResource
 */
const transformRawVideoToMediaResource = (rawVideo: any): Effect.Effect<MediaResource, YouTubeAdapterError> =>
  Effect.gen(function*() {
    const domainVideo = yield* transformRawVideoToDomain(rawVideo)
    return toMediaResourceVideo(domainVideo)
  })

/**
 * Transform raw YouTube API channel data directly to MediaResource
 */
const transformRawChannelToMediaResource = (rawChannel: any): Effect.Effect<MediaResource, YouTubeAdapterError> =>
  Effect.gen(function*() {
    const domainChannel = yield* transformRawChannelToDomain(rawChannel)
    return toMediaResourceChannel(domainChannel)
  })

/**
 * Legacy functions for backward compatibility with YouTube client
 * These transform raw API responses to domain types synchronously
 */
const transformRawVideo = (rawVideo: any): YouTubeVideo => {
  return Effect.runSync(transformRawVideoToDomain(rawVideo))
}

const transformRawChannel = (rawChannel: any): YouTubeChannel => {
  return Effect.runSync(transformRawChannelToDomain(rawChannel))
}

/**
 * Live implementation of YouTubeAdapter
 */
export const YouTubeAdapterLive = Layer.succeed(YouTubeAdapter, {
  // Domain transformations
  toDomainVideo,
  toDomainChannel,

  // MediaResource transformations
  toMediaResourceVideo,
  toMediaResourceChannel,
  apiVideoToMediaResource,
  apiChannelToMediaResource,

  // Validation
  validateVideo: validateVideoFields,
  validateChannel: validateChannelFields,

  // Raw data transformations
  transformRawVideoToDomain,
  transformRawChannelToDomain,
  transformRawVideoToMediaResource,
  transformRawChannelToMediaResource,

  // Legacy synchronous transforms
  transformRawVideo,
  transformRawChannel
})

// Export the adapter functions for direct use if needed
export {
  apiChannelToMediaResource,
  apiVideoToMediaResource,
  toDomainChannel,
  toDomainVideo,
  toMediaResourceChannel,
  toMediaResourceVideo,
  transformRawChannel,
  transformRawChannelToDomain,
  transformRawChannelToMediaResource,
  transformRawVideo,
  transformRawVideoToDomain,
  transformRawVideoToMediaResource,
  validateChannelFields,
  validateVideoFields
}
