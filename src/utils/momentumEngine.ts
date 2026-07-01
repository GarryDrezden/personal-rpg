import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry } from '../types';
import type {
  MomentumDailyFactor,
  MomentumDayResult,
  MomentumHistoryRange,
  MomentumLevel,
  MomentumSummary,
  MomentumTrendPoint,
  MomentumTrendSummary,
} from '../types/momentum';
import {
  MOMENTUM_DECAY,
  MOMENTUM_LEVELS,
  MOMENTUM_LIMITS,
  MOMENTUM_XP_MULTIPLIERS,
} from '../constants/momentum';
import { hasAnyDailyData } from './achievementHelpers';
import { calcDailyPoints } from './points';
import {
  getNutritionMomentumDelta,
  getNutritionMomentumLabel,
  getNutritionStatus,
  isNutritionLogged,
  isNutritionTrackingEnabled,
} from './nutritionEngine';
import { normalizeSleepQuality } from './resourceEngine';
import {
  getDayMode,
  isStepsExcellentDone,
  isStepsMinimumDone,
  isStepsNormalDone,
} from './stepsEngine';
import { MINIMAL_DAY_STEPS } from './recoveryEngine';
import { weekDays, weekStart } from './dates';

export function clampMomentum(value: number): number {
  return Math.max(MOMENTUM_LIMITS.min, Math.min(MOMENTUM_LIMITS.max, value));
}

export function getMomentumLevel(value: number): MomentumLevel {
  const clamped = clampMomentum(value);
  for (const level of MOMENTUM_LEVELS) {
    if (clamped >= level.min && clamped <= level.max) return level;
  }
  return MOMENTUM_LEVELS.find((l) => l.id === 'neutral')!;
}

export function getMomentumXpMultiplier(momentumValue: number): number {
  const level = getMomentumLevel(momentumValue);
  return MOMENTUM_XP_MULTIPLIERS[level.id];
}

function factor(
  id: string,
  title: string,
  value: number,
  extras?: {
    description?: string;
    explanation?: string;
    source?: MomentumDailyFactor['source'];
  },
): MomentumDailyFactor {
  return {
    id,
    title,
    value,
    type: value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral',
    description: extras?.description,
    explanation: extras?.explanation,
    source: extras?.source,
  };
}

function entryForDate(entries: DailyEntry[], date: string): DailyEntry | null {
  return entries.find((e) => e.date === date) ?? null;
}

function countConsecutiveDays(
  endDate: string,
  entries: DailyEntry[],
  predicate: (entry: DailyEntry | null) => boolean,
  maxDays = 30,
): number {
  let count = 0;
  let d = parseISO(endDate);
  for (let i = 0; i < maxDays; i++) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const entry = entryForDate(entries, dateStr);
    if (predicate(entry)) {
      count++;
      d = addDays(d, -1);
    } else {
      break;
    }
  }
  return count;
}

function isLowMovement(entry: DailyEntry | null): boolean {
  if (!entry || !hasAnyDailyData(entry)) return false;
  if (entry.steps === null || entry.steps === undefined) return true;
  return entry.steps < 3000;
}

function isRecoveryMinimalBaseHeld(entry: DailyEntry, settings: AppSettings): boolean {
  const mode = getDayMode(entry.dayMode);
  if (mode !== 'recovery' && mode !== 'minimal') return false;

  const hasNutrition = isNutritionLogged({ entry, settings });
  const hasSteps = (entry.steps ?? 0) >= MINIMAL_DAY_STEPS;
  const sober = entry.alcohol === 'none';
  const hasJournal = entry.journal || entry.comment.trim().length > 0;

  return hasNutrition && hasSteps && sober && hasJournal;
}

