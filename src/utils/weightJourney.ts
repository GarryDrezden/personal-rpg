import type { MeasurementEntry } from '../types';
import { sortMeasurementsByDate } from './measurements';

export const WEIGHT_TARGET_KG = 100;
export const WEIGHT_DEATH_KG = 200;
export const WEIGHT_STAGE_COUNT = 7;

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
  stage: number;
  stageInterval: number;
  /** Сколько ещё сбросить до следующей стадии (null если цель достигнута) */
  kgUntilNextStage: number | null;
  /** Номер следующей стадии 2…7 */
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

  const interval = toLoseTotal > 0 ? toLoseTotal / WEIGHT_STAGE_COUNT : 0;
  const stage =
    toLoseTotal <= 0
      ? 0
      : lostFromPeak >= toLoseTotal
        ? WEIGHT_STAGE_COUNT - 1
        : Math.min(WEIGHT_STAGE_COUNT - 1, Math.floor(lostFromPeak / interval));

  const deltaSinceLast =
    previousWeight !== null ? currentWeight - previousWeight : null;

  const isGameOver = currentWeight >= WEIGHT_DEATH_KG;
  const kgUntilDeath = isGameOver ? 0 : WEIGHT_DEATH_KG - currentWeight;

  const atFinalStage = stage >= WEIGHT_STAGE_COUNT - 1;
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
    stageInterval: interval,
    kgUntilNextStage,
    nextStage,
    kgUntilDeath,
    isGameOver,
  };
}
