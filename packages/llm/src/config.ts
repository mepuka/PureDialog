import type { LLM } from "@puredialog/domain"
import { Config } from "effect"

export const GeminiConfig = Config.all({
  apiKey: Config.redacted("GEMINI_API_KEY"),
  model: Config.string("GEMINI_MODEL").pipe(
    Config.withDefault("gemini-2.5-flash")
  ),
  temperature: Config.number("GEMINI_TEMPERATURE").pipe(
    Config.withDefault(0.0)
  ),
  timeout: Config.number("GEMINI_TIMEOUT_").pipe(
    Config.withDefault(30000)
  ),
  maxRetries: Config.number("GEMINI_MAX_RETRIES").pipe(
    Config.withDefault(3)
  ),
  backoff: Config.number("GEMINI_BACKOFF").pipe(
    Config.withDefault(1000)
  )
})

/**
 * Convert Effect Config to domain ProviderConfig schema.
 */
export const toProviderConfig = (config: Config.Config.Success<typeof GeminiConfig>): LLM.GeminiProviderConfig => ({
  provider: "gemini" as const,
  model: config.model,
  temperature: config.temperature,
  mediaResolution: "low"
})
