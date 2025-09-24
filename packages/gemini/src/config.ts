import { Config } from "effect";

export const GeminiConfig = Config.all({
  apiKey: Config.redacted("GEMINI_API_KEY"),
  model: Config.string("GEMINI_MODEL").pipe(
    Config.withDefault("gemini-2.5-flash"),
  ),
  timeout: Config.number("GEMINI_TIMEOUT").pipe(
    Config.withDefault(30000),
  ),
  maxRetries: Config.number("GEMINI_MAX_RETRIES").pipe(
    Config.withDefault(3),
  ),
  backoff: Config.number("GEMINI_BACKOFF").pipe(
    Config.withDefault(1000),
  ),
});
