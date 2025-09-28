import { assert, describe, it } from "@effect/vitest"
import {
  extractMediaUrl,
  generateIdempotencyKey,
  generateMediaHash,
  hashIdempotencyKey,
  IdempotencyKey,
  idempotencyKeyFromString,
  idempotencyKeyToString,
  isIdempotencyExpired
} from "@puredialog/storage"
import { Effect } from "effect"
import { createAlternateMediaResource, createTestMediaResource } from "./fixtures/jobs.js"

describe("Idempotency Logic", () => {
  describe("generateMediaHash", () => {
    it("should generate consistent hash for same media", () => {
      const media1 = createTestMediaResource()
      const media2 = createTestMediaResource()

      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)

      assert.strictEqual(hash1, hash2)
      assert.isTrue(hash1.length <= 16) // Up to 16 characters of hex
      assert.isTrue(hash1.length > 0) // Must have some content
    })

    it("should generate different hashes for different media", () => {
      const media1 = createTestMediaResource()
      const media2 = createAlternateMediaResource()

      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)

      assert.notStrictEqual(hash1, hash2)
    })

    it("should generate deterministic hashes", () => {
      const media = createTestMediaResource()

      // Generate hash multiple times
      const hashes = Array.from({ length: 5 }, () => generateMediaHash(media))

      // All hashes should be identical
      hashes.forEach((hash) => {
        assert.strictEqual(hash, hashes[0])
      })
    })

    it("should generate hex string of correct length", () => {
      const media = createTestMediaResource()
      const hash = generateMediaHash(media)

      assert.isTrue(/^[0-9a-f]+$/.test(hash)) // Valid hex string
      assert.isTrue(hash.length <= 16) // Limited to 16 characters
      assert.isTrue(hash.length > 0) // Must have content
    })
  })

  describe("generateIdempotencyKey", () => {
    it("should generate idempotency key with correct structure", () => {
      const media = createTestMediaResource()
      const endpoint = "/jobs"

      const key = generateIdempotencyKey(endpoint, media)

      assert.isTrue(key instanceof IdempotencyKey)
      assert.strictEqual(key.endpoint, endpoint)
      assert.isDefined(key.requestKey)
      assert.isDefined(key.mediaHash)
    })

    it("should generate different request keys on each call", () => {
      const media = createTestMediaResource()
      const endpoint = "/jobs"

      const key1 = generateIdempotencyKey(endpoint, media)
      const key2 = generateIdempotencyKey(endpoint, media)

      // Request keys should be different (UUIDs)
      assert.notStrictEqual(key1.requestKey, key2.requestKey)

      // But media hashes should be the same
      assert.strictEqual(key1.mediaHash, key2.mediaHash)
      assert.strictEqual(key1.endpoint, key2.endpoint)
    })

    it("should generate same media hash for same media", () => {
      const media = createTestMediaResource()

      const key1 = generateIdempotencyKey("/jobs", media)
      const key2 = generateIdempotencyKey("/jobs", media)

      assert.strictEqual(key1.mediaHash, key2.mediaHash)
    })
  })

  describe("extractMediaUrl", () => {
    it("should extract correct YouTube URL", () => {
      const media = createTestMediaResource()

      const url = extractMediaUrl(media)

      assert.strictEqual(url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    })

    it("should extract different URLs for different videos", () => {
      const media1 = createTestMediaResource()
      const media2 = createAlternateMediaResource()

      const url1 = extractMediaUrl(media1)
      const url2 = extractMediaUrl(media2)

      assert.notStrictEqual(url1, url2)
      assert.isTrue(url1.includes("dQw4w9WgXcQ"))
      assert.isTrue(url2.includes("9bZkp7q19f0"))
    })

    it("should handle non-YouTube media gracefully", () => {
      const customMedia = {
        type: "custom" as any,
        data: { url: "https://example.com/video.mp4" }
      }

      const url = extractMediaUrl(customMedia)

      // Should return JSON string for unknown media types
      assert.isTrue(url.includes("custom"))
      assert.isTrue(url.includes("https://example.com/video.mp4"))
    })
  })

  describe("hashIdempotencyKey", () => {
    it.effect("should hash idempotency key consistently", () =>
      Effect.gen(function*() {
        const key = generateIdempotencyKey("/jobs", createTestMediaResource())

        const hash1 = yield* hashIdempotencyKey(key)
        const hash2 = yield* hashIdempotencyKey(key)

        assert.strictEqual(hash1, hash2)
        assert.isTrue(/^[0-9a-f]+$/.test(hash1)) // Hex string
      }))

    it.effect("should generate different hashes for different keys", () =>
      Effect.gen(function*() {
        const key1 = generateIdempotencyKey("/jobs", createTestMediaResource())
        const key2 = generateIdempotencyKey("/transcripts", createTestMediaResource())

        const hash1 = yield* hashIdempotencyKey(key1)
        const hash2 = yield* hashIdempotencyKey(key2)

        assert.notStrictEqual(hash1, hash2)
      }))
  })

  describe("idempotencyKeyToString and idempotencyKeyFromString", () => {
    it("should serialize and deserialize correctly", () => {
      const originalKey = generateIdempotencyKey("/jobs", createTestMediaResource())

      const serialized = idempotencyKeyToString(originalKey)
      const deserialized = idempotencyKeyFromString(serialized)

      assert.strictEqual(deserialized.requestKey, originalKey.requestKey)
      assert.strictEqual(deserialized.endpoint, originalKey.endpoint)
      assert.strictEqual(deserialized.mediaHash, originalKey.mediaHash)
    })

    it("should generate string with correct format", () => {
      const key = generateIdempotencyKey("/jobs", createTestMediaResource())

      const serialized = idempotencyKeyToString(key)

      // Should be in format: requestKey:endpoint:mediaHash
      const parts = serialized.split(":")
      assert.strictEqual(parts.length, 3)
      assert.strictEqual(parts[0], key.requestKey)
      assert.strictEqual(parts[1], key.endpoint)
      assert.strictEqual(parts[2], key.mediaHash)
    })

    it("should handle round-trip serialization", () => {
      const keys = [
        generateIdempotencyKey("/jobs", createTestMediaResource()),
        generateIdempotencyKey("/transcripts", createAlternateMediaResource()),
        generateIdempotencyKey("/analyze", createTestMediaResource())
      ]

      keys.forEach((originalKey) => {
        const serialized = idempotencyKeyToString(originalKey)
        const deserialized = idempotencyKeyFromString(serialized)
        const reserialized = idempotencyKeyToString(deserialized)

        assert.strictEqual(serialized, reserialized)
      })
    })
  })

  describe("isIdempotencyExpired", () => {
    it("should return false for recent timestamps", () => {
      const recentTime = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago

      const isExpired = isIdempotencyExpired(recentTime)

      assert.isFalse(isExpired)
    })

    it("should return true for timestamps older than 24 hours", () => {
      const oldTime = new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() // 25 hours ago

      const isExpired = isIdempotencyExpired(oldTime)

      assert.isTrue(isExpired)
    })

    it("should handle edge case exactly at 24 hours", () => {
      const exactTime = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // Exactly 24 hours

      const isExpired = isIdempotencyExpired(exactTime)

      assert.isFalse(isExpired) // Should be false since it's not > 24 hours
    })

    it("should handle edge case just over 24 hours", () => {
      const justOverTime = new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000).toISOString() // 24 hours + 1 second

      const isExpired = isIdempotencyExpired(justOverTime)

      assert.isTrue(isExpired)
    })

    it("should handle invalid date strings gracefully", () => {
      const invalidTime = "invalid-date-string"

      // Should not throw, but behavior depends on implementation
      // This test ensures it doesn't crash the system
      const result = isIdempotencyExpired(invalidTime)
      assert.isTrue(typeof result === "boolean")
    })
  })

  describe("integration scenarios", () => {
    it.effect("should handle complete idempotency workflow", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()
        const endpoint = "/jobs"

        // 1. Generate idempotency key
        const key = generateIdempotencyKey(endpoint, media)

        // 2. Serialize for storage
        const serialized = idempotencyKeyToString(key)

        // 3. Hash for lookup
        const hashedKey = yield* hashIdempotencyKey(key)

        // 4. Deserialize from storage
        const deserialized = idempotencyKeyFromString(serialized)

        // 5. Verify integrity
        assert.strictEqual(key.requestKey, deserialized.requestKey)
        assert.strictEqual(key.endpoint, deserialized.endpoint)
        assert.strictEqual(key.mediaHash, deserialized.mediaHash)

        // 6. Verify hash consistency
        const hashedDeserialized = yield* hashIdempotencyKey(deserialized)
        assert.strictEqual(hashedKey, hashedDeserialized)
      }))

    it("should handle collision detection scenario", () => {
      const media1 = createTestMediaResource()
      const media2 = createTestMediaResource() // Same media
      const media3 = createAlternateMediaResource() // Different media

      // Same media should produce same hash
      const hash1 = generateMediaHash(media1)
      const hash2 = generateMediaHash(media2)
      const hash3 = generateMediaHash(media3)

      assert.strictEqual(hash1, hash2) // Collision
      assert.notStrictEqual(hash1, hash3) // No collision
    })

    it.effect("should handle multiple endpoints with same media", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()

        const jobKey = generateIdempotencyKey("/jobs", media)
        const transcriptKey = generateIdempotencyKey("/transcripts", media)

        // Different endpoints should produce different hashed keys
        const jobHash = yield* hashIdempotencyKey(jobKey)
        const transcriptHash = yield* hashIdempotencyKey(transcriptKey)

        assert.notStrictEqual(jobHash, transcriptHash)

        // But media hashes should be the same
        assert.strictEqual(jobKey.mediaHash, transcriptKey.mediaHash)
      }))
  })

  describe("performance and consistency", () => {
    it("should be fast for repeated operations", () => {
      const media = createTestMediaResource()
      const iterations = 1000

      const start = Date.now()

      for (let i = 0; i < iterations; i++) {
        generateMediaHash(media)
      }

      const duration = Date.now() - start

      // Should complete 1000 operations in reasonable time (< 100ms)
      assert.isTrue(duration < 100)
    })

    it("should maintain consistency across multiple calls", () => {
      const media = createTestMediaResource()
      const iterations = 100

      const hashes = Array.from({ length: iterations }, () => generateMediaHash(media))

      // All hashes should be identical
      hashes.forEach((hash) => {
        assert.strictEqual(hash, hashes[0])
      })
    })

    it.effect("should handle concurrent key generation", () =>
      Effect.gen(function*() {
        const media = createTestMediaResource()

        // Generate multiple keys concurrently
        const keys = yield* Effect.all(
          Array.from({ length: 10 }, () => Effect.sync(() => generateIdempotencyKey("/jobs", media))),
          { concurrency: "unbounded" }
        )

        // All should have different request keys
        const requestKeys = keys.map((k) => k.requestKey)
        const uniqueRequestKeys = new Set(requestKeys)
        assert.strictEqual(uniqueRequestKeys.size, keys.length)

        // But all should have same media hash
        const mediaHashes = keys.map((k) => k.mediaHash)
        mediaHashes.forEach((hash) => {
          assert.strictEqual(hash, mediaHashes[0])
        })
      }))
  })
})
