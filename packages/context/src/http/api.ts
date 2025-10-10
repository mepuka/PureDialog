import { HttpApi, HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { IngestRequest, IngestResponse } from "./schemas.js"

const Ingest = HttpApiGroup.make("ingest").add(
  HttpApiEndpoint.post("ingest", "/ingest").setPayload(IngestRequest).addSuccess(IngestResponse).addError(
    HttpApiError.HttpApiDecodeError
  )
)

export const contextApi = HttpApi
  .make(
    "ContextApi"
  )
  .add(Ingest)
