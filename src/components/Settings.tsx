import React from 'react';
import type { SpeakerConfig } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SettingsProps {
  speakers: SpeakerConfig[];
  setSpeakers: React.Dispatch<React.SetStateAction<SpeakerConfig[]>>;
}

const MAX_SPEAKERS = 5;

export const Settings: React.FC<SettingsProps> = ({ speakers, setSpeakers }) => {
  const handleAddSpeaker = () => {
    if (speakers.length < MAX_SPEAKERS) {
      setSpeakers([
        ...speakers,
        { id: crypto.randomUUID(), name: `Speaker ${speakers.length + 1}`, description: '' },
      ]);
    }
  };

  const handleRemoveSpeaker = (id: string) => {
    if (speakers.length > 1) {
      setSpeakers(speakers.filter((s) => s.id !== id));
    }
  };

  const handleSpeakerChange = (id: string, field: 'name' | 'description', value: string) => {
    setSpeakers(
      speakers.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-medium text-white mb-4">Transcription Settings</h2>
        <div className="space-y-4">
            <h3 className="text-md font-semibold text-indigo-300">Speakers</h3>
            {speakers.map((speaker, index) => (
                <div key={speaker.id} className="p-4 bg-gray-900/50 border border-gray-700 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-gray-300">Speaker {index + 1}</p>
                        <button
                            onClick={() => handleRemoveSpeaker(speaker.id)}
                            disabled={speakers.length <= 1}
                            className="p-1 text-gray-400 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed transition"
                            aria-label={`Remove Speaker ${index + 1}`}
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div>
                        <label htmlFor={`speaker-name-${speaker.id}`} className="block text-xs font-medium text-gray-400 mb-1">
                            Speaker Name (e.g., Host, Guest)
                        </label>
                        <input
                            type="text"
                            id={`speaker-name-${speaker.id}`}
                            value={speaker.name}
                            onChange={(e) => handleSpeakerChange(speaker.id, 'name', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Host"
                        />
                    </div>
                    <div>
                        <label htmlFor={`speaker-desc-${speaker.id}`} className="block text-xs font-medium text-gray-400 mb-1">
                           Description (Helps AI identify the speaker)
                        </label>
                        <textarea
                            id={`speaker-desc-${speaker.id}`}
                            rows={2}
                            value={speaker.description}
                            onChange={(e) => handleSpeakerChange(speaker.id, 'description', e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Typically directs the conversation."
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={handleAddSpeaker}
                disabled={speakers.length >= MAX_SPEAKERS}
                className="w-full text-sm font-semibold py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
            >
                Add Speaker
            </button>
        </div>
    </div>
  );
};
