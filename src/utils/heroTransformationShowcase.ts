import { HERO_MILESTONE_STAGES } from '../constants/heroMilestones';
import type { HeroStageNumber } from '../types/gameAssets';

export type MilestoneFlankStages = {
  /** Предыдущая веха; null если слева показывается deathState */
  left: HeroStageNumber | null;
  right: HeroStageNumber | null;
  /** Стадия 1: слева «Смерть» (200 кг) вместо прошлой формы */
  deathState: boolean;
};

/** Ближайшие вехи + death pole для cinematic-сцены кодекса. */
export function resolveMilestoneFlankStages(
  displayStage: HeroStageNumber,
): MilestoneFlankStages {
  const milestones = HERO_MILESTONE_STAGES;

  if (displayStage === 1) {
    return { left: null, right: 5, deathState: true };
  }

  if (displayStage <= 4) {
    const right = milestones.find((m) => m > displayStage) ?? null;
    return { left: null, right, deathState: false };
  }

  if (displayStage === 20) {
    return { left: 15, right: null, deathState: false };
  }

  const previous = milestones.filter((m) => m < displayStage);
  const next = milestones.find((m) => m > displayStage) ?? null;

  return {
    left: previous.length ? previous[previous.length - 1]! : null,
    right: next,
    deathState: false,
  };
}

export function isStageUnlocked(
  stage: HeroStageNumber,
  currentStage: HeroStageNumber,
): boolean {
  return stage <= currentStage;
}