function buildDailyFactors(
  date: string,
  entry: DailyEntry | null,
  allEntries: DailyEntry[],
  settings: AppSettings,
): MomentumDailyFactor[] {
  const factors: MomentumDailyFactor[] = [];
  const hasData = entry !== null && hasAnyDailyData(entry);

  if (!hasData) {
    const streak = countConsecutiveDays(date, allEntries, (e) => !e || !hasAnyDailyData(e));
    if (streak >= 3) {
      factors.push(factor('no_data_3plus', 'Три дня без данных', -20));
    } else if (streak >= 2) {
      factors.push(factor('no_data_2', 'Два дня без данных', -12));
    } else {
      factors.push(factor('no_data', 'День без данных', -5));
    }
    return factors;
  }

  factors.push(factor('any_data', 'День не потерян', 2));

  if (isNutritionTrackingEnabled(settings)) {
    const nutritionStatus = getNutritionStatus({ entry: entry!, settings });
    const nutritionDelta = getNutritionMomentumDelta({ entry: entry!, settings });
    if (nutritionDelta !== 0 || nutritionStatus !== 'missing') {
      factors.push(
        factor('nutrition', getNutritionMomentumLabel(nutritionStatus), nutritionDelta),
      );
    }
  }

  const steps = entry!.steps;
  if (isStepsExcellentDone(steps, settings, date)) {
    factors.push(factor('steps_excellent', 'Отличные шаги', 8));
  } else if (isStepsNormalDone(steps, settings, date)) {
    factors.push(factor('steps_normal', 'Норма шагов', 6));
  } else if (isStepsMinimumDone(steps, settings, date)) {
    factors.push(factor('steps_minimum', 'Минимум шагов', 4));
  } else if (steps !== null && steps !== undefined && steps < 3000) {
    factors.push(factor('steps_low', 'Очень мало движения', -5));
  }

  const lowMoveStreak = countConsecutiveDays(date, allEntries, isLowMovement);
  if (lowMoveStreak >= 3) {
    factors.push(factor('low_movement_streak', 'Несколько дней без движения', -10));
  }

  if (entry!.alcohol === 'none') {
    factors.push(factor('no_alcohol', 'Без алкоголя', 6));
  } else if (entry!.alcohol === 'moderate') {
    factors.push(factor('alcohol_moderate', 'Умеренный алкоголь', -8));
  } else if (entry!.alcohol === 'heavy') {
    factors.push(factor('alcohol_heavy', 'Тяжёлый алкоголь', -18));
  }

  if (entry!.morningExercise) {
    factors.push(factor('morning_exercise', 'Зарядка', 3));
  }
  if (entry!.gym) {
    factors.push(factor('gym', 'Зал', 5));
  }
  if (entry!.journal || entry!.comment.trim().length > 0) {
    factors.push(factor('journal', 'Дневник', 3));
  }

  if (isRecoveryMinimalBaseHeld(entry!, settings)) {
    factors.push(factor('recovery_held', 'Режим удержан без героизма', 5));
  }

  const energy = entry!.energyLevel;
  const lowEnergyStreak = countConsecutiveDays(
    date,
    allEntries,
    (e) => e !== null && (e.energyLevel === 1 || e.energyLevel === 2),
  );

  if (lowEnergyStreak >= 3) {
    factors.push(factor('low_energy_streak', 'Несколько дней с низким ресурсом', -8));
  } else if (energy === 1) {
    factors.push(factor('energy_1', 'Очень низкий ресурс', -5));
  } else if (energy === 2) {
    factors.push(factor('energy_2', 'Низкий ресурс', -3));
  }

  // Sleep & cognitive rest — gentle bonuses, no harsh penalties for missing data
  const sleepQ = normalizeSleepQuality(entry!.sleepQuality);
  const hasSleepHours = entry!.sleepHours !== null && entry!.sleepHours !== undefined;

  if (sleepQ === 'good') {
    factors.push(
      factor('sleep_good', 'Хороший сон поддержал инерцию', 3, {
        source: 'sleep',
        description: 'Отмечен хороший сон — небольшой бонус к инерции.',
      }),
    );
  } else if (sleepQ === 'ok') {
    factors.push(
      factor('sleep_ok', 'Сон в норме', 1, {
        source: 'sleep',
        description: 'Сон отмечен как нормальный.',
      }),
    );
  } else if (sleepQ === 'poor') {
    factors.push(
      factor('sleep_poor', 'Сон просел', -1, {
        source: 'sleep',
        description: 'Мягкий сигнал — без наказания, просто учёт ресурса.',
      }),
    );
  } else if (hasSleepHours && entry!.sleepHours! >= 7) {
    factors.push(factor('sleep_hours', 'Достаточно часов сна', 2, { source: 'sleep' }));
  }

  const cognitive = entry!.cognitiveBreaks;
  if (cognitive === 'deep') {
    factors.push(factor('cognitive_deep', 'Глубокая разгрузка головы', 3, { source: 'rest' }));
  } else if (cognitive === 'good') {
    factors.push(factor('cognitive_good', 'Разгрузка головы', 2, { source: 'rest' }));
  } else if (cognitive === 'small') {
    factors.push(factor('cognitive_small', 'Короткий перерыв', 1, { source: 'rest' }));
  }

  return factors;
}

