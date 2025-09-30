import { Chunk, Console, Context, DateTime, Effect, Layer, Option, Stream } from "effect"

import type { Core, Media, Transcription, YouTube } from "@puredialog/domain"
import { LLM } from "@puredialog/domain"
import { LLMAdapter, LLMAdapterLive } from "./adapters.js"
import { GeminiClient, GeminiClientLive } from "./client.js"
import { GeminiConfig } from "./config.js"
import type { LLMError } from "./errors.js"

/**
 * Transcription result with artifact traceability.
 */
export interface TranscriptionWithArtifact {
  readonly turns: ReadonlyArray<Transcription.DialogueTurn>
  readonly artifact: LLM.LLMArtifacts
}

// 2. Define the service tag
export class LLMService extends Context.Tag("@puredialog/llm/LLMService")<
  LLMService,
  {
    readonly transcribeMedia: (
      jobId: Core.JobId,
      video: YouTube.YouTubeVideo,
      metadata: Media.MediaMetadata
    ) => Effect.Effect<TranscriptionWithArtifact, LLMError>
  }
>() {}

// 3. Implement the service
const makeLLMService = Effect.gen(function*() {
  const client = yield* GeminiClient
  const adapter = yield* LLMAdapter
  const config = yield* GeminiConfig

  const transcribeMedia = (
    jobId: Core.JobId,
    video: YouTube.YouTubeVideo,
    metadata: Media.MediaMetadata
  ) =>
    Effect.gen(function*() {
      const { promptArtifact, stream: resultStream } = yield* client.transcribeYoutubeVideo({
        video,
        mediaMetadata: metadata
      })

      // might pipe this out via an event bus
      const rawOutputStream = resultStream.pipe(
        Stream.tap((chunk) =>
          chunk.pipe(Option.match(
            { onSome: (chunk) => Console.log(chunk), onNone: () => Console.log("No chunk") }
          ))
        )
      )

      const rawOutput = (yield* Stream.runCollect(rawOutputStream)).pipe(Chunk.compact)

      const turns = yield* adapter.toDomainTranscript(rawOutput)

      const artifact = LLM.LLMArtifacts.make({
        id: LLM.LLMArtifactId.make(`gemini_transcribe_youtube_video_${jobId}`),
        jobId,
        providerConfig: LLM.GeminiProviderConfig.make({
          provider: "gemini" as const,
          model: config.model,
          temperature: config.temperature,
          mediaResolution: "low"
        }),
        createdAt: DateTime.unsafeFromDate(new Date()),
        additional: { promptArtifact }
      })

      return {
        turns,
        artifact
      }
    }).pipe(Effect.withSpan("LLMService.transcribeMedia"))

  return LLMService.of({
    transcribeMedia
  })
})

// 4. Compose the final layer
const LayerLLMService = Layer.effect(LLMService, makeLLMService)

const LLMServiceDeps = Layer.mergeAll(GeminiClientLive, LLMAdapterLive)

export const LLMServiceLive = LayerLLMService.pipe(
  Layer.provide(LLMServiceDeps)
)
