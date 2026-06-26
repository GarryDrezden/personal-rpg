import type { FreedomScoreLevelId } from './freedomScore';

export type SeenFreedomLevel = {
  levelId: FreedomScoreLevelId;
  seenAt: string;
};

export type FreedomLevelUnlock = {
  levelId: FreedomScoreLevelId;
  title: string;
  description: string;
  unlockText: string;
  icon: string;
  score: number;
  xpReward: number;
  coinReward: number;
};
