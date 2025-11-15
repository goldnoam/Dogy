
import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4">
      <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-yellow-300">Paused</h2>
      <button
        onClick={onResume}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-lg sm:text-2xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
      >
        Resume
      </button>
      <p className="mt-4 text-gray-300 text-sm sm:text-lg">You can also press 'Space' to resume.</p>
    </div>
  );
};
