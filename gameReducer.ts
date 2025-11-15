import { GameState, GameAction, GameStatus, GameObject, Boss, ZombieType } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SPEED,
  PROJECTILE_SPEED,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  LEVEL_DURATION,
  ENEMY_SPAWN_RATE_INITIAL,
  BOSS_WIDTH,
  BOSS_HEIGHT,
  BOSS_INITIAL_HEALTH,
  BOSS_SPEED,
  PLAYER_SHOOT_COOLDOWN,
  PLAYER_JUMP_STRENGTH,
  GRAVITY,
  ZOMBIE_TYPE_CONFIGS,
  ZIGZAG_AMPLITUDE,
  ZIGZAG_FREQUENCY,
  BOSS_MIN_DISTANCE_FROM_PLAYER,
  BOSS_SHOOT_COOLDOWN_INITIAL,
  BOSS_PROJECTILE_SPEED,
  BOSS_PROJECTILE_WIDTH,
  BOSS_PROJECTILE_HEIGHT,
} from './constants';
import { audioService } from './services/audioService';

const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  if (!obj1 || !obj2) return false;
  // AABB 2D Collision Detection
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

const getRandomZombieType = (level: number): ZombieType => {
  const rand = Math.random();
  if (level >= 7) {
    if (rand < 0.2) return ZombieType.Tank;
    if (rand < 0.4) return ZombieType.Zigzag;
    if (rand < 0.7) return ZombieType.Fast;
    return ZombieType.Regular;
  }
  if (level >= 5) {
    if (rand < 0.2) return ZombieType.Zigzag;
    if (rand < 0.5) return ZombieType.Fast;
    return ZombieType.Regular;
  }
  if (level >= 3) {
    if (rand < 0.3) return ZombieType.Fast;
    return ZombieType.Regular;
  }
  return ZombieType.Regular;
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: GameStatus.Playing,
        nextEnemyId: 1,
        nextProjectileId: 1,
        enemySpawnTimer: ENEMY_SPAWN_RATE_INITIAL,
        shootCooldown: 0,
      };

    case 'RESTART_GAME':
        return action.payload;

    case 'PAUSE_GAME':
        return { ...state, status: GameStatus.Paused };
    
    case 'RESUME_GAME':
        return { ...state, status: GameStatus.Playing };

    case 'JUMP': {
        if (state.player.isGrounded) {
            const newPlayer = { ...state.player, vy: -PLAYER_JUMP_STRENGTH, isGrounded: false };
            return { ...state, player: newPlayer };
        }
        return state;
    }

    case 'UPDATE': {
      if (state.status !== GameStatus.Playing) return state;

      const { deltaTime, keysPressed } = action.payload;
      
      let newState: GameState = {
        ...state,
        player: { ...state.player },
        enemies: [...state.enemies],
        projectiles: [...state.projectiles],
        bossProjectiles: [...state.bossProjectiles],
        boss: state.boss ? { ...state.boss } : null,
      };
      
      newState.shootCooldown = Math.max(0, state.shootCooldown - deltaTime);
      if (!newState.isBossLevel) {
          newState.enemySpawnTimer = Math.max(0, state.enemySpawnTimer - deltaTime);
      }

      newState.timeLeft -= deltaTime;
      if (newState.timeLeft <= 0) {
        if (newState.isBossLevel && newState.boss) {
            newState.score += 500;
            const newLives = newState.lives + 1;
            audioService.playLevelUpSound();
            return { ...newState, lives: newLives, status: GameStatus.Playing, isBossLevel: false, boss: null, timeLeft: LEVEL_DURATION, level: newState.level + 1 };
        } else if (!newState.isBossLevel) {
            return { ...newState, status: GameStatus.Playing, isBossLevel: true, enemies: [], projectiles: [], bossProjectiles: [], timeLeft: LEVEL_DURATION };
        }
      }

      // Player horizontal movement
      let dx = 0;
      if (keysPressed.has('ArrowLeft') || keysPressed.has('KeyA')) dx -= 1;
      if (keysPressed.has('ArrowRight') || keysPressed.has('KeyD')) dx += 1;
      
      newState.player.vx = dx * PLAYER_SPEED;
      newState.player.x += newState.player.vx * deltaTime;

      if (dx !== 0) {
        newState.player.direction = dx > 0 ? 'right' : 'left';
      }
      
      // Apply physics to player
      newState.player.vy += GRAVITY * deltaTime;
      newState.player.y += newState.player.vy * deltaTime;
      
      // Screen and Ground Boundaries for Player
      const groundY = GAME_HEIGHT - newState.player.height;
      if (newState.player.y >= groundY) {
          newState.player.y = groundY;
          newState.player.vy = 0;
          newState.player.isGrounded = true;
      } else {
          newState.player.isGrounded = false;
      }
      newState.player.x = Math.max(0, Math.min(GAME_WIDTH - newState.player.width, newState.player.x));

      // Move projectiles
      newState.projectiles = newState.projectiles
        .map(p => ({ ...p, x: p.x + p.vx * deltaTime }))
        .filter(p => p.x < GAME_WIDTH && p.x > -p.width);
      
      newState.bossProjectiles = newState.bossProjectiles
        .map(p => ({ ...p, x: p.x + p.vx * deltaTime }))
        .filter(p => p.x < GAME_WIDTH && p.x > -p.width);

      if (newState.isBossLevel) {
        if (!newState.boss) {
            const newBoss: Boss = {
                id: 1000,
                x: GAME_WIDTH - BOSS_WIDTH,
                y: GAME_HEIGHT - BOSS_HEIGHT,
                width: BOSS_WIDTH,
                height: BOSS_HEIGHT,
                vx: -BOSS_SPEED * (1 + (newState.level - 1) * 0.25),
                vy: 0, 
                type: 'boss',
                health: BOSS_INITIAL_HEALTH + (newState.level - 1) * 2,
                maxHealth: BOSS_INITIAL_HEALTH + (newState.level - 1) * 2,
                isGrounded: true,
            };
            newState.boss = newBoss;
            newState.bossShootCooldown = BOSS_SHOOT_COOLDOWN_INITIAL;
        } else {
            newState.bossShootCooldown = Math.max(0, newState.bossShootCooldown - deltaTime);

            const playerCenter = newState.player.x + newState.player.width / 2;
            const bossCenter = newState.boss.x + newState.boss.width / 2;
            const distance = playerCenter - bossCenter;
            const speed = BOSS_SPEED * (1 + (newState.level - 1) * 0.25);

            if (Math.abs(distance) > BOSS_MIN_DISTANCE_FROM_PLAYER) {
                newState.boss.vx = Math.sign(distance) * speed;
            } else if (Math.abs(distance) < BOSS_MIN_DISTANCE_FROM_PLAYER - 20) { // Hysteresis to prevent jitter
                newState.boss.vx = -Math.sign(distance) * speed;
            } else {
                newState.boss.vx = 0;
            }
            
            newState.boss.x += newState.boss.vx * deltaTime;
            newState.boss.x = Math.max(0, Math.min(GAME_WIDTH - newState.boss.width, newState.boss.x));
            newState.boss.y = GAME_HEIGHT - newState.boss.height;

            if (newState.bossShootCooldown <= 0) {
                audioService.playBossShootSound();
                const projectileVx = Math.sign(distance) * BOSS_PROJECTILE_SPEED;
                const newBossProjectile: GameObject = {
                    id: newState.nextProjectileId,
                    x: bossCenter - BOSS_PROJECTILE_WIDTH / 2,
                    y: newState.boss.y + newState.boss.height / 2 - BOSS_PROJECTILE_HEIGHT / 2,
                    width: BOSS_PROJECTILE_WIDTH,
                    height: BOSS_PROJECTILE_HEIGHT,
                    vx: projectileVx,
                    vy: 0,
                    type: 'boss_projectile',
                };
                newState.nextProjectileId++;
                newState.bossProjectiles.push(newBossProjectile);
                const shootCooldown = Math.max(0.5, BOSS_SHOOT_COOLDOWN_INITIAL - (newState.level - 1) * 0.1);
                newState.bossShootCooldown = shootCooldown;
            }
        }
      } else {
         // Spawn and move enemies
        if (newState.enemySpawnTimer <= 0) {
            const spawnFromRight = Math.random() > 0.5;
            const zombieType = getRandomZombieType(newState.level);
            const config = ZOMBIE_TYPE_CONFIGS[zombieType];
            const baseSpeed = (100 + newState.level * 40);
            const enemySpeed = baseSpeed * config.speedMultiplier;

            const newEnemy: GameObject = {
                id: newState.nextEnemyId,
                x: spawnFromRight ? GAME_WIDTH : -ENEMY_WIDTH,
                y: GAME_HEIGHT - ENEMY_HEIGHT,
                width: ENEMY_WIDTH,
                height: ENEMY_HEIGHT,
                vx: spawnFromRight ? -enemySpeed : enemySpeed,
                vy: 0, 
                type: 'enemy',
                isGrounded: true,
                direction: spawnFromRight ? 'left' : 'right',
                zombieType: zombieType,
                health: config.health,
                maxHealth: config.health,
                baseY: GAME_HEIGHT - ENEMY_HEIGHT,
                age: 0,
            };
            newState.nextEnemyId++;
            newState.enemies.push(newEnemy);
            const spawnRateFactor = Math.max(0.15, ENEMY_SPAWN_RATE_INITIAL - newState.level * 0.15);
            newState.enemySpawnTimer = spawnRateFactor * (0.8 + Math.random() * 0.4);
        }

        newState.enemies = newState.enemies
          .map(e => {
            const updatedE = { ...e };
            updatedE.age = (e.age || 0) + deltaTime;
            updatedE.x += e.vx * deltaTime;

            if (e.zombieType === ZombieType.Zigzag) {
              updatedE.y = e.baseY! + Math.sin(updatedE.age * ZIGZAG_FREQUENCY) * ZIGZAG_AMPLITUDE;
            }
            return updatedE;
          })
          .filter(e => e.x > -e.width && e.x < GAME_WIDTH);
      }

      // Collision detection
      if (newState.isBossLevel && newState.boss) {
        const usedProjectileIds = new Set<number>();
        for (const p of newState.projectiles) {
          if (!newState.boss) break;
          
          if (checkCollision(p, newState.boss)) {
            usedProjectileIds.add(p.id);
            newState.boss.health -= 1;
            newState.score += 25;
            audioService.playHitSound();

            if (newState.boss.health <= 0) {
              newState.score += 1000;
              newState.level += 1;
              newState.lives += 1;
              newState.isBossLevel = false;
              newState.boss = null;
              newState.projectiles = [];
              newState.bossProjectiles = [];
              newState.timeLeft = LEVEL_DURATION;
              audioService.playBossDefeatSound();
              audioService.playLevelUpSound();
            }
          }
        }
        newState.projectiles = newState.projectiles.filter(p => !usedProjectileIds.has(p.id));

      } else {
        const usedProjectileIds = new Set<number>();
        const enemiesThisFrame = [...newState.enemies];

        for (const p of newState.projectiles) {
            if (usedProjectileIds.has(p.id)) continue;
    
            for (const e of enemiesThisFrame) {
                if (e.health! <= 0) continue; // Skip dead enemies
    
                if (checkCollision(p, e)) {
                    e.health! -= 1;
                    usedProjectileIds.add(p.id);
                    audioService.playHitSound();
                    
                    if (e.health! <= 0) {
                        const config = ZOMBIE_TYPE_CONFIGS[e.zombieType!];
                        newState.score += config.score;
                    }
                    
                    break; // Projectile is used up
                }
            }
        }
        
        newState.enemies = enemiesThisFrame.filter(e => e.health! > 0);
        newState.projectiles = newState.projectiles.filter(p => !usedProjectileIds.has(p.id));
      }

      let playerHit = false;
      if (newState.isBossLevel && newState.boss) {
          if (checkCollision(newState.player, newState.boss)) playerHit = true;
      } else {
        for (const e of newState.enemies) {
            if (checkCollision(newState.player, e)) {
                playerHit = true;
                newState.enemies = newState.enemies.filter(en => en.id !== e.id);
                break; 
            }
        }
      }

      const hitBossProjectiles = new Set<number>();
        for (const p of newState.bossProjectiles) {
            if(checkCollision(newState.player, p)) {
                playerHit = true;
                hitBossProjectiles.add(p.id);
                break; // one hit is enough
            }
        }

        if (hitBossProjectiles.size > 0) {
            newState.bossProjectiles = newState.bossProjectiles.filter(p => !hitBossProjectiles.has(p.id));
        }

      if (playerHit) {
          newState.lives -= 1;
          audioService.playPlayerHitSound();
          if (newState.lives <= 0) {
              return gameReducer(newState, { type: 'GAME_OVER' });
          }
      }
      
      return newState;
    }

    case 'SHOOT': {
      if (state.shootCooldown > 0) {
        return state;
      }
      
      audioService.playShootSound();
      
      const projectileVx = state.player.direction === 'right' ? PROJECTILE_SPEED : -PROJECTILE_SPEED;
      
      const newProjectile: GameObject = {
        id: state.nextProjectileId,
        x: state.player.x + (state.player.direction === 'right' ? state.player.width : -PROJECTILE_WIDTH),
        y: state.player.y + state.player.height / 2 - PROJECTILE_HEIGHT / 2,
        width: PROJECTILE_WIDTH,
        height: PROJECTILE_HEIGHT,
        vx: projectileVx,
        vy: 0,
        type: 'projectile',
      };
      return {
        ...state,
        projectiles: [...state.projectiles, newProjectile],
        nextProjectileId: state.nextProjectileId + 1,
        shootCooldown: Math.max(0.08, PLAYER_SHOOT_COOLDOWN - state.level * 0.015),
      };
    }
    
    case 'GAME_OVER': {
      audioService.playGameOverSound();
      const newHighScore = Math.max(state.score, state.highScore);
      if (newHighScore > state.highScore) {
        localStorage.setItem('fluffyDogHighScore', newHighScore.toString());
      }
      return {
        ...state,
        status: GameStatus.GameOver,
        highScore: newHighScore,
      };
    }
      
    default:
      return state;
  }
};