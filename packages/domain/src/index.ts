/**
 * PureDialog Domain Package
 *
 * Clean, organized domain types with namespaces to avoid circular dependencies
 * and provide clear separation of concerns.
 */

// Core domain types - fundamental building blocks
export * as Core from "./core/index.js"

// Media-related types - resources, metadata, speakers
export * as Media from "./media/index.js"

// Transcription-related types - transcripts, context, inference
export * as Transcription from "./transcription/index.js"

// Job processing types - status, entities, requests, responses
export * as Jobs from "./jobs/index.js"

// YouTube-specific types and utilities
export * as YouTube from "./youtube/index.js"

// Error types and schemas
export * as Errors from "./errors/index.js"

// Event schemas (CloudEvents, GCS)
export * as CloudEvents from "./cloudevents/index.js"

// Worker schemas (HTTP contracts, errors)
export * as Workers from "./workers/index.js"
