import { HttpApp, HttpRouter, HttpServer } from "@effect/platform"
import { Effect, Layer } from "effect"
import { v4 as uuidv4 } from "uuid"
import { IngestResponse } from "../http/schemas.js"

export const ingestRoutes = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/ingest",
    Effect.succeed(
      HttpServer.response.schemaJson(IngestResponse)({
        id: uuidv4(),
        status: "pending"
      })
    )
  )
)

export const IngestRoutesLive = Layer.succeed(HttpApp.make, ingestRoutes)
