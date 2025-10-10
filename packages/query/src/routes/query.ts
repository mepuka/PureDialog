import { HttpApp, HttpRouter, HttpServer } from "@effect/platform"
import { Effect, Layer, Schedule } from "effect"

export const queryRoutes = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/query/stream",
    HttpServer.response.stream(
      Effect.succeed("hello").pipe(
        Effect.repeat(Schedule.spaced("1 second"))
      ),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Connection": "keep-alive",
          "Cache-Control": "no-cache"
        }
      }
    )
  )
)

export const QueryRoutesLive = Layer.succeed(HttpApp.make, queryRoutes)
