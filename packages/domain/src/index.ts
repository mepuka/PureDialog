// Core domain exports - tree-shakeable
export * from "./errors/index.js"
export * from "./schemas/index.js"
export * from "./shared/index.js"

// Commonly used YouTube utilities (tree-shakeable)
export {
  CHANNEL_URL_PATTERN,
  extractChannelId,
  // Most commonly used extractors
  extractVideoId,
  isValidYoutubeChannelUrl,
  // Most commonly used predicates
  isValidYoutubeUrl,
  // Most commonly used patterns
  WATCH_URL_PATTERN
} from "./schemas/youtube.js"

// Note: For full YouTube API, import from "@puredialog/domain/youtube"
// This keeps the main export surface minimal and tree-shakeable
