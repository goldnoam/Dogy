
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
      <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">
        🐶
      </div>
      <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-yellow-300">Fluffy Dog's Zombie Platformer</h2>
       <p className="text-lg sm:text-xl mb-2 sm:mb-4">High Score: {highScore}</p>
      <p className="mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
        Help the fluffy dog fend off waves of zombie dogs in this platformer adventure!
      </p>
      <button
        onClick={onStart}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-lg sm:text-2xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
};
