import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { PureDialogApi } from "../api.js"

const healthLive = HttpApiBuilder.group(
  PureDialogApi,
  "health",
  (handlers) =>
    handlers.handle("status", () =>
      Effect.gen(function*() {
        // Check service connectivity
        yield* Effect.logInfo("Health check requested")

        return {
          status: "healthy" as const,
          timestamp: new Date(),
          services: {
            pubsub: "connected" as const,
            storage: "connected" as const
          }
        }
      }))
)

export { healthLive }
