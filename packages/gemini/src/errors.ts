import { Data } from "effect";

export type GeminiError =
  | ConfigurationError
  | ApiError
  | NetworkError
  | RateLimitedError
  | ValidationError
  | CancelledError;

export class ConfigurationError extends Data.TaggedError("ConfigurationError")<{ message: string }> {}
export class ApiError extends Data.TaggedError("ApiError")<{ message: string }> {}
export class NetworkError extends Data.TaggedError("NetworkError")<{ message: string }> {}
export class RateLimitedError extends Data.TaggedError("RateLimitedError")<{ message: string }> {}
export class ValidationError extends Data.TaggedError("ValidationError")<{ message: string }> {}
export class CancelledError extends Data.TaggedError("CancelledError")<{ message: string }> {}
