import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform";
import { Context, Effect, Layer } from "effect";
import { YoutubeConfig, YoutubeConfigLive } from "./config.js";
import { YoutubeApiError } from "./errors.js";
import { makeChannelRequest, makeVideoRequest } from "./internal/requests.js";
import { decodeChannelResponse, decodeVideoResponse, extractChannels, extractVideos } from "./internal/responses.js";
import { transformHttpError, withRetry } from "./internal/retry.js";
import {
  Channel,
  ChannelId,
  extractChannelId,
  extractVideoId,
  transformChannel,
  transformVideo,
  Video,
  VideoId,
} from "./resources.js";

export class YoutubeApiClient extends Context.Tag("YoutubeApiClient")<
  YoutubeApiClient,
  {
    // Single resource operations
    readonly getVideo: (id: VideoId) => Effect.Effect<Video, YoutubeApiError>;
    readonly getChannel: (
      id: ChannelId,
    ) => Effect.Effect<Channel, YoutubeApiError>;

    // URL-based operations
    readonly getVideoByUrl: (
      url: string,
    ) => Effect.Effect<Video, YoutubeApiError>;
    readonly getChannelByUrl: (
      url: string,
    ) => Effect.Effect<Channel, YoutubeApiError>;

    // Batch operations
    readonly getVideos: (
      ids: VideoId[],
    ) => Effect.Effect<Video[], YoutubeApiError>;
    readonly getChannels: (
      ids: ChannelId[],
    ) => Effect.Effect<Channel[], YoutubeApiError>;
  }
>() {}

const makeYoutubeApiClient = Effect.gen(function*() {
  const httpClient = yield* HttpClient.HttpClient;
  const config = yield* YoutubeConfig;

  const executeRequest = <T>(
    request: HttpClientRequest.HttpClientRequest,
    decoder: (
      res: HttpClientResponse.HttpClientResponse,
    ) => Effect.Effect<T, YoutubeApiError>,
  ) =>
    httpClient.execute(request).pipe(
      Effect.flatMap(decoder),
      Effect.catchTag("RequestError", (error) => Effect.fail(transformHttpError(error))),
      Effect.catchTag("ResponseError", (error) => Effect.fail(transformHttpError(error))),
      withRetry(config),
    );

  // Single video operation
  const getVideo = (id: VideoId) =>
    Effect.gen(function*() {
      const request = makeVideoRequest([id], config);
      const response = yield* executeRequest(request, decodeVideoResponse);
      const rawVideos = yield* extractVideos(response);

      if (rawVideos.length === 0) {
        return yield* Effect.fail(
          YoutubeApiError.apiError(404, `Video not found: ${id}`),
        );
      }

      return transformVideo(rawVideos[0]);
    });

  // Video by URL operation
  const getVideoByUrl = (url: string) =>
    Effect.gen(function*() {
      const videoId = extractVideoId(url);
      if (!videoId) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(url, "Unable to extract video ID"),
        );
      }
      return yield* getVideo(videoId as VideoId);
    });

  // Batch video operation
  const getVideos = (ids: VideoId[]) =>
    Effect.gen(function*() {
      if (ids.length === 0) return [];
      if (ids.length > 50) {
        return yield* Effect.fail(
          YoutubeApiError.validationError(
            "Maximum 50 video IDs allowed per request",
          ),
        );
      }

      const request = makeVideoRequest(ids, config);
      const response = yield* executeRequest(request, decodeVideoResponse);
      const rawVideos = yield* extractVideos(response);
      return rawVideos.map(transformVideo);
    });

  // Single channel operation
  const getChannel = (id: ChannelId) =>
    Effect.gen(function*() {
      const request = makeChannelRequest([id], config);
      const response = yield* executeRequest(request, decodeChannelResponse);
      const rawChannels = yield* extractChannels(response);

      if (rawChannels.length === 0) {
        return yield* Effect.fail(
          YoutubeApiError.apiError(404, `Channel not found: ${id}`),
        );
      }

      return transformChannel(rawChannels[0]);
    });

  // Channel by URL operation
  const getChannelByUrl = (url: string) =>
    Effect.gen(function*() {
      const channelId = extractChannelId(url);
      if (!channelId) {
        return yield* Effect.fail(
          YoutubeApiError.invalidUrl(
            url,
            "Unable to extract channel ID or custom URLs not supported",
          ),
        );
      }
      return yield* getChannel(channelId as ChannelId);
    });

  // Batch channel operation
  const getChannels = (ids: ChannelId[]) =>
    Effect.gen(function*() {
      if (ids.length === 0) return [];
      if (ids.length > 50) {
        return yield* Effect.fail(
          YoutubeApiError.validationError(
            "Maximum 50 channel IDs allowed per request",
          ),
        );
      }

      const request = makeChannelRequest(ids, config);
      const response = yield* executeRequest(request, decodeChannelResponse);
      const rawChannels = yield* extractChannels(response);
      return rawChannels.map(transformChannel);
    });

  return {
    getVideo,
    getVideoByUrl,
    getVideos,
    getChannel,
    getChannelByUrl,
    getChannels,
  } as const;
});

// Layer implementation
export const YoutubeApiClientLive = Layer.effect(
  YoutubeApiClient,
  makeYoutubeApiClient,
).pipe(Layer.provide(YoutubeConfigLive));
