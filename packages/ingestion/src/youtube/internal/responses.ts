import { HttpClientResponse } from "@effect/platform"
import { Effect, Schema } from "effect"
import { YoutubeApiError } from "../errors.js"

const RawVideoSchema = Schema.Struct({
  id: Schema.optional(Schema.NullOr(Schema.String)),
  snippet: Schema.optional(
    Schema.Struct({
      title: Schema.optional(Schema.NullOr(Schema.String)),
      description: Schema.optional(Schema.NullOr(Schema.String)),
      channelId: Schema.optional(Schema.NullOr(Schema.String)),
      channelTitle: Schema.optional(Schema.NullOr(Schema.String)),
      publishedAt: Schema.optional(Schema.NullOr(Schema.String)),
      defaultAudioLanguage: Schema.optional(Schema.NullOr(Schema.String)),
      tags: Schema.optional(Schema.Array(Schema.String))
    })
  ),
  contentDetails: Schema.optional(
    Schema.Struct({ duration: Schema.optional(Schema.NullOr(Schema.String)) })
  )
})

const RawChannelSchema = Schema.Struct({
  id: Schema.optional(Schema.NullOr(Schema.String)),
  snippet: Schema.optional(
    Schema.Struct({
      title: Schema.optional(Schema.NullOr(Schema.String)),
      description: Schema.optional(Schema.NullOr(Schema.String)),
      customUrl: Schema.optional(Schema.NullOr(Schema.String)),
      publishedAt: Schema.optional(Schema.NullOr(Schema.String)),
      country: Schema.optional(Schema.NullOr(Schema.String))
    })
  ),
  statistics: Schema.optional(
    Schema.Struct({ subscriberCount: Schema.optional(Schema.NullOr(Schema.String)) })
  )
})

export type RawVideo = Schema.Schema.Type<typeof RawVideoSchema>
export type RawChannel = Schema.Schema.Type<typeof RawChannelSchema>

// API Response wrapper schema
const ApiResponse = <A, I, R>(itemSchema: Schema.Schema<A, I, R>) =>
  Schema.Struct({
    kind: Schema.String,
    etag: Schema.optional(Schema.String),
    items: Schema.Array(itemSchema),
    error: Schema.optional(
      Schema.Struct({
        code: Schema.Number,
        message: Schema.String
      })
    )
  })

export const VideoResponse = ApiResponse(RawVideoSchema)
export const ChannelResponse = ApiResponse(RawChannelSchema)

export const decodeVideoResponse = (
  response: HttpClientResponse.HttpClientResponse
) =>
  HttpClientResponse.schemaBodyJson(VideoResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(
        YoutubeApiError.validationError(
          "Failed to parse video response",
          error
        )
      )),
    Effect.catchTag("ResponseError", (error) =>
      Effect.fail(
        YoutubeApiError.networkError("HTTP response error", error)
      ))
  )

export const decodeChannelResponse = (
  response: HttpClientResponse.HttpClientResponse
) =>
  HttpClientResponse.schemaBodyJson(ChannelResponse)(response).pipe(
    Effect.catchTag("ParseError", (error) =>
      Effect.fail(
        YoutubeApiError.validationError(
          "Failed to parse channel response",
          error
        )
      )),
    Effect.catchTag("ResponseError", (error) =>
      Effect.fail(
        YoutubeApiError.networkError("HTTP response error", error)
      ))
  )

// Extract items and handle empty results
export const extractVideos = (
  response: Schema.Schema.Type<typeof VideoResponse>
) =>
  Effect.gen(function*() {
    if (response.error) {
      return yield* Effect.fail(
        YoutubeApiError.apiError(response.error.code, response.error.message)
      )
    }
    return response.items
  })

export const extractChannels = (
  response: Schema.Schema.Type<typeof ChannelResponse>
) =>
  Effect.gen(function*() {
    if (response.error) {
      return yield* Effect.fail(
        YoutubeApiError.apiError(response.error.code, response.error.message)
      )
    }
    return response.items
  })
