/**
 * Test Data Factories for Domain Package
 *
 * Provides factory functions to create test data for all domain entities,
 * schemas, and types following Effect patterns and ensuring type safety.
 */

import { DateTime, Option } from "effect"
import {
  AuthorizationError,
  ConfigurationError,
  MediaResourceError,
  StreamingError,
  TranscriptionError,
  ValidationError
} from "../../src/errors/definitions.js"
import type { CorrelationId, JobId, MediaResourceId, RequestId, TranscriptId } from "../../src/schemas/ids.js"
import type {
  YouTubeChannel,
  YouTubeChannelId,
  YouTubeThumbnail,
  YouTubeThumbnails,
  YouTubeVideo,
  YouTubeVideoId
} from "../../src/schemas/youtube.js"

// --- ID Factories ---

export const createTestJobId = (id = "test-job-123"): JobId => id as JobId

export const createTestRequestId = (id = "test-request-456"): RequestId => id as RequestId

export const createTestMediaResourceId = (id = "test-media-789"): MediaResourceId => id as MediaResourceId

export const createTestTranscriptId = (id = "test-transcript-abc"): TranscriptId => id as TranscriptId

export const createTestCorrelationId = (id = "test-correlation-def"): CorrelationId => id as CorrelationId

// --- YouTube ID Factories ---

export const createTestYouTubeVideoId = (id = "dQw4w9WgXcQ"): YouTubeVideoId => id as YouTubeVideoId

export const createTestYouTubeChannelId = (id = "UC1234567890123456789012"): YouTubeChannelId => id as YouTubeChannelId

// --- YouTube Data Factories ---

export const createTestYouTubeThumbnail = (overrides: Partial<YouTubeThumbnail> = {}): YouTubeThumbnail => ({
  url: "https://example.com/thumbnail.jpg",
  width: Option.some(320),
  height: Option.some(180),
  ...overrides
})

export const createTestYouTubeThumbnails = (overrides: Partial<YouTubeThumbnails> = {}): YouTubeThumbnails => ({
  default: Option.some(createTestYouTubeThumbnail({ width: Option.some(120), height: Option.some(90) })),
  medium: Option.some(createTestYouTubeThumbnail({ width: Option.some(320), height: Option.some(180) })),
  high: Option.some(createTestYouTubeThumbnail({ width: Option.some(480), height: Option.some(360) })),
  standard: Option.some(createTestYouTubeThumbnail({ width: Option.some(640), height: Option.some(480) })),
  maxres: Option.some(createTestYouTubeThumbnail({ width: Option.some(1280), height: Option.some(720) })),
  ...overrides
})

export const createTestYouTubeVideo = (overrides: Partial<YouTubeVideo> = {}): YouTubeVideo => ({
  id: createTestYouTubeVideoId(),
  title: "Test Video Title",
  description: "This is a test video description with detailed content for testing purposes.",
  publishedAt: DateTime.unsafeFromDate(new Date("2024-01-01T12:00:00Z")),
  channelId: createTestYouTubeChannelId(),
  channelTitle: "Test Channel",
  thumbnails: [createTestYouTubeThumbnails()],
  duration: 1800, // 30 minutes
  viewCount: 10000,
  likeCount: 500,
  commentCount: 25,
  tags: ["test", "video", "sample"],
  ...overrides
})

export const createTestYouTubeChannel = (overrides: Partial<YouTubeChannel> = {}): YouTubeChannel => ({
  id: createTestYouTubeChannelId(),
  title: "Test Channel",
  description: "This is a test YouTube channel for testing purposes.",
  publishedAt: DateTime.unsafeFromDate(new Date("2020-01-01T00:00:00Z")),
  thumbnails: createTestYouTubeThumbnails(),
  subscriberCount: 100000,
  videoCount: 250,
  viewCount: 5000000,
  ...overrides
})

// --- Error Factories ---

export const createTestMediaResourceError = (
  overrides: Partial<MediaResourceError> = {}
): MediaResourceError =>
  new MediaResourceError({
    message: "Failed to fetch media resource",
    source: "youtube",
    resourceId: "test-resource-id",
    ...overrides
  })

export const createTestTranscriptionError = (
  overrides: Partial<TranscriptionError> = {}
): TranscriptionError =>
  new TranscriptionError({
    message: "Transcription processing failed",
    jobId: createTestJobId(),
    phase: "processing",
    retryable: true,
    ...overrides
  })

