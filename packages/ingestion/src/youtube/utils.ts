import { YouTubeChannelId, YouTubeVideoId } from "@puredialog/domain"
import { ParseResult, Schema } from "effect"

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

// Transformation functions moved to ../adapters/youtube.ts
