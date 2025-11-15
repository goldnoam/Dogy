
import React from 'react';
import { GameState, ZombieType, PowerUpType } from '../types';
import { GameObject } from './GameObject';
import { HUD } from './HUD';
import { ZOMBIE_TYPE_CONFIGS } from '../constants';

interface GameScreenProps {
  gameState: GameState;
}

const PowerUpEmoji: React.FC<{type: PowerUpType}> = React.memo(({ type }) => {
    switch(type) {
        case PowerUpType.SpeedBoost: return <div className="text-4xl drop-shadow-lg">⚡️</div>;
        case PowerUpType.Invincibility: return <div className="text-4xl drop-shadow-lg">✨</div>;
        default: return null;
    }
});

export const GameScreen: React.FC<GameScreenProps> = ({ gameState }) => {
  const { player, enemies, projectiles, boss, level, score, lives, timeLeft, isBossLevel, highScore, bossProjectiles, powerUps, enemyProjectiles, activePowerUp } = gameState;

  const isInvincible = activePowerUp?.type === PowerUpType.Invincibility;

  return (
    <div 
        className="w-full h-full relative overflow-hidden"
    >
        {/* Ground */}
        <div 
            className="absolute bottom-0 left-0 w-full"
            style={{ height: '50px', backgroundImage: 'linear-gradient(to right, #4a332a, #6f4e37)', zIndex: 0 }}
        />

      <div 
        className="relative z-10 w-full h-full"
      >
        <HUD 
          lives={lives} 
          score={score} 
          level={level} 
          timeLeft={Math.ceil(timeLeft)} 
          isBossLevel={isBossLevel}
          highScore={highScore}
          activePowerUp={activePowerUp}
        />
        
        <GameObject {...player}>
            <div 
              className={`text-5xl transition-all duration-200 ${isInvincible ? 'animate-pulse' : ''}`}
              style={{ 
                transform: player.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                filter: isInvincible ? 'drop-shadow(0 0 10px #fef08a)' : 'none',
              }}
            >
                🐶
            </div>
        </GameObject>

        {enemies.map(enemy => {
          const config = ZOMBIE_TYPE_CONFIGS[enemy.zombieType!];
          return (
            <React.Fragment key={enemy.id}>
              <GameObject {...enemy}>
                <div className="text-5xl" style={{ transform: enemy.direction === 'right' ? 'scaleX(-1)' : 'scaleX(1)' }}>
                  {config.emoji}
                </div>
              </GameObject>
              {(enemy.zombieType === ZombieType.Tank || enemy.zombieType === ZombieType.Shooter) && enemy.health! < enemy.maxHealth! && (
                 <div 
                    className="absolute bg-gray-500 rounded z-20" 
                    style={{ 
                        width: enemy.width, 
                        height: 5,
                        transform: `translate(${enemy.x}px, ${enemy.y - 10}px)`,
                    }}
                >
                    <div 
                        className="bg-red-500 h-full rounded" 
                        style={{ width: `${(enemy.health! / enemy.maxHealth!) * 100}%` }}
                    ></div>
                </div>
              )}
            </React.Fragment>
          )
        })}
        
        {projectiles.map(p => (
         <GameObject key={p.id} {...p}>
            <div className="text-4xl drop-shadow-lg" style={{ transform: p.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>{p.id % 2 === 0 ? '🦴' : '🍪'}</div>
         </GameObject>
        ))}

        {enemyProjectiles.map(p => (
         <GameObject key={p.id} {...p}>
            <div className="text-3xl">🟢</div>
         </GameObject>
        ))}

        {bossProjectiles.map(p => (
         <GameObject key={p.id} {...p}>
            <div className="text-4xl">🔥</div>
         </GameObject>
        ))}
        
        {powerUps.map(p => (
          <GameObject key={p.id} {...p}>
            <PowerUpEmoji type={p.powerUpType!} />
          </GameObject>
        ))}

        {boss && (
          <>
              <GameObject {...boss}>
                <div className="text-7xl">👹</div>
              </GameObject>
              <div 
                  className="absolute bg-gray-500 rounded z-20" 
                  style={{ 
                      width: boss.width, 
                      height: 10,
                      transform: `translate(${boss.x}px, ${boss.y - 15}px)`,
                  }}
              >
                  <div 
                      className="bg-red-500 h-full rounded" 
                      style={{ width: `${(boss.health / boss.maxHealth) * 100}%` }}
                  ></div>
              </div>
          </>
        )}
      </div>
    </div>
  );
};
