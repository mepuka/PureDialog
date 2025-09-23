import { ParseResult, Schema } from "effect";

// YouTube URL regex patterns
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{22}$/;

// YouTube video URL patterns
const WATCH_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/;
const SHORT_URL_PATTERN = /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/;
const EMBED_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/;
const MOBILE_URL_PATTERN = /^https?:\/\/m\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/;

// Combined pattern for all YouTube video URLs
const ALL_YOUTUBE_VIDEO_URL_PATTERN = new RegExp(
  [
    WATCH_URL_PATTERN.source,
    SHORT_URL_PATTERN.source,
    EMBED_URL_PATTERN.source,
    MOBILE_URL_PATTERN.source,
  ].join("|"),
);

// YouTube channel URL patterns
const CHANNEL_URL_PATTERN = /^https?:\/\/(?:www\.)?youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/;

// Extract video ID from various URL formats
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    WATCH_URL_PATTERN,
    SHORT_URL_PATTERN,
    EMBED_URL_PATTERN,
    MOBILE_URL_PATTERN,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already a video ID
  if (VIDEO_ID_PATTERN.test(url)) {
    return url;
  }

  return null;
};

// Extract channel ID from various URL formats (returns null for custom URLs that need API resolution)
export const extractChannelId = (url: string): string | null => {
  const channelMatch = url.match(CHANNEL_URL_PATTERN);
  if (channelMatch && channelMatch[1]) {
    return channelMatch[1];
  }

  // If it's already a channel ID
  if (CHANNEL_ID_PATTERN.test(url)) {
    return url;
  }

  // Custom URLs (user/, c/, @) cannot be resolved without API call
  return null;
};

// Schema for canonical video ID (11 characters)
export const VideoId = Schema.String.pipe(
  Schema.pattern(VIDEO_ID_PATTERN, {
    message: () => "Video ID must be 11 characters of alphanumeric, underscore, or dash",
  }),
  Schema.brand("VideoId"),
);
export type VideoId = Schema.Schema.Type<typeof VideoId>;

// Schema for any YouTube video URL that can be converted to VideoId
export const YoutubeVideoUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((url) => extractVideoId(url) !== null, {
      message: () => "Must be a valid YouTube video URL or video ID",
    }),
  ),
  VideoId,
  {
    decode: (url) => {
      const videoId = extractVideoId(url);
      if (videoId === null) {
        return ParseResult.fail(new ParseResult.Type(VideoId.ast, url));
      }
      return ParseResult.succeed(videoId as VideoId);
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/watch?v=${id}`),
  },
);
export type YoutubeVideoUrl = Schema.Schema.Type<typeof YoutubeVideoUrl>;

// Schema for canonical channel ID (UC + 22 characters)
export const ChannelId = Schema.String.pipe(
  Schema.pattern(CHANNEL_ID_PATTERN, {
    message: () => "Channel ID must start with 'UC' followed by 22 characters",
  }),
  Schema.brand("ChannelId"),
);
export type ChannelId = Schema.Schema.Type<typeof ChannelId>;

// Schema for any YouTube channel URL that can be converted to ChannelId
export const YoutubeChannelUrl = Schema.transformOrFail(
  Schema.String.pipe(
    Schema.filter((url) => extractChannelId(url) !== null, {
      message: () => "Must be a valid YouTube channel URL with standard channel ID format",
    }),
  ),
  ChannelId,
  {
    decode: (url) => {
      const channelId = extractChannelId(url);
      if (channelId === null) {
        return ParseResult.fail(new ParseResult.Type(ChannelId.ast, url));
      }
      return ParseResult.succeed(channelId as ChannelId);
    },
    encode: (id) => ParseResult.succeed(`https://www.youtube.com/channel/${id}`),
  },
);
export type YoutubeChannelUrl = Schema.Schema.Type<typeof YoutubeChannelUrl>;

// Branded schema for validated YouTube video URLs (input validation)
export const ValidatedYoutubeUrl = Schema.String.pipe(
  Schema.pattern(ALL_YOUTUBE_VIDEO_URL_PATTERN, {
    message: () => "Must be a valid YouTube video URL (watch, youtu.be, embed, or mobile format)",
  }),
  Schema.brand("ValidatedYoutubeUrl"),
);
export type ValidatedYoutubeUrl = Schema.Schema.Type<typeof ValidatedYoutubeUrl>;

const Thumbnail = Schema.Struct({
  url: Schema.String,
  width: Schema.Number,
  height: Schema.Number,
});

const Thumbnails = Schema.Record({ key: Schema.String, value: Thumbnail });

const VideoSnippet = Schema.Struct({
  publishedAt: Schema.String,
  channelId: ChannelId,
  title: Schema.String,
  description: Schema.String,
  thumbnails: Thumbnails,
  channelTitle: Schema.String,
  tags: Schema.optional(Schema.Array(Schema.String)),
  categoryId: Schema.optional(Schema.String),
  liveBroadcastContent: Schema.optional(Schema.String),
  defaultLanguage: Schema.optional(Schema.String),
  defaultAudioLanguage: Schema.optional(Schema.String),
});

const VideoContentDetails = Schema.Struct({
  duration: Schema.String,
  dimension: Schema.optional(Schema.String),
  definition: Schema.optional(Schema.String),
  caption: Schema.optional(Schema.String),
  licensedContent: Schema.optional(Schema.Boolean),
});

