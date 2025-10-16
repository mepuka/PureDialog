import { assert, describe, it } from "@effect/vitest"
import { Either, Effect, Schema } from "effect"
import { GcpRegion, GcpProjectId, ServiceAccountEmail, ContainerImageUri, GcsBucketName } from "../../src/types/GcpTypes.js"

describe("GcpRegion", () => {
  it.effect("accepts valid GCP regions", () =>
    Effect.gen(function*() {
      const validRegions = [
        "us-west1",
        "us-central1",
        "europe-west1",
        "asia-east1"
      ]

      for (const region of validRegions) {
        const decoded = yield* Schema.decode(GcpRegion)(region)
        assert.strictEqual(decoded, region)
      }
    })
  )

  it.effect("rejects invalid region formats", () =>
    Effect.gen(function*() {
      const invalidRegions = [
        "us-west",        // missing number
        "west1",          // missing continent
        "US-WEST1",       // uppercase
        "",               // empty
        "us_west1"        // underscore instead of hyphen
      ]

      for (const invalid of invalidRegions) {
        const result = yield* Effect.either(Schema.decode(GcpRegion)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("GcpProjectId", () => {
  it.effect("accepts valid GCP project IDs", () =>
    Effect.gen(function*() {
      const validIds = [
        "my-project-123",
        "gen-lang-client-0874846742",
        "a-b-c-d",  // minimum length
        "a" + "-".repeat(28) + "b"  // maximum length (30 chars)
      ]

      for (const id of validIds) {
        const decoded = yield* Schema.decode(GcpProjectId)(id)
        assert.strictEqual(decoded, id)
      }
    })
  )

  it.effect("rejects invalid project ID formats", () =>
    Effect.gen(function*() {
      const invalidIds = [
        "My-Project",      // uppercase
        "project_name",    // underscore
        "123",             // too short
        "a",               // too short
        "a" + "-".repeat(30) + "b",  // too long (> 30 chars)
        "-project",        // starts with hyphen
        "project-"         // ends with hyphen
      ]

      for (const invalid of invalidIds) {
        const result = yield* Effect.either(Schema.decode(GcpProjectId)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("ServiceAccountEmail", () => {
  it.effect("accepts valid service account emails", () =>
    Effect.gen(function*() {
      const validEmails = [
        "my-service@my-project.iam.gserviceaccount.com",
        "211636922435-compute@developer.gserviceaccount.com"
      ]

      for (const email of validEmails) {
        const decoded = yield* Schema.decode(ServiceAccountEmail)(email)
        assert.strictEqual(decoded, email)
      }
    })
  )

  it.effect("rejects invalid service account formats", () =>
    Effect.gen(function*() {
      const invalidEmails = [
        "not-a-service-account",
        "user@gmail.com",
        "@project.gserviceaccount.com",
        ""
      ]

      for (const invalid of invalidEmails) {
        const result = yield* Effect.either(Schema.decode(ServiceAccountEmail)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("ContainerImageUri", () => {
  it.effect("accepts valid container image URIs", () =>
    Effect.gen(function*() {
      const validUris = [
        "gcr.io/my-project/my-service:latest",
        "us-docker.pkg.dev/my-project/my-repo/my-image:v1.0.0",
        "docker.io/library/node:18-alpine"
      ]

      for (const uri of validUris) {
        const decoded = yield* Schema.decode(ContainerImageUri)(uri)
        assert.strictEqual(decoded, uri)
      }
    })
  )

  it.effect("rejects invalid image URI formats", () =>
    Effect.gen(function*() {
      const invalidUris = [
        "not-a-uri",
        "gcr.io/project/image",  // missing tag
        ":latest",               // missing registry/image
        ""
      ]

      for (const invalid of invalidUris) {
        const result = yield* Effect.either(Schema.decode(ContainerImageUri)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("GcsBucketName", () => {
  it.effect("accepts valid GCS bucket names", () =>
    Effect.gen(function*() {
      const validNames = [
        "my-bucket",
        "ingestion-shared-artifacts-7qpl58",
        "a-b",  // minimum length
        "a" + "-".repeat(59) + "b"  // maximum length (63 chars)
      ]

      for (const name of validNames) {
        const decoded = yield* Schema.decode(GcsBucketName)(name)
        assert.strictEqual(decoded, name)
      }
    })
  )

  it.effect("rejects invalid bucket name formats", () =>
    Effect.gen(function*() {
      const invalidNames = [
        "My-Bucket",      // uppercase
        "-bucket",        // starts with hyphen
        "bucket-",        // ends with hyphen
        "a",              // too short
        "a" + "-".repeat(65),  // too long
        ""
      ]

      for (const invalid of invalidNames) {
        const result = yield* Effect.either(Schema.decode(GcsBucketName)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})
