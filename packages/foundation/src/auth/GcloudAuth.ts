import { Command } from "@effect/platform"
import { Context, Effect, Layer, Schema } from "effect"
import { GcloudError, NotAuthenticatedError } from "../errors/index.js"
import { ServiceAccountEmail } from "../types/index.js"

/**
 * Timestamped authentication cache
 */
interface AuthenticationCache {
  readonly account: ServiceAccountEmail
  readonly timestamp: number // Date.now() in milliseconds
}

/**
 * Service for managing gcloud authentication state
 *
 * Checks authentication eagerly at layer construction and caches the result
 * with a timestamp for future staleness detection.
 */
export class GcloudAuth extends Context.Tag("@puredialog/foundation/GcloudAuth")<
  GcloudAuth,
  {
    /**
     * Ensures the user is authenticated with gcloud
     *
     * Uses cached authentication check from layer construction.
     * Future: Can add staleness checks and re-authentication.
     *
     * @returns void on success
     * @throws NotAuthenticatedError if not authenticated
     */
    readonly ensureAuthenticated: () => Effect.Effect<void, NotAuthenticatedError>

    /**
     * Get the active gcloud account email
     *
     * @returns ServiceAccountEmail of the authenticated user
     * @throws NotAuthenticatedError if not authenticated
     */
    readonly getActiveAccount: () => Effect.Effect<ServiceAccountEmail, NotAuthenticatedError>

    /**
     * Get the timestamp when authentication was last checked
     *
     * Useful for future staleness detection combinators.
     *
     * @returns Timestamp in milliseconds (Date.now())
     */
    readonly getAuthTimestamp: () => Effect.Effect<number>
  }
>() {}

/**
 * Schema for parsing `gcloud auth list --format=json` output
 */
const AuthListItemSchema = Schema.Struct({
  account: Schema.String,
  status: Schema.String
})

const AuthListSchema = Schema.Array(AuthListItemSchema)

/**
 * Live implementation - checks gcloud auth eagerly at layer construction
 */
export const GcloudAuthLive = Layer.effect(
  GcloudAuth,
  Effect.gen(function*() {
    // Check authentication eagerly by running `gcloud auth list`
    const authListJson = yield* Command.string(
      Command.make("gcloud", "auth", "list", "--filter=status:ACTIVE", "--format=json")
    ).pipe(
      Effect.mapError((error) =>
        new GcloudError({
          message: error.message || String(error),
          command: "gcloud auth list --filter=status:ACTIVE --format=json",
          exitCode: -1,
          stderr: error.message || String(error)
        })
      ),
      Effect.map((s) => s.trim())
    )

    // Parse and validate the auth list
    const authList = yield* Schema.decodeUnknown(Schema.parseJson(AuthListSchema))(authListJson)

    // Check if there's an active account
    if (authList.length === 0) {
      return yield* Effect.fail(
        new NotAuthenticatedError({
          message: "No active gcloud account found. Please run `gcloud auth login`."
        })
      )
    }

    // Validate the account email is a valid ServiceAccountEmail
    const activeAccount = authList[0].account
    const validatedAccount = yield* Schema.decode(ServiceAccountEmail)(activeAccount).pipe(
      Effect.mapError((parseError) =>
        new NotAuthenticatedError({
          message: `Active account "${activeAccount}" is not a valid service account email: ${parseError}`
        })
      )
    )

    // Create timestamped cache
    const cache: AuthenticationCache = {
      account: validatedAccount,
      timestamp: Date.now()
    }

    return {
      ensureAuthenticated: () => Effect.void,
      getActiveAccount: () => Effect.succeed(cache.account),
      getAuthTimestamp: () => Effect.succeed(cache.timestamp)
    }
  })
)

/**
 * Test implementation - provides a mock authenticated state
 */
export const GcloudAuthTest = (account: ServiceAccountEmail, timestamp?: number) =>
  Layer.succeed(GcloudAuth, {
    ensureAuthenticated: () => Effect.void,
    getActiveAccount: () => Effect.succeed(account),
    getAuthTimestamp: () => Effect.succeed(timestamp ?? Date.now())
  })

/**
 * Test implementation for unauthenticated state
 */
export const GcloudAuthTestUnauthenticated = Layer.succeed(GcloudAuth, {
  ensureAuthenticated: () =>
    Effect.fail(
      new NotAuthenticatedError({
        message: "Not authenticated (test mode)"
      })
    ),
  getActiveAccount: () =>
    Effect.fail(
      new NotAuthenticatedError({
        message: "Not authenticated (test mode)"
      })
    ),
  getAuthTimestamp: () => Effect.succeed(0)
})
