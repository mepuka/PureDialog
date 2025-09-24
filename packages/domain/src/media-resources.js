import { Schema } from "effect";
import { MediaResourceId } from "./ids";
import { MediaMetadata } from "./media-resource-metadata";
/** A unique identifier for a YouTube video (11 characters). */
export const YouTubeVideoId = Schema.String.pipe(Schema.minLength(11), Schema.maxLength(11), Schema.pattern(/^[a-zA-Z0-9_-]+$/), Schema.brand("YouTubeVideoId"));
/** A unique identifier for a YouTube channel (24 characters starting with UC). */
export const YouTubeChannelId = Schema.String.pipe(Schema.minLength(24), Schema.maxLength(24), Schema.pattern(/^UC[a-zA-Z0-9_-]+$/), Schema.brand("YouTubeChannelId"));
/** Clean domain representation of a YouTube video resource. */
export class YouTubeVideo extends Schema.Class("YouTubeVideo")({
    id: YouTubeVideoId,
    title: Schema.String,
    description: Schema.optional(Schema.String),
    duration: Schema.Number, // seconds
    channelId: Schema.String,
    channelTitle: Schema.String,
    publishedAt: Schema.optional(Schema.String),
    language: Schema.optional(Schema.String).pipe(Schema.withConstructorDefault(() => "en-US")),
}) {
}
/** Clean domain representation of a YouTube channel resource. */
export class YouTubeChannel extends Schema.Class("YouTubeChannel")({
    id: YouTubeChannelId,
    title: Schema.String,
    description: Schema.optional(Schema.String),
    customUrl: Schema.optional(Schema.String),
    publishedAt: Schema.String,
    country: Schema.optional(Schema.String),
    subscriberCount: Schema.optional(Schema.Number),
}) {
}
export class YouTubeVideoResource extends Schema.Class("YouTubeVideoResource")({
    type: Schema.Literal("youtube"),
    id: MediaResourceId,
    metadata: MediaMetadata,
    data: YouTubeVideo,
}) {
}
export class YouTubeChannelResource extends Schema.Class("YouTubeChannelResource")({
    type: Schema.Literal("youtube-channel"),
    id: MediaResourceId,
    metadata: MediaMetadata,
    data: YouTubeChannel,
}) {
}
/** MediaResource as discriminated union with clean {type, data} structure. */
export const MediaResource = Schema.Union(YouTubeVideoResource, YouTubeChannelResource);
