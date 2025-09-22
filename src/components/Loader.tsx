import React from "react";

export const Loader: React.FC<{ text?: string; streamingText?: string | null }> = ({
  text = "Processing...",
  streamingText,
}) => (
  <div className="flex flex-col items-center justify-center space-y-2">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
    <p className="text-sm text-gray-400">{text}</p>
    {streamingText && (
      <p className="text-xs text-indigo-300 font-mono mt-2 animate-pulse">
        Latest timestamp: {streamingText}
      </p>
    )}
  </div>
);
