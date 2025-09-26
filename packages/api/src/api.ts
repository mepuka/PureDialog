import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

export const statusEndpoint = HttpApiEndpoint
  .get("status", "/health")
  .addSuccess(Schema.String)

export const healthGroup = HttpApiGroup
  .make("Health")
  .add(statusEndpoint)

export const api = HttpApi
  .make("TranscriptionApi")
  .add(healthGroup)
