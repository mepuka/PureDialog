import React from "react";
import type { VideoJob } from "../types";
import { VideoCard } from "./VideoCard";

interface VideoQueueProps {
  jobs: VideoJob[];
  onTranscribe: (url: string) => void;
  onView: (id: string) => void;
  onCancel: (id: string) => void;
  activeVideoId: string | null;
}

export const VideoQueue: React.FC<VideoQueueProps> = ({ jobs, onTranscribe, onView, onCancel, activeVideoId }) => {
  const pendingJobs = jobs.filter(j => j.status === "pending" || j.status === "transcribing" || j.status === "failed");
  const completedJobs = jobs.filter(j => j.status === "completed");

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* Pending Queue */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-medium text-white mb-4">
          To Transcribe ({pendingJobs.length})
        </h2>
        {pendingJobs.length > 0
          ? (
            <ul className="space-y-3">
              {pendingJobs.map((job) => (
                <li key={job.id}>
                  <VideoCard
                    job={job}
                    onTranscribe={onTranscribe}
                    onView={onView}
                    onCancel={onCancel}
                    isActive={job.id === activeVideoId && job.status !== "completed"}
                  />
                </li>
              ))}
            </ul>
          )
          : <p className="text-sm text-gray-500">No new videos detected.</p>}
      </div>

      {/* Completed Queue */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-grow">
        <h2 className="text-lg font-medium text-white mb-4">
          Completed ({completedJobs.length})
        </h2>
        {completedJobs.length > 0
          ? (
            <ul className="space-y-3">
              {completedJobs.map((job) => (
                <li key={job.id}>
                  <VideoCard
                    job={job}
                    onTranscribe={onTranscribe}
                    onView={onView}
                    onCancel={onCancel}
                    isActive={job.id === activeVideoId}
                  />
                </li>
              ))}
            </ul>
          )
          : <p className="text-sm text-gray-500">No transcripts yet. Process a video to see it here.</p>}
      </div>
    </div>
  );
};
