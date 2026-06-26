import type { AppSettings, DailyEntry, MeasurementEntry, Reward } from '../types';
import type { CoinTransaction } from '../types/currency';
import {
  calcDailyPoints,
  calcTotalEarnedXP,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from '../utils/points';
import { buildCoinWalletSummary, getNearestRewards } from '../utils/coinEngine';
import { weekStart, weekDays } from '../utils/dates';
import { getLevelInfo } from '../utils/levels';
import { calcStreaks } from '../utils/streaks';
import { getDelta, getLatestMeasurement } from '../utils/measurements';
import { getBonusXpTotal } from '../utils/xpTransactionStorage';
import { calcMomentumBonusXp, getMomentumAdjustedDailyPoints } from '../utils/momentumEngine';

export function useDerivedStats(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  rewards: Reward[],
  settings: AppSettings,
  today: string,
  storedCoinTransactions: CoinTransaction[] = [],
) {
  const ws = weekStart(today);
  const weekEntries = weekDays(ws).map(
    (d) => dailyEntries.find((e) => e.date === d) ?? null,
  );

  const todayEntry = dailyEntries.find((e) => e.date === today);
  const todayPointsRaw = todayEntry ? calcDailyPoints(todayEntry, settings) : 0;
  const todayMomentum = todayEntry
    ? getMomentumAdjustedDailyPoints(todayEntry, settings, dailyEntries)
    : { base: 0, adjusted: 0, multiplier: 1 };
  const todayPoints = todayEntry ? todayMomentum.adjusted : 0;
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

  const totalXP =
    calcTotalEarnedXP(dailyEntries, measurements, settings) +
    getBonusXpTotal() +
    calcMomentumBonusXp(dailyEntries, settings);
  const level = getLevelInfo(totalXP);
  const coins = buildCoinWalletSummary(
    dailyEntries,
    measurements,
    settings,
    today,
    storedCoinTransactions,
  );
  const nearestRewards = getNearestRewards(rewards, coins.available);
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
    todayPointsRaw,
    todayMomentumMultiplier: todayMomentum.multiplier,
    weekTotal,
    weekPercent,
    weekly,
    bonuses,
    totalXP,
    level,
    coins,
    nearestRewards,
    /** @deprecated use coins.available */
    availablePoints: coins.available,
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
