// YouTube API Client Package
// Main exports for the YouTube Data API v3 client

export * from "./client.ts";
export * from "./config.ts";
export * from "./errors.ts";
export * from "./resources.ts";

// Re-export specific utilities
export { makeChannelRequest, makeVideoRequest } from "./internal/requests.ts";
export { decodeChannelResponse, decodeVideoResponse, extractChannels, extractVideos } from "./internal/responses.ts";
export { transformHttpError, withRetry } from "./internal/retry.ts";
