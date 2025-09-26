/**
 * YouTube Domain Schemas
 *
 * Pure domain schemas for YouTube functionality with standard Effect APIs.
 * Provides schemas, predicates, refinements, and type guards following Effect patterns.
 */

import type { Predicate } from "effect"
import { Option, ParseResult, Schema } from "effect"

/**
 * Branded type for YouTube Video IDs
 * 11-character alphanumeric string with hyphens and underscores
 */
export const YouTubeVideoId = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9_-]{11}$/, {
    message: () => "YouTube Video ID must be 11 characters (alphanumeric, hyphens, underscores)"
  }),
  Schema.brand("YouTubeVideoId")
)
export type YouTubeVideoId = Schema.Schema.Type<typeof YouTubeVideoId>

/**
 * Type guard for YouTube Video IDs
 */
export const isYouTubeVideoId = Schema.is(YouTubeVideoId)

/**
 * Predicate for YouTube Video IDs
 */
export const isValidVideoId: Predicate.Predicate<string> = (value): boolean => /^[a-zA-Z0-9_-]{11}$/.test(value)

/**
 * Branded type for YouTube Channel IDs
 * Starts with 'UC' followed by 22 alphanumeric characters with hyphens and underscores
 */
export const YouTubeChannelId = Schema.String.pipe(
  Schema.pattern(/^UC[a-zA-Z0-9_-]{22}$/, {
    message: () => "YouTube Channel ID must start with 'UC' followed by 22 characters"
  }),
  Schema.brand("YouTubeChannelId")
)
export type YouTubeChannelId = Schema.Schema.Type<typeof YouTubeChannelId>

/**
 * Type guard for YouTube Channel IDs
 */
export const isYouTubeChannelId = Schema.is(YouTubeChannelId)

/**
 * Predicate for YouTube Channel IDs
 */
export const isValidChannelId: Predicate.Predicate<string> = (value): value is string =>
  /^UC[a-zA-Z0-9_-]{22}$/.test(value)

/**
 * YouTube Video Thumbnails
 */
export const YouTubeThumbnail = Schema.Struct({
  url: Schema.String,
  width: Schema.OptionFromNullishOr(Schema.Number, undefined),
  height: Schema.OptionFromNullishOr(Schema.Number, undefined)
})
export type YouTubeThumbnail = Schema.Schema.Type<typeof YouTubeThumbnail>

export const YouTubeThumbnails = Schema.Struct({
  default: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  medium: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  high: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  standard: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined),
  maxres: Schema.OptionFromNullishOr(YouTubeThumbnail, undefined)
})
export type YouTubeThumbnails = Schema.Schema.Type<typeof YouTubeThumbnails>

/**
 * Core YouTube Video domain schema
 */
export const YouTubeVideo = Schema.Struct({
  id: YouTubeVideoId,
  title: Schema.NonEmptyString,
  description: Schema.String,
  publishedAt: Schema.DateTimeUtc,
  channelId: YouTubeChannelId,
  channelTitle: Schema.NonEmptyString,
  thumbnails: Schema.Array(YouTubeThumbnails).pipe(Schema.propertySignature, Schema.withConstructorDefault(() => [])),
  duration: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  viewCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  likeCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  commentCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  tags: Schema.Array(Schema.NonEmptyString)
})
export type YouTubeVideo = Schema.Schema.Type<typeof YouTubeVideo>

/**
 * Type guard for YouTube Videos
 */
export const isYouTubeVideo = Schema.is(YouTubeVideo)

/**
 * Refinement for YouTube Videos
 */
export const refineYouTubeVideo = YouTubeVideo.pipe(Schema.filter(isYouTubeVideo))

/**
 * Core YouTube Channel domain schema
 */
export const YouTubeChannel = Schema.Struct({
  id: YouTubeChannelId,
  title: Schema.NonEmptyString,
  description: Schema.String,
  publishedAt: Schema.DateTimeUtc,
  thumbnails: YouTubeThumbnails,
  subscriberCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  videoCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  viewCount: Schema.Number.pipe(Schema.int(), Schema.nonNegative())
})
export type YouTubeChannel = Schema.Schema.Type<typeof YouTubeChannel>

/**
 * Type guard for YouTube Channels
 */
export const isYouTubeChannel = Schema.is(YouTubeChannel)

/**
 * Refinement for YouTube Channels
 */
export const refineYouTubeChannel = YouTubeChannel.pipe(Schema.filter(isYouTubeChannel))

/**
 * Extract YouTube video ID from URL using Effect patterns
 */
export const extractVideoId = (url: string): Option.Option<YouTubeVideoId> => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1] && isValidVideoId(match[1])) {
      return Option.some(match[1] as YouTubeVideoId)
    }
  }

  return Option.none()
}

/**
 * Parse YouTube video ID from string with validation
 */
export const parseVideoId = Schema.decodeOption(YouTubeVideoId)

/**
 * Safe video ID extraction with schema validation
 */
export const safeExtractVideoId = (url: string): Option.Option<YouTubeVideoId> =>
  Option.flatMap(extractVideoId(url), parseVideoId)

