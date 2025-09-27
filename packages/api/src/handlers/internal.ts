import { HttpApiBuilder } from "@effect/platform"
import { MessageAdapter, MessageAdapterLive } from "@puredialog/ingestion"
import { Effect, Layer } from "effect"
import { PureDialogApi } from "../api.js"
import { ProcessingJobStore, ProcessingJobStoreMock } from "./services/JobStore.js"

/**
 * Handler for Pub/Sub push messages.
 */
const internalLive = HttpApiBuilder.group(PureDialogApi, "internal", (handlers) =>
  Effect.gen(function*() {
    const _jobStore = yield* ProcessingJobStore

    const _messageAdapter = yield* MessageAdapter

    return handlers.handle("jobUpdate", ({ payload }) =>
      Effect.gen(function*() {
        yield* Effect.logInfo(`Received job update push message: ${payload.message.messageId}`)

        // TODO: Implement full logic:
        // 1. Decode base64 data field
        // 2. Parse job update payload
        // 3. Update job status in storage
        // 4. Handle errors appropriately

        yield* Effect.die("jobUpdate handler not implemented")
        return { received: true }
      }))
  })).pipe(
    Layer.provide(ProcessingJobStoreMock),
    Layer.provide(MessageAdapterLive)
  )

export { internalLive }
