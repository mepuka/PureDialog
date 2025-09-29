import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"
import { pureDialogApi } from "../http/api.js"
import { HealthStatus } from "../http/schemas.js"

export const healthRoutes = HttpApiBuilder.group(
  pureDialogApi,
  "health",
  (handlers) =>
    handlers.handle("status", () =>
      Effect.gen(function*() {
        yield* Effect.logInfo("Health check requested")

        return HealthStatus.make({
          status: "Ok" as const
        })
      }))
)
