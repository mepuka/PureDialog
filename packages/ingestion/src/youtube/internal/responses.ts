import { HttpClientResponse } from "@effect/platform";
import { Effect, Schema } from "effect";
import { YoutubeApiError } from "../errors.js";
import { Channel, Video } from "../resources.js";

// API Response wrapper schema
const ApiResponse = <A, I, R>(itemSchema: Schema.Schema<A, I, R>) =>
  Schema.Struct({
    items: Schema.Array(itemSchema),
    pageInfo: Schema.optional(
      Schema.Struct({
        totalResults: Schema.Number,
        resultsPerPage: Schema.Number,
      }),
    ),
    nextPageToken: Schema.optional(Schema.String),
    prevPageToken: Schema.optional(Schema.String),
    error: Schema.optional(
      Schema.Struct({
        code: Schema.Number,
        message: Schema.String,
        errors: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ),
  });

export const VideoResponse = ApiResponse(Video);
export const ChannelResponse = ApiResponse(Channel);

export const decodeVideoResponse = (
  response: HttpClientResponse.HttpClientResponse,
) =>
  HttpClientResponse.schemaBodyJson(VideoResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(
        YoutubeApiError.validationError(
          "Failed to parse video response",
          error,
        ),
      )),
    Effect.catchTag("ResponseError", (error) =>
      Effect.fail(
        YoutubeApiError.networkError("HTTP response error", error),
      )),
  );

export const decodeChannelResponse = (
  response: HttpClientResponse.HttpClientResponse,
) =>
  HttpClientResponse.schemaBodyJson(ChannelResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(
        YoutubeApiError.validationError(
          "Failed to parse channel response",
          error,
        ),
      )),
    Effect.catchTag("ResponseError", (error) =>
      Effect.fail(
        YoutubeApiError.networkError("HTTP response error", error),
      )),
  );

// Extract items and handle empty results
export const extractVideos = (
  response: Schema.Schema.Type<typeof VideoResponse>,
) =>
  Effect.gen(function*() {
    if (response.error) {
      return yield* Effect.fail(
        YoutubeApiError.apiError(response.error.code, response.error.message),
      );
    }
    return response.items;
  });

export const extractChannels = (
  response: Schema.Schema.Type<typeof ChannelResponse>,
) =>
  Effect.gen(function*() {
    if (response.error) {
      return yield* Effect.fail(
        YoutubeApiError.apiError(response.error.code, response.error.message),
      );
    }
    return response.items;
  });
