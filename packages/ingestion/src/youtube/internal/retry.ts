import type { HttpClientError } from "@effect/platform"
import { Duration, Effect, Schedule } from "effect"
import { YoutubeConfig } from "../config.js"
import { YoutubeApiError } from "../errors.js"

// Create retry schedule from config
const createRetrySchedule = (maxAttempts: number, baseDelayMs: number) =>
  Schedule.exponential(Duration.millis(baseDelayMs)).pipe(
    Schedule.intersect(Schedule.recurs(maxAttempts - 1)),
    Schedule.whileInputEffect((error: YoutubeApiError) =>
      Effect.succeed(
        error.type === "NetworkError"
          || (error.type === "ApiError" && error.context?.status === 429)
          || (error.type === "ApiError"
            && (error.context?.status as number) >= 500)
      )
    )
  )

export const withRetry = <A, R>(effect: Effect.Effect<A, YoutubeApiError, R>) =>
  Effect.gen(function*() {
    const config = yield* YoutubeConfig
    const backoffMs = Duration.toMillis(config.retryBackoff)
    const schedule = createRetrySchedule(config.retryAttempts, backoffMs)
    return yield* effect.pipe(Effect.retry(schedule))
  })

// HTTP error transformation
export const transformHttpError = (error: HttpClientError.HttpClientError): YoutubeApiError => {
  switch (error._tag) {
    case "RequestError":
      return YoutubeApiError.networkError("Request failed", error)
    case "ResponseError": {
      const status = error.response.status
      if (status === 403) {
        return YoutubeApiError.apiError(
          status,
          "API key invalid or quota exceeded"
        )
      } else if (status === 404) {
        return YoutubeApiError.apiError(status, "Resource not found")
      } else if (status === 429) {
        return YoutubeApiError.apiError(status, "Rate limit exceeded")
      } else {
        return YoutubeApiError.apiError(status, `HTTP ${status} error`)
      }
    }
    default:
      return YoutubeApiError.networkError("Unknown HTTP error", error)
  }
}
