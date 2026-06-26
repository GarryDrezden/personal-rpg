import type { FreedomScoreLevelId } from '../types/freedomScore';
import type { FreedomLevelUnlock } from '../types/freedomUnlock';
import { FREEDOM_LEVEL_UNLOCKS } from '../constants/freedomUnlocks';

const STORAGE_KEY = 'personal-rpg-seen-freedom-levels';

type SeenFreedomLevelsMap = Record<string, string>;

function readSeenMap(): SeenFreedomLevelsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SeenFreedomLevelsMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSeenMap(map: SeenFreedomLevelsMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getSeenFreedomLevelIds(): FreedomScoreLevelId[] {
  return Object.keys(readSeenMap()) as FreedomScoreLevelId[];
}

export function markFreedomLevelSeen(levelId: FreedomScoreLevelId): void {
  const map = readSeenMap();
  if (map[levelId]) return;
  map[levelId] = new Date().toISOString();
  writeSeenMap(map);
}

export function isFreedomLevelSeen(levelId: FreedomScoreLevelId): boolean {
  return levelId in readSeenMap();
}

export function getNewFreedomLevelUnlock(params: {
  currentLevelId: FreedomScoreLevelId;
  currentScore: number;
}): FreedomLevelUnlock | null {
  const { currentLevelId, currentScore } = params;

  if (currentLevelId === 'awakening' || currentScore < 10) {
    return null;
  }

  if (isFreedomLevelSeen(currentLevelId)) {
    return null;
  }

  const def = FREEDOM_LEVEL_UNLOCKS[currentLevelId];
  if (!def) {
    return null;
  }

  return {
    ...def,
    score: currentScore,
  };
}

export function freedomLevelRelatedId(levelId: FreedomScoreLevelId): string {
  return `freedom_level_${levelId}`;
}
