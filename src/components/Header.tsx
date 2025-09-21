
import React from 'react';
import { TranscriptionIcon } from './icons/TranscriptionIcon';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-500 p-3 rounded-lg shadow-lg">
          <TranscriptionIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Gemini YouTube Transcriber
          </h1>
          <p className="text-indigo-300 mt-1">
            Generate production-quality transcripts from YouTube videos with speaker labels.
          </p>
        </div>
      </div>
    </header>
  );
};
