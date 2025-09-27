import { Config, Context, Effect, Layer, Option } from "effect"

export interface CloudStorageConfigInterface {
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

export const CloudStorageConfigLive = Layer.effect(
  CloudStorageConfig,
  Effect.gen(function*() {
    const projectId = yield* Config.string("GCS_PROJECT_ID")
    const keyFilename = yield* Config.string("GCS_KEY_FILE").pipe(Config.option)
    const bucket = yield* Config.string("GCS_BUCKET")
    const maxRetries = yield* Config.number("GCS_MAX_RETRIES").pipe(Config.withDefault(3))
    const backoffMultiplier = yield* Config.number("GCS_BACKOFF_MULTIPLIER").pipe(Config.withDefault(2))
    const maxDelayMs = yield* Config.number("GCS_MAX_DELAY_MS").pipe(Config.withDefault(30000))

    return {
      projectId,
      keyFilename: Option.getOrUndefined(keyFilename),
      bucket,
      retryOptions: {
        maxRetries,
        backoffMultiplier,
        maxDelayMs
      }
    }
  })
)
