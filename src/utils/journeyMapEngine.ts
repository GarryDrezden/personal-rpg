import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { BodyAbilityProgress } from '../types/bodyAbilities';
import type {
  JourneyMapSummary,
  JourneyStage,
  JourneyStageCondition,
  JourneyStageConditionProgress,
  JourneyStageProgress,
  JourneyStageStatus,
} from '../types/journeyMap';
import { JOURNEY_STAGES } from '../constants/journeyMap';
import { isCaloriesInLimit } from './achievementEngine';
import { hasAnyDailyData } from './achievementHelpers';
import { isBadDay } from './recoveryEngine';
import {
  isStepsMinimumDone,
  isStepsNormalDone,
  isStepsExcellentDone,
  getDayMode,
} from './stepsEngine';
import {
  countCognitiveBreakDays,
  countRestMarkerDays,
  countRestRecoveryDays,
} from './resourceEngine';
import {
  getWeightLossKg,
  getWaistLossCm,
  getAllBodyAbilityProgress,
} from './bodyAbilityEngine';

type EngineParams = {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  bodyAbilityProgress?: BodyAbilityProgress[];
};

function resolveBodyAbilities(params: EngineParams): BodyAbilityProgress[] {
  if (params.bodyAbilityProgress) return params.bodyAbilityProgress;
  return getAllBodyAbilityProgress({
    dailyEntries: params.dailyEntries,
    measurements: params.measurements,
    settings: params.settings,
  });
}

function countWeightEntries(measurements: MeasurementEntry[]): number {
  return measurements.filter((m) => m.weight !== null && m.weight > 0).length;
}

function countCalorieTrackingDays(entries: DailyEntry[]): number {
  return entries.filter((e) => e.calories !== null && e.calories !== undefined).length;
}

function countCalorieLimitDays(entries: DailyEntry[], settings: AppSettings): number {
  return entries.filter((e) => isCaloriesInLimit(e, settings)).length;
}

function countNoAlcoholDays(entries: DailyEntry[]): number {
  return entries.filter((e) => e.alcohol === 'none').length;
}

function countGymDays(entries: DailyEntry[]): number {
  return entries.filter((e) => e.gym).length;
}

function countRecoveryDays(entries: DailyEntry[]): number {
  return entries.filter((e) => {
    const mode = getDayMode(e.dayMode);
    return mode === 'recovery' || mode === 'minimal';
  }).length;
}

function countMinimalDays(entries: DailyEntry[]): number {
  return entries.filter((e) => getDayMode(e.dayMode) === 'minimal').length;
}

