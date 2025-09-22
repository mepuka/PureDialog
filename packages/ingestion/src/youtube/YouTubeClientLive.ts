import { FetchHttpClient } from "@effect/platform";
import { Context, Effect, Layer } from "effect";
import { ConfigError } from "effect/ConfigError";
import { YoutubeApiClient, YoutubeApiClientLive } from "./client.js";
import { YoutubeApiError } from "./errors.js";
import { ValidatedYoutubeUrl, Video } from "./resources.js";

// YouTube Client interface - completely self-contained
export interface YouTubeClient {
  readonly fetchVideo: (
    videoUrl: ValidatedYoutubeUrl,
  ) => Effect.Effect<Video, YoutubeApiError>;
}

// Context tag for the YouTube client
export const YouTubeClient = Context.GenericTag<YouTubeClient>(
  "@puredialog/ingestion/YouTubeClient",
);

// Implementation that uses the real YouTube API
const makeYouTubeClient = Effect.gen(function*() {
  const youtubeApiClient = yield* YoutubeApiClient;

  return {
    fetchVideo: (videoUrl: ValidatedYoutubeUrl) =>
      Effect.gen(function*() {
        // Use the API client's built-in URL handling
        const video = yield* youtubeApiClient.getVideoByUrl(videoUrl);
        return video;
      }),
  };
});

// Layer that provides the real YouTube client
export const YouTubeClientLive: Layer.Layer<
  YouTubeClient,
  YoutubeApiError | ConfigError
> = Layer.effect(YouTubeClient, makeYouTubeClient).pipe(
  Layer.provide(YoutubeApiClientLive),
  Layer.provide(FetchHttpClient.layer),
);