/**
 * Extract YouTube channel ID from URL using Effect patterns
 */
export const extractChannelId = (url: string): Option.Option<YouTubeChannelId> => {
  const patterns = [
    /youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      // Only return if it matches the UC format for channel IDs
      if (isValidChannelId(match[1])) {
        return Option.some(match[1] as YouTubeChannelId)
      }
    }
  }

  return Option.none()
}

/**
 * Parse YouTube channel ID from string with validation
 */
export const parseChannelId = Schema.decodeOption(YouTubeChannelId)

/**
 * Safe channel ID extraction with schema validation
 */
export const safeExtractChannelId = (url: string): Option.Option<YouTubeChannelId> =>
  Option.flatMap(extractChannelId(url), parseChannelId)

/**
 * YouTube URL patterns and validation
 */
export const WATCH_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
export const SHORT_URL_PATTERN = /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/
export const EMBED_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
export const MOBILE_URL_PATTERN = /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
export const CHANNEL_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/

/**
 * Combined pattern for all YouTube video URL formats
 */
const ALL_YOUTUBE_VIDEO_URL_PATTERN = new RegExp(
  [
    WATCH_URL_PATTERN.source,
    SHORT_URL_PATTERN.source,
    EMBED_URL_PATTERN.source,
    MOBILE_URL_PATTERN.source
  ].join("|")
)

/**
 * Predicate: Check if a string is a valid YouTube video URL
 */
export const isValidYoutubeUrl: Predicate.Predicate<string> = (url): url is string => Option.isSome(extractVideoId(url))

/**
 * Predicate: Check if a string is a valid YouTube channel URL
 */
export const isValidYoutubeChannelUrl: Predicate.Predicate<string> = (url): url is string =>
  Option.isSome(extractChannelId(url))

/**
 * Predicate: Check if a string is any valid YouTube URL (video or channel)
 */
export const isValidYoutubeAnyUrl: Predicate.Predicate<string> = (url): url is string =>
  isValidYoutubeUrl(url) || isValidYoutubeChannelUrl(url)

/**
 * Convert YouTube video ID to standard watch URL
 */
export const videoIdToWatchUrl = (videoId: YouTubeVideoId): string => {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Convert YouTube channel ID to channel URL
 */
export const channelIdToChannelUrl = (channelId: YouTubeChannelId): string => {
  return `https://www.youtube.com/channel/${channelId}`
}

/**
 * Schema for validated YouTube video URL
 */
const YoutubeVideoUrl = Schema.String.pipe(
  Schema.pattern(WATCH_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL"
  }),
  Schema.brand("YoutubeVideoUrl")
)

/**
 * Transform string to YouTube video URL with validation
 */
export const YoutubeVideoUrlFromString = Schema.transformOrFail(
  Schema.String,
  YoutubeVideoUrl,
  {
    decode: (value, _, ast) => {
      const idOption = extractVideoId(value)
      if (Option.isNone(idOption)) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(idOption.value)
    },
    encode: (id) => ParseResult.succeed(YoutubeVideoUrl.make(`https://www.youtube.com/watch?v=${id}`)),
    strict: false
  }
)

/**
 * Transform string to YouTube channel ID with validation
 */
export const YoutubeChannelUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((value) => Option.isSome(extractChannelId(value)), {
      message: () => "Must be a valid YouTube channel URL with standard channel ID format"
    })
  ),
  YouTubeChannelId,
  {
    decode: (value, _, ast) => {
      const idOption = extractChannelId(value)
      if (Option.isNone(idOption)) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(idOption.value)
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/channel/${id}`)
  }
)

/**
 * Schema for validated YouTube URL (any video format)
 */
export const ValidatedYoutubeUrl = Schema.String.pipe(
  Schema.pattern(ALL_YOUTUBE_VIDEO_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL (watch, youtu.be, embed, or mobile format)"
  }),
  Schema.brand("ValidatedYoutubeUrl")
)
export type ValidatedYoutubeUrl = Schema.Schema.Type<typeof ValidatedYoutubeUrl>

/**
 * ISO8601 Duration parsing utility
 */
export const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Schema for ISO8601 duration strings
 */
export const ISO8601Duration = Schema.String.pipe(
  Schema.pattern(/^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/, {
    message: () => "Must be a valid ISO8601 duration (e.g., PT1H30M45S)"
  }),
  Schema.brand("ISO8601Duration")
)
export type ISO8601Duration = Schema.Schema.Type<typeof ISO8601Duration>

/**
 * Transform ISO8601 duration to seconds
 */
export const DurationInSeconds = Schema.transformOrFail(
  ISO8601Duration,
  Schema.Number.pipe(Schema.int(), Schema.nonNegative()),
  {
    decode: (duration) => ParseResult.succeed(parseISO8601Duration(duration)),
    encode: (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      let result = "PT"
      if (hours > 0) result += `${hours}H`
      if (minutes > 0) result += `${minutes}M`
      if (remainingSeconds > 0 || result === "PT") result += `${remainingSeconds}S`

      return ParseResult.succeed(result as ISO8601Duration)
    }
  }
)
