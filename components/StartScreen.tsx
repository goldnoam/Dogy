
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
      <div className="text-8xl mb-4">
        🐶
      </div>
      <h2 className="text-4xl font-bold mb-2 text-yellow-300">Fluffy Dog's Zombie Platformer</h2>
       <p className="text-xl mb-4">High Score: {highScore}</p>
      <p className="mb-6 max-w-md">
        Help the fluffy dog in a 2D platformer adventure! Fend off different types of zombie dogs and survive as long as you can.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-2xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
};