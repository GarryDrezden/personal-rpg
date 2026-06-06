import type { AppSettings, DailyEntry, MeasurementEntry, Reward } from '../types';
import {
  calcAvailablePoints,
  calcDailyPoints,
  calcTotalEarnedXP,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from '../utils/points';
import { weekStart, weekDays } from '../utils/dates';
import { getLevelInfo } from '../utils/levels';
import { calcStreaks } from '../utils/streaks';
import { getDelta, getLatestMeasurement } from '../utils/measurements';

export function useDerivedStats(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  rewards: Reward[],
  settings: AppSettings,
  today: string,
) {
  const ws = weekStart(today);
  const weekEntries = weekDays(ws).map(
    (d) => dailyEntries.find((e) => e.date === d) ?? null,
  );

  const todayEntry = dailyEntries.find((e) => e.date === today);
  const todayPoints = todayEntry ? calcDailyPoints(todayEntry, settings) : 0;
  const weekDailyPoints = weekEntries.reduce((sum, e) => {
    if (!e) return sum;
    return sum + calcDailyPoints(e, settings);
  }, 0);
  const bonuses = calcWeeklyBonuses(ws, dailyEntries, measurements, settings);
  const weekTotal = weekDailyPoints + bonuses.total;
  const weekly = getWeeklySettingsForDate(today, settings);
  const weekPercent = weekly.weeklyPointsGoal > 0
    ? Math.round((weekTotal / weekly.weeklyPointsGoal) * 100)
    : 0;

  const totalXP = calcTotalEarnedXP(dailyEntries, measurements, settings);
  const purchasedCosts = rewards
    .filter((r) => r.purchasedAt)
    .map((r) => r.cost);
  const availablePoints = calcAvailablePoints(totalXP, purchasedCosts);
  const level = getLevelInfo(totalXP);
  const streaks = calcStreaks(dailyEntries, settings);
  const latest = getLatestMeasurement(measurements);
  const deltas = getDelta(measurements, 'weight');

  const gymCount = weekEntries.filter((e) => e?.gym).length;
  const caloriesOkDays = weekEntries.filter(
    (e) => e && e.calories !== null && e.calories <= weekly.caloriesLimit,
  ).length;
  const noAlcoholDays = weekEntries.filter((e) => e?.alcohol === 'none').length;
  const weekSteps = weekEntries.reduce((s, e) => s + (e?.steps ?? 0), 0);

  return {
    todayPoints,
    weekTotal,
    weekPercent,
    weekly,
    bonuses,
    totalXP,
    availablePoints,
    level,
    streaks,
    latest,
    weightDelta: deltas,
    waistDelta: getDelta(measurements, 'waist'),
    gymCount,
    caloriesOkDays,
    noAlcoholDays,
    weekSteps,
    todayEntry,
  };
}
