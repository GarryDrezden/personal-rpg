import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type { BaseProgressionSnapshot, BaseScoreBreakdown, BaseStageDef } from '../../types/baseV1';
import { hasAnyDailyData } from '../../utils/achievementHelpers';
import { getDayMode } from '../../utils/stepsEngine';
import { getNutritionQuestCompleted, isNutritionTrackingEnabled } from '../../utils/nutritionEngine';
import { getBodyAbilityState } from '../bodyAbilities/bodyAbilityV1Engine';
import { getSeasonConfigByIndex } from '../seasons/seasonConfig';
import { buildQuestProgressList } from '../seasons/seasonQuestProgress';
import {
  getSeasonDateRange,
  getSeasonEntries,
  getSeasonIndex,
  resolveCampaignStartDate,
} from '../seasons/seasonEngine';
import { getSeasonPartialStatus } from '../seasons/seasonRecap';
import { getPlateauSnapshot } from '../plateau/plateauEngine';
import { todayISO } from '../../utils/dates';
import { BASE_STAGES } from './baseProgressionConfig';

export const BASE_SCORE_WEIGHTS = {
  savedDay: 1,
  minimalDay: 1,
  recoveryDay: 1,
  resourceDay: 1,
  movementDay: 1,
  alcoholFreeDay: 1,
  nutritionDay: 1,
  bodyAbility: 2,
  qualifyingSeason: 4,
  plateauGuardian: 4,
} as const;

/** Один день даёт максимум столько очков маршрута (без бонусов способностей/сезонов). */
export const BASE_MAX_POINTS_PER_DAY = 2;

export const BASE_RECENT_WINDOW_DAYS = 14;

function isSavedDay(entry: DailyEntry): boolean {
  if (!entry.id) return false;
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal' || mode === 'recovery') return true;
  return hasAnyDailyData(entry);
}

function isResourceMarked(entry: DailyEntry): boolean {
  return (
    entry.energyLevel != null ||
    entry.sleepQuality != null ||
    (entry.cognitiveBreaks != null && entry.cognitiveBreaks !== 'none')
  );
}

function isMovementDay(entry: DailyEntry): boolean {
  return (entry.steps ?? 0) > 0 || Boolean(entry.morningExercise) || Boolean(entry.gym);
}

/** Очки за один день до капа — без отдельного double-count minimal/recovery поверх saved. */
export function dayRouteSignalPoints(entry: DailyEntry, settings: AppSettings): number {
  if (!isSavedDay(entry)) return 0;
  let points = BASE_SCORE_WEIGHTS.savedDay;
  if (isResourceMarked(entry)) points += BASE_SCORE_WEIGHTS.resourceDay;
  if (isMovementDay(entry)) points += BASE_SCORE_WEIGHTS.movementDay;
  if (entry.alcohol === 'none') points += BASE_SCORE_WEIGHTS.alcoholFreeDay;
  if (
    isNutritionTrackingEnabled(settings) &&
    getNutritionQuestCompleted({ entry, settings })
  ) {
    points += BASE_SCORE_WEIGHTS.nutritionDay;
  }
  return points;
}

export function cappedDayRoutePoints(entry: DailyEntry, settings: AppSettings): number {
  return Math.min(BASE_MAX_POINTS_PER_DAY, dayRouteSignalPoints(entry, settings));
}

function countQualifyingSeasons(
  settings: AppSettings,
  dailyEntries: DailyEntry[],
  today: string,
): number {
  const campaignStart = resolveCampaignStartDate(settings, dailyEntries, today);
  const currentSeasonIndex = getSeasonIndex(campaignStart, today);
  let count = 0;

  for (let seasonIndex = 1; seasonIndex <= currentSeasonIndex; seasonIndex += 1) {
    const { start, end } = getSeasonDateRange(campaignStart, seasonIndex);
    const seasonEntries = getSeasonEntries(dailyEntries, start, end);
    const config = getSeasonConfigByIndex(seasonIndex);
    const quests = buildQuestProgressList(config.quests, seasonEntries, settings);
    const completedQuestCount = quests.filter((q) => q.completed).length;
    const status = getSeasonPartialStatus(completedQuestCount);
    if (status === 'held' || status === 'cleared' || status === 'empowered') {
      count += 1;
    }
  }

  return count;
}

