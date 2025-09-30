import type { Core } from "@puredialog/domain"
import { LLM } from "@puredialog/domain"
import { Config as IngestionConfig, Layer as GCSLayer } from "@puredialog/ingestion"
import { Context, Data, Effect, Layer, Schema } from "effect"
import { Index } from "./indices.js"

/**
 * LLM Artifact Store errors
 */
export class ArtifactNotFoundError extends Data.TaggedError("ArtifactNotFoundError")<{
  readonly artifactId: LLM.LLMArtifactId
  readonly message: string
}> {}

export class ArtifactStorageError extends Data.TaggedError("ArtifactStorageError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Service for managing LLM artifacts in GCS.
 * Artifacts are stored at: artifacts/{jobId}/{artifactId}.json
 */
export class LLMArtifactStore extends Context.Tag("@puredialog/storage/LLMArtifactStore")<
  LLMArtifactStore,
  {
    readonly save: (artifact: LLM.LLMArtifacts) => Effect.Effect<void, ArtifactStorageError>
    readonly listByJob: (
      jobId: Core.JobId
    ) => Effect.Effect<ReadonlyArray<LLM.LLMArtifacts>, ArtifactStorageError>
  }
>() {}

const makeLLMArtifactStore = Effect.gen(function*() {
  const storage = yield* GCSLayer.CloudStorageService
  const config = yield* IngestionConfig.CloudStorageConfig

  const save = (artifact: LLM.LLMArtifacts) =>
    Effect.gen(function*() {
      const path = Index.artifact(artifact.jobId, artifact.id)

      yield* storage.putObject(config.bucket, path, artifact).pipe(
        Effect.mapError(
          (error) =>
            new ArtifactStorageError({
              message: `Failed to save artifact ${artifact.id}`,
              cause: error
            })
        ),
        Effect.tap(() =>
          Effect.logInfo("Saved LLM artifact", {
            artifactId: artifact.id,
            jobId: artifact.jobId,
            path
          })
        )
      )
    })

  const listByJob = (jobId: Core.JobId) =>
    Effect.gen(function*() {
      const prefix = Index.artifacts(jobId)

      const objects = yield* storage.listObjects(config.bucket, prefix).pipe(
        Effect.mapError(
          (error) =>
            new ArtifactStorageError({
              message: `Failed to list artifacts for job ${jobId}`,
              cause: error
            })
        )
      )

      const artifacts = yield* Effect.all(
        objects.map((obj) =>
          storage.getObject(config.bucket, obj, LLM.LLMArtifacts).pipe(
            Effect.flatMap((data) => Schema.decodeUnknown(LLM.LLMArtifacts)(data)),
            Effect.mapError(
              (error) =>
                new ArtifactStorageError({
                  message: `Failed to parse artifact from ${obj}`,
                  cause: error
                })
            )
          )
        ),
        { concurrency: "unbounded" }
      )

      yield* Effect.logInfo("Listed LLM artifacts", {
        jobId,
        count: artifacts.length
      })

      return artifacts
    })

  return LLMArtifactStore.of({
    save: (artifact) => save(artifact),
    listByJob: (jobId) => listByJob(jobId)
  })
})

export const LLMArtifactStoreLayer = Layer.effect(LLMArtifactStore, makeLLMArtifactStore).pipe(
  Layer.provide(Layer.mergeAll(GCSLayer.CloudStorageLayer, IngestionConfig.CloudStorageConfigLayer))
)
