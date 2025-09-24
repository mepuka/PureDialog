import { GoogleGenerativeAI, GoogleGenerativeAILive } from "@effect/ai-google";
import { SpeakerConfig } from "@puredialog/domain";
import { Context, Effect, Layer, Schedule, Stream } from "effect";
import { GeminiConfig } from "./config";
import { GeminiError, RateLimitedError } from "./errors";
import { buildSystemInstruction } from "./prompt";
import { LLMTranscript, LLMTranscriptChunk } from "./schema";

export class GeminiTranscription extends Context.Tag("GeminiTranscription")<GeminiTranscription, {
  transcribe(url: string, speakers: SpeakerConfig[]): Effect.Effect<typeof LLMTranscript, GeminiError>;
  stream(url: string, speakers: SpeakerConfig[]): Stream.Stream<typeof LLMTranscriptChunk, GeminiError>;
}> {}

export const GeminiTranscriptionLive = Layer.effect(
  GeminiTranscription,
  Effect.gen(function*(_) {
    const gemini = yield* _(GoogleGenerativeAI);
    const config = yield* _(GeminiConfig);

    const retryPolicy = Schedule.exponential(config.backoff).pipe(
      Schedule.compose(Schedule.recurs(config.maxRetries)),
      Schedule.when((error) => error instanceof RateLimitedError),
    );

    return {
      transcribe: (url: string, speakers: SpeakerConfig[]) => {
        const system = buildSystemInstruction(speakers);
        return gemini.generateContent({ system, video: url }).pipe(
          Effect.retry(retryPolicy),
          Effect.withLogSpan("gemini.transcribe"),
          Effect.annotateLogs({ url, speakers }),
        );
      },
      stream: (url: string, speakers: SpeakerConfig[]) => {
        const system = buildSystemInstruction(speakers);
        return gemini.streamContent({ system, video: url }).pipe(
          Stream.retry(retryPolicy),
          Stream.withLogSpan("gemini.stream"),
          Stream.annotateLogs({ url, speakers }),
        );
      },
    };
  }),
).pipe(Layer.provide(GoogleGenerativeAILive.pipe(Layer.useConfig(GeminiConfig))));
