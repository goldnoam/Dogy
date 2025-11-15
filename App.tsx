
import React, { useState, useEffect, useCallback, useReducer, useRef, useLayoutEffect } from 'react';
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
import { getHighScores } from './services/scoreManager';

const App: React.FC = () => {
  const initialHighScores = getHighScores();
  const getTopScore = () => initialHighScores.length > 0 ? initialHighScores[0].score : 0;


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
    highScore: getTopScore(),
    highScores: initialHighScores,
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
  const [scale, setScale] = useState(1);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const keysPressedRef = useRef<Set<string>>(new Set());
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
            const width = entry.contentRect.width;
            setScale(width / GAME_WIDTH);
        }
    });
    
    observer.observe(container);
    
    // Set initial scale
    const initialWidth = container.clientWidth;
    if (initialWidth) {
        setScale(initialWidth / GAME_WIDTH);
    }

    return () => observer.disconnect();
  }, []);

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
    const freshHighScores = getHighScores();
    const topScore = freshHighScores.length > 0 ? freshHighScores[0].score : 0;
    dispatch({ type: 'RESTART_GAME', payload: {...initialState, player: initialPlayer, highScores: freshHighScores, highScore: topScore } });
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
    // For single-press actions
    if (keyCode === 'Space') {
      dispatch({ type: 'SHOOT' });
    } else if (keyCode === 'ArrowUp') {
      dispatch({ type: 'JUMP' });
    } else if (keyCode === 'Pause') {
      if (gameState.status === GameStatus.Playing) {
        dispatch({ type: 'PAUSE_GAME' });
      } else if (gameState.status === GameStatus.Paused) {
        dispatch({ type: 'RESUME_GAME' });
      }
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-2 sm:p-4 font-mono">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-yellow-300 tracking-wider text-center" style={{ textShadow: '2px 2px 4px #000' }}>Fluffy Dog's Zombie Platformer</h1>
      <div className="w-full max-w-4xl mx-auto">
        <div 
          ref={gameContainerRef}
          style={{ 
            aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
          }} 
          className="relative bg-blue-300 border-2 sm:border-4 border-yellow-300 rounded-lg shadow-2xl overflow-hidden mx-auto w-full"
        >
          <div style={{
            position: 'absolute',
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}>
            {gameState.status === GameStatus.Start && <StartScreen onStart={startGame} highScores={gameState.highScores} />}
            {gameState.status === GameStatus.Playing && <GameScreen gameState={gameState} />}
            {gameState.status === GameStatus.Paused && <PauseScreen onResume={resumeGame} />}
            {gameState.status === GameStatus.GameOver && <GameOverScreen score={gameState.score} highScore={gameState.highScore} onRestart={restartGame} />}
          </div>
          {isTouchDevice && (gameState.status === GameStatus.Playing || gameState.status === GameStatus.Paused) && (
            <button
              onTouchStart={() => handleTouchStart('Pause')}
              className="absolute top-4 right-4 z-30 w-12 h-12 bg-blue-600 bg-opacity-80 rounded-full text-white flex items-center justify-center select-none active:bg-blue-500 active:scale-95 transition-transform border-2 border-blue-800 shadow-xl font-bold text-2xl"
              aria-label={gameState.status === GameStatus.Paused ? 'Resume' : 'Pause'}
            >
              {gameState.status === GameStatus.Paused ? '▶️' : '⏸️'}
            </button>
          )}
        </div>
        {isTouchDevice && (gameState.status === GameStatus.Playing || gameState.status === GameStatus.Paused) && (
          <MobileControls onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
        )}
      </div>
       <footer className="text-center text-gray-500 mt-2 sm:mt-4 text-xs sm:text-sm w-full max-w-4xl">
        <p className="hidden sm:block">A/D or Left/Right to Move | W or Up Arrow to Jump | Space to Shoot | P to Pause.</p>
        <div className="mt-2 flex justify-center items-center space-x-2 sm:space-x-4">
          <span>(C) Noam Gold AI 2025</span>
          <span className="hidden sm:inline">|</span>
          <a href="mailto:gold.noam@gmail.com" className="text-yellow-400 hover:underline">Feedback</a>
          <button onClick={toggleMute} className="px-2 py-1 sm:px-3 bg-yellow-400 text-gray-900 rounded-md font-semibold hover:bg-yellow-300">
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
