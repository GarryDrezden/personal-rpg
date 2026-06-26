import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type {
  Achievement,
  AchievementProgress,
  UnlockedAchievement,
} from '../types/achievements';
import { ACHIEVEMENTS } from '../constants/achievements';
import { isMonday, todayISO, weekDays, weekStart } from './dates';
import {
  calcDailyPoints,
  calcTotalEarnedXP,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from './points';
import { sortMeasurementsByDate } from './measurements';
import {
  countDefeatedBosses,
  countPerfectBosses,
  getBossHistory,
  maxBossDefeatStreak,
} from './bossEngine';
import {
  getConsecutiveBalancedWeeks,
  getMaxRecoveryDaysWithoutBreakingTracking,
} from './achievementHelpers';
import { isMinimalDayCompleted } from './recoveryEngine';
import {
  isStepsMinimumDone,
  isStepsNormalDone,
  isStepsExcellentDone,
  getDayMode,
} from './stepsEngine';
import {
  buildMomentumAchievementMetrics,
  calculateMomentumHistory,
  calcMomentumBonusXp,
} from './momentumEngine';
import { getBonusXpTotal } from './xpTransactionStorage';

export type AchievementEngineParams = {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  totalXp: number;
  unlockedAchievements: UnlockedAchievement[];
};

export function isCaloriesInLimit(entry: DailyEntry, settings: AppSettings): boolean {
  if (entry.calories === null) return false;
  const weekly = getWeeklySettingsForDate(entry.date, settings);
  return entry.calories <= weekly.caloriesLimit;
}

export function isStepsGoalDone(entry: DailyEntry, settings: AppSettings): boolean {
  return isStepsNormalDone(entry.steps, settings, entry.date);
}

export function isStepsMinimumGoalDone(entry: DailyEntry, settings: AppSettings): boolean {
  return isStepsMinimumDone(entry.steps, settings, entry.date);
}

export function isStepsExcellentGoalDone(entry: DailyEntry, settings: AppSettings): boolean {
  return isStepsExcellentDone(entry.steps, settings, entry.date);
}

export function isNoAlcohol(entry: DailyEntry): boolean {
  return entry.alcohol === 'none';
}

export function getWeekSettings(date: string, settings: AppSettings) {
  return getWeeklySettingsForDate(date, settings);
}

export function calculateDayPoints(entry: DailyEntry, settings: AppSettings): number {
  return calcDailyPoints(entry, settings);
}

export function hasDayData(entry: DailyEntry | undefined): boolean {
  if (!entry) return false;
  return (
    entry.calories !== null ||
    entry.steps !== null ||
    entry.alcohol !== null ||
    entry.morningExercise ||
    entry.gym ||
    entry.journal ||
    entry.cooking ||
    entry.repair ||
    entry.plants ||
    entry.hobby ||
    entry.comment.trim().length > 0
  );
}

export function countEntries(
  entries: DailyEntry[],
  predicate: (entry: DailyEntry) => boolean,
): number {
  return entries.filter(predicate).length;
}

export function sumSteps(entries: DailyEntry[]): number {
  return entries.reduce((s, e) => s + (e.steps ?? 0), 0);
}

export function getMaxStreak(
  entries: DailyEntry[],
  predicate: (entry: DailyEntry | undefined, date: string) => boolean,
): number {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(entries.map((e) => [e.date, e]));
  let start = parseISO(sorted[0].date);
  const end = parseISO(todayISO());
  let max = 0;
  let current = 0;

  for (let d = start; d <= end; d = addDays(d, 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    if (predicate(byDate.get(dateStr), dateStr)) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

function getAllWeekStarts(entries: DailyEntry[], measurements: MeasurementEntry[]): string[] {
  const weeks = new Set<string>();
  for (const e of entries) weeks.add(weekStart(e.date));
  for (const m of measurements) weeks.add(weekStart(m.date));
  return [...weeks].sort();
}

function weekGymMet(ws: string, entries: DailyEntry[], settings: AppSettings): boolean {
  const weekly = getWeeklySettingsForDate(ws, settings);
  const gymCount = weekDays(ws).filter((d) => entries.find((e) => e.date === d)?.gym).length;
  return gymCount >= weekly.gymTarget;
}

function weekPointsTotal(ws: string, entries: DailyEntry[], measurements: MeasurementEntry[], settings: AppSettings): number {
  const daily = weekDays(ws).reduce((sum, d) => {
    const e = entries.find((x) => x.date === d);
    return sum + (e ? calcDailyPoints(e, settings) : 0);
  }, 0);
  return daily + calcWeeklyBonuses(ws, entries, measurements, settings).total;
}

function weekPointsPercent(
  ws: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  const weekly = getWeeklySettingsForDate(ws, settings);
  if (weekly.weeklyPointsGoal <= 0) return 0;
  return (weekPointsTotal(ws, entries, measurements, settings) / weekly.weeklyPointsGoal) * 100;
}

function maxGymWeekStreak(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  const weeks = getAllWeekStarts(entries, measurements);
  let max = 0;
  let current = 0;
  for (const ws of weeks) {
    if (weekGymMet(ws, entries, settings)) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

function maxCookingInMonth(entries: DailyEntry[]): number {
  const byMonth = new Map<string, number>();
  for (const e of entries) {
    if (!e.cooking) continue;
    const key = e.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  return Math.max(0, ...byMonth.values(), 0);
}

function hasSoberWeekend(entries: DailyEntry[]): boolean {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const weeks = new Set(entries.map((e) => weekStart(e.date)));
  for (const ws of weeks) {
    const days = weekDays(ws);
    const fri = days[4];
    const sat = days[5];
    const sun = days[6];
    const f = byDate.get(fri);
    const s = byDate.get(sat);
    const u = byDate.get(sun);
    if (f && s && u && isNoAlcohol(f) && isNoAlcohol(s) && isNoAlcohol(u)) return true;
  }
  return false;
}

function hasAlcoholReturnNextDay(entries: DailyEntry[]): boolean {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));
  for (const e of sorted) {
    if (e.alcohol !== 'moderate' && e.alcohol !== 'heavy') continue;
    const next = format(addDays(parseISO(e.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(next);
    if (nextEntry && isNoAlcohol(nextEntry)) return true;
  }
  return false;
}

function hasCaloriesReturnAfterOver(entries: DailyEntry[], settings: AppSettings): boolean {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));
  for (const e of sorted) {
    if (e.calories === null || isCaloriesInLimit(e, settings)) continue;
    const next = format(addDays(parseISO(e.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(next);
    if (nextEntry && isCaloriesInLimit(nextEntry, settings)) return true;
  }
  return false;
}

function hasBackAfterBadDay(entries: DailyEntry[], settings: AppSettings): boolean {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));
  for (const e of sorted) {
    if (calcDailyPoints(e, settings) >= 40) continue;
    const next = format(addDays(parseISO(e.date), 1), 'yyyy-MM-dd');
    const nextEntry = byDate.get(next);
    if (nextEntry && calcDailyPoints(nextEntry, settings) >= 70) return true;
  }
  return false;
}

function hasBackAfterAbsence(entries: DailyEntry[]): boolean {
  const sorted = [...entries].filter((e) => hasDayData(e)).sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1].date);
    const curr = parseISO(sorted[i].date);
    const gap = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (gap >= 7) return true;
  }
  return false;
}

function weekPerfectBase(ws: string, entries: DailyEntry[], settings: AppSettings): boolean {
  const days = weekDays(ws);
  const weekEntries = days.map((d) => entries.find((e) => e.date === d));
  if (weekEntries.some((e) => !e)) return false;
  return weekEntries.every(
    (e) => e && isNoAlcohol(e) && isStepsGoalDone(e, settings) && isCaloriesInLimit(e, settings),
  );
}

function hasRecoveryAfterBadWeek(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): boolean {
  const weeks = getAllWeekStarts(entries, measurements);
  for (let i = 0; i < weeks.length - 1; i++) {
    const badPercent = weekPointsPercent(weeks[i]!, entries, measurements, settings);
    const nextPercent = weekPointsPercent(weeks[i + 1]!, entries, measurements, settings);
    if (badPercent < 40 && nextPercent >= 60) return true;
  }
  return false;
}

function completedWeeksCount(entries: DailyEntry[]): number {
  const weeks = new Set(entries.map((e) => weekStart(e.date)));
  let count = 0;
  for (const ws of weeks) {
    const daysWithData = weekDays(ws).filter((d) => hasDayData(entries.find((e) => e.date === d))).length;
    if (daysWithData >= 5) count++;
  }
  return count;
}

interface AchievementMetrics {
  [key: string]: number | boolean;
}

function buildMetrics(params: AchievementEngineParams): AchievementMetrics {
  const { dailyEntries, measurements, settings, totalXp } = params;
  const entries = [...dailyEntries].sort((a, b) => a.date.localeCompare(b.date));
  const sortedMeasurements = sortMeasurementsByDate(measurements);
  const withWeight = sortedMeasurements.filter((m) => m.weight !== null && m.weight > 0);
  const withWaist = sortedMeasurements.filter((m) => m.waist !== null && m.waist > 0);

  const startWeight = withWeight[0]?.weight ?? null;
  const latestWeight = withWeight[withWeight.length - 1]?.weight ?? null;
  const weightLost =
    startWeight !== null && latestWeight !== null ? Math.max(0, startWeight - latestWeight) : 0;

  const startWaist = withWaist[0]?.waist ?? null;
  const latestWaist = withWaist[withWaist.length - 1]?.waist ?? null;
  const waistLost =
    startWaist !== null && latestWaist !== null ? Math.max(0, startWaist - latestWaist) : 0;

  const weeks = getAllWeekStarts(entries, measurements);
  const strongWeeks = weeks.filter((ws) => weekPointsPercent(ws, entries, measurements, settings) >= 100).length;
  const heroWeeks = weeks.filter((ws) => {
    const calOk = weekDays(ws).filter((d) => {
      const e = entries.find((x) => x.date === d);
      return e && isCaloriesInLimit(e, settings);
    }).length;
    return (
      weekPointsPercent(ws, entries, measurements, settings) >= 100 &&
      weekGymMet(ws, entries, settings) &&
      calOk >= 5
    );
  }).length;
  const perfectBaseWeeks = weeks.filter((ws) => weekPerfectBase(ws, entries, settings)).length;
  const gymWeeksMet = weeks.filter((ws) => weekGymMet(ws, entries, settings)).length;
  const bossHistory = getBossHistory(entries, settings, measurements);
  const momentumMetrics = buildMomentumAchievementMetrics(
    calculateMomentumHistory({ dailyEntries: entries, settings }),
  );

  const m: AchievementMetrics = {
    hasAnyEntry: entries.some((e) => hasDayData(e)),
    daysWithEntries: countEntries(entries, (e) => hasDayData(e)),
    maxEntryStreak: getMaxStreak(entries, (e) => hasDayData(e)),
    completedWeeks: completedWeeksCount(entries),
    weightLost,
    waistLost,
    totalXp,
    totalSteps: sumSteps(entries),
    maxStepsDay: Math.max(0, ...entries.map((e) => e.steps ?? 0)),
    totalMorningExercise: countEntries(entries, (e) => e.morningExercise),
    totalGym: countEntries(entries, (e) => e.gym),
    totalJournal: countEntries(entries, (e) => e.journal),
    totalCooking: countEntries(entries, (e) => e.cooking),
    totalRepair: countEntries(entries, (e) => e.repair),
    totalPlants: countEntries(entries, (e) => e.plants),
    totalHobby: countEntries(entries, (e) => e.hobby),
    measurementCount: sortedMeasurements.length,
    hasMondayMeasurement: sortedMeasurements.some((m) => isMonday(m.date)),
    hasFirstMeasurement: withWeight.length > 0,
    maxNoAlcoholStreak: getMaxStreak(entries, (e) => !!e && isNoAlcohol(e)),
    maxCaloriesStreak: getMaxStreak(entries, (e) => !!e && isCaloriesInLimit(e, settings)),
    maxStepsStreak: getMaxStreak(entries, (e) => !!e && isStepsGoalDone(e, settings)),
    maxStepsMinimumStreak: getMaxStreak(
      entries,
      (e) => !!e && isStepsMinimumGoalDone(e, settings),
    ),
    maxStepsNormalStreak: getMaxStreak(
      entries,
      (e) => !!e && isStepsGoalDone(e, settings),
    ),
    hasStepsExcellent: entries.some((e) => isStepsExcellentGoalDone(e, settings)),
    hasHeardBody: entries.some((e) => e.energyLevel === 1 || e.energyLevel === 2),
    hasRecoverySmart: entries.some((e) => {
      const mode = getDayMode(e.dayMode);
      return (
        (mode === 'recovery' || mode === 'minimal') &&
        e.calories !== null &&
        isNoAlcohol(e)
      );
    }),
    stepsNormalDaysBestWeek: Math.max(
      0,
      ...weeks.map((ws) =>
        weekDays(ws).filter((d) => {
          const e = entries.find((x) => x.date === d);
          return e && isStepsGoalDone(e, settings);
        }).length,
      ),
    ),
    maxGymWeekStreak: maxGymWeekStreak(entries, measurements, settings),
    hasCaloriesFirst: entries.some((e) => e.calories !== null),
    hasCaloriesOk: entries.some((e) => isCaloriesInLimit(e, settings)),
    hasStepsFirst: entries.some((e) => e.steps !== null),
    hasStepsGoal: entries.some((e) => isStepsGoalDone(e, settings)),
    hasGoodDay: entries.some((e) => calcDailyPoints(e, settings) >= 70),
    hasGreatDay: entries.some((e) => calcDailyPoints(e, settings) >= 100),
    hasHeroDay: entries.some(
      (e) => isCaloriesInLimit(e, settings) && isStepsGoalDone(e, settings) && isNoAlcohol(e),
    ),
    hasIronDay: entries.some(
      (e) =>
        isCaloriesInLimit(e, settings) &&
        isStepsGoalDone(e, settings) &&
        e.gym &&
        isNoAlcohol(e),
    ),
    hasBalanceDay: entries.some(
      (e) =>
        isCaloriesInLimit(e, settings) &&
        isStepsGoalDone(e, settings) &&
        e.journal &&
        e.hobby,
    ),
    strongWeeks,
    heroWeeks,
    perfectBaseWeeks,
    gymWeeksMet,
    maxCookingMonth: maxCookingInMonth(entries),
    hasSoberWeekend: hasSoberWeekend(entries),
    hasAlcoholReturnNextDay: hasAlcoholReturnNextDay(entries),
    hasCaloriesReturnAfterOver: hasCaloriesReturnAfterOver(entries, settings),
    hasBackAfterBadDay: hasBackAfterBadDay(entries, settings),
    hasBackAfterAbsence: hasBackAfterAbsence(entries),
    defeatedBosses: countDefeatedBosses(bossHistory),
    perfectBosses: countPerfectBosses(bossHistory),
    maxBossDefeatStreak: maxBossDefeatStreak(bossHistory),
    hasMinimalDay: entries.some((e) =>
      isMinimalDayCompleted({ todayEntry: e, settings }),
    ),
    hasRecoveryAfterBadWeek: hasRecoveryAfterBadWeek(entries, measurements, settings),
    maxBalancedWeeksStreak: getConsecutiveBalancedWeeks(entries),
    maxRecoveryDaysInTracking: getMaxRecoveryDaysWithoutBreakingTracking(entries),
    momentumExitedNegative: momentumMetrics.hasExitedNegative,
    momentumReachedStable: momentumMetrics.hasReachedStable,
    momentumReachedBoost: momentumMetrics.hasReachedBoost,
    momentumReachedFlow: momentumMetrics.hasReachedFlow,
    momentumReturnedFromLostSpeed: momentumMetrics.hasReturnedFromLostSpeed,
  };

  return m;
}

function evaluateAchievement(achievement: Achievement, m: AchievementMetrics): { completed: boolean; current: number; target: number } {
  const target = achievement.target ?? 1;

  const instantMap: Record<string, boolean> = {
    start_first_entry: !!m.hasAnyEntry,
    measurements_first: !!m.hasFirstMeasurement,
    measurements_monday: !!m.hasMondayMeasurement,
    calories_first: !!m.hasCaloriesFirst,
    calories_first_ok: !!m.hasCaloriesOk,
    steps_first: !!m.hasStepsFirst,
    steps_first_goal: !!m.hasStepsGoal,
    steps_excellent_first: !!m.hasStepsExcellent,
    recovery_heard_body: !!m.hasHeardBody,
    recovery_smart: !!m.hasRecoverySmart,
    steps_20k_day: (m.maxStepsDay as number) >= 20000,
    steps_30k_day: (m.maxStepsDay as number) >= 30000,
    exercise_first: (m.totalMorningExercise as number) >= 1,
    gym_first: (m.totalGym as number) >= 1,
    journal_first: (m.totalJournal as number) >= 1,
    cooking_first: (m.totalCooking as number) >= 1,
    repair_first: (m.totalRepair as number) >= 1,
    plants_first: (m.totalPlants as number) >= 1,
    hobby_first: (m.totalHobby as number) >= 1,
    combo_good_day: !!m.hasGoodDay,
    combo_great_day: !!m.hasGreatDay,
    combo_hero_day: !!m.hasHeroDay,
    combo_iron_day: !!m.hasIronDay,
    combo_balance_day: !!m.hasBalanceDay,
    combo_back_after_bad_day: !!m.hasBackAfterBadDay,
    combo_back_after_absence: !!m.hasBackAfterAbsence,
    calories_return_after_over: !!m.hasCaloriesReturnAfterOver,
    alcohol_sober_weekend: !!m.hasSoberWeekend,
    alcohol_return_next_day: !!m.hasAlcoholReturnNextDay,
    gym_week_norm: (m.gymWeeksMet as number) >= 1,
    combo_strong_week: (m.strongWeeks as number) >= 1,
    combo_hero_week: (m.heroWeeks as number) >= 1,
    combo_perfect_base: (m.perfectBaseWeeks as number) >= 1,
    start_first_week: (m.completedWeeks as number) >= 1,
    boss_first_defeat: (m.defeatedBosses as number) >= 1,
    boss_perfect_win: (m.perfectBosses as number) >= 1,
    recovery_minimal_day: !!m.hasMinimalDay,
    recovery_not_robot: !!m.hasRecoveryAfterBadWeek,
    momentum_first_positive: !!m.momentumExitedNegative,
    momentum_stable: !!m.momentumReachedStable,
    momentum_boost: !!m.momentumReachedBoost,
    momentum_flow: !!m.momentumReachedFlow,
    momentum_return: !!m.momentumReturnedFromLostSpeed,
  };

  if (achievement.conditionType === 'instant' || achievement.conditionType === 'combo') {
    const done = instantMap[achievement.id] ?? false;
    return { completed: done, current: done ? 1 : 0, target: 1 };
  }

  const metricMap: Record<string, number> = {
    start_three_days: m.maxEntryStreak as number,
    start_30_days: m.daysWithEntries as number,
    weight_minus_1: m.weightLost as number,
    weight_minus_5: m.weightLost as number,
    weight_minus_10: m.weightLost as number,
    weight_minus_15: m.weightLost as number,
    weight_minus_20: m.weightLost as number,
    weight_minus_30: m.weightLost as number,
    weight_minus_50: m.weightLost as number,
    waist_minus_1: m.waistLost as number,
    waist_minus_5: m.waistLost as number,
    waist_minus_10: m.waistLost as number,
    waist_minus_20: m.waistLost as number,
    measurements_4_weeks: m.measurementCount as number,
    measurements_8_weeks: m.measurementCount as number,
    measurements_12_weeks: m.measurementCount as number,
    calories_7_streak: m.maxCaloriesStreak as number,
    calories_14_streak: m.maxCaloriesStreak as number,
    calories_30_streak: m.maxCaloriesStreak as number,
    steps_7_streak: m.maxStepsNormalStreak as number,
    steps_15_streak: m.maxStepsNormalStreak as number,
    steps_30_streak: m.maxStepsNormalStreak as number,
    steps_minimum_7_streak: m.maxStepsMinimumStreak as number,
    steps_normal_7_streak: m.maxStepsNormalStreak as number,
    steps_normal_5_week: m.stepsNormalDaysBestWeek as number,
    steps_100k_total: m.totalSteps as number,
    steps_500k_total: m.totalSteps as number,
    steps_1m_total: m.totalSteps as number,
    alcohol_1_day: m.maxNoAlcoholStreak as number,
    alcohol_7_days: m.maxNoAlcoholStreak as number,
    alcohol_10_days: m.maxNoAlcoholStreak as number,
    alcohol_15_days: m.maxNoAlcoholStreak as number,
    alcohol_20_days: m.maxNoAlcoholStreak as number,
    alcohol_30_days: m.maxNoAlcoholStreak as number,
    alcohol_60_days: m.maxNoAlcoholStreak as number,
    alcohol_90_days: m.maxNoAlcoholStreak as number,
    exercise_10_total: m.totalMorningExercise as number,
    exercise_50_total: m.totalMorningExercise as number,
    exercise_100_total: m.totalMorningExercise as number,
    gym_4_weeks: m.maxGymWeekStreak as number,
    gym_12_weeks: m.maxGymWeekStreak as number,
    gym_50_total: m.totalGym as number,
    journal_7_total: m.totalJournal as number,
    journal_30_total: m.totalJournal as number,
    journal_100_total: m.totalJournal as number,
    cooking_20_month: m.maxCookingMonth as number,
    repair_30_total: m.totalRepair as number,
    plants_30_total: m.totalPlants as number,
    hobby_30_total: m.totalHobby as number,
    xp_500: m.totalXp as number,
    xp_1200: m.totalXp as number,
    xp_3500: m.totalXp as number,
    xp_10000: m.totalXp as number,
    xp_30000: m.totalXp as number,
    xp_100000: m.totalXp as number,
    boss_3_streak: m.maxBossDefeatStreak as number,
    boss_4_streak: m.maxBossDefeatStreak as number,
    recovery_not_a_robot: m.maxRecoveryDaysInTracking as number,
    recovery_balance_of_strength: m.maxBalancedWeeksStreak as number,
  };

  const current = metricMap[achievement.id] ?? 0;
  return {
    completed: current >= target,
    current,
    target,
  };
}

function buildParamsWithXp(params: AchievementEngineParams): AchievementEngineParams {
  const totalXp =
    calcTotalEarnedXP(params.dailyEntries, params.measurements, params.settings) +
    calcMomentumBonusXp(params.dailyEntries, params.settings) +
    getBonusXpTotal();
  return { ...params, totalXp };
}

export function getAchievementProgress(params: AchievementEngineParams): AchievementProgress[] {
  const full = buildParamsWithXp(params);
  const m = buildMetrics(full);
  return ACHIEVEMENTS.map((a) => {
    const { completed, current, target } = evaluateAchievement(a, m);
    const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : completed ? 100 : 0;
    return {
      achievementId: a.id,
      current,
      target,
      completed,
      percent,
    };
  });
}

export function getCompletedAchievementIds(params: AchievementEngineParams): string[] {
  return getAchievementProgress(params)
    .filter((p) => p.completed)
    .map((p) => p.achievementId);
}

export function getUnlockedAchievements(params: AchievementEngineParams): UnlockedAchievement[] {
  const completedIds = new Set(getCompletedAchievementIds(params));
  const stored = new Map(params.unlockedAchievements.map((u) => [u.achievementId, u]));

  return ACHIEVEMENTS.filter((a) => completedIds.has(a.id)).map((a) => {
    const existing = stored.get(a.id);
    return existing ?? { achievementId: a.id, unlockedAt: new Date().toISOString() };
  });
}

export function checkNewAchievements(params: AchievementEngineParams): Achievement[] {
  const full = buildParamsWithXp(params);
  const completed = new Set(getCompletedAchievementIds(full));
  const already = new Set(params.unlockedAchievements.map((u) => u.achievementId));
  return ACHIEVEMENTS.filter((a) => completed.has(a.id) && !already.has(a.id));
}
