
import React from 'react';
import { HighScoreEntry } from '../types';

interface StartScreenProps {
  onStart: () => void;
  highScores: HighScoreEntry[];
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScores }) => {
  const topScore = highScores.length > 0 ? highScores[0].score : 0;
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
      <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">
        🐶
      </div>
      <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 text-yellow-300">Fluffy Dog's Zombie Platformer</h2>
       <p className="text-lg sm:text-xl mb-2 sm:mb-4">High Score: {topScore}</p>
      
      <div className="w-full max-w-sm mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-yellow-200">Top Scores</h3>
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2 sm:p-4 h-40 overflow-y-auto border border-gray-600">
          {highScores.length > 0 ? (
            <ul className="text-left">
              {highScores.map((entry, index) => (
                <li key={index} className="flex justify-between items-center text-sm sm:text-base py-1 border-b border-gray-700 last:border-b-0">
                  <span className="font-bold text-white">{index + 1}. {entry.score}</span>
                  <span className="text-gray-400">{entry.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No scores yet. Be the first!</p>
          )}
        </div>
      </div>

      <button
        onClick={onStart}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-lg sm:text-2xl hover:bg-yellow-300 transition-transform transform hover:scale-105"
      >
        Start Game
      </button>
    </div>
  );
};