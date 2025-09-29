import { Transcription } from "@puredialog/domain"
import { Context, Effect, Layer, Schema } from "effect"
import type { LLMError } from "./errors.js"
import { TranscriptionError } from "./errors.js"

// The schema for the raw output we expect from the LLM
const LLMOutputSchema = Schema.Array(Transcription.DialogueTurn)

export class LLMAdapter extends Context.Tag("LLMAdapter")<LLMAdapter, {
  readonly toDomainTranscript: (
    rawOutput: unknown
  ) => Effect.Effect<ReadonlyArray<Transcription.DialogueTurn>, LLMError>
}>() {}

export const LLMAdapterLive = Layer.succeed(
  LLMAdapter,
  LLMAdapter.of({
    toDomainTranscript: (rawOutput) =>
      Schema.decodeUnknown(LLMOutputSchema)(rawOutput).pipe(
        Effect.mapError(
          (cause) =>
            new TranscriptionError({
              message: "Failed to parse LLM output into DialogueTurns",
              cause
            })
        )
      )
  })
)
