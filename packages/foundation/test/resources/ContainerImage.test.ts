import { assert, describe, it } from "@effect/vitest"
import { Effect, Either, Schema } from "effect"
import { BuiltContainerImageSchema, ImageDigest, ImageTag } from "../../src/index.js"

describe("ImageDigest", () => {
  it("accepts valid SHA256 digests", () =>
    Effect.gen(function*() {
      const validDigests = [
        "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ]

      for (const digest of validDigests) {
        const decoded = yield* Schema.decode(ImageDigest)(digest)
        assert.strictEqual(decoded, digest)
      }
    })
  )

  it("rejects invalid digests", () =>
    Effect.gen(function*() {
      const invalidDigests = [
        "sha256:tooshort",
        "sha256:GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG", // invalid hex
        "md5:0123456789abcdef0123456789abcdef", // wrong algorithm
        "",
        "notadigest"
      ]

      for (const invalid of invalidDigests) {
        const result = yield* Effect.either(Schema.decode(ImageDigest)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("ImageTag", () => {
  it("accepts valid image tags", () =>
    Effect.gen(function*() {
      const validTags = [
        "latest",
        "v1.0.0",
        "main-abc123",
        "pr-456_test",
        "2025.01.16"
      ]

      for (const tag of validTags) {
        const decoded = yield* Schema.decode(ImageTag)(tag)
        assert.strictEqual(decoded, tag)
      }
    })
  )

  it("rejects invalid tags", () =>
    Effect.gen(function*() {
      const invalidTags = [
        "",
        "has spaces",
        "has/slash",
        "a".repeat(129) // too long
      ]

      for (const invalid of invalidTags) {
        const result = yield* Effect.either(Schema.decode(ImageTag)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("BuiltContainerImage", () => {
  it("validates complete image data", () =>
    Effect.gen(function*() {
      const imageData = {
        uri: "gcr.io/project/image:latest" as any,
        digest: "sha256:abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234" as any,
        tag: "latest" as any,
        projectId: "my-project" as any,
        registry: "gcr.io",
        repository: "project/image",
        builtAt: "2025-01-16T12:00:00Z",
        sizeBytes: 12345678
      }

      const decoded = yield* Schema.decode(BuiltContainerImageSchema)(imageData)

      assert.strictEqual(decoded.tag, "latest")
      assert.strictEqual(decoded.registry, "gcr.io")
      assert.strictEqual(decoded.sizeBytes, 12345678)
    })
  )

  it("validates image with commit SHA", () =>
    Effect.gen(function*() {
      const imageData = {
        uri: "gcr.io/project/app:v1.0.0" as any,
        digest: "sha256:1111111111111111111111111111111111111111111111111111111111111111" as any,
        tag: "v1.0.0" as any,
        projectId: "prod-project" as any,
        registry: "gcr.io",
        repository: "project/app",
        builtAt: "2025-01-16T15:00:00Z",
        sizeBytes: 98765432,
        commitSha: "abc123def456"
      }

      const decoded = yield* Schema.decode(BuiltContainerImageSchema)(imageData)

      assert.ok(decoded.commitSha)
      assert.strictEqual(decoded.commitSha, "abc123def456")
    })
  )

  it("rejects image with invalid digest", () =>
    Effect.gen(function*() {
      const invalidData = {
        uri: "gcr.io/project/image:latest" as any,
        digest: "not-a-valid-digest" as any,
        tag: "latest" as any,
        projectId: "my-project" as any,
        registry: "gcr.io",
        repository: "project/image",
        builtAt: "2025-01-16T12:00:00Z",
        sizeBytes: 12345678
      }

      const result = yield* Effect.either(Schema.decode(BuiltContainerImageSchema)(invalidData))
      assert.isTrue(Either.isLeft(result))
    })
  )
})
