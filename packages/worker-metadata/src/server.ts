import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { YouTube } from "@puredialog/domain"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { Layer } from "effect"
import { createServer } from "node:http"
import { MetadataWorkerApi } from "./http/api.js"
import { eventRoutes } from "./routes/events.js"
import { healthRoutes } from "./routes/health.js"

const RoutesLive = Layer.mergeAll(healthRoutes, eventRoutes)

const ApiLive = HttpApiBuilder.api(MetadataWorkerApi).pipe(Layer.provide(RoutesLive))

const port = Number(process.env.PORT) || 8080

const RuntimeLayer = Layer.mergeAll(
  YouTube.YouTubeClientLive.pipe(Layer.provide(YouTube.YouTubeConfigLive)),
  Config.CloudStorageConfigLayer,
  IngestionLayer.CloudStorageLayer,
  NodeHttpServer.layer(createServer, { port })
)

const ServerLayer = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress
)

export const ServerLive = ServerLayer.pipe(Layer.provide(RuntimeLayer))

export const main = Layer.launch(ServerLive)

export default main
