import { Storage } from "@google-cloud/storage"
import { Context, Effect, Layer, Option, Schema } from "effect"
import { CloudStorageConfig, CloudStorageConfigLayer } from "./Config.js"
import { CloudStorageError } from "./errors.js"
import type { Error } from "./index.js"

export interface CloudStoragePutOptions {
  readonly ifGenerationMatch?: number
}

/**
 * Service tag for Cloud Storage
 */
export class CloudStorageService extends Context.Tag("CloudStorageService")<
  CloudStorageService,
  {
    readonly putObject: (
      bucket: string,
      key: string,
      data: unknown,
      options?: CloudStoragePutOptions
    ) => Effect.Effect<void, Error.CloudStorageError>

    readonly getObject: <T extends Schema.Schema.AnyNoContext>(
      bucket: string,
      key: string,
      schema: T
    ) => Effect.Effect<Option.Option<Schema.Schema.Type<T>>, Error.CloudStorageError>

    readonly deleteObject: (
      bucket: string,
      key: string
    ) => Effect.Effect<void, Error.CloudStorageError>

    readonly listObjects: (
      bucket: string,
      prefix: string
    ) => Effect.Effect<ReadonlyArray<string>, Error.CloudStorageError>

    readonly objectExists: (
      bucket: string,
      key: string
    ) => Effect.Effect<boolean, Error.CloudStorageError>
  }
>() {}

/**
 * Live implementation using Google Cloud Storage client
 */
export const CloudStorageLayer = Layer.effect(
  CloudStorageService,
  Effect.gen(function*() {
    const config = yield* CloudStorageConfig
    const storage = new Storage({
      projectId: config.projectId,
      ...(config.keyFilename && { keyFilename: config.keyFilename })
    })

    return {
      putObject: (bucket, key, data, options) =>
        Effect.tryPromise({
          try: async () => {
            const file = storage.bucket(bucket).file(key)
            await file.save(JSON.stringify(data, null, 2), {
              contentType: "application/json",
              ...(options?.ifGenerationMatch !== undefined
                ? { ifGenerationMatch: options.ifGenerationMatch }
                : {})
            })
          },
          catch: (cause) => CloudStorageError.putObjectFailed(bucket, key, cause)
        }),

      getObject: (bucket, key, schema) =>
        Effect.tryPromise({
          try: async () => {
            const file = storage.bucket(bucket).file(key)
            const [exists] = await file.exists()

            if (!exists) {
              return Option.none()
            }

            const [data] = await file.download()
            const parsed = JSON.parse(data.toString())
            const decoded = Schema.decodeSync(schema)(parsed)

            return Option.some(decoded)
          },
          catch: (cause) => CloudStorageError.getObjectFailed(bucket, key, cause)
        }),

      deleteObject: (bucket, key) =>
        Effect.tryPromise({
          try: () => storage.bucket(bucket).file(key).delete(),
          catch: (cause) => CloudStorageError.deleteObjectFailed(bucket, key, cause)
        }).pipe(Effect.asVoid),

      listObjects: (bucket, prefix) =>
        Effect.tryPromise({
          try: async () => {
            const [files] = await storage.bucket(bucket).getFiles({ prefix })
            return files.map((file) => file.name) as ReadonlyArray<string>
          },
          catch: (cause) => CloudStorageError.listObjectsFailed(bucket, cause)
        }),

      objectExists: (bucket, key) =>
        Effect.tryPromise({
          try: async () => {
            const [exists] = await storage.bucket(bucket).file(key).exists()
            return exists
          },
          catch: (cause) => CloudStorageError.objectExistsFailed(bucket, key, cause)
        })
    }
  })
).pipe(Layer.provide(CloudStorageConfigLayer))
