import { Schema } from "effect"

/**
 * Prompt and generation tracking types and schemas
 */

/**
 * GenerationPrompt tracks the exact compiled prompt used for transcript generation.
 * This provides full traceability and enables reproducibility of results.
 */
export const GenerationPrompt = Schema.Struct({
  // Identifies the base template used for compilation
  templateId: Schema.String,
  templateVersion: Schema.String,
  // The final, full prompt text sent to the LLM
  compiledText: Schema.String,
  // Parameters used during prompt compilation
  compilationParams: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown
  }),
  compiledAt: Schema.Date
})

export type GenerationPrompt = Schema.Schema.Type<typeof GenerationPrompt>
