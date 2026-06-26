import type { MeasurementEntry } from '../types';
import type { HeroStageNumber } from '../types/gameAssets';
import { HERO_STAGE_COUNT } from '../types/gameAssets';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getStartWeight(measurements: MeasurementEntry[]): number | null {
  const sorted = [...measurements]
    .filter((m) => m.weight !== null && m.weight !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date));
  return sorted[0]?.weight ?? null;
}

export function getBestWeightForWeightLoss(measurements: MeasurementEntry[]): number | null {
  const weights = measurements
    .map((m) => m.weight)
    .filter((w): w is number => w !== null && w !== undefined);
  if (weights.length === 0) return null;
  return Math.min(...weights);
}

/** Progress ratio 0..1 based on best achieved weight (no rollback on spikes) */
export function getWeightLossProgressRatio(params: {
  startWeight: number | null | undefined;
  currentWeight: number | null | undefined;
  targetWeight: number | null | undefined;
}): number {
  const { startWeight, currentWeight, targetWeight } = params;
  if (
    startWeight === null ||
    startWeight === undefined ||
    currentWeight === null ||
    currentWeight === undefined ||
    targetWeight === null ||
    targetWeight === undefined
  ) {
    return 0;
  }
  if (targetWeight >= startWeight) return 0;

  const total = startWeight - targetWeight;
  if (total <= 0) return 0;

  return clamp((startWeight - currentWeight) / total, 0, 1);
}

export function getWeightLossProgressPercent(params: {
  startWeight: number | null | undefined;
  currentWeight: number | null | undefined;
  targetWeight: number | null | undefined;
}): number {
  return getWeightLossProgressRatio(params) * 100;
}

export function getHeroStageFromWeightLoss(params: {
  startWeight: number | null | undefined;
  currentWeight: number | null | undefined;
  targetWeight: number | null | undefined;
}): HeroStageNumber {
  const ratio = getWeightLossProgressRatio(params);
  if (ratio <= 0) return 1;

  const stage = Math.min(
    HERO_STAGE_COUNT,
    Math.max(1, Math.floor(ratio * HERO_STAGE_COUNT) + 1),
  );
  return stage as HeroStageNumber;
}

export function getChapterFromStage(stage: number): 1 | 2 | 3 | 4 | 5 {
  if (stage <= 4) return 1;
  if (stage <= 8) return 2;
  if (stage <= 12) return 3;
  if (stage <= 16) return 4;
  return 5;
}

export function getNextStageProgress(params: {
  progressPercent: number;
  currentStage: HeroStageNumber;
}): {
  currentStage: HeroStageNumber;
  nextStage: HeroStageNumber | null;
  progressToNextStage: number;
} {
  const { progressPercent, currentStage } = params;
  const totalProgress = clamp(progressPercent / 100, 0, 1);

  if (currentStage >= HERO_STAGE_COUNT) {
    return { currentStage, nextStage: null, progressToNextStage: 100 };
  }

  const stageSize = 1 / HERO_STAGE_COUNT;
  const stageStart = (currentStage - 1) * stageSize;
  const stageEnd = currentStage * stageSize;
  const progressToNextStage = clamp(
    ((totalProgress - stageStart) / (stageEnd - stageStart)) * 100,
    0,
    100,
  );

  return {
    currentStage,
    nextStage: (currentStage + 1) as HeroStageNumber,
    progressToNextStage,
  };
}

export function resolveHeroProgressFromMeasurements(
  measurements: MeasurementEntry[],
  targetWeight: number | null | undefined,
): {
  startWeight: number | null;
  bestWeight: number | null;
  progressPercent: number;
  stage: HeroStageNumber;
  chapter: 1 | 2 | 3 | 4 | 5;
} {
  const startWeight = getStartWeight(measurements);
  const bestWeight = getBestWeightForWeightLoss(measurements);
  const progressPercent = getWeightLossProgressPercent({
    startWeight,
    currentWeight: bestWeight,
    targetWeight,
  });
  const stage = getHeroStageFromWeightLoss({
    startWeight,
    currentWeight: bestWeight,
    targetWeight,
  });

  return {
    startWeight,
    bestWeight,
    progressPercent,
    stage,
    chapter: getChapterFromStage(stage),
  };
}

// TODO: muscle_gain and recomposition modes