export function calculateMomentumDay(params: {
  date: string;
  previousMomentum: number;
  entry: DailyEntry | null;
  previousEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumDayResult {
  const { date, previousMomentum, entry, previousEntries, settings } = params;
  const allEntries = entry
    ? [...previousEntries.filter((e) => e.date !== date), entry]
    : previousEntries;

  const decayValue = previousMomentum * MOMENTUM_DECAY;
  const factors = buildDailyFactors(date, entry, allEntries, settings);
  const dailyDelta = factors.reduce((sum, f) => sum + f.value, 0);
  const endValue = clampMomentum(decayValue + dailyDelta);
  const level = getMomentumLevel(endValue);

  return {
    date,
    startValue: previousMomentum,
    decayValue,
    dailyDelta,
    endValue,
    level,
    factors,
  };
}

export function calculateMomentumHistory(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumDayResult[] {
  const { dailyEntries, settings } = params;
  const withData = dailyEntries.filter((e) => hasAnyDailyData(e));
  if (withData.length === 0) return [];

  const sorted = [...withData].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0]!.date;
  const lastDate = sorted[sorted.length - 1]!.date;

  const byDate = new Map(dailyEntries.map((e) => [e.date, e]));
  const results: MomentumDayResult[] = [];
  let momentum = 0;

  for (let d = parseISO(firstDate); d <= parseISO(lastDate); d = addDays(d, 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const entry = byDate.get(dateStr) ?? null;
    const previousEntries = results.map((r) => byDate.get(r.date)).filter(Boolean) as DailyEntry[];

    const dayResult = calculateMomentumDay({
      date: dateStr,
      previousMomentum: momentum,
      entry: entry && hasAnyDailyData(entry) ? entry : null,
      previousEntries,
      settings,
    });

    results.push(dayResult);
    momentum = dayResult.endValue;
  }

  return results;
}

function getMomentumAtDate(
  history: MomentumDayResult[],
  date: string,
): MomentumDayResult | null {
  return history.find((r) => r.date === date) ?? null;
}

function getStartOfDayMomentum(history: MomentumDayResult[], date: string): number {
  const day = getMomentumAtDate(history, date);
  if (day) return day.decayValue;

  const prior = [...history].filter((r) => r.date < date).sort((a, b) => b.date.localeCompare(a.date));
  if (prior.length === 0) return 0;
  return prior[0]!.endValue * MOMENTUM_DECAY;
}

export function isStrongMomentumDay(entry: DailyEntry, settings: AppSettings): boolean {
  const nutritionOk =
    !isNutritionTrackingEnabled(settings) ||
    getNutritionStatus({ entry, settings }) === 'light' ||
    getNutritionStatus({ entry, settings }) === 'precise_in_limit';
  return (
    nutritionOk &&
    isStepsNormalDone(entry.steps, settings, entry.date) &&
    entry.alcohol === 'none'
  );
}

export function isBaseMomentumDay(entry: DailyEntry, settings: AppSettings): boolean {
  return (
    isNutritionLogged({ entry, settings }) &&
    isStepsMinimumDone(entry.steps, settings, entry.date) &&
    entry.alcohol === 'none'
  );
}

export function getMomentumSummary(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumSummary {
  const { today, dailyEntries, settings } = params;
  const history = calculateMomentumHistory({ dailyEntries, settings });
  const todayResult = getMomentumAtDate(history, today);

  const currentValue = todayResult?.endValue ?? getStartOfDayMomentum(history, today);
  const currentLevel = getMomentumLevel(currentValue);
  const startMomentum = getStartOfDayMomentum(history, today);
  const bonusMultiplier = getMomentumXpMultiplier(startMomentum);

  const ws = weekStart(today);
  const weekDates = weekDays(ws);
  const weekResults = history.filter((r) => weekDates.includes(r.date));
  const weekStartMomentum =
    weekResults.length > 0
      ? getStartOfDayMomentum(history, weekResults[0]!.date)
      : getStartOfDayMomentum(history, today);
  const weekEndMomentum = todayResult?.endValue ?? currentValue;
  const weekDelta = Math.round(weekEndMomentum - weekStartMomentum);
  const weekAverage =
    weekResults.length > 0
      ? Math.round(weekResults.reduce((s, r) => s + r.endValue, 0) / weekResults.length)
      : currentValue;

  const todayEntry = dailyEntries.find((e) => e.date === today);
  const coinBonusAvailable =
    (currentLevel.id === 'boost' || currentLevel.id === 'flow') &&
    todayEntry !== undefined &&
    hasAnyDailyData(todayEntry) &&
    ((currentLevel.id === 'boost' && isStrongMomentumDay(todayEntry, settings)) ||
      (currentLevel.id === 'flow' && isBaseMomentumDay(todayEntry, settings)));

  return {
    currentValue: Math.round(currentValue),
    currentLevel,
    todayDelta: todayResult?.dailyDelta ?? 0,
    todayFactors: todayResult?.factors ?? [],
    weekDelta,
    weekAverage,
    bonusMultiplier,
    coinBonusAvailable,
    recoverySuggested: currentValue <= -10,
    minimalModeSuggested: currentValue <= -40,
  };
}

export function getAverageMomentumLastDays(
  history: MomentumDayResult[],
  endDate: string,
  days: number,
): number {
  const end = parseISO(endDate);
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(format(addDays(end, -i), 'yyyy-MM-dd'));
  }

  const values = dates.map((d) => {
    const r = getMomentumAtDate(history, d);
    return r?.endValue ?? null;
  }).filter((v): v is number => v !== null);

  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function momentumPointsFromAverage(avg: number): number {
  if (avg <= -40) return 0;
  if (avg <= -10) return 1;
  if (avg <= 9) return 2;
  if (avg <= 39) return 3;
  if (avg <= 69) return 4;
  return 5;
}

export function getMomentumStartValueForDay(
  history: MomentumDayResult[],
  date: string,
): number {
  return getStartOfDayMomentum(history, date);
}

export function calcMomentumBonusXp(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
): number {
  const history = calculateMomentumHistory({ dailyEntries, settings });
  let bonus = 0;

  for (const entry of dailyEntries) {
    const base = calcDailyPoints(entry, settings);
    if (base <= 0) continue;

    const startMomentum = getStartOfDayMomentum(history, entry.date);
    const mult = getMomentumXpMultiplier(startMomentum);
    if (mult <= 1) continue;

    bonus += Math.round(base * (mult - 1));
  }

  return bonus;
}

export function getMomentumAdjustedDailyPoints(
  entry: DailyEntry,
  settings: AppSettings,
  dailyEntries: DailyEntry[],
): { base: number; adjusted: number; multiplier: number } {
  const base = calcDailyPoints(entry, settings);
  const history = calculateMomentumHistory({ dailyEntries, settings });
  const startMomentum = getStartOfDayMomentum(history, entry.date);
  const multiplier = getMomentumXpMultiplier(startMomentum);
  const adjusted = Math.round(Math.max(0, base) * multiplier + Math.min(0, base));

  return { base, adjusted, multiplier };
}

export function buildMomentumWeekSummaryText(weekDelta: number): string {
  if (weekDelta >= 15) return 'Неделя разогнала систему.';
  if (weekDelta >= 5) return 'Инерция недели слегка выросла — ритм держится.';
  if (weekDelta <= -15) return 'Система просела, но recovery-день остановит падение.';
  if (weekDelta <= -5) return 'Инерция недели снизилась — базовый день вернёт ход.';
  return 'Инерция недели держится в нейтральной зоне.';
}

export interface MomentumAchievementMetrics {
  hasExitedNegative: boolean;
  hasReachedStable: boolean;
  hasReachedBoost: boolean;
  hasReachedFlow: boolean;
  hasReturnedFromLostSpeed: boolean;
}

export function buildMomentumAchievementMetrics(
  history: MomentumDayResult[],
): MomentumAchievementMetrics {
  let hasExitedNegative = false;
  let hasReachedStable = false;
  let hasReachedBoost = false;
  let hasReachedFlow = false;
  let hasReturnedFromLostSpeed = false;

  let wasNegative = false;
  let wasLostSpeed = false;

  for (const day of history) {
    if (day.endValue < 0) wasNegative = true;
    if (day.level.id === 'lost_speed') wasLostSpeed = true;

    if (wasNegative && day.endValue >= 0) hasExitedNegative = true;
    if (day.endValue >= 10) hasReachedStable = true;
    if (day.endValue >= 40) hasReachedBoost = true;
    if (day.endValue >= 70) hasReachedFlow = true;
    if (wasLostSpeed && day.endValue >= -9) hasReturnedFromLostSpeed = true;
  }

  return {
    hasExitedNegative,
    hasReachedStable,
    hasReachedBoost,
    hasReachedFlow,
    hasReturnedFromLostSpeed,
  };
}

export function getTopWeekMomentumFactors(
  history: MomentumDayResult[],
  weekStartDate: string,
): MomentumDailyFactor[] {
  const days = weekDays(weekStartDate);
  const factorMap = new Map<string, MomentumDailyFactor>();

  for (const day of history.filter((r) => days.includes(r.date))) {
    for (const f of day.factors) {
      const existing = factorMap.get(f.id);
      if (existing) {
        existing.value += f.value;
      } else {
        factorMap.set(f.id, { ...f });
      }
    }
  }

  return [...factorMap.values()]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 3);
}

export function getMomentumTrendSummary(params: {
  history: MomentumDayResult[];
  range?: MomentumHistoryRange;
}): MomentumTrendSummary {
  const range = params.range ?? 14;
  const sorted = [...params.history].sort((a, b) => a.date.localeCompare(b.date));
  const sliced = sorted.slice(-range);

  const points: MomentumTrendPoint[] = sliced.map((r) => ({
    date: r.date,
    value: Math.round(r.endValue),
    delta: r.dailyDelta,
    levelId: r.level.id,
  }));

  if (points.length === 0) {
    return {
      range,
      points: [],
      minValue: 0,
      maxValue: 0,
      averageValue: 0,
      totalDelta: 0,
    };
  }

  const values = points.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const averageValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const first = sliced[0]!;
  const last = sliced[sliced.length - 1]!;
  const totalDelta = Math.round(last.endValue - first.decayValue);

  return {
    range,
    points,
    minValue,
    maxValue,
    averageValue,
    totalDelta,
  };
}

export function getMomentumTopFactors(params: {
  history: MomentumDayResult[];
  range?: MomentumHistoryRange;
  limit?: number;
}): {
  positive: MomentumDailyFactor[];
  negative: MomentumDailyFactor[];
} {
  const range = params.range ?? 14;
  const limit = params.limit ?? 5;
  const sorted = [...params.history].sort((a, b) => a.date.localeCompare(b.date));
  const sliced = sorted.slice(-range);

  const factorMap = new Map<string, MomentumDailyFactor>();

  for (const day of sliced) {
    for (const f of day.factors) {
      const existing = factorMap.get(f.id);
      if (existing) {
        existing.value += f.value;
      } else {
        factorMap.set(f.id, { ...f, type: f.value > 0 ? 'positive' : f.value < 0 ? 'negative' : 'neutral' });
      }
    }
  }

  const all = [...factorMap.values()].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value),
  );

  return {
    positive: all.filter((f) => f.value > 0).slice(0, limit),
    negative: all.filter((f) => f.value < 0).slice(0, limit),
  };
}

export {
  getMomentumLevelThemeText,
  getMomentumActionThemeText,
  getMomentumPageSubtitle,
} from '../constants/momentumThemeTexts';
