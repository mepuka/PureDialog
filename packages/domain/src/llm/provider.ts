import { Schema } from "effect"

/**
 * LLM provider configuration schemas
 */

/**
 * Gemini-specific provider configuration.
 * Captures model, temperature, and media resolution settings.
 */
export const GeminiProviderConfig = Schema.Struct({
  provider: Schema.Literal("gemini"),
  model: Schema.String.pipe(
    Schema.annotations({
      description: "Gemini model identifier (e.g., 'gemini-2.0-flash-exp')"
    })
  ),
  temperature: Schema.Number.pipe(
    Schema.between(0, 2),
    Schema.annotations({
      description: "Sampling temperature for generation (0-2)"
    })
  ),
  mediaResolution: Schema.optional(
    Schema.Literal("low", "high").pipe(
      Schema.annotations({
        description: "Media resolution for video/audio processing"
      })
    )
  )
}).annotations({
  description: "Gemini LLM provider configuration"
})
export type GeminiProviderConfig = Schema.Schema.Type<typeof GeminiProviderConfig>

/**
 * Union of all supported LLM provider configurations.
 * Currently only Gemini, extensible for future providers.
 */
export const ProviderConfig = Schema.Union(GeminiProviderConfig).annotations({
  description: "LLM provider configuration (currently Gemini only)"
})
export type ProviderConfig = Schema.Schema.Type<typeof ProviderConfig>
