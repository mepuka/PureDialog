import { Data } from "effect"

/**
 * YouTube API-specific error types for domain layer
 */

/**
 * Error for YouTube API validation failures
 */
export class YoutubeApiValidationError extends Data.TaggedError("YoutubeApiValidationError")<{
  readonly message: string
  readonly field?: string | undefined
  readonly value?: unknown
}> {}

/**
 * Error for invalid YouTube URLs
 */
export class YoutubeApiInvalidUrlError extends Data.TaggedError("YoutubeApiInvalidUrlError")<{
  readonly url: string
  readonly reason: string
}> {}

/**
 * Error for YouTube API rate limiting
 */
export class YoutubeApiRateLimitError extends Data.TaggedError("YoutubeApiRateLimitError")<{
  readonly message: string
  readonly retryAfter?: number | undefined
}> {}

/**
 * Error for YouTube API quota exceeded
 */
export class YoutubeApiQuotaExceededError extends Data.TaggedError("YoutubeApiQuotaExceededError")<{
  readonly message: string
  readonly resetTime?: string | undefined
}> {}

/**
 * Generic YouTube API error
 */
export class YoutubeApiErrorClass extends Data.TaggedError("YoutubeApiError")<{
  readonly type: "NetworkError" | "ApiError" | "ValidationError" | "RateLimit" | "QuotaExceeded"
  readonly message: string
  readonly context?: {
    readonly status?: number | undefined
    readonly code?: string | undefined
    readonly reason?: string | undefined
    readonly domain?: string | undefined
  } | undefined
}> {}

/**
 * Constructor functions for errors
 */
export const YoutubeApiError = {
  validationError: (message: string, field?: string | undefined, value?: unknown) =>
    new YoutubeApiValidationError({ message, field, value }),

  invalidUrl: (url: string, reason: string) => new YoutubeApiInvalidUrlError({ url, reason }),

  rateLimit: (message: string, retryAfter?: number | undefined) =>
    new YoutubeApiRateLimitError({ message, retryAfter }),

  quotaExceeded: (message: string, resetTime?: string | undefined) =>
    new YoutubeApiQuotaExceededError({ message, resetTime }),

  apiError: (status: number, message: string, context?: YoutubeApiErrorClass["context"]) =>
    new YoutubeApiErrorClass({
      type: "ApiError",
      message,
      context: { status, ...context }
    }),

  networkError: (message: string) =>
    new YoutubeApiErrorClass({
      type: "NetworkError",
      message
    })
} as const

// YoutubeApiErrorClass is already exported above
// No need for duplicate export
