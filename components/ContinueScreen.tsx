
import React, { useState, useEffect } from 'react';

interface ContinueScreenProps {
  score: number;
  onContinue: () => void;
  onGameOver: () => void;
}

export const ContinueScreen: React.FC<ContinueScreenProps> = ({ score, onContinue, onGameOver }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      onGameOver();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onGameOver]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
      <div className="text-5xl sm:text-6xl mb-4">😵</div>
      <h2 className="text-3xl sm:text-5xl font-bold mb-2 text-yellow-300">Continue?</h2>
      <p className="text-lg sm:text-2xl mb-6">Current Score: {score}</p>
      <button
        onClick={onContinue}
        disabled={countdown <= 0}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded-lg text-lg sm:text-2xl hover:bg-green-400 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Continue ({countdown})
      </button>
      <p className="mt-4 text-gray-300 text-sm sm:text-lg">You get 3 ❤️ and keep your score!</p>
    </div>
  );
};
