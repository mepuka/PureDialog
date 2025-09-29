import { Schema } from "effect"
import { MediaResourceId } from "../core/ids.js"
import { MediaMetadata } from "./metadata.js"

// Import YouTube types - this creates a dependency on the YouTube namespace
// This is acceptable since Media depends on YouTube, not the other way around
import { YouTubeChannel, YouTubeVideo } from "../youtube/index.js"

/**
 * Media resource types and schemas
 */

/**
 * MediaResource as discriminated union with clean {type, data} structure.
 * This is the core type that all APIs should consume for media content.
 *
 * Design: Simple {type, data} structure for easy consumption by all services.
 * Future: Will be extended to support Spotify, Podcast, etc.
 */
export const MediaResource = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("youtube"),
    data: YouTubeVideo
  }),
  Schema.Struct({
    type: Schema.Literal("youtube#channel"),
    data: YouTubeChannel
  })
  // Future: add other media types like:
  // Schema.Struct({ type: Schema.Literal("spotify"), data: SpotifyTrack }),
  // Schema.Struct({ type: Schema.Literal("podcast"), data: PodcastEpisode }),
)
export type MediaResource = Schema.Schema.Type<typeof MediaResource>

// Legacy support - keeping the class-based resources for backward compatibility if needed
export class YouTubeVideoResource extends Schema.Class<YouTubeVideoResource>("YouTubeVideoResource")({
  type: Schema.Literal("youtube"),
  id: MediaResourceId,
  metadata: MediaMetadata,
  data: YouTubeVideo
}) {}

export class YouTubeChannelResource extends Schema.Class<YouTubeChannelResource>("YouTubeChannelResource")({
  type: Schema.Literal("youtube-channel"),
  id: MediaResourceId,
  metadata: MediaMetadata,
  data: YouTubeChannel
}) {}

export const LegacyMediaResource = Schema.Union(
  YouTubeVideoResource,
  YouTubeChannelResource
)
