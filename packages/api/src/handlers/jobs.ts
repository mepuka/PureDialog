import { HttpApiBuilder } from "@effect/platform"
import { MessageAdapter, MessageAdapterLive, PubSubClient, PubSubConfigLive } from "@puredialog/ingestion"
import { Effect, Layer } from "effect"
import { PureDialogApi } from "../api.js"
import { ProcessingJobStore, ProcessingJobStoreMock } from "../services/JobStore.js"

/**
 * Handler implementation requiring dependencies.
 */
const jobsLive = HttpApiBuilder.group(PureDialogApi, "jobs", (handlers) =>
  Effect.gen(function*() {
    const _jobStore = yield* ProcessingJobStore

    const _pubSubClient = yield* PubSubClient

    const _messageAdapter = yield* MessageAdapter

    return handlers.handle("createJob", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Creating job with idempotency key: ${payload.idempotencyKey}`)

        // TODO: Implement full logic:
        // 1. Check idempotency key
        // 2. Create and persist job
        // 3. Publish to PubSub
        // 4. Return appropriate response

        yield* Effect.die("createJob handler not implemented")
        return {
          status: "accepted" as const,
          statusCode: 202 as const,
          job: {} as any,
          message: "Not implemented"
        }
      }))
  })).pipe(
    Layer.provide(ProcessingJobStoreMock), // Will be replaced with real implementation
    Layer.provide(PubSubConfigLive),
    Layer.provide(MessageAdapterLive)
  )

export { jobsLive }
