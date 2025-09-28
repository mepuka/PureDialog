import { Config, Context, Effect, Layer } from "effect"

export interface ApiConfigInterface {
  readonly port: number
  readonly host: string
}

export class ApiConfig extends Context.Tag("ApiConfig")<
  ApiConfig,
  ApiConfigInterface
>() {}

export const ApiConfigLive = Layer.effect(
  ApiConfig,
  Effect.gen(function*() {
    const port = yield* Config.number("PORT").pipe(Config.withDefault(8080))
    const host = yield* Config.string("HOST").pipe(Config.withDefault("0.0.0.0"))

    return {
      port,
      host
    }
  })
)
