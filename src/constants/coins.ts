import type { AchievementTier } from '../types/achievements';

/** Монеты за привычки — только положительные действия, без штрафов за алкоголь */
export const COIN_AWARDS = {
  caloriesOk: 5,
  stepsOk: 5,
  noAlcohol: 5,
  morningExercise: 3,
  gym: 5,
  journal: 3,
  cooking: 2,
  repair: 2,
  plants: 2,
  hobby: 2,
  gymWeeklyBonus: 12,
  noAlcoholWeekBonus: 15,
  caloriesWeekBonus: 15,
  measurementsMondayBonus: 8,
  weekGoalBonus: 20,
  goodDayBonus: 3,
  greatDayBonus: 5,
} as const;

export const ACHIEVEMENT_COIN_BONUS: Record<AchievementTier, number> = {
  bronze: 5,
  silver: 8,
  gold: 12,
  epic: 20,
  legendary: 30,
};
