import { Config, Context, Effect, Layer } from "effect"

/**
 * API Configuration interface for API-specific settings.
 * This is kept separate from PubSubConfig to maintain clear service boundaries.
 */
interface ApiConfig {
  readonly port: number
  readonly host: string
  readonly corsOrigins: ReadonlyArray<string>
}

/**
 * Service tag for API configuration.
 */
const ApiConfig = Context.GenericTag<ApiConfig>("@puredialog/api/ApiConfig")

/**
 * Live implementation using environment variables.
 */
const ApiConfigLive = Layer.effect(
  ApiConfig,
  Effect.gen(function*() {
    const port = yield* Config.number("API_PORT").pipe(
      Config.withDefault(3000)
    )
    const host = yield* Config.string("API_HOST").pipe(
      Config.withDefault("0.0.0.0")
    )
    const corsOrigins = yield* Config.string("CORS_ORIGINS").pipe(
      Config.withDefault("*"),
      Config.map((origins) => origins === "*" ? ["*"] : origins.split(","))
    )

    return {
      port,
      host,
      corsOrigins
    }
  })
)

/**
 * Test implementation with default values.
 */
const ApiConfigTest: Layer.Layer<ApiConfig> = Layer.sync(ApiConfig, () => ({
  port: 3000,
  host: "localhost",
  corsOrigins: ["*"]
}))

export { ApiConfig, ApiConfigLive, ApiConfigTest }
