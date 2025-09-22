import { Config, Context, Duration, Effect, Layer, Secret } from "effect";
import { YoutubeApiError } from "./errors.js";

export interface YoutubeConfigInterface {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeout: Duration.Duration;
  readonly retryAttempts: number;
}

export class YoutubeConfig extends Context.Tag("YoutubeConfig")<
  YoutubeConfig,
  YoutubeConfigInterface
>() {}

const YoutubeConfigSchema = {
  apiKey: Config.secret("YOUTUBE_API_KEY"),
  baseUrl: Config.string("YOUTUBE_API_BASE_URL").pipe(
    Config.withDefault("https://www.googleapis.com/youtube/v3"),
  ),
  timeout: Config.duration("YOUTUBE_API_TIMEOUT").pipe(
    Config.withDefault(Duration.seconds(30)),
  ),
  retryAttempts: Config.number("YOUTUBE_API_RETRY_ATTEMPTS").pipe(
    Config.withDefault(3),
  ),
};

const makeConfig = Effect.gen(function*() {
  const apiKeySecret = yield* YoutubeConfigSchema.apiKey;
  const baseUrl = yield* YoutubeConfigSchema.baseUrl;
  const timeout = yield* YoutubeConfigSchema.timeout;
  const retryAttempts = yield* YoutubeConfigSchema.retryAttempts;

  // Convert secret to string
  const apiKey = Secret.value(apiKeySecret);

  // Validate API key format
  if (!apiKey || apiKey.length < 20) {
    return yield* Effect.fail(
      YoutubeApiError.configurationError("Invalid API key format"),
    );
  }

  // Validate retry attempts
  if (retryAttempts < 0 || retryAttempts > 10) {
    return yield* Effect.fail(
      YoutubeApiError.configurationError(
        "Retry attempts must be between 0 and 10",
      ),
    );
  }

  return {
    apiKey,
    baseUrl,
    timeout,
    retryAttempts,
  } as const;
});

export const YoutubeConfigLive = Layer.effect(YoutubeConfig, makeConfig);
