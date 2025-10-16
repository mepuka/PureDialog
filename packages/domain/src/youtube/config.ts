import { Config as EffectConfig, Context, Effect, Layer } from "effect"

/**
 * YouTube API configuration values
 */
export interface YouTubeConfigValues {
  readonly apiKey: string
}

/**
 * YouTube API configuration service
 */
export class YouTubeConfig extends Context.Tag("@puredialog/domain/YouTubeConfig")<
  YouTubeConfig,
  YouTubeConfigValues
>() {}

/**
 * Live layer for YouTube configuration
 * Reads from YOUTUBE_API_KEY environment variable
 */
export const YouTubeConfigLive = Layer.effect(
  YouTubeConfig,
  Effect.gen(function*() {
    const apiKey = yield* EffectConfig.string("YOUTUBE_API_KEY")

    return {
      apiKey
    } satisfies YouTubeConfigValues
  })
)
