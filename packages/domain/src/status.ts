import { Data, Schema } from "effect"

/** TranscriptionJob processing status enumeration. */
export const JobStatus = Schema.Literal(
  "Queued",
  "MetadataReady",
  "Processing",
  "Completed",
  "Failed",
  "Cancelled"
)
export type JobStatus = Schema.Schema.Type<typeof JobStatus>

/** TranscriptionJob status transition as a tagged enum for better pattern matching. */
export type JobStatusTransition = Data.TaggedEnum<{
  Queued: {
    readonly allowedNext: readonly ["MetadataReady", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  MetadataReady: {
    readonly allowedNext: readonly ["Processing", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  Processing: {
    readonly allowedNext: readonly ["Completed", "Failed", "Cancelled"]
    readonly isTerminal: false
  }
  Completed: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
  Failed: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
  Cancelled: {
    readonly allowedNext: readonly []
    readonly isTerminal: true
  }
}>

/** Status transition constructors and utilities. */
export const {
  $is: isTransitionType,
  $match: matchTransition,
  Cancelled: CancelledTransition,
  Completed: CompletedTransition,
  Failed: FailedTransition,
  MetadataReady: MetadataReadyTransition,
  Processing: ProcessingTransition,
  Queued: QueuedTransition
} = Data.taggedEnum<JobStatusTransition>()

/** Get transition info for a given status. */
export const getStatusTransition = (status: JobStatus): JobStatusTransition => {
  switch (status) {
    case "Queued":
      return QueuedTransition({
        allowedNext: ["MetadataReady", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "MetadataReady":
      return MetadataReadyTransition({
        allowedNext: ["Processing", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "Processing":
      return ProcessingTransition({
        allowedNext: ["Completed", "Failed", "Cancelled"],
        isTerminal: false
      })
    case "Completed":
      return CompletedTransition({ allowedNext: [], isTerminal: true })
    case "Failed":
      return FailedTransition({ allowedNext: [], isTerminal: true })
    case "Cancelled":
      return CancelledTransition({ allowedNext: [], isTerminal: true })
  }
}

/** Check if a status transition is valid. */
export const isValidStatusTransition = (
  from: JobStatus,
  to: JobStatus
): boolean => {
  const transition = getStatusTransition(from)
  return matchTransition(transition, {
    Queued: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    MetadataReady: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    Processing: ({ allowedNext }) => (allowedNext as ReadonlyArray<JobStatus>).includes(to),
    Completed: () => false,
    Failed: () => false,
    Cancelled: () => false
  })
}

/** Check if a status is terminal (no further transitions allowed). */
export const isTerminalStatus = (status: JobStatus): boolean => {
  const transition = getStatusTransition(status)
  return matchTransition(transition, {
    Queued: ({ isTerminal }) => isTerminal,
    MetadataReady: ({ isTerminal }) => isTerminal,
    Processing: ({ isTerminal }) => isTerminal,
    Completed: ({ isTerminal }) => isTerminal,
    Failed: ({ isTerminal }) => isTerminal,
    Cancelled: ({ isTerminal }) => isTerminal
  })
}
