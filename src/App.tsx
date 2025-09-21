import React, { useState, useCallback, useMemo } from "react";
import type {
  Transcript,
  UsageMetadata,
  VideoJob,
  SpeakerConfig,
  TranscriptEntry,
} from "./types";
import { extractYouTubeLinks } from "./utils/youtube";
import { transcribeVideo } from "./services/geminiService";
import { Header } from "./components/Header";
import { Loader } from "./components/Loader";
import { TranscriptView } from "./components/TranscriptView";
import { VideoQueue } from "./components/VideoQueue";
import { ErrorIcon } from "./components/icons/ErrorIcon";
import { Settings } from "./components/Settings";

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(
    /(?:[?&]v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

/**
 * Extracts the last complete JSON object from a streaming string that is expected to be a JSON array.
 * This is more robust than regex as it correctly handles nested structures and special characters within strings.
 * @param jsonString The streaming JSON string.
 * @returns The parsed object or null if no complete object is found.
 */
const extractLastCompleteObject = (
  jsonString: string
): TranscriptEntry | null => {
  // Find the last closing brace. If there's none, there's no object.
  const lastBraceIndex = jsonString.lastIndexOf("}");
  if (lastBraceIndex === -1) {
    return null;
  }

  // From the last '}', scan backwards to find its matching '{'.
  let braceCount = 0;
  let startBraceIndex = -1;
  for (let i = lastBraceIndex; i >= 0; i--) {
    if (jsonString[i] === "}") {
      braceCount++;
    } else if (jsonString[i] === "{") {
      braceCount--;
    }

    if (braceCount === 0) {
      startBraceIndex = i;
      break;
    }
  }

  // If a matching '{' was found...
  if (startBraceIndex !== -1) {
    const objectStr = jsonString.substring(startBraceIndex, lastBraceIndex + 1);
    try {
      // ...try to parse it.
      const parsed = JSON.parse(objectStr);
      // A simple check to see if it resembles our TranscriptEntry type.
      if (
        parsed &&
        typeof parsed.speaker === "string" &&
        typeof parsed.dialogue === "string"
      ) {
        return parsed as TranscriptEntry;
      }
    } catch (e) {
      // This can happen if the substring is not valid JSON, which is fine for a stream.
      return null;
    }
  }

  return null;
};

const App: React.FC = () => {
  const [textInput, setTextInput] = useState("");
  const [videoJobs, setVideoJobs] = useState<VideoJob[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [speakers, setSpeakers] = useState<SpeakerConfig[]>([
    {
      id: crypto.randomUUID(),
      name: "Host",
      description:
        "Typically introduces the show and directs the conversation.",
    },
    {
      id: crypto.randomUUID(),
      name: "Guest",
      description:
        "The person being interviewed or participating in the discussion.",
    },
  ]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextInput(newText);
    const links = extractYouTubeLinks(newText);

    setVideoJobs((prevJobs) => {
      const existingIds = new Set(prevJobs.map((job) => job.id));
      const newJobs: VideoJob[] = [];

      for (const link of links) {
        const videoId = getYouTubeVideoId(link);
        if (videoId && !existingIds.has(videoId)) {
          newJobs.push({
            id: videoId,
            url: link,
            status: "pending",
          });
          existingIds.add(videoId);
        }
      }
      return [...prevJobs, ...newJobs];
    });
  };

  const handleTranscribe = useCallback(
    async (videoUrl: string) => {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) return;

      abortController?.abort(); // Cancel any previous job
      const controller = new AbortController();
      setAbortController(controller);

      setVideoJobs((prev) =>
        prev.map((job) =>
          job.id === videoId
            ? {
                ...job,
                status: "transcribing",
                error: undefined,
                streamingTimestamp: null,
                streamingSnippet: null,
              }
            : job
        )
      );
      setActiveVideoId(videoId); // Focus the main view on the transcribing job

      const handleStreamChunk = (accumulatedText: string) => {
        // This function provides a real-time preview of the transcription.
        // It safely parses the last complete entry from the incomplete stream.
        // The full, final JSON is parsed only once the stream is complete in `geminiService.ts`.
        const lastEntry = extractLastCompleteObject(accumulatedText);

        if (lastEntry) {
          setVideoJobs((prev) =>
            prev.map((job) =>
              job.id === videoId
                ? {
                    ...job,
                    streamingTimestamp: lastEntry.timestamp,
                    streamingSnippet: lastEntry.dialogue,
                  }
                : job
            )
          );
        }
      };

      try {
        const { transcript: result, metadata } = await transcribeVideo(
          videoUrl,
          speakers,
          handleStreamChunk,
          controller.signal
        );
        setVideoJobs((prev) =>
          prev.map((job) =>
            job.id === videoId
              ? {
                  ...job,
                  status: "completed",
                  transcript: result,
                  metadata,
                  streamingTimestamp: null,
                  streamingSnippet: null,
                }
              : job
          )
        );
      } catch (err) {
        console.error("Transcription failed:", err);
        const isCancellation =
          err instanceof Error &&
          err.message === "Transcription was cancelled.";
        const errorMessage = isCancellation
          ? "Cancelled by user."
          : err instanceof Error
          ? err.message
          : "An unknown error occurred.";
        setVideoJobs((prev) =>
          prev.map((job) =>
            job.id === videoId && job.status === "transcribing"
              ? {
                  ...job,
                  status: "failed",
                  error: errorMessage,
                  streamingTimestamp: null,
                  streamingSnippet: null,
                }
              : job
          )
        );
      } finally {
        setAbortController(null);
      }
    },
    [abortController, speakers]
  );

  const handleCancelTranscription = useCallback(
    (videoId: string) => {
      console.log(`Requesting cancellation for job: ${videoId}`);
      abortController?.abort();
    },
    [abortController]
  );

  const handleViewTranscript = (videoId: string) => {
    setActiveVideoId(videoId);
  };

  const activeJob = useMemo(() => {
    return videoJobs.find((job) => job.id === activeVideoId);
  }, [activeVideoId, videoJobs]);

  const renderRightPanel = () => {
    if (!activeJob) {
      return (
        <div className="text-center text-gray-500">
          <p className="text-lg">Transcript Viewer</p>
          <p className="mt-2">
            Select a completed transcript, or start a new transcription.
          </p>
        </div>
      );
    }

    switch (activeJob.status) {
      case "transcribing":
        return (
          <div className="w-full text-center flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Transcription in Progress...
            </h3>
            <Loader text="This may take a few minutes." />
            {(activeJob.streamingTimestamp || activeJob.streamingSnippet) && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg w-full max-w-lg mx-auto border border-gray-700">
                <p className="text-sm text-gray-400">Latest Update</p>
                <div className="font-mono text-indigo-300 mt-2 text-left animate-pulse">
                  <span className="font-bold mr-2">{`[${
                    activeJob.streamingTimestamp || "00:00:00"
                  }]`}</span>
                  <span className="text-gray-300 break-words">{`"${
                    activeJob.streamingSnippet || "..."
                  }"`}</span>
                </div>
              </div>
            )}
          </div>
        );
      case "completed":
        return activeJob.transcript ? (
          <TranscriptView
            transcript={activeJob.transcript}
            videoUrl={activeJob.url}
            metadata={activeJob.metadata || null}
          />
        ) : null;
      case "failed":
        return (
          <div className="text-center text-red-400 p-4">
            <ErrorIcon className="h-12 w-12 mx-auto" />
            <p className="text-lg mt-4 font-semibold">Transcription Failed</p>
            <p className="mt-2 text-sm text-gray-400 max-w-md">
              {activeJob.error}
            </p>
          </div>
        );
      case "pending":
        return (
          <div className="text-center text-gray-500">
            <p className="text-lg">Ready to Transcribe</p>
            <p className="mt-2">
              Click "Transcribe" on a video in the queue to begin.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel: Input and Queues */}
          <div className="flex flex-col space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <label
                htmlFor="text-input"
                className="block text-lg font-medium text-white mb-2"
              >
                Paste Text Containing YouTube Links
              </label>
              <textarea
                id="text-input"
                rows={5}
                value={textInput}
                onChange={handleTextChange}
                placeholder="Paste text here... any YouTube links will be automatically detected and added to the queue below."
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                aria-label="Text input for YouTube links"
              />
            </div>
            <Settings speakers={speakers} setSpeakers={setSpeakers} />
            <VideoQueue
              jobs={videoJobs}
              onTranscribe={handleTranscribe}
              onView={handleViewTranscript}
              onCancel={handleCancelTranscription}
              activeVideoId={activeVideoId}
            />
          </div>

          {/* Right Panel: Transcript View */}
          <div className="bg-gray-800/50 rounded-lg shadow-lg flex items-center justify-center p-1 min-h-[400px] lg:min-h-0">
            {renderRightPanel()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
