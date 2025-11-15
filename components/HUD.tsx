
import React from 'react';
import { ActivePowerUp, PowerUpType } from '../types';

interface HUDProps {
  lives: number;
  score: number;
  level: number;
  timeLeft: number;
  isBossLevel: boolean;
  highScore: number;
  activePowerUp: ActivePowerUp | null;
}

const PowerUpIcon: React.FC<{type: PowerUpType}> = React.memo(({ type }) => {
    switch(type) {
        case PowerUpType.SpeedBoost: return <span className="text-yellow-400">⚡️</span>;
        case PowerUpType.Invincibility: return <span className="text-yellow-300">✨</span>;
        default: return null;
    }
});

export const HUD: React.FC<HUDProps> = React.memo(({ lives, score, level, timeLeft, isBossLevel, highScore, activePowerUp }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-1 sm:p-2 bg-black bg-opacity-30 flex justify-between items-center text-sm sm:text-lg md:text-xl z-10">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex items-center">
          <span className="text-red-500 mr-1 sm:mr-2">❤️</span>
          <span>{lives}</span>
        </div>
        {activePowerUp && (
          <div className="flex items-center bg-gray-900 bg-opacity-50 px-2 py-1 rounded-md">
            <PowerUpIcon type={activePowerUp.type} />
            <span className="ml-2 font-mono font-bold">{Math.ceil(activePowerUp.timeLeft)}s</span>
          </div>
        )}
      </div>
      <div className="hidden sm:block">
        <span>Score: {score}</span>
      </div>
       <div className="hidden md:block">
        <span>High Score: {highScore}</span>
      </div>
      <div>
        <span>Lvl: {level}</span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div>
            <span className="text-yellow-300 mr-1 sm:mr-2">⏳</span>
            <span>{isBossLevel ? 'BOSS!' : timeLeft}</span>
        </div>
      </div>
    </div>
  );
});