const VideoStatus = Schema.Struct({
  uploadStatus: Schema.optional(Schema.String),
  privacyStatus: Schema.String,
  license: Schema.optional(Schema.String),
  embeddable: Schema.optional(Schema.Boolean),
  publicStatsViewable: Schema.optional(Schema.Boolean),
  madeForKids: Schema.optional(Schema.Boolean),
  selfDeclaredMadeForKids: Schema.optional(Schema.Boolean),
});

const VideoStatistics = Schema.Struct({
  viewCount: Schema.optional(Schema.String),
  likeCount: Schema.optional(Schema.String),
  dislikeCount: Schema.optional(Schema.String),
  favoriteCount: Schema.optional(Schema.String),
  commentCount: Schema.optional(Schema.String),
});

// Raw YouTube API video schema (internal use only)
export const RawVideo = Schema.Struct({
  kind: Schema.Literal("youtube#video"),
  etag: Schema.String,
  id: VideoId,
  snippet: VideoSnippet,
  contentDetails: VideoContentDetails,
  status: VideoStatus,
  statistics: VideoStatistics,
});

export type RawVideo = Schema.Schema.Type<typeof RawVideo>;

// Simplified video schema for application use
export const Video = Schema.Struct({
  id: VideoId,
  title: Schema.String,
  description: Schema.String,
  publishedAt: Schema.String,
  channelId: ChannelId,
  channelTitle: Schema.String,
  duration: Schema.String,
  viewCount: Schema.optional(Schema.String),
  likeCount: Schema.optional(Schema.String),
  commentCount: Schema.optional(Schema.String),
  thumbnails: Thumbnails,
  tags: Schema.optional(Schema.Array(Schema.String)),
  categoryId: Schema.optional(Schema.String),
  privacyStatus: Schema.String,
});

export type Video = Schema.Schema.Type<typeof Video>;

const ChannelSnippet = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  customUrl: Schema.optional(Schema.String),
  publishedAt: Schema.String,
  thumbnails: Thumbnails,
  defaultLanguage: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
});

const ChannelContentDetails = Schema.Struct({
  relatedPlaylists: Schema.Struct({
    uploads: Schema.optional(Schema.String),
    likes: Schema.optional(Schema.String),
    favorites: Schema.optional(Schema.String),
  }),
});

const ChannelStatistics = Schema.Struct({
  viewCount: Schema.optional(Schema.String),
  subscriberCount: Schema.optional(Schema.String),
  hiddenSubscriberCount: Schema.optional(Schema.Boolean),
  videoCount: Schema.optional(Schema.String),
});

const ChannelStatus = Schema.Struct({
  privacyStatus: Schema.String,
  isLinked: Schema.optional(Schema.Boolean),
  longUploadsStatus: Schema.optional(Schema.String),
  madeForKids: Schema.optional(Schema.Boolean),
  selfDeclaredMadeForKids: Schema.optional(Schema.Boolean),
});

// Raw YouTube API channel schema (internal use only)
export const RawChannel = Schema.Struct({
  kind: Schema.Literal("youtube#channel"),
  etag: Schema.String,
  id: ChannelId,
  snippet: ChannelSnippet,
  contentDetails: Schema.optional(ChannelContentDetails),
  statistics: Schema.optional(ChannelStatistics),
  status: Schema.optional(ChannelStatus),
});

export type RawChannel = Schema.Schema.Type<typeof RawChannel>;

// Simplified channel schema for application use
export const Channel = Schema.Struct({
  id: ChannelId,
  title: Schema.String,
  description: Schema.String,
  customUrl: Schema.optional(Schema.String),
  publishedAt: Schema.String,
  thumbnails: Thumbnails,
  country: Schema.optional(Schema.String),
  viewCount: Schema.optional(Schema.String),
  subscriberCount: Schema.optional(Schema.String),
  hiddenSubscriberCount: Schema.optional(Schema.Boolean),
  videoCount: Schema.optional(Schema.String),
  privacyStatus: Schema.String,
});

export type Channel = Schema.Schema.Type<typeof Channel>;

export const Resource = Schema.Union(Video, Channel);
export type Resource = Schema.Schema.Type<typeof Resource>;

// Transformation functions from raw API types to simplified types
export const transformVideo = (rawVideo: RawVideo): Video => ({
  id: rawVideo.id,
  title: rawVideo.snippet.title,
  description: rawVideo.snippet.description,
  publishedAt: rawVideo.snippet.publishedAt,
  channelId: rawVideo.snippet.channelId,
  channelTitle: rawVideo.snippet.channelTitle,
  duration: rawVideo.contentDetails.duration,
  viewCount: rawVideo.statistics.viewCount,
  likeCount: rawVideo.statistics.likeCount,
  commentCount: rawVideo.statistics.commentCount,
  thumbnails: rawVideo.snippet.thumbnails,
  tags: rawVideo.snippet.tags,
  categoryId: rawVideo.snippet.categoryId,
  privacyStatus: rawVideo.status.privacyStatus,
});

export const transformChannel = (rawChannel: RawChannel): Channel => ({
  id: rawChannel.id,
  title: rawChannel.snippet.title,
  description: rawChannel.snippet.description,
  customUrl: rawChannel.snippet.customUrl,
  publishedAt: rawChannel.snippet.publishedAt,
  thumbnails: rawChannel.snippet.thumbnails,
  country: rawChannel.snippet.country,
  viewCount: rawChannel.statistics?.viewCount,
  subscriberCount: rawChannel.statistics?.subscriberCount,
  hiddenSubscriberCount: rawChannel.statistics?.hiddenSubscriberCount,
  videoCount: rawChannel.statistics?.videoCount,
  privacyStatus: rawChannel.status?.privacyStatus ?? "public",
});
