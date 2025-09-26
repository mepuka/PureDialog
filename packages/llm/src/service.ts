import type { AiError, LanguageModel } from "@effect/ai/index"
import type { MediaMetadata, Speaker, TranscriptSegment, YouTubeChannel, YouTubeVideo } from "@puredialog/domain"
import type { Config, Effect } from "effect"
import { Context, Layer } from "effect"
import type { ConfigError } from "effect/ConfigError"
import type { ParseError } from "effect/ParseResult"
import type { GoogleApiError, TranscriptionError } from "./errors.js"
import type { PodcastSpeakerMetadata } from "./prompts/extract_media_metadata.js"
import { extractMediaMetadata } from "./prompts/extract_media_metadata.js"
import { transcribeMedia } from "./prompts/transcribe_media.js"

export interface LLMService {
  readonly extractMetadata: (
    video: YouTubeVideo,
    host: Speaker,
    channel?: YouTubeChannel
  ) => Effect.Effect<PodcastSpeakerMetadata, AiError.AiError, LanguageModel.LanguageModel>

  readonly transcribeMedia: (
    video: YouTubeVideo,
    metadata: MediaMetadata
  ) => Effect.Effect<
    ReadonlyArray<TranscriptSegment>,
    GoogleApiError | ConfigError | TranscriptionError | ParseError,
    Config.Config<string>
  >
}

export const LLMService = Context.GenericTag<LLMService>("@puredialog/llm/LLMService")

export const LLMServiceLive = Layer.succeed(
  LLMService,
  LLMService.of({
    extractMetadata: (video: YouTubeVideo, host: Speaker, channel?: YouTubeChannel) =>
      extractMediaMetadata(video, host, channel),
    transcribeMedia: (video: YouTubeVideo, metadata: MediaMetadata) => transcribeMedia(video, metadata)
  })
)
