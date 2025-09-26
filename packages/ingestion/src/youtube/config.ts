import { Config, Context, Duration, Effect, Layer, Redacted } from "effect"
import { YoutubeApiError } from "./errors.js"

export interface YoutubeConfigInterface {
  readonly apiKey: string
  readonly baseUrl: string
  readonly timeout: Duration.Duration
  readonly retryAttempts: number
  readonly retryBackoff: Duration.Duration
}

export class YoutubeConfig extends Context.Tag("YoutubeConfig")<
  YoutubeConfig,
  YoutubeConfigInterface
>() {}

const YoutubeConfigSchema = {
  apiKey: Config.redacted("YOUTUBE_API_KEY"),
  baseUrl: Config.string("YOUTUBE_API_BASE_URL").pipe(
    Config.withDefault("https://youtube.googleapis.com/youtube/v3")
  ),
  timeout: Config.duration("YOUTUBE_API_TIMEOUT").pipe(
    Config.withDefault(Duration.seconds(30))
  ),
  retryAttempts: Config.integer("YOUTUBE_API_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3)
  ),
  retryBackoff: Config.duration("YOUTUBE_API_RETRY_BACKOFF").pipe(
    Config.withDefault(Duration.seconds(1))
  )
}

const makeConfig = Effect.gen(function*() {
  const apiKeyRedacted = yield* YoutubeConfigSchema.apiKey
  const baseUrl = yield* YoutubeConfigSchema.baseUrl
  const timeout = yield* YoutubeConfigSchema.timeout
  const retryAttempts = yield* YoutubeConfigSchema.retryAttempts
  const retryBackoff = yield* YoutubeConfigSchema.retryBackoff

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
    timeout,
    retryAttempts,
    retryBackoff
  } as const
})

export const YoutubeConfigLive = Layer.effect(YoutubeConfig, makeConfig)
