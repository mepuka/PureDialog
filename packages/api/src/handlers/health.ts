import { HttpApiBuilder } from "@effect/platform"
import { Effect } from "effect"

import { api } from "../api.js"

export const healthLive = HttpApiBuilder.group(
  api,
  "Health",
  (handlers) =>
    handlers.handle(
      "status",
      () => Effect.succeed("Server is running successfully")
    )
)
