import { assert, describe, it } from "@effect/vitest"
import { Effect, Either, Schema } from "effect"
import {
  CloudRunServiceName,
  CloudRunServiceStatus,
  CloudRunServiceUrl,
  DeployedCloudRunServiceSchema
} from "../../src/index.js"

describe("CloudRunServiceName", () => {
  it("accepts valid service names", () =>
    Effect.gen(function*() {
      const validNames = [
        "worker-transcription",
        "api-gateway",
        "a",
        "a-b-c-1-2-3"
      ]

      for (const name of validNames) {
        const decoded = yield* Schema.decode(CloudRunServiceName)(name)
        assert.strictEqual(decoded, name)
      }
    })
  )

  it("rejects invalid service names", () =>
    Effect.gen(function*() {
      const invalidNames = [
        "UPPERCASE",
        "has_underscore",
        "-starts-with-hyphen",
        "ends-with-hyphen-",
        "",
        "a".repeat(64) // too long
      ]

      for (const invalid of invalidNames) {
        const result = yield* Effect.either(Schema.decode(CloudRunServiceName)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("CloudRunServiceUrl", () => {
  it("accepts valid Cloud Run URLs", () =>
    Effect.gen(function*() {
      const validUrls = [
        "https://worker-transcription-abc123-uc.a.run.app",
        "https://api-gw-xyz789-uw.a.run.app"
      ]

      for (const url of validUrls) {
        const decoded = yield* Schema.decode(CloudRunServiceUrl)(url)
        assert.strictEqual(decoded, url)
      }
    })
  )

  it("rejects invalid URLs", () =>
    Effect.gen(function*() {
      const invalidUrls = [
        "http://insecure.a.run.app", // http not https
        "https://no-hash.a.run.app", // missing hash part
        "https://service.com", // not Cloud Run domain
        ""
      ]

      for (const invalid of invalidUrls) {
        const result = yield* Effect.either(Schema.decode(CloudRunServiceUrl)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("CloudRunServiceStatus", () => {
  it("accepts valid status literals", () =>
    Effect.gen(function*() {
      const validStatuses: Array<"READY" | "DEPLOYING" | "FAILED" | "UNKNOWN"> = [
        "READY",
        "DEPLOYING",
        "FAILED",
        "UNKNOWN"
      ]

      for (const status of validStatuses) {
        const decoded = yield* Schema.decode(CloudRunServiceStatus)(status)
        assert.strictEqual(decoded, status)
      }
    })
  )

  it("rejects invalid status values", () =>
    Effect.gen(function*() {
      const invalidStatuses = ["ready", "RUNNING", "STOPPED", ""]

      for (const invalid of invalidStatuses) {
        const result = yield* Effect.either(Schema.decode(CloudRunServiceStatus)(invalid))
        assert.isTrue(Either.isLeft(result), `Expected ${invalid} to be rejected`)
      }
    })
  )
})

describe("DeployedCloudRunService", () => {
  it("validates complete service data", () =>
    Effect.gen(function*() {
      const serviceData = {
        name: "worker-transcription" as any,
        projectId: "test-project-123" as any,
        region: "us-west1" as any,
        url: "https://worker-transcription-abc123-uw.a.run.app" as any,
        image: "gcr.io/test-project-123/worker:latest" as any,
        serviceAccount: "worker@test-project-123.iam.gserviceaccount.com" as any,
        status: "READY" as const,
        latestRevision: "worker-transcription-00001-abc",
        deployedAt: "2025-01-16T12:00:00Z"
      }

      const decoded = yield* Schema.decode(DeployedCloudRunServiceSchema)(serviceData)

      assert.strictEqual(decoded.name, "worker-transcription")
      assert.strictEqual(decoded.status, "READY")
      assert.strictEqual(decoded.region, "us-west1")
    })
  )

  it("validates service with environment variables", () =>
    Effect.gen(function*() {
      const serviceData = {
        name: "api" as any,
        projectId: "prod-123" as any,
        region: "us-central1" as any,
        url: "https://api-xyz-uc.a.run.app" as any,
        image: "gcr.io/prod-123/api:v1.0.0" as any,
        serviceAccount: "api@prod-123.iam.gserviceaccount.com" as any,
        status: "READY" as const,
        latestRevision: "api-00042",
        deployedAt: "2025-01-16T14:30:00Z",
        env: {
          NODE_ENV: "production",
          LOG_LEVEL: "info"
        }
      }

      const decoded = yield* Schema.decode(DeployedCloudRunServiceSchema)(serviceData)

      assert.ok(decoded.env)
      assert.strictEqual(decoded.env.NODE_ENV, "production")
    })
  )

  it("rejects service with invalid fields", () =>
    Effect.gen(function*() {
      const invalidData = {
        name: "INVALID-NAME", // uppercase
        projectId: "test" as any,
        region: "invalid" as any,
        url: "http://not-https.com" as any,
        image: "no-tag" as any,
        serviceAccount: "not-an-email" as any,
        status: "INVALID" as const,
        latestRevision: "rev",
        deployedAt: "not-iso"
      }

      const result = yield* Effect.either(Schema.decode(DeployedCloudRunServiceSchema)(invalidData))
      assert.isTrue(Either.isLeft(result))
    })
  )
})
