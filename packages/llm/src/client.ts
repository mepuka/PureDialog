import { ApiError, GoogleGenAI, MediaResolution } from "@google/genai"
import { Media, YouTube } from "@puredialog/domain"
import { Context, Effect, Layer, Option, Redacted, Schema, Stream } from "effect"
import { GeminiConfig } from "./config.js"
import { GoogleApiError } from "./errors.js"
import { hints, instructions, systemInstruction } from "./prompts/transcribe_media.js"

export type TranscribeYoutubeVideoOptions = Schema.Schema.Type<typeof TranscribeYoutubeVideoOptions>
export const TranscribeYoutubeVideoOptions = Schema.Struct({
  video: YouTube.YouTubeVideo,
  mediaMetadata: Media.MediaMetadata
})

/**
 * Result from transcription with timing and token metadata.
 */
export interface TranscriptionResult {
  readonly stream: Stream.Stream<Option.Option<string>, GoogleApiError, never>
  readonly promptArtifact: typeof PromptArtifact.Type
}

const PromptArtifact = Schema.Struct(
  {
    systemInstruction: Schema.String,
    fullPromptText: Schema.String
  }
)

// Helper function to format content parts for the LLM call
const _formatContentParts = (options: TranscribeYoutubeVideoOptions) => {
  const parts: Array<{ fileData: { fileUri: string } } | { text: string }> = [
    { fileData: { fileUri: YouTube.videoIdToWatchUrl(options.video.id) } }
  ]

  // If we have media metadata, use the hints function to generate context
  if (options.mediaMetadata) {
    const metadata = options.mediaMetadata as Media.MediaMetadata
    const hintsText = hints(metadata)
    parts.push({ text: hintsText })
  }

  // Add the instructions
  parts.push({ text: instructions })

  return parts
}

// Define the service tag
export class GeminiClient extends Context.Tag("GeminiClient")<
  GeminiClient,
  {
    readonly transcribeYoutubeVideo: (
      options: TranscribeYoutubeVideoOptions
    ) => Effect.Effect<TranscriptionResult, GoogleApiError>
  }
>() {}

// Implement the live layer
export const GeminiClientLive = Layer.effect(
  GeminiClient,
  Effect.gen(function*() {
    const config = yield* GeminiConfig
    const genAI = yield* Effect.try(() => new GoogleGenAI({ apiKey: Redacted.value(config.apiKey) }))

    const transcribeYoutubeVideo = (options: TranscribeYoutubeVideoOptions) =>
      Effect.gen(function*() {
        const fullPromptData = {
          model: config.model,
          contents: _formatContentParts(options),
          config: {
            responseMimeType: "application/json",
            mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
            temperature: config.temperature,
            systemInstruction
          }
        }

        const response = yield* Effect.tryPromise({
          try: () => genAI.models.generateContentStream(fullPromptData),
          catch: (cause) =>
            cause instanceof ApiError ?
              new GoogleApiError({
                message: cause.message,
                status: cause.status
              })
              : new GoogleApiError({
                message: "Error generating content from Gemini API",
                status: 500
              })
        })

        const stream = Stream.fromAsyncIterable(response, (e) =>
          new GoogleApiError({
            message: "Error generating content from Gemini API",
            cause: e,
            status: 500
          })).pipe(
            Stream.map((res) => Option.fromNullable(res.text)),
            Stream.withSpan("GeminiClient.transcribeYoutubeVideo")
          )

        return {
          stream,
          promptArtifact: PromptArtifact.make({
            systemInstruction: fullPromptData.config.systemInstruction,
            fullPromptText: JSON.stringify(fullPromptData, null, 2)
          })
        }
      })

    return {
      transcribeYoutubeVideo
    } as const
  })
)
