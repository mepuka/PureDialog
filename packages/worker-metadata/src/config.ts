import { Config as EffectConfig, Context, Effect, Layer } from "effect"

export interface MetadataWorkerConfigValues {
  readonly youtubeApiKey: string
}

export class MetadataWorkerConfig extends Context.Tag("MetadataWorkerConfig")<
  MetadataWorkerConfig,
  MetadataWorkerConfigValues
>() {}

export const MetadataWorkerConfigLayer = Layer.effect(
  MetadataWorkerConfig,
  Effect.gen(function*() {
    const youtubeApiKey = yield* EffectConfig.string("YOUTUBE_API_KEY")

    return {
      youtubeApiKey
    } satisfies MetadataWorkerConfigValues
  })
)
