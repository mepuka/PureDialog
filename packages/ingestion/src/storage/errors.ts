import { Data } from "effect"

/**
 * Cloud Storage specific errors
 */
export class CloudStorageError extends Data.TaggedError("CloudStorageError")<{
  readonly message: string
  readonly operation: string
  readonly bucket?: string
  readonly key?: string
  readonly cause?: unknown
}> {
  static putObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to put object",
      operation: "putObject",
      bucket,
      key,
      cause
    })
  }

  static getObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to get object",
      operation: "getObject",
      bucket,
      key,
      cause
    })
  }

  static deleteObjectFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to delete object",
      operation: "deleteObject",
      bucket,
      key,
      cause
    })
  }

  static listObjectsFailed(bucket: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to list objects",
      operation: "listObjects",
      bucket,
      cause
    })
  }

  static objectExistsFailed(bucket: string, key: string, cause: unknown) {
    return new CloudStorageError({
      message: "Failed to check object existence",
      operation: "objectExists",
      bucket,
      key,
      cause
    })
  }

  static configurationError(message: string) {
    return new CloudStorageError({
      message,
      operation: "configuration",
      cause: "Invalid configuration"
    })
  }
}