export function calculateBaseScoreBreakdown(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  unlockedAchievementIds?: string[];
}): BaseScoreBreakdown {
  const today = params.today ?? todayISO();
  const entries = params.dailyEntries.filter((e) => e.date <= today);

  const breakdown: BaseScoreBreakdown = {
    savedDays: 0,
    minimalDays: 0,
    recoveryDays: 0,
    resourceDays: 0,
    movementDays: 0,
    alcoholFreeDays: 0,
    nutritionDays: 0,
    bodyAbilities: getBodyAbilityState(params.settings).unlockedAbilityIds.length,
    qualifyingSeasons: countQualifyingSeasons(params.settings, entries, today),
    plateauGuardian: (params.unlockedAchievementIds ?? []).includes('plateau_route_guardian')
      ? 1
      : 0,
  };

  for (const entry of entries) {
    if (isSavedDay(entry)) breakdown.savedDays += 1;
    const mode = getDayMode(entry.dayMode);
    if (mode === 'minimal') breakdown.minimalDays += 1;
    if (mode === 'recovery') breakdown.recoveryDays += 1;
    if (isResourceMarked(entry)) breakdown.resourceDays += 1;
    if (isMovementDay(entry)) breakdown.movementDays += 1;
    if (entry.alcohol === 'none') breakdown.alcoholFreeDays += 1;
    if (
      isNutritionTrackingEnabled(params.settings) &&
      getNutritionQuestCompleted({ entry, settings: params.settings })
    ) {
      breakdown.nutritionDays += 1;
    }
  }

  return breakdown;
}

export function scoreFromBreakdown(breakdown: BaseScoreBreakdown): number {
  const w = BASE_SCORE_WEIGHTS;
  return (
    breakdown.savedDays * w.savedDay +
    breakdown.minimalDays * w.minimalDay +
    breakdown.recoveryDays * w.recoveryDay +
    breakdown.resourceDays * w.resourceDay +
    breakdown.movementDays * w.movementDay +
    breakdown.alcoholFreeDays * w.alcoholFreeDay +
    breakdown.nutritionDays * w.nutritionDay +
    breakdown.bodyAbilities * w.bodyAbility +
    breakdown.qualifyingSeasons * w.qualifyingSeason +
    breakdown.plateauGuardian * w.plateauGuardian
  );
}

/** Итоговый score лагеря: дни с капом + редкие бонусы. */
export function calculateBaseRouteScore(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  unlockedAchievementIds?: string[];
}): { breakdown: BaseScoreBreakdown; baseScore: number } {
  const breakdown = calculateBaseScoreBreakdown(params);
  const today = params.today ?? todayISO();
  const entries = params.dailyEntries.filter((e) => e.date <= today);

  let dayScore = 0;
  for (const entry of entries) {
    dayScore += cappedDayRoutePoints(entry, params.settings);
  }

  const bonusScore =
    breakdown.bodyAbilities * BASE_SCORE_WEIGHTS.bodyAbility +
    breakdown.qualifyingSeasons * BASE_SCORE_WEIGHTS.qualifyingSeason +
    breakdown.plateauGuardian * BASE_SCORE_WEIGHTS.plateauGuardian;

  return { breakdown, baseScore: dayScore + bonusScore };
}

function resolveStageForScore(score: number): {
  currentStage: BaseStageDef;
  nextStage: BaseStageDef | null;
  progressToNext: number;
  progressPercent: number;
} {
  let currentStage = BASE_STAGES[0]!;
  let nextStage: BaseStageDef | null = BASE_STAGES[1] ?? null;

  for (let i = BASE_STAGES.length - 1; i >= 0; i -= 1) {
    const stage = BASE_STAGES[i]!;
    if (score >= stage.unlockScore) {
      currentStage = stage;
      nextStage = BASE_STAGES[i + 1] ?? null;
      break;
    }
  }

  if (!nextStage) {
    return {
      currentStage,
      nextStage: null,
      progressToNext: 0,
      progressPercent: 100,
    };
  }

  const span = nextStage.unlockScore - currentStage.unlockScore;
  const progress = score - currentStage.unlockScore;

  return {
    currentStage,
    nextStage,
    progressToNext: Math.max(0, nextStage.unlockScore - score),
    progressPercent: Math.min(100, Math.round((progress / span) * 100)),
  };
}

function countRecentBreakdown(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string,
): Pick<
  BaseScoreBreakdown,
  | 'savedDays'
  | 'minimalDays'
  | 'recoveryDays'
  | 'resourceDays'
  | 'movementDays'
  | 'alcoholFreeDays'
  | 'nutritionDays'
