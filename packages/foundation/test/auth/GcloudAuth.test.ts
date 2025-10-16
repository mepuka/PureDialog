import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import {
  GcloudAuth,
  GcloudAuthTest,
  GcloudAuthTestUnauthenticated,
  NotAuthenticatedError
} from "../../src/index.js"

describe("GcloudAuth", () => {
  describe("Test layer - authenticated", () => {
    it.effect("ensureAuthenticated succeeds with test layer", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth
        yield* auth.ensureAuthenticated()
        // Should not throw
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any))
      )
    )

    it.effect("getActiveAccount returns test account", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth
        const account = yield* auth.getActiveAccount()

        assert.strictEqual(account, "test@test-project.iam.gserviceaccount.com")
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any))
      )
    )

    it.effect("getAuthTimestamp returns custom timestamp", () =>
      Effect.gen(function*() {
        const testTimestamp = 1234567890
        const auth = yield* GcloudAuth
        const timestamp = yield* auth.getAuthTimestamp()

        assert.strictEqual(timestamp, testTimestamp)
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any, 1234567890))
      )
    )

    it.effect("getAuthTimestamp returns current time when not specified", () =>
      Effect.gen(function*() {
        const before = Date.now()
        const auth = yield* GcloudAuth
        const timestamp = yield* auth.getAuthTimestamp()
        const after = Date.now()

        // Timestamp should be between before and after
        assert.isTrue(timestamp >= before && timestamp <= after)
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any))
      )
    )
  })

  describe("Test layer - unauthenticated", () => {
    it.effect("ensureAuthenticated fails with unauthenticated layer", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth
        const error = yield* Effect.flip(auth.ensureAuthenticated())

        assert.isTrue(error instanceof NotAuthenticatedError)
        assert.include(error.message, "Not authenticated")
      }).pipe(Effect.provide(GcloudAuthTestUnauthenticated))
    )

    it.effect("getActiveAccount fails with unauthenticated layer", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth
        const error = yield* Effect.flip(auth.getActiveAccount())

        assert.isTrue(error instanceof NotAuthenticatedError)
        assert.include(error.message, "Not authenticated")
      }).pipe(Effect.provide(GcloudAuthTestUnauthenticated))
    )

    it.effect("getAuthTimestamp returns 0 for unauthenticated layer", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth
        const timestamp = yield* auth.getAuthTimestamp()

        assert.strictEqual(timestamp, 0)
      }).pipe(Effect.provide(GcloudAuthTestUnauthenticated))
    )
  })

  describe("Timestamp caching", () => {
    it.effect("timestamp remains constant across multiple calls", () =>
      Effect.gen(function*() {
        const testTimestamp = 1000
        const auth = yield* GcloudAuth

        const timestamp1 = yield* auth.getAuthTimestamp()
        const timestamp2 = yield* auth.getAuthTimestamp()

        // Should be the same timestamp (cached)
        assert.strictEqual(timestamp1, testTimestamp)
        assert.strictEqual(timestamp2, testTimestamp)
        assert.strictEqual(timestamp1, timestamp2)
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any, 1000))
      )
    )

    it.effect("account remains constant across multiple calls", () =>
      Effect.gen(function*() {
        const auth = yield* GcloudAuth

        const account1 = yield* auth.getActiveAccount()
        const account2 = yield* auth.getActiveAccount()

        assert.strictEqual(account1, account2)
      }).pipe(
        Effect.provide(GcloudAuthTest("test@test-project.iam.gserviceaccount.com" as any))
      )
    )
  })
})
