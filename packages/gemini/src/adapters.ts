import { SpeakerRole, Timestamp, Transcript } from "@puredialog/domain";
import { Array, Schema } from "effect";
import { LLMTranscript } from "./schema";

export const normalizeTimestamp = (timestamp: string): string => {
  const parts = timestamp.split(":");
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `00:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
  }
  return timestamp;
};

export const mapSpeaker = (speaker: string): SpeakerRole => {
  if (speaker.toLowerCase().includes("host")) {
    return "host";
  }
  return "guest";
};

export const toDomainTranscript = Schema.transform(
  LLMTranscript,
  Transcript,
  (llmTranscript) => {
    return {
      id: "" as any,
      jobId: "" as any,
      rawText: llmTranscript.map((chunk) => chunk.dialogue).join("\n"),
      turns: Array.map(llmTranscript, (chunk) => ({
        timestamp: normalizeTimestamp(chunk.timestamp) as Timestamp,
        speaker: mapSpeaker(chunk.speaker),
        text: chunk.dialogue,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
  () => {
    // Not implemented
    return [];
  },
);
