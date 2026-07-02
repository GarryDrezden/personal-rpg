export type BaseStageTheme =
  | 'ember'
  | 'shelter'
  | 'trail'
  | 'workshop'
  | 'clarity'
  | 'hearth'
  | 'fortress'
  | 'citadel';

export type BaseStageDef = {
  id: string;
  level: number;
  title: string;
  shortTitle: string;
  description: string;
  theme: BaseStageTheme;
  unlockScore: number;
  flavorText: string;
  icon: string;
};

export type BaseScoreBreakdown = {
  savedDays: number;
  minimalDays: number;
  recoveryDays: number;
  resourceDays: number;
  movementDays: number;
  alcoholFreeDays: number;
  nutritionDays: number;
  bodyAbilities: number;
  qualifyingSeasons: number;
  plateauGuardian: number;
};

export type BaseProgressionSnapshot = {
  baseScore: number;
  breakdown: BaseScoreBreakdown;
  currentStage: BaseStageDef;
  nextStage: BaseStageDef | null;
  progressToNext: number;
  progressPercent: number;
  recentContributors: string[];
  flavorText: string;
  allStages: BaseStageDef[];
  isMaxStage: boolean;
};
