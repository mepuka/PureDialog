/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Config, Context, Layer } from "effect"

export interface ApiConfig {
  readonly port: number
  readonly host: string
}

export class ApiConfig extends Context.Tag("ApiConfig")<ApiConfig, ApiConfig>() {}

export const ApiConfigLive = Layer.effect(
  ApiConfig,
  Config.all({
    port: Config.number("PORT").pipe(Config.withDefault(8080)),
    host: Config.string("HOST").pipe(Config.withDefault("0.0.0.0"))
  })
)