> {
  const windowStart = format(
    addDays(parseISO(today), -(BASE_RECENT_WINDOW_DAYS - 1)),
    'yyyy-MM-dd',
  );
  const recent = dailyEntries.filter((e) => e.date >= windowStart && e.date <= today);
  const partial: Pick<
    BaseScoreBreakdown,
    | 'savedDays'
    | 'minimalDays'
    | 'recoveryDays'
    | 'resourceDays'
    | 'movementDays'
    | 'alcoholFreeDays'
    | 'nutritionDays'
  > = {
    savedDays: 0,
    minimalDays: 0,
    recoveryDays: 0,
    resourceDays: 0,
    movementDays: 0,
    alcoholFreeDays: 0,
    nutritionDays: 0,
  };

  for (const entry of recent) {
    if (isSavedDay(entry)) partial.savedDays += 1;
    const mode = getDayMode(entry.dayMode);
    if (mode === 'minimal') partial.minimalDays += 1;
    if (mode === 'recovery') partial.recoveryDays += 1;
    if (isResourceMarked(entry)) partial.resourceDays += 1;
    if (isMovementDay(entry)) partial.movementDays += 1;
    if (entry.alcohol === 'none') partial.alcoholFreeDays += 1;
    if (
      isNutritionTrackingEnabled(settings) &&
      getNutritionQuestCompleted({ entry, settings })
    ) {
      partial.nutritionDays += 1;
    }
  }

  return partial;
}

function buildRecentContributors(
  recent: Pick<
    BaseScoreBreakdown,
    | 'savedDays'
    | 'minimalDays'
    | 'recoveryDays'
    | 'resourceDays'
    | 'movementDays'
    | 'alcoholFreeDays'
    | 'nutritionDays'
  >,
): string[] {
  const candidates: Array<{ count: number; label: string }> = [
    { count: recent.savedDays, label: `${recent.savedDays} сохранённых дней` },
    { count: recent.recoveryDays, label: `${recent.recoveryDays} recovery day` },
    { count: recent.minimalDays, label: `${recent.minimalDays} минимальных дней` },
    { count: recent.movementDays, label: `${recent.movementDays} дней движения` },
    { count: recent.resourceDays, label: `${recent.resourceDays} дней с ресурсом` },
    { count: recent.alcoholFreeDays, label: `${recent.alcoholFreeDays} дней без алкоголя` },
    { count: recent.nutritionDays, label: `${recent.nutritionDays} дней с питанием` },
  ];

  const lines = candidates
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((c) => c.label);

  if (lines.length > 0) return lines;
  return ['За последние 14 дней новых искр маршрута не было — лагерь ждёт возвращения.'];
}

export function getBaseProgressionSnapshot(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  unlockedAchievementIds?: string[];
}): BaseProgressionSnapshot {
  const today = params.today ?? todayISO();
  const { breakdown, baseScore } = calculateBaseRouteScore(params);
  const stageInfo = resolveStageForScore(baseScore);
  const recent = countRecentBreakdown(params.dailyEntries, params.settings, today);
  const recentContributors = buildRecentContributors(recent);

  const plateau = getPlateauSnapshot({
    dailyEntries: params.dailyEntries,
    measurements: params.measurements,
    settings: params.settings,
    today,
  });
  const flavorText =
    plateau.mode === 'active'
      ? `${stageInfo.currentStage.flavorText} На перевале лагерь крепнет от маршрута, не от веса.`
      : stageInfo.currentStage.flavorText;

  return {
    baseScore,
    breakdown,
    ...stageInfo,
    recentContributors,
    flavorText,
    allStages: BASE_STAGES,
    isMaxStage: stageInfo.nextStage === null,
  };
}

export function getBaseSaveSparkLine(entry: DailyEntry, settings: AppSettings): string | null {
  if (!entry.id) return null;
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal') {
    return 'Лагерь получил искру маршрута — минимальный день крепит костёр.';
  }
  if (mode === 'recovery') {
    return 'Очаг лагеря потеплел — день восстановления укрепляет базу.';
  }
  if (entry.alcohol === 'none') {
    return 'Костёр лагеря горит ровнее — день без алкоголя укрепляет маршрут.';
  }
  if (isNutritionTrackingEnabled(settings) && getNutritionQuestCompleted({ entry, settings })) {
    return 'Лагерь получил искру маршрута — питание отмечено.';
  }
  if (hasAnyDailyData(entry)) {
    return 'Лагерь получил искру маршрута.';
  }
  return null;
}
