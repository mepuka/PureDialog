import React from "react";
import type { VideoJob } from "../types";
import { CheckIcon } from "./icons/CheckIcon";
import { ErrorIcon } from "./icons/ErrorIcon";

interface VideoCardProps {
  job: VideoJob;
  onTranscribe: (url: string) => void;
  onView: (id: string) => void;
  onCancel: (id: string) => void;
  isActive: boolean;
}

const getYouTubeThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

export const VideoCard: React.FC<VideoCardProps> = ({ job, onTranscribe, onView, onCancel, isActive }) => {
  const baseClasses = "w-full flex items-center p-3 bg-gray-700 rounded-md transition duration-200 group";
  const activeClasses = isActive ? "ring-2 ring-indigo-500" : "hover:bg-gray-600";
  const cursorClass = job.status === "completed" ? "cursor-pointer" : "cursor-default";

  const handleCardClick = () => {
    if (job.status === "completed" || job.status === "failed" || job.status === "pending") {
      onView(job.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.key === "Enter" || e.key === " ")
      && (job.status === "completed" || job.status === "failed" || job.status === "pending")
    ) {
      e.preventDefault();
      onView(job.id);
    }
  };

  const renderStatus = () => {
    switch (job.status) {
      case "pending":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTranscribe(job.url);
            }}
            className="text-xs font-semibold text-indigo-300 hover:text-white uppercase whitespace-nowrap"
            aria-label={`Transcribe video ${job.url}`}
          >
            Transcribe
          </button>
        );
      case "transcribing":
        return (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(job.id);
              }}
              className="text-xs font-semibold text-red-400 hover:text-white whitespace-nowrap"
              aria-label={`Cancel transcription for ${job.url}`}
            >
              Cancel
            </button>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-5 w-5 text-green-400" />
            <span className="text-xs text-green-400">Done</span>
          </div>
        );
      case "failed":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTranscribe(job.url);
            }}
            className="flex items-center space-x-2 text-xs font-semibold text-yellow-400 hover:text-white uppercase whitespace-nowrap"
            aria-label={`Retry transcription for video ${job.url}`}
          >
            <ErrorIcon className="h-5 w-5 text-yellow-400" />
            <span>Retry</span>
          </button>
        );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`${baseClasses} ${activeClasses} ${cursorClass}`}
      role={job.status !== "transcribing" ? "button" : undefined}
      tabIndex={job.status !== "transcribing" ? 0 : -1}
      aria-label={job.status === "completed" ? `View transcript for ${job.url}` : `Video card for ${job.url}`}
    >
      <div className="flex-shrink-0 w-24 h-14 bg-gray-900 rounded-md overflow-hidden mr-4">
        <img
          src={getYouTubeThumbnail(job.id)}
          alt={`Thumbnail for video ${job.id}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <p className="text-sm text-gray-300 truncate group-hover:text-white">{job.url}</p>
        {job.status === "completed" && job.metadata && (
          <p className="text-xs text-gray-400 font-mono">
            {job.transcript?.length} entries / {job.metadata.totalTokenCount} tokens
          </p>
        )}
        {job.status === "failed" && (
          <p className="text-xs text-red-400 font-mono truncate" title={job.error}>
            {job.error}
          </p>
        )}
      </div>
      <div className="pl-4">{renderStatus()}</div>
    </div>
  );
};