function countReturnAfterBadDay(entries: DailyEntry[], settings: AppSettings): number {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));
  let count = 0;

  for (const entry of sorted) {
    if (!isBadDay(entry, settings)) continue;
    const nextDate = format(addDays(parseISO(entry.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(nextDate);
    if (hasAnyDailyData(nextEntry)) count++;
  }

  return count;
}

function countUnlockedBodyAbilities(progress: BodyAbilityProgress[]): number {
  return progress.filter((p) => p.unlocked).length;
}

export function getJourneyConditionCurrentValue(
  params: EngineParams & { condition: JourneyStageCondition },
): number {
  const { condition, dailyEntries, measurements, settings } = params;
  const bodyAbilities = resolveBodyAbilities(params);

  switch (condition.type) {
    case 'weight_entry':
      return countWeightEntries(measurements);
    case 'calorie_tracking_days':
      return countCalorieTrackingDays(dailyEntries);
    case 'calorie_limit_days':
      return countCalorieLimitDays(dailyEntries, settings);
    case 'weight_loss_kg':
      return getWeightLossKg(measurements);
    case 'waist_loss_cm':
      return getWaistLossCm(measurements);
    case 'steps_total':
      return dailyEntries.reduce((sum, e) => sum + (e.steps ?? 0), 0);
    case 'steps_days_minimum':
      return dailyEntries.filter((e) => isStepsMinimumDone(e.steps, settings, e.date)).length;
    case 'steps_days_normal':
      return dailyEntries.filter((e) => isStepsNormalDone(e.steps, settings, e.date)).length;
    case 'steps_days_excellent':
      return dailyEntries.filter((e) => isStepsExcellentDone(e.steps, settings, e.date)).length;
    case 'no_alcohol_days':
      return countNoAlcoholDays(dailyEntries);
    case 'gym_total':
      return countGymDays(dailyEntries);
    case 'recovery_days':
      return countRecoveryDays(dailyEntries);
    case 'minimal_days':
      return countMinimalDays(dailyEntries);
    case 'body_abilities_unlocked':
      return countUnlockedBodyAbilities(bodyAbilities);
    case 'return_after_bad_day':
      return countReturnAfterBadDay(dailyEntries, settings);
    case 'rest_marker_days':
      return countRestMarkerDays(dailyEntries);
    case 'rest_recovery_days':
      return countRestRecoveryDays(dailyEntries);
    case 'cognitive_break_days':
      return countCognitiveBreakDays(dailyEntries);
    default:
      return 0;
  }
}

function buildConditionProgress(
  params: EngineParams & { condition: JourneyStageCondition },
): JourneyStageConditionProgress {
  const { condition } = params;
  const current = getJourneyConditionCurrentValue(params);
  const target = condition.target;
  const completed = current >= target;
  const progressPercent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return { condition, current, target, completed, progressPercent };
}

function isStageFullyComplete(conditions: JourneyStageConditionProgress[]): boolean {
  return conditions.length > 0 && conditions.every((c) => c.completed);
}

function computeRawStageProgress(
  stage: JourneyStage,
  params: EngineParams,
): Omit<JourneyStageProgress, 'status'> {
  const conditions = stage.conditions.map((c) =>
    buildConditionProgress({ ...params, condition: c }),
  );
  const completedConditions = conditions.filter((c) => c.completed).length;
  const totalConditions = conditions.length;
  const progressPercent =
    totalConditions > 0
      ? Math.round((completedConditions / totalConditions) * 100)
      : 0;

  return {
    stage,
    completedConditions,
    totalConditions,
    progressPercent,
    conditions,
  };
}

function assignStatuses(
  rawStages: Omit<JourneyStageProgress, 'status'>[],
): JourneyStageProgress[] {
  const result: JourneyStageProgress[] = [];
  let foundCurrent = false;

  for (const raw of rawStages) {
    const fullyComplete = isStageFullyComplete(raw.conditions);
    let status: JourneyStageStatus;

    if (fullyComplete) {
      status = 'completed';
    } else if (!foundCurrent) {
      status = 'current';
      foundCurrent = true;
    } else {
      status = 'locked';
    }

    result.push({ ...raw, status });
  }

  return result;
}

export function getJourneyStageProgress(
  params: EngineParams & { stage: JourneyStage },
): JourneyStageProgress {
  const all = getAllJourneyStageProgress(params);
  return all.find((s) => s.stage.id === params.stage.id)!;
}

export function getAllJourneyStageProgress(params: EngineParams): JourneyStageProgress[] {
  const sorted = [...JOURNEY_STAGES].sort((a, b) => a.order - b.order);
  const raw = sorted.map((stage) => computeRawStageProgress(stage, params));
  return assignStatuses(raw);
}

export function getJourneyMapSummary(params: EngineParams): JourneyMapSummary {
  const stages = getAllJourneyStageProgress(params);
  const totalStages = stages.length;
  const completedStages = stages.filter((s) => s.status === 'completed').length;
  const allComplete = completedStages === totalStages;

  const currentStage = allComplete
    ? (stages[stages.length - 1] ?? null)
    : (stages.find((s) => s.status === 'current') ?? stages[0] ?? null);

  let nextStage: JourneyStageProgress | null = null;
  if (currentStage && !allComplete) {
    const idx = stages.findIndex((s) => s.stage.id === currentStage.stage.id);
    nextStage = idx >= 0 && idx < stages.length - 1 ? (stages[idx + 1] ?? null) : null;
  }

  const overallProgressPercent =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return {
    currentStage,
    nextStage,
    completedStages,
    totalStages,
    overallProgressPercent,
  };
}

export function getIncompleteConditions(
  progress: JourneyStageProgress,
  limit = 3,
): JourneyStageConditionProgress[] {
  return progress.conditions.filter((c) => !c.completed).slice(0, limit);
}

export function formatJourneyConditionRemaining(
  cp: JourneyStageConditionProgress,
): string {
  const remaining = Math.max(0, cp.target - cp.current);
  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString('ru') : n.toFixed(1);

  if (remaining <= 0) return cp.condition.title;

  switch (cp.condition.type) {
    case 'weight_loss_kg':
      return `${fmt(remaining)} кг до цели`;
    case 'waist_loss_cm':
      return `${fmt(remaining)} см до цели`;
    case 'steps_total':
      return `${fmt(remaining)} шагов до цели`;
    case 'steps_days_minimum':
    case 'steps_days_normal':
    case 'steps_days_excellent':
      return remaining === 1
        ? '1 день до цели'
        : `${fmt(remaining)} дней до цели`;
    case 'body_abilities_unlocked':
      return remaining === 1
        ? '1 способность до цели'
        : `${fmt(remaining)} способностей до цели`;
    case 'gym_total':
      return remaining === 1
        ? '1 тренировка до цели'
        : `${fmt(remaining)} тренировок до цели`;
    case 'return_after_bad_day':
      return 'Вернуться к учёту после тяжёлого дня';
    default:
      return remaining === 1
        ? `1 день до цели`
        : `${fmt(remaining)} дней до цели`;
  }
}

export function hasAnyJourneyData(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): boolean {
  const { dailyEntries, measurements } = params;
  if (countWeightEntries(measurements) > 0) return true;
  if (dailyEntries.some((e) => hasAnyDailyData(e))) return true;
  return false;
}

export function hasMinimalJourneyData(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): boolean {
  const hasWeight = countWeightEntries(params.measurements) > 0;
  const hasCalories = countCalorieTrackingDays(params.dailyEntries) > 0;
  return hasWeight && hasCalories;
}
