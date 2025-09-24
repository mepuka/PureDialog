import { Schema } from "effect";

export const SpeakerConfig = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
});

export const LLMTranscriptChunk = Schema.Struct({
  timestamp: Schema.String,
  speaker: Schema.String,
  dialogue: Schema.String,
});

export const LLMTranscript = Schema.Array(LLMTranscriptChunk);