export const createTestConfigurationError = (
  overrides: Partial<ConfigurationError> = {}
): ConfigurationError =>
  new ConfigurationError({
    message: "Invalid configuration value",
    field: "youtube_api_key",
    expectedFormat: "string with 39 characters",
    ...overrides
  })

export const createTestValidationError = (
  overrides: Partial<ValidationError> = {}
): ValidationError =>
  new ValidationError({
    message: "Validation constraint failed",
    field: "video_id",
    value: "invalid-id",
    constraint: "must be 11 characters alphanumeric",
    ...overrides
  })

export const createTestStreamingError = (
  overrides: Partial<StreamingError> = {}
): StreamingError =>
  new StreamingError({
    message: "Streaming chunk processing failed",
    jobId: createTestJobId(),
    chunkIndex: 5,
    partialData: "partial transcription data...",
    ...overrides
  })

export const createTestAuthorizationError = (
  overrides: Partial<AuthorizationError> = {}
): AuthorizationError =>
  new AuthorizationError({
    message: "Insufficient permissions",
    requestId: createTestRequestId(),
    resource: "transcription_job",
    action: "create",
    ...overrides
  })

// --- YouTube URL Test Data ---

export const TEST_YOUTUBE_URLS = {
  // Valid video URLs
  watch: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  watchWithParams: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=PLxyz",
  short: "https://youtu.be/dQw4w9WgXcQ",
  shortWithParams: "https://youtu.be/dQw4w9WgXcQ?t=30",
  embed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  embedWithParams: "https://www.youtube.com/embed/dQw4w9WgXcQ?start=30",
  mobile: "https://m.youtube.com/watch?v=dQw4w9WgXcQ",

  // Valid channel URLs
  channel: "https://www.youtube.com/channel/UC1234567890123456789012",
  channelWithParams: "https://www.youtube.com/channel/UC1234567890123456789012?sub_confirmation=1",

  // Invalid URLs
  invalidVideoId: "https://www.youtube.com/watch?v=invalid",
  invalidChannelId: "https://www.youtube.com/channel/invalid",
  nonYoutube: "https://example.com/video",
  malformed: "not-a-url-at-all",
  empty: ""
} as const

// --- YouTube ID Test Data ---

export const TEST_YOUTUBE_IDS = {
  // Valid video IDs
  validVideos: [
    "dQw4w9WgXcQ",
    "jNQXAC9IVRw",
    "9bZkp7q19f0",
    "2Vv-BfVoq4g",
    "YQHsXMglC9A"
  ],

  // Valid channel IDs
  validChannels: [
    "UC1234567890123456789012",
    "UCabcdefghijklmnopqrstuv",
    "UCXYZ123abc456def789ghij"
  ],

  // Invalid video IDs
  invalidVideos: [
    "short", // too short
    "toolongforvalidvideoid", // too long
    "invalid@chars", // invalid characters
    "dQw4w9WgXc", // missing one character
    "dQw4w9WgXcQQ", // extra character
    ""
  ],

  // Invalid channel IDs
  invalidChannels: [
    "UC123", // too short
    "XC1234567890123456789012", // wrong prefix
    "UC123456789012345678901234", // too long
    "UC@invalid#characters", // invalid characters
    "UC123456789012345678901", // missing one character
    ""
  ]
} as const

// --- ISO8601 Duration Test Data ---

export const TEST_DURATIONS = {
  valid: {
    "PT30S": 30,
    "PT5M": 300,
    "PT1H": 3600,
    "PT1H30M": 5400,
    "PT1H30M45S": 5445,
    "PT2H15M30S": 8130,
    "PT45S": 45
  },
  invalid: [
    "30S", // missing PT
    "P30S", // missing T
    "PT", // no duration specified
    "PT30X", // invalid unit
    "1H30M", // missing PT prefix
    "PT-30S", // negative duration
    ""
  ]
} as const

// --- Predicate Test Helpers ---

export const generateRandomYouTubeVideoId = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-"
  return Array.from({ length: 11 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export const generateRandomYouTubeChannelId = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-"
  const suffix = Array.from({ length: 22 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `UC${suffix}`
}

// --- Array Test Helpers ---

export const createTestVideoIds = (count: number): Array<YouTubeVideoId> =>
  Array.from({ length: count }, (_, i) => createTestYouTubeVideoId(`testVideo${i.toString().padStart(8, "0")}`))

export const createTestChannelIds = (count: number): Array<YouTubeChannelId> =>
  Array.from({ length: count }, (_, i) => createTestYouTubeChannelId(`UCtest${i.toString().padStart(19, "0")}`))
