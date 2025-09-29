import { Schema } from "effect"

/**
 * Inference configuration types and schemas
 */

/**
 * InferenceConfig captures the model configuration used for transcript generation.
 * This enables reproducibility and tracking of generation parameters.
 */
export const InferenceConfig = Schema.Struct({
  model: Schema.String,
  temperature: Schema.Number,
  maxTokens: Schema.optional(Schema.Number),
  additionalParams: Schema.optional(Schema.Record({
    key: Schema.String,
    value: Schema.Unknown
  }))
})

export type InferenceConfig = Schema.Schema.Type<typeof InferenceConfig>
