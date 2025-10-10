import { HttpApiBuilder, HttpApiSwagger, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { queryApi } from "./http/api.js"
import { queryRoutes } from "./routes/query.js"

const ApiLive = HttpApiBuilder.api(queryApi).pipe(Layer.provide(queryRoutes))

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3001 }))
)

export const main = Layer.launch(ServerLive)

export default main
