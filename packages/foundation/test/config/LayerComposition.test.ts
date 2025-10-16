import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema } from "effect"
import {
  GcpConfig,
  GcpConfigTest,
  GcloudAuth,
  GcloudAuthTest,
  GcloudCli,
  GcloudCliTest
} from "../../src/index.js"

describe("Layer Composition Patterns", () => {
  describe("Layer.merge - Parallel Composition", () => {
    it("merges independent layers into combined context", () =>
      Effect.gen(function*() {
        // Two independent layers
        const configLayer = GcpConfigTest({
          projectId: "test-project" as any,
          projectNumber: "123",
          region: "us-west1" as any,
          serviceAccount: "test@test-project.iam.gserviceaccount.com" as any
        })

        const authLayer = GcloudAuthTest("auth@test-project.iam.gserviceaccount.com" as any)

        // Merge them - both built in parallel
        // Layer<GcpConfig | GcloudAuth, never, never>
        const appFoundation = Layer.merge(configLayer, authLayer)

        // Use both services
        const result = yield* Effect.gen(function*() {
          const config = yield* GcpConfig
          const auth = yield* GcloudAuth
          const account = yield* auth.getActiveAccount()

          return {
            projectId: config.projectId,
            account
          }
        }).pipe(Effect.provide(appFoundation))

        assert.strictEqual(result.projectId, "test-project")
        assert.strictEqual(result.account, "auth@test-project.iam.gserviceaccount.com")
      })
    )

    it.effect("merged layers preserve their independence", () =>
      Effect.gen(function*() {
        const configLayer = GcpConfigTest({
          projectId: "independent" as any,
          projectNumber: "999",
          region: "asia-east1" as any,
          serviceAccount: "svc@independent.iam.gserviceaccount.com" as any
        })

        const authLayer = GcloudAuthTest("different@other-project.iam.gserviceaccount.com" as any)

        // Merge - no dependency relationship
        const merged = Layer.merge(configLayer, authLayer)

        // Each service maintains its own state
        const { config, auth } = yield* Effect.gen(function*() {
          return {
            config: yield* GcpConfig,
            auth: yield* GcloudAuth
          }
        }).pipe(Effect.provide(merged))

        assert.strictEqual(config.projectId, "independent")
        assert.strictEqual(config.serviceAccount, "svc@independent.iam.gserviceaccount.com")

        const account = yield* auth.getActiveAccount()
        assert.strictEqual(account, "different@other-project.iam.gserviceaccount.com")
      })
    )
  })

  describe("Layer.provide - Sequential Composition", () => {
    it("provides dependencies to downstream layers", () =>
      Effect.gen(function*() {
        const authLayer = GcloudAuthTest("cli@test.iam.gserviceaccount.com" as any)

        const cliLayer = GcloudCliTest(
          new Map([
            ["projects list --format=json", JSON.stringify([{ projectId: "test-proj" }])]
          ])
        )

        // CLI requires Auth - use Layer.provideMerge
        // This feeds Auth into CLI AND exposes both services
        // Layer<GcloudCli | GcloudAuth, never, never>
        const cliWithAuth = Layer.provideMerge(cliLayer, authLayer)

        // Use CLI - both GcloudCli and GcloudAuth are available at runtime
        const result = yield* Effect.gen(function*() {
          const cli = yield* GcloudCli
          return yield* cli.runJson(["projects", "list"], Schema.Struct({ projectId: Schema.String }))
        }).pipe(Effect.provide(cliWithAuth))

        assert.ok(result)
      })
    )

    it("chains multiple dependencies", () =>
      Effect.gen(function*() {
        // Foundation: Config + Auth (independent)
        const foundation = Layer.merge(
          GcpConfigTest({
            projectId: "chain-test" as any,
            projectNumber: "555",
            region: "us-central1" as any,
            serviceAccount: "svc@chain-test.iam.gserviceaccount.com" as any
          }),
          GcloudAuthTest("auth@chain-test.iam.gserviceaccount.com" as any)
        )

        // CLI depends on Auth
        const cliLayer = GcloudCliTest(new Map([["version", "Google Cloud SDK 450.0.0"]]))

        // Use Layer.provideMerge to feed foundation into CLI
        // This satisfies CLI's Auth requirement AND exposes Config/Auth/CLI to application
        // Layer<GcloudCli | GcpConfig | GcloudAuth, never, never>
        const fullStack = Layer.provideMerge(cliLayer, foundation)

        // Use all services
        const result = yield* Effect.gen(function*() {
          const config = yield* GcpConfig
          const cli = yield* GcloudCli
          const version = yield* cli.version()

          return {
            projectId: config.projectId,
            version
          }
        }).pipe(Effect.provide(fullStack))

        assert.strictEqual(result.projectId, "chain-test")
        assert.include(result.version, "Google Cloud SDK")
      })
    )
  })


  describe("Real-world Pattern - Full Application Stack", () => {
    it("composes all layers for complete application context", () =>
      Effect.gen(function*() {
        // 1. Foundation: Independent config and auth
        const foundation = Layer.merge(
          GcpConfigTest({
            projectId: "full-app" as any,
            projectNumber: "12345",
            region: "us-west1" as any,
            serviceAccount: "app@full-app.iam.gserviceaccount.com" as any
          }),
          GcloudAuthTest("authenticated@full-app.iam.gserviceaccount.com" as any)
        )

        // 2. Operations: CLI depends on Auth
        const operations = GcloudCliTest(
          new Map([
            [
              "run services list --format=json",
              JSON.stringify([{ name: "worker-transcription", status: "READY" }])
            ]
          ])
        )

        // 3. Compose: Use Layer.provideMerge to feed foundation into operations
        // This satisfies CLI's Auth requirement AND exposes all services (Config/Auth/CLI)
        // Layer<GcloudCli | GcpConfig | GcloudAuth, never, never>
        const fullAppStack = Layer.provideMerge(operations, foundation)

        // 4. Application code uses the full stack
        const appResult = yield* Effect.gen(function*() {
          // All services available!
          const config = yield* GcpConfig
          const auth = yield* GcloudAuth
          const cli = yield* GcloudCli

          // Use them together
          const account = yield* auth.getActiveAccount()
          const services = yield* cli.runJson(["run", "services", "list"], Schema.Array(Schema.Struct({ name: Schema.String, status: Schema.String })))

          return {
            environment: {
              projectId: config.projectId,
              region: config.region,
              authenticatedAs: account
            },
            services
          }
        }).pipe(Effect.provide(fullAppStack))

        // Verify complete application context
        assert.strictEqual(appResult.environment.projectId, "full-app")
        assert.strictEqual(appResult.environment.region, "us-west1")
        assert.strictEqual(appResult.environment.authenticatedAs, "authenticated@full-app.iam.gserviceaccount.com")
        assert.ok(appResult.services)
      })
    )
  })
})
