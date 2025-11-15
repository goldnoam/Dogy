
export enum GameStatus {
  Start,
  Playing,
  Paused,
  GameOver,
  Continue,
}

export type GameObjectType = 'player' | 'enemy' | 'projectile' | 'boss' | 'boss_projectile' | 'power_up' | 'enemy_projectile';

export enum ZombieType {
  Regular = 'REGULAR',
  Fast = 'FAST',
  Tank = 'TANK',
  Zigzag = 'ZIGZAG',
  Flying = 'FLYING',
  Shooter = 'SHOOTER',
}

export enum PowerUpType {
  SpeedBoost = 'SPEED_BOOST',
  Invincibility = 'INVINCIBILITY',
}

export interface HighScoreEntry {
  score: number;
  date: string;
}

export interface GameObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: GameObjectType;
  direction?: 'left' | 'right';
  isGrounded?: boolean;
  zombieType?: ZombieType;
  health?: number;
  maxHealth?: number;
  baseY?: number;
  age?: number;
  enemyShootCooldown?: number; // for shooter enemies
  powerUpType?: PowerUpType;
}

export interface Boss extends GameObject {
  health: number;
  maxHealth: number;
}

export interface ActivePowerUp {
    type: PowerUpType;
    timeLeft: number;
}

export interface GameState {
  status: GameStatus;
  level: number;
  lives: number;
  score: number;
  highScore: number;
  highScores: HighScoreEntry[];
  timeLeft: number;
  isBossLevel: boolean;
  player: GameObject;
  enemies: GameObject[];
  projectiles: GameObject[];
  boss: Boss | null;
  bossProjectiles: GameObject[];
  powerUps: GameObject[];
  enemyProjectiles: GameObject[];
  activePowerUp: ActivePowerUp | null;
  shootCooldown: number;
  bossShootCooldown: number;
  nextEnemyId: number;
  nextProjectileId: number;
  nextPowerUpId: number;
  enemySpawnTimer: number;
  canContinue: boolean;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'RESTART_GAME'; payload: GameState }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'CONTINUE_GAME' }
  | { type: 'UPDATE'; payload: { deltaTime: number, keysPressed: Set<string> } }
  | { type: 'SHOOT' }
  | { type: 'JUMP' }
  | { type: 'ENEMY_HIT'; payload: { enemyId: number; projectileId: number } }
  | { type: 'BOSS_HIT'; payload: { projectileId: number } }
  | { type: 'PLAYER_HIT'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'GAME_OVER' };
