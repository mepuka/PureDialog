import { Schema } from "effect"

/**
 * Base error for gcloud CLI operations
 */
export class GcloudError extends Schema.TaggedError<GcloudError>()("GcloudError", {
  message: Schema.String,
  command: Schema.String,
  exitCode: Schema.Number,
  stderr: Schema.optional(Schema.String)
}) {}

/**
 * Defect when gcloud CLI is not installed or not in PATH
 */
export class GcloudNotInstalledDefect extends Schema.TaggedError<GcloudNotInstalledDefect>()("GcloudNotInstalled", {
  message: Schema.String
}) {}

/**
 * Defect when gcloud output can't be parsed
 */
export class InvalidGcloudOutputDefect extends Schema.TaggedError<InvalidGcloudOutputDefect>()("InvalidGcloudOutput", {
  message: Schema.String,
  command: Schema.String,
  output: Schema.String
}) {}
