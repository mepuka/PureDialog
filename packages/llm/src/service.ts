import { Chunk, Console, Context, Effect, Layer, Option, Stream } from "effect"

import type { Media, Transcription, YouTube } from "@puredialog/domain"
import { LLMAdapter, LLMAdapterLive } from "./adapters.js"
import { GeminiClient, GeminiClientLive } from "./client.js"
import type { LLMError } from "./errors.js"

// 2. Define the service tag
export class LLMService extends Context.Tag("@puredialog/llm/LLMService")<
  LLMService,
  {
    readonly transcribeMedia: (
      video: YouTube.YouTubeVideo,
      metadata: Media.MediaMetadata
    ) => Effect.Effect<ReadonlyArray<Transcription.DialogueTurn>, LLMError>
  }
>() {}

// 3. Implement the service
const makeLLMService = Effect.gen(function*() {
  const client = yield* GeminiClient
  const adapter = yield* LLMAdapter

  const transcribeMedia = (
    video: YouTube.YouTubeVideo,
    metadata: Media.MediaMetadata
  ) =>
    Effect.gen(function*() {
      const rawOutputStream = (yield* client.transcribeYoutubeVideo({
        video,
        mediaMetadata: metadata
      })).pipe(
        Stream.tap((chunk) =>
          chunk.pipe(Option.match(
            { onSome: (chunk) => Console.log(chunk), onNone: () => Console.log("No chunk") }
          ))
        )
      )
      const rawOutput = (yield* Stream.runCollect(rawOutputStream)).pipe(Chunk.compact)
      const turns = yield* adapter.toDomainTranscript(rawOutput)
      return turns
    }).pipe(Effect.withSpan("LLMService.transcribeMedia"))

  return LLMService.of({
    transcribeMedia
  })
})

// 4. Compose the final layer
const LayerLLMService = Layer.effect(LLMService, makeLLMService)

const LLMServiceDeps = Layer.merge(GeminiClientLive, LLMAdapterLive)

export const LLMServiceLive = LayerLLMService.pipe(
  Layer.provide(LLMServiceDeps)
)
