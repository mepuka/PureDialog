import { Schema } from "effect";
import { JobId, RequestId } from "./ids.js";
declare const MediaResourceError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "MediaResourceError";
} & Readonly<A>;
/** Domain-specific error for media resource issues. */
export declare class MediaResourceError extends MediaResourceError_base<{
  readonly message: string;
  readonly source: "youtube" | "upload" | "url";
  readonly resourceId?: string;
}> {
}
declare const TranscriptionError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "TranscriptionError";
} & Readonly<A>;
/** Domain-specific error for transcription processing. */
export declare class TranscriptionError extends TranscriptionError_base<{
  readonly message: string;
  readonly jobId: JobId;
  readonly phase: "metadata" | "processing" | "parsing" | "validation";
  readonly retryable: boolean;
}> {
}
declare const ConfigurationError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "ConfigurationError";
} & Readonly<A>;
/** Domain-specific error for configuration issues. */
export declare class ConfigurationError extends ConfigurationError_base<{
  readonly message: string;
  readonly field: string;
  readonly expectedFormat?: string;
}> {
}
declare const ValidationError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "ValidationError";
} & Readonly<A>;
/** Domain-specific error for validation failures. */
export declare class ValidationError extends ValidationError_base<{
  readonly message: string;
  readonly field: string;
  readonly value: unknown;
  readonly constraint: string;
}> {
}
declare const StreamingError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "StreamingError";
} & Readonly<A>;
/** Domain-specific error for streaming issues. */
export declare class StreamingError extends StreamingError_base<{
  readonly message: string;
  readonly jobId: JobId;
  readonly chunkIndex?: number;
  readonly partialData?: string;
}> {
}
declare const AuthorizationError_base: new<A extends Record<string, any> = {}>(
  args: import("effect/Types").Equals<A, {}> extends true ? void
    : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => import("effect/Cause").YieldableError & {
  readonly _tag: "AuthorizationError";
} & Readonly<A>;
/** Domain-specific error for authentication/authorization. */
export declare class AuthorizationError extends AuthorizationError_base<{
  readonly message: string;
  readonly requestId?: RequestId;
  readonly resource: string;
  readonly action: string;
}> {
}
/** All domain errors for pattern matching. */
export type DomainError =
  | MediaResourceError
  | TranscriptionError
  | ConfigurationError
  | ValidationError
  | StreamingError
  | AuthorizationError;
/** Schema for media resource errors. */
export declare const MediaResourceErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["MediaResourceError"]>;
  message: typeof Schema.String;
  source: Schema.Literal<["youtube", "upload", "url"]>;
  resourceId: Schema.optional<typeof Schema.String>;
}>;
/** Schema for transcription errors. */
export declare const TranscriptionErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["TranscriptionError"]>;
  message: typeof Schema.String;
  jobId: typeof Schema.String;
  phase: Schema.Literal<["metadata", "processing", "parsing", "validation"]>;
  retryable: typeof Schema.Boolean;
}>;
/** Schema for configuration errors. */
export declare const ConfigurationErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["ConfigurationError"]>;
  message: typeof Schema.String;
  field: typeof Schema.String;
  expectedFormat: Schema.optional<typeof Schema.String>;
}>;
/** Schema for validation errors. */
export declare const ValidationErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["ValidationError"]>;
  message: typeof Schema.String;
  field: typeof Schema.String;
  value: typeof Schema.Unknown;
  constraint: typeof Schema.String;
}>;
/** Schema for streaming errors. */
export declare const StreamingErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["StreamingError"]>;
  message: typeof Schema.String;
  jobId: typeof Schema.String;
  chunkIndex: Schema.optional<typeof Schema.Number>;
  partialData: Schema.optional<typeof Schema.String>;
}>;
/** Schema for authorization errors. */
export declare const AuthorizationErrorSchema: Schema.Struct<{
  _tag: Schema.Literal<["AuthorizationError"]>;
  message: typeof Schema.String;
  requestId: Schema.optional<typeof Schema.String>;
  resource: typeof Schema.String;
  action: typeof Schema.String;
}>;
/** Union schema for all domain errors. */
export declare const DomainErrorSchema: Schema.Union<[
  Schema.Struct<{
    _tag: Schema.Literal<["MediaResourceError"]>;
    message: typeof Schema.String;
    source: Schema.Literal<["youtube", "upload", "url"]>;
    resourceId: Schema.optional<typeof Schema.String>;
  }>,
  Schema.Struct<{
    _tag: Schema.Literal<["TranscriptionError"]>;
    message: typeof Schema.String;
    jobId: typeof Schema.String;
    phase: Schema.Literal<["metadata", "processing", "parsing", "validation"]>;
    retryable: typeof Schema.Boolean;
  }>,
  Schema.Struct<{
    _tag: Schema.Literal<["ConfigurationError"]>;
    message: typeof Schema.String;
    field: typeof Schema.String;
    expectedFormat: Schema.optional<typeof Schema.String>;
  }>,
  Schema.Struct<{
    _tag: Schema.Literal<["ValidationError"]>;
    message: typeof Schema.String;
    field: typeof Schema.String;
    value: typeof Schema.Unknown;
    constraint: typeof Schema.String;
  }>,
  Schema.Struct<{
    _tag: Schema.Literal<["StreamingError"]>;
    message: typeof Schema.String;
    jobId: typeof Schema.String;
    chunkIndex: Schema.optional<typeof Schema.Number>;
    partialData: Schema.optional<typeof Schema.String>;
  }>,
  Schema.Struct<{
    _tag: Schema.Literal<["AuthorizationError"]>;
    message: typeof Schema.String;
    requestId: Schema.optional<typeof Schema.String>;
    resource: typeof Schema.String;
    action: typeof Schema.String;
  }>,
]>;
export type DomainErrorSchema = Schema.Schema.Type<typeof DomainErrorSchema>;
export {};
