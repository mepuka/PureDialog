import { Effect } from "effect";

import {
  YouTubeVideo,
  YouTubeChannel,
  YouTubeVideoId,
  YouTubeChannelId,
} from "@puredialog/domain";
import { youtube_v3 } from "@googleapis/youtube";
import { YoutubeApiError } from "../youtube/errors";

/** Transform YouTube API response to clean domain YouTubeVideo. */
export const toDomainYouTubeVideo = (
  apiVideo: youtube_v3.Schema$Video
): Effect.Effect<YouTubeVideo, YoutubeApiError> =>
  Effect.gen(function* () {
    // Validate required fields exist
    if (!apiVideo.id) {
      return yield* Effect.fail(
        YoutubeApiError.validationError(
          "Missing video ID from YouTube API response"
        )
      );
    }

    if (!apiVideo.snippet) {
      return yield* Effect.fail(
        YoutubeApiError.validationError(
          "Missing snippet data from YouTube API response"
        )
      );
    }

    // Use Effect's Schema validation instead of try-catch
    const videoData = new YouTubeVideo({
      id: YouTubeVideoId.make(apiVideo.id),
      title: apiVideo.snippet.title || "Untitled",
      description: apiVideo.snippet.description ?? undefined,
      duration: apiVideo.contentDetails?.duration
        ? parseDurationToSeconds(apiVideo.contentDetails.duration)
        : 0,
      channelId: apiVideo.snippet.channelId || "",
      channelTitle: apiVideo.snippet.channelTitle || "Unknown Channel",
      publishedAt: apiVideo.snippet.publishedAt ?? undefined,
      language: apiVideo.snippet.defaultAudioLanguage!,
    });

    return videoData;
  });

/** Transform domain YouTubeVideo back to YouTube API format for updates. */
export const fromDomainYouTubeVideo = (
  youtubeVideo: YouTubeVideo
): Effect.Effect<youtube_v3.Schema$Video, YoutubeApiError> =>
  Effect.gen(function* () {
    // No try-catch needed - this is pure data transformation
    const apiVideo: youtube_v3.Schema$Video = {
      id: youtubeVideo.id,
      snippet: {
        title: youtubeVideo.title,
        description: youtubeVideo.description ?? "",
        channelId: youtubeVideo.channelId ?? undefined,
        channelTitle: youtubeVideo.channelTitle ?? undefined,
        publishedAt: youtubeVideo.publishedAt ?? undefined,
        defaultAudioLanguage: youtubeVideo.language,
      },
      contentDetails: youtubeVideo.duration
        ? { duration: formatSecondsToISO8601(youtubeVideo.duration) }
        : undefined,
    };

    return apiVideo;
  });

/** Parse YouTube API ISO 8601 duration format (PT4M13S) to seconds. */
const parseDurationToSeconds = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
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

/** Transform YouTube API Channel response to clean domain YouTubeChannel. */
export const toDomainYouTubeChannel = (
  apiChannel: youtube_v3.Schema$Channel
): Effect.Effect<YouTubeChannel, YoutubeApiError> =>
  Effect.gen(function* () {
    // Validate required fields exist
    if (!apiChannel.id) {
      return yield* Effect.fail(
        YoutubeApiError.validationError(
          "Missing channel ID from YouTube API response"
        )
      );
    }

    if (!apiChannel.snippet) {
      return yield* Effect.fail(
        YoutubeApiError.validationError(
          "Missing snippet data from YouTube API response"
        )
      );
    }

    // Use Effect's Schema validation instead of try-catch
    const channelData = new YouTubeChannel({
      id: YouTubeChannelId.make(apiChannel.id),
      title: apiChannel.snippet.title || "Untitled Channel",
      description: apiChannel.snippet.description ?? undefined,
      customUrl: apiChannel.snippet.customUrl ?? undefined,
      publishedAt: apiChannel.snippet.publishedAt || new Date().toISOString(),
      country: apiChannel.snippet.country ?? undefined,
      subscriberCount: apiChannel.statistics?.subscriberCount
        ? parseInt(apiChannel.statistics.subscriberCount, 10)
        : undefined,
    });

    return channelData;
  });

/** Transform domain YouTubeChannel back to YouTube Channel API format for updates. */
export const fromDomainYouTubeChannel = (
  youtubeChannel: YouTubeChannel
): Effect.Effect<youtube_v3.Schema$Channel, YoutubeApiError> =>
  Effect.gen(function* () {
    // No try-catch needed - this is pure data transformation
    const apiChannel: youtube_v3.Schema$Channel = {
      id: youtubeChannel.id,
      snippet: {
        title: youtubeChannel.title,
        description: youtubeChannel.description ?? "",
        customUrl: youtubeChannel.customUrl ?? undefined,
        publishedAt: youtubeChannel.publishedAt ?? undefined,
        country: youtubeChannel.country ?? undefined,
      },
      statistics: youtubeChannel.subscriberCount
        ? { subscriberCount: youtubeChannel.subscriberCount.toString() }
        : undefined,
    };

    return apiChannel;
  });
