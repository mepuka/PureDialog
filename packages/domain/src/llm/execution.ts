import { Schema } from "effect"

/**
 * LLM execution metadata and token usage schemas
 */

/**
 * Token usage statistics from LLM execution.
 */
export const TokenUsage = Schema.Struct({
  promptTokens: Schema.Int.pipe(
    Schema.nonNegative(),
    Schema.annotations({
      description: "Number of tokens in the prompt"
    })
  ),
  completionTokens: Schema.Int.pipe(
    Schema.nonNegative(),
    Schema.annotations({
      description: "Number of tokens in the completion"
    })
  ),
  totalTokens: Schema.Int.pipe(
    Schema.nonNegative(),
    Schema.annotations({
      description: "Total tokens used (prompt + completion)"
    })
  )
}).annotations({
  description: "Token usage statistics from LLM execution"
})
export type TokenUsage = Schema.Schema.Type<typeof TokenUsage>

/**
 * Execution timing and resource usage metadata.
 * Captures when execution occurred, duration, and token usage.
 */
export const LLMExecutionMetadata = Schema.Struct({
  executedAt: Schema.Date.pipe(
    Schema.annotations({
      description: "Timestamp when LLM execution started"
    })
  ),
  durationMs: Schema.Int.pipe(
    Schema.positive(),
    Schema.annotations({
      description: "Execution duration in milliseconds"
    })
  ),
  tokens: TokenUsage
}).annotations({
  description: "LLM execution timing and token usage metadata"
})
export type LLMExecutionMetadata = Schema.Schema.Type<typeof LLMExecutionMetadata>
