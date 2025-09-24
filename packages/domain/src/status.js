import { Schema } from "effect";
import { Data } from "effect";
/** TranscriptionJob processing status enumeration. */
export const JobStatus = Schema.Literal("Queued", "MetadataReady", "Processing", "Completed", "Failed", "Cancelled");
/** Status transition constructors and utilities. */
export const { Queued: QueuedTransition, MetadataReady: MetadataReadyTransition, Processing: ProcessingTransition, Completed: CompletedTransition, Failed: FailedTransition, Cancelled: CancelledTransition, $is: isTransitionType, $match: matchTransition, } = Data.taggedEnum();
/** Get transition info for a given status. */
export const getStatusTransition = (status) => {
    switch (status) {
        case "Queued":
            return QueuedTransition({
                allowedNext: ["MetadataReady", "Failed", "Cancelled"],
                isTerminal: false,
            });
        case "MetadataReady":
            return MetadataReadyTransition({
                allowedNext: ["Processing", "Failed", "Cancelled"],
                isTerminal: false,
            });
        case "Processing":
            return ProcessingTransition({
                allowedNext: ["Completed", "Failed", "Cancelled"],
                isTerminal: false,
            });
        case "Completed":
            return CompletedTransition({ allowedNext: [], isTerminal: true });
        case "Failed":
            return FailedTransition({ allowedNext: [], isTerminal: true });
        case "Cancelled":
            return CancelledTransition({ allowedNext: [], isTerminal: true });
    }
};
/** Check if a status transition is valid. */
export const isValidStatusTransition = (from, to) => {
    const transition = getStatusTransition(from);
    return matchTransition(transition, {
        Queued: ({ allowedNext }) => allowedNext.includes(to),
        MetadataReady: ({ allowedNext }) => allowedNext.includes(to),
        Processing: ({ allowedNext }) => allowedNext.includes(to),
        Completed: () => false,
        Failed: () => false,
        Cancelled: () => false,
    });
};
/** Check if a status is terminal (no further transitions allowed). */
export const isTerminalStatus = (status) => {
    const transition = getStatusTransition(status);
    return matchTransition(transition, {
        Queued: ({ isTerminal }) => isTerminal,
        MetadataReady: ({ isTerminal }) => isTerminal,
        Processing: ({ isTerminal }) => isTerminal,
        Completed: ({ isTerminal }) => isTerminal,
        Failed: ({ isTerminal }) => isTerminal,
        Cancelled: ({ isTerminal }) => isTerminal,
    });
};
