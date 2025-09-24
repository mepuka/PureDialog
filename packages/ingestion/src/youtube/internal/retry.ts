import { HttpClientError } from "@effect/platform";
import { Effect, Schedule } from "effect";
import { YoutubeApiError } from "../errors.js";

// Retry policy for YouTube API
export const youtubeRetrySchedule = (maxAttempts: number) =>
  Schedule.exponential("1 seconds").pipe(
    Schedule.intersect(Schedule.recurs(maxAttempts - 1)),
    Schedule.whileInputEffect((error: YoutubeApiError) =>
      Effect.succeed(
        error.type === "NetworkError"
          || (error.type === "ApiError" && error.context?.status === 429)
          || (error.type === "ApiError"
            && (error.context?.status as number) >= 500),
      )
    ),
  );

export const withRetry = <A, R>(effect: Effect.Effect<A, YoutubeApiError, R>) =>
  effect.pipe(Effect.retry(youtubeRetrySchedule(3))); // Default retry attempts since retryAttempts removed

// HTTP error transformation
export const transformHttpError = (error: HttpClientError.HttpClientError): YoutubeApiError => {
  switch (error._tag) {
    case "RequestError":
      return YoutubeApiError.networkError("Request failed", error);
    case "ResponseError": {
      const status = error.response.status;
      if (status === 403) {
        return YoutubeApiError.apiError(
          status,
          "API key invalid or quota exceeded",
        );
      } else if (status === 404) {
        return YoutubeApiError.apiError(status, "Resource not found");
      } else if (status === 429) {
        return YoutubeApiError.apiError(status, "Rate limit exceeded");
      } else {
        return YoutubeApiError.apiError(status, `HTTP ${status} error`);
      }
    }
    default:
      return YoutubeApiError.networkError("Unknown HTTP error", error);
  }
};
