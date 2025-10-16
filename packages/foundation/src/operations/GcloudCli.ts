import { Context, Effect, Layer, ParseResult, Schema } from "effect"
import { Command, CommandExecutor } from "@effect/platform"
import * as PlatformError from "@effect/platform/Error"
import { GcloudError, GcloudNotInstalledDefect, NotAuthenticatedError } from "../errors/index.js"
import { GcloudAuth } from "../auth/index.js"

/**
 * Service for executing gcloud CLI commands
 */
export class GcloudCli extends Context.Tag("@puredialog/foundation/GcloudCli")<
  GcloudCli,
  {
    /**
     * Execute a gcloud command and parse JSON output with schema validation
     *
     * Automatically appends --format=json to the command arguments.
     * Requires authentication via GcloudAuth.
     *
     * @param args - Command arguments (e.g., ["run", "services", "describe", "my-service"])
     * @param schema - Schema to validate and parse the JSON output
     * @returns Parsed and validated result
     * @throws GcloudError on command failure
     * @throws NotAuthenticatedError if not authenticated
     * @throws ParseError on JSON parse or schema validation failure
     * @throws PlatformError.PlatformError on platform/system errors
     */
    readonly runJson: <A, I, R>(
      args: ReadonlyArray<string>,
      schema: Schema.Schema<A, I, R>
    ) => Effect.Effect<A, GcloudError | ParseResult.ParseError | PlatformError.PlatformError | NotAuthenticatedError, GcloudAuth | CommandExecutor.CommandExecutor | R>

    /**
     * Execute a gcloud command and return raw string output
     *
     * Use this for commands that don't support JSON output or when you need raw text.
     * Requires authentication via GcloudAuth.
     *
     * @param args - Command arguments (e.g., ["projects", "list"])
     * @returns Raw stdout output as string
     * @throws GcloudError on command failure
     * @throws NotAuthenticatedError if not authenticated
     * @throws PlatformError.PlatformError on platform/system errors
     */
    readonly runString: (args: ReadonlyArray<string>) => Effect.Effect<string, GcloudError | PlatformError.PlatformError | NotAuthenticatedError, GcloudAuth | CommandExecutor.CommandExecutor>

    /**
     * Get gcloud CLI version (no authentication required)
     *
     * @returns Version string
     * @throws GcloudError on command failure
     * @throws PlatformError.PlatformError on platform/system errors
     */
    readonly version: () => Effect.Effect<string, GcloudError | PlatformError.PlatformError, CommandExecutor.CommandExecutor>
  }
>() {}

/**
 * Live implementation - calls real gcloud CLI
 */
export const GcloudCliLive = Layer.effect(
  GcloudCli,
  Effect.gen(function*() {
    // Check if gcloud is installed
    const checkResult = yield* Command.exitCode(Command.make("which", "gcloud")).pipe(
      Effect.catchAll(() => Effect.succeed(1))
    )

    if (checkResult !== 0) {
      return yield* Effect.die(
        new GcloudNotInstalledDefect({
          message: "gcloud CLI not found in PATH. Please install Google Cloud SDK."
        })
      )
    }

    // Helper to execute gcloud command and return stdout
    const executeCommand = (args: ReadonlyArray<string>) =>
      Command.string(Command.make("gcloud", ...args)).pipe(
        Effect.mapError((error) =>
          new GcloudError({
            message: error.message || String(error),
            command: `gcloud ${args.join(" ")}`,
            exitCode: -1,
            stderr: error.message || String(error)
          })
        ),
        Effect.map((output) => output.trim())
      )

    return {
      runJson: <A, I, R>(args: ReadonlyArray<string>, schema: Schema.Schema<A, I, R>) =>
        Effect.gen(function*() {
          // Check authentication first
          const auth = yield* GcloudAuth
          yield* auth.ensureAuthenticated()

          // Append --format=json to arguments
          const jsonArgs = [...args, "--format=json"]
          const output = yield* Command.string(Command.make("gcloud", ...jsonArgs)).pipe(
            Effect.map((s) => s.trim())
          )

          // Parse JSON and validate with schema in one step
          return yield* Schema.decodeUnknown(Schema.parseJson(schema))(output)
        }),

      runString: (args) =>
        Effect.gen(function*() {
          // Check authentication first
          const auth = yield* GcloudAuth
          yield* auth.ensureAuthenticated()

          return yield* executeCommand(args)
        }),

      version: () => executeCommand(["version"])
    }
  })
)

/**
 * Test implementation - returns canned responses based on command
 */
export const GcloudCliTest = (
  interactions: Map<string, string | Effect.Effect<string, GcloudError | PlatformError.PlatformError, CommandExecutor.CommandExecutor>>
) =>
  Layer.succeed(
    GcloudCli,
    {
      runJson: <A, I, R>(args: ReadonlyArray<string>, schema: Schema.Schema<A, I, R>) =>
        Effect.gen(function*() {
          // Check authentication first
          const auth = yield* GcloudAuth
          yield* auth.ensureAuthenticated()

          // Append --format=json to match live implementation
          const jsonArgs = [...args, "--format=json"]
          const key = jsonArgs.join(" ")
          const response = interactions.get(key)

          if (!response) {
            return yield* Effect.die(
              new Error(`Unexpected gcloud command in test: gcloud ${key}`)
            )
          }

          // Get raw string output
          let output: string
          if (typeof response === "string") {
            yield* Effect.sleep("10 millis")
            output = response.trim()
          } else {
            output = yield* response.pipe(Effect.map((s) => s.trim()))
          }

          // Parse JSON and validate with schema in one step
          return yield* Schema.decodeUnknown(Schema.parseJson(schema))(output)
        }),

      runString: (args) =>
        Effect.gen(function*() {
          // Check authentication first
          const auth = yield* GcloudAuth
          yield* auth.ensureAuthenticated()

          const key = args.join(" ")
          const response = interactions.get(key)

          if (!response) {
            return yield* Effect.die(
              new Error(`Unexpected gcloud command in test: gcloud ${key}`)
            )
          }

          // Allow response to be either a string or an Effect
          if (typeof response === "string") {
            // Simulate network latency
            yield* Effect.sleep("10 millis")
            return response.trim()
          } else {
            return yield* response.pipe(Effect.map((s) => s.trim()))
          }
        }),

      version: () =>
        Effect.gen(function*() {
          const key = "version"
          const response = interactions.get(key)

          if (!response) {
            return yield* Effect.die(
              new Error(`Unexpected gcloud command in test: gcloud ${key}`)
            )
          }

          // Allow response to be either a string or an Effect
          if (typeof response === "string") {
            yield* Effect.sleep("10 millis")
            return response.trim()
          } else {
            return yield* response.pipe(Effect.map((s) => s.trim()))
          }
        })
    }
  )
