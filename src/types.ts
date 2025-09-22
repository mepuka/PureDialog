export interface SpeakerConfig {
  id: string; // For React keys
  name: string;
  description: string;
}

export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  dialogue: string;
}

export type Transcript = TranscriptEntry[];

export interface UsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export type VideoStatus = "pending" | "transcribing" | "completed" | "failed";

export interface VideoJob {
  id: string; // YouTube Video ID
  url: string;
  status: VideoStatus;
  transcript?: Transcript;
  metadata?: UsageMetadata;
  error?: string;
  streamingTimestamp?: string | null;
  streamingSnippet?: string | null;
}
