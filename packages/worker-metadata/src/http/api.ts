import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Workers } from "@puredialog/domain"

export const MetadataWorkerApi = HttpApi
  .make("MetadataWorkerApi")
  .add(
    HttpApiGroup.make("health").add(
      HttpApiEndpoint.get("status", "/health").addSuccess(Workers.Http.WorkerProcessingResponse)
    )
  )
  .add(
    HttpApiGroup.make("events").add(
      HttpApiEndpoint.post("ingest", "/")
        .setPayload(Workers.Http.WorkerCloudEventRequest)
        .addSuccess(Workers.Http.WorkerProcessingResponse)
        .addSuccess(Workers.Http.WorkerErrorResponse)
    )
  )
