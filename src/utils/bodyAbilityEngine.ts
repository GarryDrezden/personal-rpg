import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type {
  BodyAbility,
  BodyAbilityBranchSummary,
  BodyAbilityProgress,
} from '../types/bodyAbilities';
import {
  BODY_ABILITIES,
  BODY_ABILITY_BRANCHES,
} from '../constants/bodyAbilities';
import { sortMeasurementsByDate } from './measurements';
import { isBadDay } from './recoveryEngine';
import { hasAnyDailyData } from './achievementHelpers';
import {
  isStepsMinimumDone,
  isStepsNormalDone,
  isStepsExcellentDone,
  getDayMode,
} from './stepsEngine';
import { isCaloriesInLimit } from './achievementEngine';

export function getWeightLossKg(entries: MeasurementEntry[]): number {
  const withWeight = sortMeasurementsByDate(entries).filter(
    (m) => m.weight !== null && m.weight > 0,
  );
  if (withWeight.length < 2) return 0;

  const startWeight = withWeight[0]!.weight!;
  const minWeight = Math.min(...withWeight.map((m) => m.weight!));
  return Math.max(0, startWeight - minWeight);
}

export function getWaistLossCm(entries: MeasurementEntry[]): number {
  const withWaist = sortMeasurementsByDate(entries).filter(
    (m) => m.waist !== null && m.waist > 0,
  );
  if (withWaist.length < 2) return 0;

  const startWaist = withWaist[0]!.waist!;
  const minWaist = Math.min(...withWaist.map((m) => m.waist!));
  return Math.max(0, startWaist - minWaist);
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

export function getBodyAbilityCurrentValue(params: {
  ability: BodyAbility;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): number {
  const { ability, dailyEntries, measurements, settings } = params;

  switch (ability.conditionType) {
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
    case 'calorie_tracking_days':
      return countCalorieTrackingDays(dailyEntries);
    case 'calorie_limit_days':
      return countCalorieLimitDays(dailyEntries, settings);
    case 'no_alcohol_days':
      return countNoAlcoholDays(dailyEntries);
    case 'gym_total':
      return countGymDays(dailyEntries);
    case 'recovery_days':
      return countRecoveryDays(dailyEntries);
    case 'minimal_days':
      return countMinimalDays(dailyEntries);
    case 'return_after_bad_day':
      return countReturnAfterBadDay(dailyEntries, settings);
    default:
      return 0;
  }
}

function buildProgress(
  ability: BodyAbility,
  current: number,
): BodyAbilityProgress {
  const target = ability.target;
  const unlocked = current >= target;
  const progressPercent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return {
    ability,
    current,
    target,
    progressPercent,
    unlocked,
  };
}

export function getBodyAbilityProgress(params: {
  ability: BodyAbility;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityProgress {
  const current = getBodyAbilityCurrentValue(params);
  return buildProgress(params.ability, current);
}

export function getAllBodyAbilityProgress(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityProgress[] {
  return BODY_ABILITIES.map((ability) =>
    getBodyAbilityProgress({ ...params, ability }),
  );
}

export function getUnlockedBodyAbilities(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityProgress[] {
  return getAllBodyAbilityProgress(params).filter((p) => p.unlocked);
}

export function getNextBodyAbilities(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  limit?: number;
}): BodyAbilityProgress[] {
  const { limit = 3, ...rest } = params;
  return getAllBodyAbilityProgress(rest)
    .filter((p) => !p.unlocked)
    .sort((a, b) => b.progressPercent - a.progressPercent || a.target - b.target)
    .slice(0, limit);
}

export function getBodyAbilityBranchSummaries(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityBranchSummary[] {
  const all = getAllBodyAbilityProgress(params);

  return BODY_ABILITY_BRANCHES.map((meta) => {
    const branchAbilities = all.filter((p) => p.ability.branch === meta.branch);
    const unlockedCount = branchAbilities.filter((p) => p.unlocked).length;
    const totalCount = branchAbilities.length;
    const progressPercent =
      totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return {
      branch: meta.branch,
      title: meta.title,
      description: meta.description,
      icon: meta.icon,
      unlockedCount,
      totalCount,
      progressPercent,
    };
  });
}

export function getBodyAbilityStats(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): { unlocked: number; total: number } {
  const all = getAllBodyAbilityProgress(params);
  return {
    unlocked: all.filter((p) => p.unlocked).length,
    total: all.length,
  };
}

export function formatBodyAbilityProgressValue(progress: BodyAbilityProgress): string {
  const { ability, current, target } = progress;
  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString('ru') : n.toFixed(1);

  switch (ability.conditionType) {
    case 'weight_loss_kg':
      return `${fmt(current)} / ${fmt(target)} кг`;
    case 'waist_loss_cm':
      return `${fmt(current)} / ${fmt(target)} см`;
    case 'steps_total':
      return `${fmt(current)} / ${fmt(target)} шагов`;
    case 'gym_total':
      return `${fmt(current)} / ${fmt(target)} ${target === 1 ? 'тренировка' : 'тренировок'}`;
    case 'steps_days_minimum':
    case 'steps_days_normal':
    case 'steps_days_excellent':
    case 'calorie_tracking_days':
    case 'calorie_limit_days':
    case 'no_alcohol_days':
    case 'recovery_days':
    case 'minimal_days':
    case 'return_after_bad_day':
      return `${fmt(current)} / ${fmt(target)} ${target === 1 ? 'день' : 'дней'}`;
    default:
      return `${fmt(current)} / ${fmt(target)}`;
  }
}

export function getBodyAbilityRemainingHint(progress: BodyAbilityProgress): string {
  const { ability, current, target } = progress;
  const remaining = Math.max(0, target - current);
  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString('ru') : n.toFixed(1);

  if (remaining <= 0) return '';

  switch (ability.conditionType) {
    case 'weight_loss_kg':
      return `Осталось ${fmt(remaining)} кг`;
    case 'waist_loss_cm':
      return `Осталось ${fmt(remaining)} см`;
    case 'steps_total':
      return `Осталось ${fmt(remaining)} шагов`;
    case 'minimal_days':
      if (current === 0) return 'Включи минимальный день и удержи базу';
      return remaining === 1 ? 'Остался 1 день' : `Осталось ${fmt(remaining)} дней`;
    case 'steps_days_minimum':
    case 'steps_days_normal':
    case 'steps_days_excellent':
    case 'calorie_tracking_days':
    case 'calorie_limit_days':
    case 'no_alcohol_days':
    case 'recovery_days':
      return remaining === 1
        ? 'Остался 1 день'
        : `Осталось ${fmt(remaining)} дней`;
    case 'return_after_bad_day':
      return 'Вернись к учёту после тяжёлого дня';
    case 'gym_total':
      return remaining === 1
        ? 'Осталась 1 тренировка'
        : `Осталось ${fmt(remaining)} тренировок`;
    default:
      return '';
  }
}

export function getBranchEmptyHint(branch: BodyAbility['branch']): string | null {
  switch (branch) {
    case 'lightness':
      return 'Добавь первый замер веса, чтобы открыть путь Легкости.';
    case 'endurance':
      return 'Шаги появятся здесь, когда ты начнёшь вносить активность.';
    default:
      return null;
  }
}

export function hasEnoughDataForBodyAbilities(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): boolean {
  const { dailyEntries, measurements } = params;
  if (measurements.some((m) => m.weight !== null && m.weight > 0)) return true;
  if (dailyEntries.some((e) => hasAnyDailyData(e))) return true;
  return false;
}
