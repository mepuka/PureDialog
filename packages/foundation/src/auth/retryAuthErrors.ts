import { Effect, Schedule } from "effect"
import { NotAuthenticatedError } from "../errors/index.js"

/**
 * Standard retry policy for authentication errors
 *
 * Retries operations when NotAuthenticatedError occurs, propagates all other errors.
 * Uses exponential backoff with a maximum of 3 retries.
 *
 * @param self - Effect to retry on authentication errors
 * @returns Effect with retry policy applied
 *
 * @example
 * ```typescript
 * const program = Effect.gen(function*() {
 *   const cli = yield* GcloudCli
 *   return yield* cli.runJson(["projects", "list"], ProjectListSchema)
 * }).pipe(
 *   retryAuthErrors,
 *   Effect.provide(GcloudCliLive),
 *   Effect.provide(GcloudAuthLive)
 * )
 * ```
 */
export const retryAuthErrors = <A, E, R>(
  self: Effect.Effect<A, E | NotAuthenticatedError, R>
): Effect.Effect<A, E | NotAuthenticatedError, R> =>
  Effect.retry(self, {
    schedule: Schedule.exponential("100 millis").pipe(Schedule.compose(Schedule.recurs(3))),
    while: (error): error is NotAuthenticatedError => error instanceof NotAuthenticatedError
  })
