import { GoogleGenAI, MediaResolution, Type } from "@google/genai";
import type { Transcript, UsageMetadata, SpeakerConfig } from '../types';

/**
 * Constructs a SOTA (State-Of-The-Art) prompt for generating a high-quality,
 * production-ready video transcript based on dynamic speaker settings.
 * @param speakers An array of speaker configurations.
 * @returns A detailed system instruction string for the Gemini model.
 */
const getTranscriptionPrompt = (speakers: SpeakerConfig[]): string => {
  const speakerList = speakers.map(s => `'${s.name}'`).join(', ');
  const speakerDescriptions = speakers.map(s => `- **${s.name}:** ${s.description}`).join('\n');

  return `
You are a world-class transcription engine specializing in generating human-level, production-quality transcripts from video content. Your task is to analyze the provided video and produce a transcript that is not only accurate but also perfectly formatted and easy to read.

**Primary Objective:** Create a verbatim transcript with precise speaker diarization for **${speakers.length}** distinct speakers, adhering strictly to the provided JSON schema.

**Core Instructions:**

1.  **Speaker Diarization:**
    *   Identify the ${speakers.length} primary speakers: ${speakerList}.
    *   Use the following descriptions to help identify each speaker:
${speakerDescriptions}
    *   Label each dialogue segment with the correct speaker.
    *   You MUST ONLY use the provided speaker labels. Do not invent any other speaker labels. If a voice appears that cannot be confidently matched to one of the provided speakers, you must still assign it to the most likely speaker from the list.

2.  **Transcription Accuracy (Verbatim Style):**
    *   Transcribe speech exactly as it is spoken. This includes filler words ("uh", "um", "like"), false starts, and repeated words. These are crucial for capturing the natural cadence of the conversation.
    *   Do not paraphrase, summarize, or correct grammatical errors made by the speakers.
    *   Use proper capitalization and punctuation (commas, periods, question marks) to create coherent sentences that reflect the speaker's delivery and intonation.

3.  **Timestamping Protocol:**
    *   Provide a timestamp in the strict format [MM:SS] at the beginning of EVERY new dialogue entry. For example: [00:00], [01:23], [15:42].
    *   A new dialogue entry is created whenever the speaker changes.
    *   For a long monologue by a single speaker, insert a new timestamped entry at logical pauses or topic shifts, approximately every 1-2 minutes, to maintain synchronization.

4.  **Handling Non-Speech Elements:**
    *   The transcript must ONLY contain the verbatim spoken dialogue.
    *   Do not include any non-speech sounds or descriptions like [laughs], [applause], or [music starts].
    *   If speech is completely indecipherable, use [unintelligible]. Use this sparingly.
    *   Do not describe any visual elements. If a speaker refers to something visual on screen (e.g., "as you can see here..."), you must transcribe their words only and NOT describe what they are referring to.

5.  **Technical Context Awareness:**
    *   The video input is low-resolution and compressed to facilitate analysis of long-form content. Your analysis should be robust to potential visual artifacts. Focus primarily on the audio track and contextual visual cues for speaker identification.

**Thinking Process:**
Before generating the final JSON output, follow these steps internally:
1.  **Determine Video Length:** First, quickly scan to the end of the video to find the last spoken words (e.g., "thanks for watching," "goodbye"). Note this final timestamp. This will serve as an anchor to ensure all timestamps are logical and within the video's duration.
2.  **Initial Speaker Pass:** Briefly scan the entire video to understand the context, identify the distinct voices, and map them to the provided speaker roles (${speakerList}).
3.  **Detailed Transcription:** Go through the video sequentially. Transcribe the dialogue verbatim, assigning each segment to the correct speaker and generating a precise timestamp in the [MM:SS] format.
4.  **Review and Refine:** Review the complete transcript. Ensure all timestamps are in the correct [MM:SS] format, are strictly sequential, and do not exceed the final timestamp you identified in the first step. Verify that speaker labels are used consistently and correctly according to your initial mapping.

**Output Format:**
*   The entire output MUST be a single, valid JSON array that conforms to the provided schema.
*   Do not include any introductory text, explanations, apologies, or markdown formatting (e.g., \`\`\`json). The response should begin with \`[\` and end with \`]\`.
`;
};

/**
 * Defines the strict JSON schema the Gemini model must follow for the transcript,
 * with speaker names populated dynamically.
 * @param speakers An array of speaker configurations.
 * @returns A JSON schema object.
 */
const getTranscriptSchema = (speakers: SpeakerConfig[]) => {
  const speakerNames = speakers.map(s => s.name);

  return {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        timestamp: {
          type: Type.STRING,
          description: 'Timestamp of the dialogue in MM:SS format.'
        },
        speaker: {
          type: Type.STRING,
          enum: speakerNames,
          description: 'The identified speaker. Must be one of the provided names.'
        },
        dialogue: {
          type: Type.STRING,
          description: 'The verbatim transcribed text for this segment. Should include filler words.'
        }
      },
      required: ['timestamp', 'speaker', 'dialogue'],
    }
  };
};

/**
 * Transcribes a YouTube video using the Gemini API with streaming.
 * @param videoUrl The URL of the YouTube video to transcribe.
 * @param speakers The configured speaker settings.
 * @param onChunk A callback function that receives the accumulated response text as it streams in.
 * @param signal An AbortSignal to allow for cancellation of the transcription.
 * @returns A promise that resolves to the final, parsed transcript data and usage metadata.
 */
export const transcribeVideo = async (
  videoUrl: string,
  speakers: SpeakerConfig[],
  onChunk: (accumulatedText: string) => void,
  signal: AbortSignal,
): Promise<{ transcript: Transcript; metadata?: UsageMetadata }> => {
  if (!process.env.API_KEY) {
    throw new Error("The API_KEY environment variable is not set. Please configure it to use the application.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const videoPart = {
    fileData: {
      // MimeType is not required for YouTube URLs; the service infers it.
      fileUri: videoUrl,
    }
  };

  console.log(`Initiating streaming transcription for: ${videoUrl}`);

  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [videoPart] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: getTranscriptSchema(speakers),
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
      temperature: 0.0,
      systemInstruction: getTranscriptionPrompt(speakers),
    },
  });
  
  let accumulatedJson = '';
  let usageMetadata: UsageMetadata | undefined;
  for await (const chunk of responseStream) {
    if (signal.aborted) {
      console.log('Transcription cancelled by user signal.');
      throw new Error('Transcription was cancelled.');
    }

    const textPart = chunk.text;
    if (textPart) {
      accumulatedJson += textPart;
      onChunk(accumulatedJson);
    }
    if (chunk.usageMetadata) {
      usageMetadata = chunk.usageMetadata;
    }
  }
  
  console.log('API Usage Metadata:', usageMetadata);

  const finalJsonStr = accumulatedJson.trim();

  // Basic validation to ensure the response looks like a JSON array.
  if (!finalJsonStr.startsWith('[') || !finalJsonStr.endsWith(']')) {
    console.error("Received non-JSON response from API stream:", finalJsonStr);
    throw new Error("Failed to get a valid transcript. The API response was not in the expected JSON format.");
  }

  try {
    const result = JSON.parse(finalJsonStr);
    return { transcript: result as Transcript, metadata: usageMetadata };
  } catch (e) {
    console.error("Failed to parse final JSON response:", finalJsonStr, e);
    throw new Error("There was an issue decoding the final transcript from the API stream.");
  }
};