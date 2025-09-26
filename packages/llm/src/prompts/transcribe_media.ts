import { GoogleGenAI } from "@google/genai"
import type { MediaMetadata, Speaker, YouTubeVideo } from "@puredialog/domain"
import { TranscriptSegment } from "@puredialog/domain"
import { Config, Effect, Redacted, Schema } from "effect"
import type { ConfigError } from "effect/ConfigError"
import type { ParseError } from "effect/ParseResult"
import { GoogleApiError, TranscriptionError } from "../errors.js"

// Raw LLM output schema (before post-processing)
const RawTranscriptSchema = Schema.Array(TranscriptSegment)
export type RawTranscriptEntry = TranscriptSegment

const createTranscriptionPrompt = (metadata: MediaMetadata): string => {
  const speakers = metadata.speakers
  const speakerList = speakers.map((s: Speaker) => `'${s.name ?? s.role}'`).join(", ")
  const speakerDescriptions = speakers
    .map((s: Speaker) => `- **${s.name ?? s.role}:** ${s.bio ?? `${s.role} speaker`}`)
    .join("\n")

  return `You are a world-class transcription engine specializing in generating human-level, production-quality transcripts from video content. Your task is to analyze the provided video and produce a transcript that is not only accurate but also perfectly formatted and easy to read.

**Primary Objective:** Create a verbatim transcript with precise speaker diarization for **${speakers.length}** distinct speakers, adhering strictly to the provided JSON schema.

**Core Instructions:**

1. **Speaker Diarization:**
   * Identify the ${speakers.length} primary speakers: ${speakerList}.
   * Use the following descriptions to help identify each speaker:
${speakerDescriptions}
   * Label each dialogue segment with the correct speaker.
   * You MUST ONLY use the provided speaker labels. Do not invent any other speaker labels. If a voice appears that cannot be confidently matched to one of the provided speakers, you must still assign it to the most likely speaker from the list.

2. **Transcription Accuracy (Verbatim Style):**
   * Transcribe speech exactly as it is spoken. This includes filler words ("uh", "um", "like"), false starts, and repeated words. These are crucial for capturing the natural cadence of the conversation.
   * Do not paraphrase, summarize, or correct grammatical errors made by the speakers.
   * Use proper capitalization and punctuation (commas, periods, question marks) to create coherent sentences that reflect the speaker's delivery and intonation.

3. **Timestamping Protocol:**
   * Provide a timestamp in the strict format [MM:SS] at the beginning of EVERY new dialogue entry. For example: [00:00], [01:23], [15:42].
   * A new dialogue entry is created whenever the speaker changes.
   * For a long monologue by a single speaker, insert a new timestamped entry at logical pauses or topic shifts, approximately every 1-2 minutes, to maintain synchronization.

4. **Handling Non-Speech Elements:**
   * The transcript must ONLY contain the verbatim spoken dialogue.
   * Do not include any non-speech sounds or descriptions like [laughs], [applause], or [music starts].
   * If speech is completely indecipherable, use [unintelligible]. Use this sparingly.
   * Do not describe any visual elements. If a speaker refers to something visual on screen (e.g., "as you can see here..."), you must transcribe their words only and NOT describe what they are referring to.

5. **Technical Context Awareness:**
   * The video input is low-resolution and compressed to facilitate analysis of long-form content. Your analysis should be robust to potential visual artifacts. Focus primarily on the audio track and contextual visual cues for speaker identification.

**Thinking Process:**
Before generating the final JSON output, follow these steps internally:
1. **Determine Video Length:** First, quickly scan to the end of the video to find the last spoken words (e.g., "thanks for watching," "goodbye"). Note this final timestamp. This will serve as an anchor to ensure all timestamps are logical and within the video's duration.
2. **Initial Speaker Pass:** Briefly scan the entire video to understand the context, identify the distinct voices, and map them to the provided speaker roles (${speakerList}).
3. **Detailed Transcription:** Go through the video sequentially. Transcribe the dialogue verbatim, assigning each segment to the correct speaker and generating a precise timestamp in the [MM:SS] format.
4. **Review and Refine:** Review the complete transcript. Ensure all timestamps are in the correct [MM:SS] format, are strictly sequential, and do not exceed the final timestamp you identified in the first step. Verify that speaker labels are used consistently and correctly according to your initial mapping.

**Output Format:**
* The entire output MUST be a single, valid JSON array that conforms to the provided schema.
* Do not include any introductory text, explanations, apologies, or markdown formatting (e.g., \`\`\`json). The response should begin with \`[\` and end with \`]\`.`
}

export const transcribeMedia = (
  resource: YouTubeVideo,
  metadata: MediaMetadata
): Effect.Effect<
  ReadonlyArray<RawTranscriptEntry>,
  TranscriptionError | GoogleApiError | ConfigError | ParseError,
  Config.Config<string>
> =>
  Effect.gen(function*() {
    const prompt = createTranscriptionPrompt(metadata)
    const apiKey = yield* Config.redacted("GOOGLE_AI_API_KEY")

    const result = yield* Effect.tryPromise({
      try: async () => {
        // Use the native Google AI SDK wrapped safely in Effect
        const genAI = new GoogleGenAI({ apiKey: Redacted.value(apiKey) })

        const response = await genAI.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{
            parts: [{
              fileData: {
                fileUri: `https://www.youtube.com/watch?v=${resource.id}`
              }
            }]
          }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.0,
            systemInstruction: {
              parts: [{ text: prompt }]
            }
          }
        })

        if (!response.text) {
          throw new GoogleApiError({
            message: "No text response from Google AI"
          })
        }

        const text = response.text
        try {
          return JSON.parse(text)
        } catch (parseError) {
          throw new TranscriptionError({
            message: "Failed to parse LLM response as JSON",
            cause: parseError
          })
        }
      },
      catch: (error) => {
        if (error instanceof TranscriptionError || error instanceof GoogleApiError) {
          return error
        }
        return new TranscriptionError({
          message: "Unexpected transcription error",
          cause: error
        })
      }
    })

    return yield* Schema.decodeUnknown(RawTranscriptSchema)(result)
  })

// Simpler version without client dependency for now
export const createGoogleTranscriber = () => {
  return (resource: YouTubeVideo, metadata: MediaMetadata) => transcribeMedia(resource, metadata)
}
