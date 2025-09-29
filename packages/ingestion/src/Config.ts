import { Config as EffectConfig, Context, Effect, Layer, Option } from "effect"

interface CloudStorageConfigInterface {
  readonly projectId: string
  readonly keyFilename: string | undefined
  readonly bucket: string
  readonly retryOptions: {
    readonly maxRetries: number
    readonly backoffMultiplier: number
    readonly maxDelayMs: number
  }
}

export class CloudStorageConfig extends Context.Tag("CloudStorageConfig")<
  CloudStorageConfig,
  CloudStorageConfigInterface
>() {}

export const CloudStorageConfigLayer = Layer.effect(
  CloudStorageConfig,
  Effect.gen(function*() {
    const projectId = yield* EffectConfig.string("GCS_PROJECT_ID")
    const keyFilename = yield* EffectConfig.string("GCS_KEY_FILE").pipe(EffectConfig.option)
    const bucket = yield* EffectConfig.string("GCS_BUCKET")
    const maxRetries = yield* EffectConfig.number("GCS_MAX_RETRIES").pipe(EffectConfig.withDefault(3))
    const backoffMultiplier = yield* EffectConfig.number("GCS_BACKOFF_MULTIPLIER").pipe(EffectConfig.withDefault(2))
    const maxDelayMs = yield* EffectConfig.number("GCS_MAX_DELAY_MS").pipe(EffectConfig.withDefault(30000))
    return {
      projectId,
      keyFilename: Option.getOrUndefined(keyFilename),
      bucket,
      retryOptions: {
        maxRetries,
        backoffMultiplier,
        maxDelayMs
      }
    } as CloudStorageConfigInterface
  })
)
