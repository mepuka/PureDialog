import { assert, describe, it } from "@effect/vitest"
import { ConfigProvider, Effect, Layer } from "effect"
import { GcpConfig, GcpConfigLive, GcpConfigTest } from "../../src/index.js"

describe("GcpConfig", () => {
  it.effect("loads config from test layer", () =>
    Effect.gen(function*() {
      const testConfig = GcpConfigTest({
        projectId: "test-project-123" as any,
        projectNumber: "123456789",
        region: "us-central1" as any,
        serviceAccount: "test@test-project-123.iam.gserviceaccount.com" as any
      })

      const config = yield* GcpConfig.pipe(
        Effect.provide(testConfig)
      )

      assert.strictEqual(config.projectId, "test-project-123")
      assert.strictEqual(config.region, "us-central1")
    })
  )

  it.effect("loads config from environment variables", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "env-project-123"],
          ["GCP_PROJECT_NUMBER", "987654321"],
          ["GCP_REGION", "europe-west1"],
          ["GCP_SERVICE_ACCOUNT", "env@env-project-123.iam.gserviceaccount.com"]
        ])
      )

      const config = yield* GcpConfig.pipe(
        Effect.provide(
          Layer.provideMerge(GcpConfigLive, Layer.setConfigProvider(testEnv))
        )
      )

      assert.strictEqual(config.projectId, "env-project-123")
      assert.strictEqual(config.region, "europe-west1")
    })
  )

  it.effect("uses default region when not specified", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "default-test"],
          ["GCP_PROJECT_NUMBER", "111222333"],
          ["GCP_SERVICE_ACCOUNT", "test@default-test.iam.gserviceaccount.com"]
          // GCP_REGION not provided
        ])
      )

      const config = yield* GcpConfig.pipe(
        Effect.provide(
          Layer.provideMerge(GcpConfigLive, Layer.setConfigProvider(testEnv))
        )
      )

      assert.strictEqual(config.region, "us-west1") // Default
    })
  )

  it.effect("fails validation with invalid project ID", () =>
    Effect.gen(function*() {
      const testEnv = ConfigProvider.fromMap(
        new Map([
          ["GCP_PROJECT_ID", "INVALID-PROJECT"], // Uppercase - invalid!
          ["GCP_PROJECT_NUMBER", "123"],
          ["GCP_SERVICE_ACCOUNT", "test@test.iam.gserviceaccount.com"]
        ])
      )

      const result = yield* Effect.exit(
        GcpConfig.pipe(
          Effect.provide(
            Layer.provideMerge(GcpConfigLive, Layer.setConfigProvider(testEnv))
          )
        )
      )

      assert.isTrue(result._tag === "Failure")
    })
  )
})
