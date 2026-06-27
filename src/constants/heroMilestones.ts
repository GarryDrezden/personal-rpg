import type { HeroStageNumber } from '../types/gameAssets';

/** Пять крупных вех трансформации — на главной вместо всех 20 стадий */
export const HERO_MILESTONE_STAGES = [1, 5, 10, 15, 20] as const satisfies readonly HeroStageNumber[];

export type HeroMilestoneStage = (typeof HERO_MILESTONE_STAGES)[number];
