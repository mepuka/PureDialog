import { HttpApiBuilder, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { PureDialogApi } from "./api.js"
import { ApiConfigLive } from "./config.js"
import { healthLive } from "./handlers/health.js"
import { internalLayer } from "./handlers/internal.js"
import { jobsApiLayer } from "./handlers/jobs.js"
import { StoreLayer } from "./services/index.js"

const ApiLive = HttpApiBuilder.api(PureDialogApi)

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(ApiLive),
  Layer.provide(ApiConfigLive),
  Layer.provide(healthLive),
  Layer.provide(jobsApiLayer),
  Layer.provide(internalLayer),
  Layer.provide(StoreLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

export const main = Layer.launch(ServerLive)
