import type { Predicate } from "effect"
import { Schema } from "effect"

/**
 * YouTube-specific types and schemas
 */

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
