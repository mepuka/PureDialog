import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { JobStoreLayerLive } from "@puredialog/storage"
import { Layer } from "effect"
import { createServer } from "node:http"
import { pureDialogApi } from "./http/api.js"
import { healthRoutes } from "./routes/health.js"
import { internalRoutes } from "./routes/internal.js"
import { jobRoutes } from "./routes/jobs.js"

const RoutesLive = Layer.mergeAll(healthRoutes, jobRoutes, internalRoutes)

const ApiLive = HttpApiBuilder.api(pureDialogApi).pipe(Layer.provide(RoutesLive))

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  Layer.provide(JobStoreLayerLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

export const main = Layer.launch(ServerLive)

export default main
