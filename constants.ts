
import { ZombieType } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 50;
export const PLAYER_SPEED = 350; // x-axis
export const PLAYER_SHOOT_COOLDOWN = 0.3; // seconds
export const PLAYER_JUMP_STRENGTH = 800;
export const GRAVITY = 2500;

export const ENEMY_WIDTH = 55;
export const ENEMY_HEIGHT = 50;
export const ENEMY_SPAWN_RATE_INITIAL = 1.5; // seconds

export const PROJECTILE_WIDTH = 30;
export const PROJECTILE_HEIGHT = 20;
export const PROJECTILE_SPEED = 700; // x-axis speed

export const BOSS_WIDTH = 120;
export const BOSS_HEIGHT = 120;
export const BOSS_INITIAL_HEALTH = 10;
export const BOSS_SPEED = 150; 
export const BOSS_MIN_DISTANCE_FROM_PLAYER = 300;
export const BOSS_SHOOT_COOLDOWN_INITIAL = 2.0;

export const BOSS_PROJECTILE_WIDTH = 40;
export const BOSS_PROJECTILE_HEIGHT = 40;
export const BOSS_PROJECTILE_SPEED = 400;

export const LEVEL_DURATION = 15; // seconds

export const ZIGZAG_AMPLITUDE = 20;
export const ZIGZAG_FREQUENCY = 5;

export const POWERUP_WIDTH = 40;
export const POWERUP_HEIGHT = 40;
export const POWERUP_DURATION = 8; // seconds
export const POWERUP_DROP_CHANCE = 0.15; // 15% chance
export const SPEED_BOOST_MULTIPLIER = 1.5;

export const SHOOTER_ENEMY_RANGE = 400;
export const SHOOTER_ENEMY_COOLDOWN = 2.5; // seconds
export const ENEMY_PROJECTILE_WIDTH = 25;
export const ENEMY_PROJECTILE_HEIGHT = 25;
export const ENEMY_PROJECTILE_SPEED = 300;

export const ZOMBIE_TYPE_CONFIGS = {
  [ZombieType.Regular]: {
    speedMultiplier: 1.0,
    health: 1,
    score: 100,
    emoji: '🧟',
  },
  [ZombieType.Fast]: {
    speedMultiplier: 1.5,
    health: 1,
    score: 150,
    emoji: '🐕‍🦺',
  },
  [ZombieType.Tank]: {
    speedMultiplier: 0.7,
    health: 3,
    score: 300,
    emoji: '🦬',
  },
  [ZombieType.Zigzag]: {
    speedMultiplier: 1.2,
    health: 1,
    score: 200,
    emoji: '🐩',
  },
  [ZombieType.Flying]: {
    speedMultiplier: 1.1,
    health: 1,
    score: 250,
    emoji: '🦇',
  },
  [ZombieType.Shooter]: {
    speedMultiplier: 0.5,
    health: 2,
    score: 400,
    emoji: '💀',
  },
};
