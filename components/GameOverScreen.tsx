
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score > 0 && score === highScore;
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
      <div className="text-5xl sm:text-6xl mb-4">😵</div>
      <h2 className="text-3xl sm:text-5xl font-bold mb-2 text-red-500">Game Over</h2>
      {isNewHighScore && <p className="text-xl sm:text-3xl text-yellow-300 animate-pulse mb-2">New High Score!</p>}
      <p className="text-lg sm:text-2xl mb-2">Final Score: {score}</p>
      <p className="text-base sm:text-xl mb-6">High Score: {highScore}</p>
      <button
        onClick={onRestart}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-lg sm:text-2xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};
