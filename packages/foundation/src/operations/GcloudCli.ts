import { Context, Effect, Layer, ParseResult, Schema, Stream, String as EffectString } from "effect"
import { Command, CommandExecutor } from "@effect/platform"
import { GcloudError, GcloudNotInstalledDefect } from "../errors/index.js"

/**
 * Service for executing gcloud CLI commands
 */
export class GcloudCli extends Context.Tag("@puredialog/foundation/GcloudCli")<
  GcloudCli,
  {
    /**
     * Execute a gcloud command and parse JSON output with schema validation
     *
     * Automatically appends --format=json to the command arguments
     *
     * @param args - Command arguments (e.g., ["run", "services", "describe", "my-service"])
     * @param schema - Schema to validate and parse the JSON output
     * @returns Parsed and validated result
     * @throws GcloudError on command failure
     * @throws ParseError on JSON parse or schema validation failure
     */
    readonly runJson: <A, I, R>(
      args: ReadonlyArray<string>,
      schema: Schema.Schema<A, I, R>
    ) => Effect.Effect<A, GcloudError | ParseResult.ParseError, CommandExecutor.CommandExecutor | R>

    /**
     * Execute a gcloud command and return raw string output
     *
     * Use this for commands that don't support JSON output or when you need raw text
     *
     * @param args - Command arguments (e.g., ["projects", "list"])
     * @returns Raw stdout output as string
     * @throws GcloudError on command failure
     */
    readonly runString: (args: ReadonlyArray<string>) => Effect.Effect<string, GcloudError, CommandExecutor.CommandExecutor>
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
      Effect.gen(function*() {
        const command = Command.make("gcloud", ...args)
        const process = yield* Command.start(command)

        const [exitCode, stdout, stderr] = yield* Effect.all(
          [
            process.exitCode,
            Stream.runFold(
              Stream.decodeText(process.stdout),
              EffectString.empty,
              EffectString.concat
            ),
            Stream.runFold(
              Stream.decodeText(process.stderr),
              EffectString.empty,
              EffectString.concat
            )
          ],
          { concurrency: 3 }
        )

        if (exitCode === 0) {
          return stdout.trim()
        } else {
          return yield* Effect.fail(
            new GcloudError({
              message: stderr || `Command failed with exit code ${exitCode}`,
              command: `gcloud ${args.join(" ")}`,
              exitCode,
              stderr
            })
          )
        }
      }).pipe(
        Effect.scoped,
        Effect.mapError((error) =>
          error instanceof GcloudError
            ? error
            : new GcloudError({
                message: error instanceof Error ? error.message : String(error),
                command: `gcloud ${args.join(" ")}`,
                exitCode: -1,
                stderr: error instanceof Error ? error.message : String(error)
              })
        )
      )

    return {
      runJson: <A, I, R>(args: ReadonlyArray<string>, schema: Schema.Schema<A, I, R>) =>
        Effect.gen(function*() {
          // Append --format=json to arguments
          const jsonArgs = [...args, "--format=json"]
          const output = yield* executeCommand(jsonArgs)

          // Parse JSON
          const parsed = yield* Effect.try({
            try: () => JSON.parse(output),
            catch: (error) =>
              new GcloudError({
                message: `Failed to parse JSON output: ${error instanceof Error ? error.message : String(error)}`,
                command: `gcloud ${jsonArgs.join(" ")}`,
                exitCode: -1,
                stderr: output
              })
          })

          // Validate with schema
          return yield* Schema.decode(schema)(parsed)
        }),

      runString: executeCommand
    }
  })
)

/**
 * Test implementation - returns canned responses based on command
 */
export const GcloudCliTest = (interactions: Map<string, string | Effect.Effect<string, GcloudError, CommandExecutor.CommandExecutor>>) =>
  Layer.succeed(
    GcloudCli,
    {
      runJson: <A, I, R>(args: ReadonlyArray<string>, schema: Schema.Schema<A, I, R>) =>
        Effect.gen(function*() {
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
            output = response
          } else {
            output = yield* response
          }

          // Parse JSON
          const parsed = yield* Effect.try({
            try: () => JSON.parse(output),
            catch: (error) =>
              new GcloudError({
                message: `Failed to parse JSON output: ${error instanceof Error ? error.message : String(error)}`,
                command: `gcloud ${jsonArgs.join(" ")}`,
                exitCode: -1,
                stderr: output
              })
          })

          // Validate with schema
          return yield* Schema.decode(schema)(parsed)
        }),

      runString: (args) =>
        Effect.gen(function*() {
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
            return response
          } else {
            return yield* response
          }
        })
    }
  )
