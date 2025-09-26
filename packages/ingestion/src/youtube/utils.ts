import { YouTubeChannel, YouTubeChannelId, YouTubeVideo, YouTubeVideoId } from "@puredialog/domain"
import { ParseResult, Schema } from "effect"
import type { RawChannel, RawVideo } from "./internal/responses.js"

const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/
const CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{22}$/

const WATCH_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
const SHORT_URL_PATTERN = /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/
const EMBED_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
const MOBILE_URL_PATTERN = /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/

const ALL_YOUTUBE_VIDEO_URL_PATTERN = new RegExp(
  [
    WATCH_URL_PATTERN.source,
    SHORT_URL_PATTERN.source,
    EMBED_URL_PATTERN.source,
    MOBILE_URL_PATTERN.source
  ].join("|")
)

const CHANNEL_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/

export const extractVideoId = (url: string): YouTubeVideoId | null => {
  const patterns = [WATCH_URL_PATTERN, SHORT_URL_PATTERN, EMBED_URL_PATTERN, MOBILE_URL_PATTERN]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1] && VIDEO_ID_PATTERN.test(match[1])) {
      return match[1] as YouTubeVideoId
    }
  }
  return VIDEO_ID_PATTERN.test(url) ? (url as YouTubeVideoId) : null
}

export const extractChannelId = (url: string): YouTubeChannelId | null => {
  const channelMatch = url.match(CHANNEL_URL_PATTERN)
  if (channelMatch && channelMatch[1]) {
    return channelMatch[1] as YouTubeChannelId
  }
  return CHANNEL_ID_PATTERN.test(url) ? (url as YouTubeChannelId) : null
}

export const YoutubeVideoUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((value) => extractVideoId(value) !== null, {
      message: () => "Must be a valid YouTube video URL or video ID"
    })
  ),
  YouTubeVideoId,
  {
    decode: (value, _, ast) => {
      const id = extractVideoId(value)
      if (id === null) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(id)
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/watch?v=${id}`)
  }
)

export const YoutubeChannelUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((value) => extractChannelId(value) !== null, {
      message: () => "Must be a valid YouTube channel URL with standard channel ID format"
    })
  ),
  YouTubeChannelId,
  {
    decode: (value, _, ast) => {
      const id = extractChannelId(value)
      if (id === null) {
        return ParseResult.fail(new ParseResult.Type(ast, value))
      }
      return ParseResult.succeed(id)
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/channel/${id}`)
  }
)

export const ValidatedYoutubeUrl = Schema.String.pipe(
  Schema.pattern(ALL_YOUTUBE_VIDEO_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL (watch, youtu.be, embed, or mobile format)"
  })
)

export const transformVideo = (apiVideo: RawVideo): YouTubeVideo =>
  YouTubeVideo.make({
    id: YouTubeVideoId.make(apiVideo.id as YouTubeVideoId),
    title: apiVideo.snippet?.title ?? "Untitled",
    description: apiVideo.snippet?.description ?? undefined,
    duration: apiVideo.contentDetails?.duration ? parseISO8601Duration(apiVideo.contentDetails.duration) : 0,
    channelId: apiVideo.snippet?.channelId ?? "",
    tags: apiVideo.snippet?.tags ?? [] as ReadonlyArray<string>,
    channelTitle: apiVideo.snippet?.channelTitle ?? "Unknown Channel",
    publishedAt: apiVideo.snippet?.publishedAt ?? undefined,
    language: apiVideo.snippet?.defaultAudioLanguage ?? "en-US"
  })

export const transformChannel = (apiChannel: RawChannel): YouTubeChannel =>
  YouTubeChannel.make({
    id: YouTubeChannelId.make(apiChannel.id as YouTubeChannelId),
    title: apiChannel.snippet?.title ?? "Untitled Channel",
    description: apiChannel.snippet?.description ?? undefined,
    customUrl: apiChannel.snippet?.customUrl ?? undefined,
    publishedAt: apiChannel.snippet?.publishedAt ?? new Date().toISOString(),
    country: apiChannel.snippet?.country ?? undefined,
    subscriberCount: apiChannel.statistics?.subscriberCount
      ? parseInt(apiChannel.statistics.subscriberCount, 10) || undefined
      : undefined
  })

const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return 0
  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)
  return hours * 3600 + minutes * 60 + seconds
}
