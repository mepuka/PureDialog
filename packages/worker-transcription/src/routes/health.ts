import { HttpApiBuilder } from "@effect/platform"
import { Core, Workers } from "@puredialog/domain"
import { Effect, Schema } from "effect"
import { TranscriptionWorkerApi } from "../http/api.js"

const healthJobId = Schema.decodeUnknownSync(Core.JobId)("job_healthcheck")

export const healthRoutes = HttpApiBuilder.group(
  TranscriptionWorkerApi,
  "health",
  (handlers) =>
    handlers.handle("status", () =>
      Effect.succeed(
        Workers.Http.WorkerProcessingResponse.make({
          status: "processed",
          jobId: healthJobId,
          message: "transcription worker healthy"
        })
      ))
)
