import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { queryApi } from "../http/api.js"

export const queryRoutes = HttpApiBuilder.group(
  queryApi,
  "query",
  (handlers) =>
    handlers.handle("stream", () =>
      Effect.succeed({
        id: `event-${Date.now()}`,
        content: "hello"
      }))
)
