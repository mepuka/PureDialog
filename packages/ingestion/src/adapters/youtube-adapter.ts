import { ParseResult } from "effect";
import { Schema } from "effect";
import { Effect } from "effect";

import { youtube_v3 } from "@googleapis/youtube";
import { YouTubeChannel, YouTubeVideo } from "@puredialog/domain";
import { YoutubeApiError } from "../youtube/errors";

/** Parse YouTube API ISO 8601 duration format (PT4M13S) to seconds. */
const parseISO8601Duration = (duration: string): number => {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
};

/** Format seconds back to YouTube API ISO 8601 duration format. */
const formatSecondsToISO8601 = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let duration = "PT";
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (seconds > 0) duration += `${seconds}S`;
  return duration === "PT" ? "PT0S" : duration;
};

/** Transform YouTube API video response to domain format, then decode with YouTubeVideo schema. */
const fromYouTubeApiVideo = Schema.transformOrFail(
  Schema.Unknown, // YouTube API response
  YouTubeVideo, // Our domain class (already a schema!)
  {
    strict: true,
    decode: (apiVideo, _, ast) => {
      // Validate required fields
      if (!apiVideo || typeof apiVideo !== "object") {
        return Effect.fail(
          new ParseResult.Type(ast, apiVideo, "Expected object"),
        );
      }

      const video = apiVideo as youtube_v3.Schema$Video;
      if (!video.id) {
        return Effect.fail(
          new ParseResult.Type(ast, apiVideo, "Missing video ID"),
        );
      }

      if (!video.snippet) {
        return Effect.fail(
          new ParseResult.Type(ast, apiVideo, "Missing snippet data"),
        );
      }

      // Transform API format to domain format
      return Effect.succeed({
        id: video.id,
        title: video.snippet.title || "Untitled",
        description: video.snippet.description ?? undefined,
        duration: video.contentDetails?.duration
          ? parseISO8601Duration(video.contentDetails.duration)
          : 0,
        channelId: video.snippet.channelId || "",
        channelTitle: video.snippet.channelTitle || "Unknown Channel",
        publishedAt: video.snippet.publishedAt ?? undefined,
        language: video.snippet.defaultAudioLanguage ?? "en-US",
      });
    },
    encode: (youtubeVideo) => {
      // Transform domain format back to API format
      const apiVideo: youtube_v3.Schema$Video = {
        id: youtubeVideo.id,
        snippet: {
          title: youtubeVideo.title,
          description: youtubeVideo.description ?? "",
          channelId: youtubeVideo.channelId || undefined,
          channelTitle: youtubeVideo.channelTitle || undefined,
          publishedAt: youtubeVideo.publishedAt || undefined,
          defaultAudioLanguage: youtubeVideo.language,
        },
        contentDetails: youtubeVideo.duration > 0
          ? { duration: formatSecondsToISO8601(youtubeVideo.duration) }
          : undefined,
      };
      return Effect.succeed(apiVideo);
    },
  },
);

/** Transform YouTube API channel response to domain format, then decode with YouTubeChannel schema. */
const fromYouTubeApiChannel = Schema.transformOrFail(
  Schema.Unknown, // YouTube API response
  YouTubeChannel, // Our domain class (already a schema!)
  {
    strict: true,
    decode: (apiChannel, _, ast) => {
      // Validate required fields
      if (!apiChannel || typeof apiChannel !== "object") {
        return Effect.fail(
          new ParseResult.Type(ast, apiChannel, "Expected object"),
        );
      }

      const channel = apiChannel as youtube_v3.Schema$Channel;
      if (!channel.id) {
        return Effect.fail(
          new ParseResult.Type(ast, apiChannel, "Missing channel ID"),
        );
      }

      if (!channel.snippet) {
        return Effect.fail(
          new ParseResult.Type(ast, apiChannel, "Missing snippet data"),
        );
      }

      // Transform API format to domain format
      return Effect.succeed({
        id: channel.id,
        title: channel.snippet.title || "Untitled Channel",
        description: channel.snippet.description ?? undefined,
        customUrl: channel.snippet.customUrl ?? undefined,
        publishedAt: channel.snippet.publishedAt || new Date().toISOString(),
        country: channel.snippet.country ?? undefined,
        subscriberCount: channel.statistics?.subscriberCount
          ? parseInt(channel.statistics.subscriberCount, 10) || undefined
          : undefined,
      });
    },
    encode: (youtubeChannel) => {
      // Transform domain format back to API format
      const apiChannel: youtube_v3.Schema$Channel = {
        id: youtubeChannel.id,
        snippet: {
          title: youtubeChannel.title,
          description: youtubeChannel.description ?? "",
          customUrl: youtubeChannel.customUrl || undefined,
          publishedAt: youtubeChannel.publishedAt || undefined,
          country: youtubeChannel.country || undefined,
        },
        statistics: youtubeChannel.subscriberCount
          ? { subscriberCount: youtubeChannel.subscriberCount.toString() }
          : undefined,
      };
      return Effect.succeed(apiChannel);
    },
  },
);

/** Transform YouTube API response to clean domain YouTubeVideo. */
export const toDomainYouTubeVideo = (
  apiVideo: youtube_v3.Schema$Video,
): Effect.Effect<YouTubeVideo, YoutubeApiError> =>
  Schema.decode(fromYouTubeApiVideo)(apiVideo).pipe(
    Effect.mapError((cause) =>
      YoutubeApiError.validationError(
        `Invalid YouTube API video response: ${cause}`,
      )
    ),
  );

/** Transform domain YouTubeVideo back to YouTube API format for updates. */
export const fromDomainYouTubeVideo = (
  youtubeVideo: YouTubeVideo,
): Effect.Effect<youtube_v3.Schema$Video, YoutubeApiError> =>
  Schema.encode(fromYouTubeApiVideo)(youtubeVideo).pipe(
    Effect.map((result) => result as youtube_v3.Schema$Video),
    Effect.mapError((cause) =>
      YoutubeApiError.validationError(
        `Failed to encode YouTube video: ${cause}`,
      )
    ),
  );

/** Transform YouTube API Channel response to clean domain YouTubeChannel. */
export const toDomainYouTubeChannel = (
  apiChannel: youtube_v3.Schema$Channel,
): Effect.Effect<YouTubeChannel, YoutubeApiError> =>
  Schema.decode(fromYouTubeApiChannel)(apiChannel).pipe(
    Effect.mapError((cause) =>
      YoutubeApiError.validationError(
        `Invalid YouTube API channel response: ${cause}`,
      )
    ),
  );

/** Transform domain YouTubeChannel back to YouTube Channel API format for updates. */
export const fromDomainYouTubeChannel = (
  youtubeChannel: YouTubeChannel,
): Effect.Effect<youtube_v3.Schema$Channel, YoutubeApiError> =>
  Schema.encode(fromYouTubeApiChannel)(youtubeChannel).pipe(
    Effect.map((result) => result as youtube_v3.Schema$Channel),
    Effect.mapError((cause) =>
      YoutubeApiError.validationError(
        `Failed to encode YouTube channel: ${cause}`,
      )
    ),
  );
