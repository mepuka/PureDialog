import type { MediaResource } from "@puredialog/domain"
import { Data, Effect, Hash } from "effect"
import { ValidationError } from "../errors.js"

/**
 * Idempotency key composition using Effect Data for value-based equality
 */
export class IdempotencyKey extends Data.TaggedClass("IdempotencyKey")<{
  readonly requestKey: string // User-provided unique identifier
  readonly endpoint: string // API endpoint path ("/jobs")
  readonly mediaHash: string // Hash of media resource for uniqueness
}> {}

/**
 * Validate user-provided idempotency key format
 */
export const validateUserKey = (userKey: string): Effect.Effect<string, ValidationError> =>
  Effect.gen(function*() {
    // Check length (1-128 characters)
    if (userKey.length < 1 || userKey.length > 128) {
      return yield* Effect.fail(ValidationError.invalidUserKey(
        `Idempotency key must be 1-128 characters, got ${userKey.length}`,
        userKey
      ))
    }

    // Check format (alphanumeric, hyphens, underscores)
    const validPattern = /^[a-zA-Z0-9_-]+$/
    if (!validPattern.test(userKey)) {
      return yield* Effect.fail(ValidationError.invalidUserKey(
        "Idempotency key must contain only alphanumeric characters, hyphens, and underscores",
        userKey
      ))
    }

    return userKey
  })

/**
 * Generate deterministic hash of media resource for uniqueness using Effect Hash
 */
export const generateMediaHash = (media: MediaResource): Effect.Effect<string, never> =>
  Effect.sync(() => {
    // Extract media URL for hashing
    const mediaUrl = extractMediaUrl(media)

    // Use Effect's Hash module to generate hash from URL
    const hashValue = Hash.hash(mediaUrl)

    // Convert to hex string and take first 16 characters
    return Math.abs(hashValue).toString(16).substring(0, 16)
  })

/**
 * Generate complete idempotency key from components using Effect Data
 */
export const generateIdempotencyKey = (
  userKey: string,
  endpoint: string,
  media: MediaResource
): Effect.Effect<IdempotencyKey, ValidationError> =>
  Effect.gen(function*() {
    // Validate user key format
    const validatedKey = yield* validateUserKey(userKey)

    // Generate deterministic hash of media resource
    const mediaHash = yield* generateMediaHash(media)

    // Create idempotency key using Effect Data for value-based equality
    return new IdempotencyKey({
      requestKey: validatedKey,
      endpoint,
      mediaHash
    })
  })

/**
 * Extract media URL for idempotency mapping using Effect Data
 */
export const extractMediaUrl = (media: MediaResource): string => {
  if (media.type === "youtube") {
    return `https://www.youtube.com/watch?v=${media.data.id}`
  }
  // For future media types, implement URL extraction
  return JSON.stringify(media)
}

/**
 * Hash idempotency key for storage using Effect Hash
 */
export const hashIdempotencyKey = (key: IdempotencyKey): Effect.Effect<string, never> =>
  Effect.sync(() => {
    // Use Effect's Hash module for consistent hashing
    const hashValue = Hash.hash(key)
    return Math.abs(hashValue).toString(16)
  })

/**
 * Convert idempotency key to string representation
 */
export const idempotencyKeyToString = (key: IdempotencyKey): string =>
  `${key.requestKey}:${key.endpoint}:${key.mediaHash}`

/**
 * Check if idempotency record is expired (24 hours)
 */
export const isIdempotencyExpired = (createdAt: string): boolean => {
  const created = new Date(createdAt)
  const now = new Date()
  const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  return (now.getTime() - created.getTime()) > twentyFourHours
}
