import type { MeasurementEntry } from '../types';
import { sortMeasurementsByDate } from './measurements';
import { WEIGHT_STAGE_COUNT } from './weightStages';

export const WEIGHT_TARGET_KG = 100;
export const WEIGHT_DEATH_KG = 200;

/** Минимум картинок в пути (напр. 75→65 кг: стадии 5, 6, 7) */
const MIN_VISUAL_STAGES = 3;

/** Пороги «сколько сбросить» → сколько стадий показывать */
const VISUAL_STAGE_TIERS: { maxKg: number; stages: number }[] = [
  { maxKg: 12, stages: 3 },
  { maxKg: 24, stages: 4 },
  { maxKg: 36, stages: 5 },
  { maxKg: 48, stages: 6 },
  { maxKg: Infinity, stages: 7 },
];

export interface VisualStageRange {
  /** Сколько стадий в прогрессе (3…7) */
  count: number;
  /** Индекс первой картинки 0…6 (stage-1 … stage-7) */
  startImage: number;
}

export function getVisualStageRange(toLoseTotal: number): VisualStageRange {
  const stages =
    VISUAL_STAGE_TIERS.find((t) => toLoseTotal <= t.maxKg)?.stages ?? WEIGHT_STAGE_COUNT;
  return {
    count: stages,
    startImage: WEIGHT_STAGE_COUNT - stages,
  };
}

export interface WeightJourney {
  hasData: boolean;
  /** Максимальный вес за всю историю — точка отсчёта */
  peakWeight: number | null;
  currentWeight: number | null;
  previousWeight: number | null;
  targetWeight: number;
  deathLimit: number;
  /** peak − цель, напр. 181 − 100 = 81 */
  toLoseTotal: number;
  /** Сброшено от пика: peak − текущий */
  lostFromPeak: number;
  /** Изменение с прошлого замера (+ = набрал) */
  deltaSinceLast: number | null;
  remaining: number;
  progressPercent: number;
  /** Индекс прогресса 0…visualStageCount−1 */
  stage: number;
  /** Индекс картинки 0…6 для отображения */
  imageStage: number;
  visualStageCount: number;
  visualStartImage: number;
  stageInterval: number;
  /** Сколько ещё сбросить до следующей стадии (null если цель достигнута) */
  kgUntilNextStage: number | null;
  /** Номер следующей стадии в визуальном пути */
  nextStage: number | null;
  kgUntilDeath: number | null;
  isGameOver: boolean;
}

export function calcWeightJourney(
  measurements: MeasurementEntry[],
  targetWeight = WEIGHT_TARGET_KG,
): WeightJourney {
  const empty: WeightJourney = {
    hasData: false,
    peakWeight: null,
    currentWeight: null,
    previousWeight: null,
    targetWeight,
    deathLimit: WEIGHT_DEATH_KG,
    toLoseTotal: 0,
    lostFromPeak: 0,
    deltaSinceLast: null,
    remaining: 0,
    progressPercent: 0,
    stage: 0,
    imageStage: 0,
    visualStageCount: MIN_VISUAL_STAGES,
    visualStartImage: WEIGHT_STAGE_COUNT - MIN_VISUAL_STAGES,
    stageInterval: 0,
    kgUntilNextStage: null,
    nextStage: null,
    kgUntilDeath: null,
    isGameOver: false,
  };

  const withWeight = sortMeasurementsByDate(measurements).filter(
    (m) => m.weight !== null && m.weight > 0,
  );

  if (withWeight.length === 0) return empty;

  const peakWeight = Math.max(...withWeight.map((m) => m.weight!));
  const currentWeight = withWeight[withWeight.length - 1].weight!;
  const previousWeight =
    withWeight.length > 1 ? withWeight[withWeight.length - 2].weight! : null;

  const toLoseTotal = Math.max(0, peakWeight - targetWeight);
  const lostFromPeak = Math.max(0, peakWeight - currentWeight);
  const remaining = Math.max(0, currentWeight - targetWeight);
  const progressPercent =
    toLoseTotal > 0
      ? Math.min(100, (lostFromPeak / toLoseTotal) * 100)
      : 0;

  const { count: visualStageCount, startImage: visualStartImage } =
    getVisualStageRange(toLoseTotal);

  const interval =
    toLoseTotal > 0 ? toLoseTotal / visualStageCount : 0;
  const stage =
    toLoseTotal <= 0
      ? 0
      : lostFromPeak >= toLoseTotal
        ? visualStageCount - 1
        : Math.min(visualStageCount - 1, Math.floor(lostFromPeak / interval));

  const imageStage = Math.min(
    WEIGHT_STAGE_COUNT - 1,
    visualStartImage + stage,
  );

  const deltaSinceLast =
    previousWeight !== null ? currentWeight - previousWeight : null;

  const isGameOver = currentWeight >= WEIGHT_DEATH_KG;
  const kgUntilDeath = isGameOver ? 0 : WEIGHT_DEATH_KG - currentWeight;

  const atFinalStage = stage >= visualStageCount - 1;
  const kgUntilNextStage = atFinalStage
    ? null
    : Math.max(0, interval * (stage + 1) - lostFromPeak);
  const nextStage = atFinalStage ? null : stage + 2;

  return {
    hasData: true,
    peakWeight,
    currentWeight,
    previousWeight,
    targetWeight,
    deathLimit: WEIGHT_DEATH_KG,
    toLoseTotal,
    lostFromPeak,
    deltaSinceLast,
    remaining,
    progressPercent,
    stage,
    imageStage,
    visualStageCount,
    visualStartImage,
    stageInterval: interval,
    kgUntilNextStage,
    nextStage,
    kgUntilDeath,
    isGameOver,
  };
}
