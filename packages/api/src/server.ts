import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { YouTube } from "@puredialog/domain"
import { JobStoreLayerLive } from "@puredialog/storage"
import { Layer } from "effect"
import { createServer } from "node:http"
import { pureDialogApi } from "./http/api.js"
import { healthRoutes } from "./routes/health.js"
import { internalRoutes } from "./routes/internal.js"
import { jobRoutes } from "./routes/jobs.js"

const RoutesLive = Layer.mergeAll(healthRoutes, jobRoutes, internalRoutes)

const ApiLive = HttpApiBuilder.api(pureDialogApi).pipe(Layer.provide(RoutesLive))

// Compose dependencies: JobStore + YouTubeClient
const ApiDependencies = Layer.mergeAll(
  JobStoreLayerLive,
  YouTube.YouTubeClientLive.pipe(Layer.provide(YouTube.YouTubeConfigLive))
)

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  Layer.provide(ApiDependencies),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8080 }))
)

export const main = Layer.launch(ServerLive)

export default main
