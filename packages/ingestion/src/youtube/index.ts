// YouTube API Client Package
// Main exports for the YouTube Data API v3 client

export * from "./client.js"
export * from "./config.js"
export * from "./errors.js"

// Re-export specific utilities
export { makeChannelRequest, makeVideoRequest } from "./internal/requests.js"
export { decodeChannelResponse, decodeVideoResponse, extractChannels, extractVideos } from "./internal/responses.js"
export { transformHttpError, withRetry } from "./internal/retry.js"
