import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { contextApi } from "./http/api.js"
import { ingestRoutes } from "./routes/ingest.js"

const ApiLive = HttpApiBuilder.api(contextApi).pipe(Layer.provide(ingestRoutes))

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3002 }))
)

export const main = Layer.launch(ServerLive)

export default main
