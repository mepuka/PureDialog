/**
 * YouTube Domain Module
 *
 * This module re-exports YouTube functionality from the consolidated schemas.
 * All YouTube schemas, utilities, and URL functions are now in @puredialog/domain/schemas/youtube
 */

// YouTube-specific error types
export * from "./errors.js"

// Re-export YouTube types
export type {
  ISO8601Duration,
  ValidatedYoutubeUrl,
  YouTubeChannel,
  YouTubeChannelId,
  YouTubeThumbnail,
  YouTubeThumbnails,
  YouTubeVideo,
  YouTubeVideoId
} from "../schemas/youtube.js"

// Re-export YouTube schemas and utilities
export {
  // URL patterns
  CHANNEL_URL_PATTERN,
  // URL conversion
  channelIdToChannelUrl,
  // Duration utilities
  DurationInSeconds,
  EMBED_URL_PATTERN,
  // URL extraction
  extractChannelId,
  extractVideoId,
  // Predicates
  isValidChannelId,
  isValidVideoId,
  isValidYoutubeAnyUrl,
  isValidYoutubeChannelUrl,
  isValidYoutubeUrl,
  // Type guards
  isYouTubeChannel,
  isYouTubeChannelId,
  isYouTubeVideo,
  isYouTubeVideoId,
  MOBILE_URL_PATTERN,
  // Schema parsing
  parseChannelId,
  parseISO8601Duration,
  parseVideoId,
  // Refinements
  refineYouTubeChannel,
  refineYouTubeVideo,
  safeExtractChannelId,
  safeExtractVideoId,
  SHORT_URL_PATTERN,
  videoIdToWatchUrl,
  WATCH_URL_PATTERN,
  // Schema transformations
  YoutubeChannelUrl,
  YoutubeVideoUrlFromString
} from "../schemas/youtube.js"
