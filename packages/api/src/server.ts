import { HttpApiBuilder, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { JobStoreLayerLive } from "@puredialog/storage"
import { Layer } from "effect"
import { createServer } from "node:http"
import { ApiConfigLive } from "./config.js"
import { PureDialogApi } from "./handlers/api.js"
import { healthLive } from "./handlers/health.js"
import { internalLayer } from "./handlers/internal.js"
import { jobsApiLayer } from "./handlers/job.js"

const ApiLive = HttpApiBuilder.api(PureDialogApi)

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(ApiLive),
  Layer.provide(ApiConfigLive),
  Layer.provide(healthLive),
  Layer.provide(jobsApiLayer),
  Layer.provide(internalLayer),
  Layer.provide(JobStoreLayerLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

export const main = Layer.launch(ServerLive)
