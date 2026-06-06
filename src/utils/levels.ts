import { LEVEL_THRESHOLDS } from '../constants/defaults';

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

function thresholdForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[level - 1];
  }
  let prev = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  for (let l = LEVEL_THRESHOLDS.length; l < level; l++) {
    prev = prev + l * 500;
  }
  return prev;
}

export function getLevelInfo(totalXP: number): LevelInfo {
  let level = 1;
  while (totalXP >= thresholdForLevel(level + 1)) {
    level++;
    if (level > 100) break;
  }

  const xpForCurrentLevel = thresholdForLevel(level);
  const xpForNextLevel = thresholdForLevel(level + 1);
  const range = xpForNextLevel - xpForCurrentLevel;
  const progress = range > 0 ? ((totalXP - xpForCurrentLevel) / range) * 100 : 100;

  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent: Math.min(100, Math.max(0, progress)),
  };
}
