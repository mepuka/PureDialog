import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Config, Layer as IngestionLayer } from "@puredialog/ingestion"
import { LLMServiceLive } from "@puredialog/llm"
import { LLMArtifactStoreLayer } from "@puredialog/storage"
import { Layer } from "effect"
import { createServer } from "node:http"
import { TranscriptionWorkerApi } from "./http/api.js"
import { eventRoutes } from "./routes/events.js"
import { healthRoutes } from "./routes/health.js"

const RoutesLive = Layer.mergeAll(healthRoutes, eventRoutes)

const ApiLive = HttpApiBuilder.api(TranscriptionWorkerApi).pipe(Layer.provide(RoutesLive))

const RuntimeLayer = Layer.mergeAll(
  LLMServiceLive,
  LLMArtifactStoreLayer,
  Config.CloudStorageConfigLayer,
  IngestionLayer.CloudStorageLayer,
  NodeHttpServer.layer(createServer, { port: 3004 })
)

const ServerLayer = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress
)

export const ServerLive = ServerLayer.pipe(Layer.provide(RuntimeLayer))

export const main = Layer.launch(ServerLive)

export default main
