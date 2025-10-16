import { Config, Context, Effect, Layer, Schema } from "effect"
import { GcpProjectId, GcpRegion, ServiceAccountEmail } from "../types/index.js"

/**
 * Core GCP configuration
 */
export const GcpConfigSchema = Schema.Struct({
  projectId: GcpProjectId,
  projectNumber: Schema.String,
  region: GcpRegion,
  serviceAccount: ServiceAccountEmail
})

export type GcpConfigData = Schema.Schema.Type<typeof GcpConfigSchema>

/**
 * GCP Configuration service
 */
export class GcpConfig extends Context.Tag("@puredialog/foundation/GcpConfig")<
  GcpConfig,
  GcpConfigData
>() {}

/**
 * Load GCP config from environment variables
 */
export const GcpConfigLive = Layer.effect(
  GcpConfig,
  Effect.gen(function*() {
    const projectId = yield* Config.string("GCP_PROJECT_ID")
    const projectNumber = yield* Config.string("GCP_PROJECT_NUMBER")
    const region = yield* Config.string("GCP_REGION").pipe(
      Config.withDefault("us-west1")
    )
    const serviceAccount = yield* Config.string("GCP_SERVICE_ACCOUNT")

    // Validate using schema
    return yield* Schema.decode(GcpConfigSchema)({
      projectId,
      projectNumber,
      region,
      serviceAccount
    })
  })
)

/**
 * Test config with hardcoded values
 */
export const GcpConfigTest = (config: GcpConfigData) =>
  Layer.succeed(GcpConfig, config)
