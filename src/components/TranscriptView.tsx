import React, { useMemo } from "react";
import type { Transcript, UsageMetadata } from "../types";

interface TranscriptViewProps {
  transcript: Transcript;
  videoUrl: string;
  metadata: UsageMetadata | null;
}

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

const SpeakerBadge: React.FC<{ speaker: string; colorClass: string }> = ({ speaker, colorClass }) => {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {speaker}
    </span>
  );
};

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript, videoUrl, metadata }) => {
  const videoId = getYouTubeVideoId(videoUrl);

  const speakerColorMap = useMemo(() => {
    const uniqueSpeakers = Array.from(new Set(transcript.map(entry => entry.speaker)));
    const colors = [
      "bg-blue-500 text-blue-100",
      "bg-purple-500 text-purple-100",
      "bg-green-500 text-green-100",
      "bg-yellow-500 text-yellow-100",
      "bg-pink-500 text-pink-100",
    ];
    const map = new Map<string, string>();
    uniqueSpeakers.forEach((speaker, index) => {
      map.set(speaker, colors[index % colors.length]);
    });
    return map;
  }, [transcript]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden h-full flex flex-col">
      {videoId && (
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          >
          </iframe>
        </div>
      )}
      <div className="p-6 flex-grow overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Transcript</h3>
        <div className="space-y-6">
          {transcript.map((entry, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-20 text-right text-sm font-mono text-indigo-300 flex-shrink-0 pt-1">
                {entry.timestamp}
              </div>
              <div className="flex-1">
                <SpeakerBadge
                  speaker={entry.speaker}
                  colorClass={speakerColorMap.get(entry.speaker) || "bg-gray-500 text-gray-100"}
                />
                <p className="mt-2 text-gray-300 leading-relaxed">
                  {entry.dialogue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {metadata && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <h4 className="text-sm font-semibold text-white mb-2">Usage Metadata</h4>
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>Prompt Tokens:</span>
            {/* FIX: Add fallback for potentially undefined token counts. */}
            <span>{metadata.promptTokenCount ?? 0}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>Response Tokens:</span>
            {/* FIX: Add fallback for potentially undefined token counts. */}
            <span>{metadata.candidatesTokenCount ?? 0}</span>
          </div>
          <div className="flex justify-between text-xs text-white font-mono mt-1 pt-1 border-t border-gray-600">
            <span>Total Tokens:</span>
            {/* FIX: Add fallback for potentially undefined token counts. */}
            <span>{metadata.totalTokenCount ?? 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};
