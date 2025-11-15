
import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { PauseScreen } from './components/PauseScreen';
import { MobileControls } from './components/MobileControls';
import { GameState, GameObject, GameStatus } from './types';
import { gameReducer } from './gameReducer';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_WIDTH, 
  PLAYER_HEIGHT,
  LEVEL_DURATION,
  ENEMY_SPAWN_RATE_INITIAL,
} from './constants';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const getHighScore = () => parseInt(localStorage.getItem('fluffyDogHighScore') || '0', 10);

  const initialPlayer: GameObject = {
    id: 0,
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    type: 'player',
    direction: 'right',
    isGrounded: true,
  };

  const initialState: GameState = {
    status: GameStatus.Start,
    level: 1,
    lives: 5,
    score: 0,
    highScore: getHighScore(),
    timeLeft: LEVEL_DURATION,
    isBossLevel: false,
    player: initialPlayer,
    enemies: [],
    projectiles: [],
    boss: null,
    bossProjectiles: [],
    shootCooldown: 0,
    bossShootCooldown: 0,
    nextEnemyId: 1,
    nextProjectileId: 1,
    enemySpawnTimer: ENEMY_SPAWN_RATE_INITIAL,
  };

  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [isMuted, setIsMuted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const keysPressedRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    audioService.setMuted(isMuted);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'KeyP' || e.code === 'Escape') {
      if (gameState.status === GameStatus.Playing) {
        dispatch({ type: 'PAUSE_GAME' });
      } else if (gameState.status === GameStatus.Paused) {
        dispatch({ type: 'RESUME_GAME' });
      }
      return;
    }

    if (e.code === 'Space' && gameState.status === GameStatus.Paused) {
      dispatch({ type: 'RESUME_GAME' });
      return;
    }
    
    // Prevent default for movement and shooting keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    if ((e.code === 'ArrowUp' || e.code === 'KeyW') && gameState.status === GameStatus.Playing) {
      dispatch({ type: 'JUMP' });
    } else {
      keysPressedRef.current.add(e.code);
    }

    if (e.code === 'Space' && gameState.status === GameStatus.Playing) {
      dispatch({ type: 'SHOOT' });
    }
  }, [gameState.status]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressedRef.current.delete(e.code);
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  
  const startGame = () => {
    audioService.init();
    dispatch({ type: 'START_GAME' });
  };
  
  const restartGame = () => {
    dispatch({ type: 'RESTART_GAME', payload: {...initialState, player: initialPlayer, highScore: getHighScore()} });
  };
  
  const resumeGame = () => {
    dispatch({ type: 'RESUME_GAME' });
  };

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Corrected to seconds
    lastTimeRef.current = timestamp;
    
    dispatch({ type: 'UPDATE', payload: { deltaTime, keysPressed: keysPressedRef.current } });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);
  
  useEffect(() => {
    if (gameState.status === GameStatus.Playing) {
      lastTimeRef.current = undefined;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, gameLoop]);
  
  const handleTouchStart = (keyCode: string) => {
    // For single-press actions like jump and shoot
    if (keyCode === 'Space') {
      dispatch({ type: 'SHOOT' });
    } else if (keyCode === 'ArrowUp') {
      dispatch({ type: 'JUMP' });
    } else {
      // For continuous-press actions like movement
      keysPressedRef.current.add(keyCode);
    }
  };

  const handleTouchEnd = (keyCode: string) => {
    // We only need to handle the release for movement keys
    if (keyCode === 'ArrowLeft' || keyCode === 'ArrowRight') {
      keysPressedRef.current.delete(keyCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-yellow-300 tracking-wider" style={{ textShadow: '2px 2px 4px #000' }}>Fluffy Dog's Zombie Platformer</h1>
      <div className="w-full max-w-4xl mx-auto">
        <div 
          style={{ 
            width: GAME_WIDTH, 
            height: GAME_HEIGHT,
          }} 
          className="relative bg-blue-300 border-4 border-yellow-300 rounded-lg shadow-2xl overflow-hidden mx-auto"
        >
          {gameState.status === GameStatus.Start && <StartScreen onStart={startGame} highScore={gameState.highScore} />}
          {gameState.status === GameStatus.Playing && <GameScreen gameState={gameState} />}
          {gameState.status === GameStatus.Paused && <PauseScreen onResume={resumeGame} />}
          {gameState.status === GameStatus.GameOver && <GameOverScreen score={gameState.score} highScore={gameState.highScore} onRestart={restartGame} />}
          {isTouchDevice && gameState.status === GameStatus.Playing && (
            <MobileControls onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
          )}
        </div>
      </div>
       <footer className="text-center text-gray-500 mt-4 text-sm w-full max-w-4xl">
        <p>A/D or Left/Right to Move | W or Up Arrow to Jump | Space to Shoot | P to Pause.</p>
        <div className="mt-2 flex justify-center items-center space-x-4">
          <span>(C) Noam Gold AI 2025</span>
          <span>|</span>
          <a href="mailto:gold.noam@gmail.com" className="text-yellow-400 hover:underline">Send Feedback</a>
          <button onClick={toggleMute} className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-md font-semibold hover:bg-yellow-300">
            {isMuted ? '🔇 Sound OFF' : '🔊 Sound ON'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
