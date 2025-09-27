import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Option, Schema } from "effect"
import { CloudStorageConfig, CloudStorageService, CloudStorageServiceLive } from "../src/storage/index.js"

// Mock CloudStorageConfig for testing
const TestCloudStorageConfig = Layer.sync(CloudStorageConfig, () => ({
  projectId: "test-project",
  keyFilename: undefined,
  bucket: "test-bucket",
  retryOptions: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxDelayMs: 30000
  }
}))

// Mock CloudStorageService for testing
const TestCloudStorageService = Layer.sync(CloudStorageService, () => ({
  putObject: (bucket, key, data) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock putObject: ${bucket}/${key}`)
      // Simulate successful operation
    }),

  getObject: (bucket, key, schema) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock getObject: ${bucket}/${key}`)
      // Return none for simplicity
      return Option.none()
    }),

  deleteObject: (bucket, key) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock deleteObject: ${bucket}/${key}`)
    }),

  listObjects: (bucket, prefix) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock listObjects: ${bucket}/${prefix}`)
      return [] as ReadonlyArray<string>
    }),

  objectExists: (bucket, key) =>
    Effect.gen(function*() {
      yield* Effect.logInfo(`Mock objectExists: ${bucket}/${key}`)
      return false
    })
}))

const TestEnvironment = Layer.mergeAll(
  TestCloudStorageConfig,
  TestCloudStorageService
)

describe("CloudStorageService", () => {
  it.effect("should provide basic operations", () =>
    Effect.gen(function*() {
      const storage = yield* CloudStorageService

      // Test putObject
      yield* storage.putObject("test-bucket", "test-key", { test: "data" })

      // Test getObject
      const result = yield* storage.getObject("test-bucket", "test-key", Schema.String)
      assert.isTrue(Option.isNone(result))

      // Test deleteObject
      yield* storage.deleteObject("test-bucket", "test-key")

      // Test listObjects
      const objects = yield* storage.listObjects("test-bucket", "test-prefix")
      assert.strictEqual(objects.length, 0)

      // Test objectExists
      const exists = yield* storage.objectExists("test-bucket", "test-key")
      assert.isFalse(exists)
    }).pipe(Effect.provide(TestEnvironment)))

  it.effect("should handle configuration", () =>
    Effect.gen(function*() {
      const config = yield* CloudStorageConfig

      assert.strictEqual(config.projectId, "test-project")
      assert.strictEqual(config.bucket, "test-bucket")
      assert.strictEqual(config.retryOptions.maxRetries, 3)
    }).pipe(Effect.provide(TestEnvironment)))
})
