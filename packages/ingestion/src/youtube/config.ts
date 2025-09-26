import { Config, Context, Duration, Effect, Layer, Redacted } from "effect"
import { YoutubeApiError } from "./errors.js"

export interface YoutubeConfigInterface {
  readonly apiKey: string
  readonly baseUrl: string
  readonly timeout: Duration.Duration
}

export class YoutubeConfig extends Context.Tag("YoutubeConfig")<
  YoutubeConfig,
  YoutubeConfigInterface
>() {}

const YoutubeConfigSchema = {
  apiKey: Config.redacted("YOUTUBE_API_KEY"),
  baseUrl: Config.string("YOUTUBE_API_BASE_URL").pipe(
    Config.withDefault("https://www.googleapis.com/youtube/v3")
  ),
  timeout: Config.duration("YOUTUBE_API_TIMEOUT").pipe(
    Config.withDefault(Duration.seconds(30))
  )
}

const makeConfig = Effect.gen(function*() {
  const apiKeyRedacted = yield* YoutubeConfigSchema.apiKey
  const baseUrl = yield* YoutubeConfigSchema.baseUrl
  const timeout = yield* YoutubeConfigSchema.timeout

  // Convert redacted to string
  const apiKey = Redacted.value(apiKeyRedacted)

  // Validate API key format
  if (!apiKey || apiKey.length < 20) {
    return yield* Effect.fail(
      YoutubeApiError.configurationError("Invalid API key format")
    )
  }

  return {
    apiKey,
    baseUrl,
    timeout
  } as const
})

export const YoutubeConfigLive = Layer.effect(YoutubeConfig, makeConfig)
