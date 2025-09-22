import { Schema } from "@effect/schema";
import { Chunk, Effect, Either, Option, pipe } from "effect";
import {
  TimeFormat,
  TranscriptEntry,
  RawTranscriptOutput,
  ParsedTranscript,
} from "./entities.js";
import { ValidationError, StreamingError } from "./errors.js";
import { JobId } from "./ids.js";

// --- Time Format Utilities ---

/** Convert MM:SS format to seconds. */
export const timeFormatToSeconds = (timeFormat: TimeFormat): number => {
  const [minutes, seconds] = timeFormat.split(":").map(Number);
  return minutes * 60 + seconds;
};

/** Convert seconds to MM:SS format. */
export const secondsToTimeFormat = (
  seconds: number
): Effect.Effect<TimeFormat, ValidationError> =>
  pipe(
    Effect.sync(() => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }),
    Effect.flatMap((formatted) =>
      pipe(
        Schema.decodeUnknown(TimeFormat)(formatted),
        Effect.mapError(
          () =>
            new ValidationError({
              message: `Invalid time format: ${formatted}`,
              field: "timeFormat",
              value: seconds,
              constraint: "Must be valid MM:SS format",
            })
        )
      )
    )
  );

// --- Raw Text Processing ---

/** Create a raw transcript output from streaming text. */
export const createRawTranscriptOutput = (
  jobId: JobId,
  rawText: string,
  isComplete: boolean
): RawTranscriptOutput => ({
  jobId,
  rawText,
  isComplete,
  receivedAt: new Date(),
});

/** Simple streaming text accumulator for raw transcript processing. */
export const accumulateStreamingText = (
  textChunks: readonly string[]
): string => textChunks.join("");

// --- Parsing Utilities (for when structured data is needed) ---

/** Parse raw transcript text into structured entries (when needed). */
export const parseRawTranscriptToEntries = (
  rawText: string
): Effect.Effect<ParsedTranscript, ValidationError> =>
  Effect.gen(function* () {
    // This is a placeholder for parsing logic
    // In practice, you might use regex patterns or other parsing strategies
    // to extract timestamp, speaker, and dialogue from raw text

    const lines = rawText.split("\n").filter((line) => line.trim());
    const entries: TranscriptEntry[] = [];

    for (const line of lines) {
      // Example pattern: "[00:15] Speaker Name: dialogue text"
      const match = line.match(/^\[(\d{1,2}:\d{2})\]\s*([^:]+):\s*(.+)$/);

      if (match) {
        const [, timestamp, speaker, dialogue] = match;

        const timeFormat = yield* pipe(
          Schema.decodeUnknown(TimeFormat)(timestamp),
          Effect.mapError(
            () =>
              new ValidationError({
                message: `Invalid timestamp format: ${timestamp}`,
                field: "timestamp",
                value: timestamp,
                constraint: "Must be MM:SS format",
              })
          )
        );

        entries.push({
          timestamp: timeFormat,
          speaker: speaker.trim(),
          dialogue: dialogue.trim(),
        });
      }
    }

    if (entries.length === 0) {
      return yield* Effect.fail(
        new ValidationError({
          message: "No valid transcript entries found in raw text",
          field: "rawText",
          value: rawText.slice(0, 200),
          constraint: "Must contain parseable transcript entries",
        })
      );
    }

    return entries;
  });

/** Validate transcript entries for consistency. */
export const validateTranscriptEntries = (
  entries: ParsedTranscript
): Effect.Effect<ParsedTranscript, ValidationError> =>
  Effect.gen(function* () {
    if (entries.length === 0) {
      return yield* Effect.fail(
        new ValidationError({
          message: "Transcript cannot be empty",
          field: "transcript",
          value: entries,
          constraint: "Must contain at least one entry",
        })
      );
    }

    // Validate timestamp ordering
    for (let i = 1; i < entries.length; i++) {
      const prevSeconds = timeFormatToSeconds(entries[i - 1].timestamp);
      const currSeconds = timeFormatToSeconds(entries[i].timestamp);

      if (currSeconds < prevSeconds) {
        return yield* Effect.fail(
          new ValidationError({
            message: `Timestamps out of order at index ${i}`,
            field: "timestamp",
            value: entries[i].timestamp,
            constraint: "Timestamps must be in ascending order",
          })
        );
      }
    }

    return entries;
  });

// --- Chunk-based Processing Utilities ---

/** Create a chunk of transcript entries for efficient processing. */
export const createTranscriptEntryChunk = (
  entries: readonly TranscriptEntry[]
): Chunk.Chunk<TranscriptEntry> => Chunk.fromIterable(entries);

/** Process transcript entries in batches. */
export const processTranscriptBatches = <E, A>(
  entries: ParsedTranscript,
  batchSize: number,
  processor: (batch: Chunk.Chunk<TranscriptEntry>) => Effect.Effect<A, E>
): Effect.Effect<Chunk.Chunk<A>, E> =>
  pipe(
    createTranscriptEntryChunk(entries),
    Chunk.chunksOf(batchSize),
    Chunk.map(processor),
    (effects) => Effect.all(effects),
    Effect.map(Chunk.fromIterable)
  );

/** Find transcript entries by speaker name. */
export const findEntriesBySpeaker = (
  entries: ParsedTranscript,
  speakerName: string
): Chunk.Chunk<TranscriptEntry> =>
  pipe(
    createTranscriptEntryChunk(entries),
    Chunk.filter((entry) => entry.speaker === speakerName)
  );

/** Find transcript entries within a time range. */
export const findEntriesInTimeRange = (
  entries: ParsedTranscript,
  startTime: TimeFormat,
  endTime: TimeFormat
): Chunk.Chunk<TranscriptEntry> => {
  const startSeconds = timeFormatToSeconds(startTime);
  const endSeconds = timeFormatToSeconds(endTime);

  return pipe(
    createTranscriptEntryChunk(entries),
    Chunk.filter((entry) => {
      const entrySeconds = timeFormatToSeconds(entry.timestamp);
      return entrySeconds >= startSeconds && entrySeconds <= endSeconds;
    })
  );
};

// --- Text Processing Utilities ---

/** Extract dialogue text from transcript entries. */
export const extractDialogueText = (entries: ParsedTranscript): string =>
  entries.map((entry) => `${entry.speaker}: ${entry.dialogue}`).join("\n");

/** Count words in transcript entries. */
export const countWordsInTranscript = (entries: ParsedTranscript): number =>
  entries.reduce((total, entry) => {
    const words = entry.dialogue
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return total + words.length;
  }, 0);

/** Get transcript duration from first and last timestamps. */
export const getTranscriptDuration = (
  entries: ParsedTranscript
): Effect.Effect<number, ValidationError> =>
  Effect.gen(function* () {
    if (entries.length === 0) {
      return yield* Effect.fail(
        new ValidationError({
          message: "Cannot calculate duration of empty transcript",
          field: "transcript",
          value: entries,
          constraint: "Must contain at least one entry",
        })
      );
    }

    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];

    const startSeconds = timeFormatToSeconds(firstEntry.timestamp);
    const endSeconds = timeFormatToSeconds(lastEntry.timestamp);

    return endSeconds - startSeconds;
  });
