import { Data } from "effect"

export class YoutubeApiError extends Data.TaggedError("YoutubeApiError")<{
  readonly type: "InvalidUrl" | "ApiError" | "NetworkError" | "ValidationError" | "ConfigurationError"
  readonly message: string
  readonly cause?: unknown
  readonly context?: Record<string, unknown>
}> {
  static invalidUrl(url: string, details?: string) {
    return new YoutubeApiError({
      type: "InvalidUrl",
      message: `Invalid YouTube URL: ${url}${details ? ` (${details})` : ""}`,
      context: { url }
    })
  }

  static apiError(status: number, message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "ApiError",
      message: `YouTube API error (${status}): ${message}`,
      cause,
      context: { status }
    })
  }

  static networkError(message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "NetworkError",
      message: `Network error: ${message}`,
      cause
    })
  }

  static validationError(message: string, cause?: unknown) {
    return new YoutubeApiError({
      type: "ValidationError",
      message: `Validation error: ${message}`,
      cause
    })
  }

  static configurationError(message: string) {
    return new YoutubeApiError({
      type: "ConfigurationError",
      message: `Configuration error: ${message}`
    })
  }
}
