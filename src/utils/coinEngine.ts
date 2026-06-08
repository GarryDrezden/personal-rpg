import type { AppSettings, DailyEntry, MeasurementEntry, Reward } from '../types';
import type { UnlockedAchievement } from '../types/achievements';
import type { CoinTransaction, CoinWalletSummary } from '../types/currency';
import {
  ACHIEVEMENT_COIN_BONUS,
  COIN_AWARDS,
} from '../constants/coins';
import { ACHIEVEMENT_BY_ID } from '../constants/achievements';
import {
  calcDailyPoints,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from './points';
import { weekStart } from './dates';

export function calcDailyCoins(entry: DailyEntry, settings: AppSettings): number {
  const weekly = getWeeklySettingsForDate(entry.date, settings);
  const c = COIN_AWARDS;
  let total = 0;

  if (entry.calories !== null && entry.calories <= weekly.caloriesLimit) total += c.caloriesOk;
  if (entry.steps !== null && entry.steps >= weekly.stepsGoal) total += c.stepsOk;
  if (entry.alcohol === 'none') total += c.noAlcohol;
  if (entry.morningExercise) total += c.morningExercise;
  if (entry.gym) total += c.gym;
  if (entry.journal) total += c.journal;
  if (entry.cooking) total += c.cooking;
  if (entry.repair) total += c.repair;
  if (entry.plants) total += c.plants;
  if (entry.hobby) total += c.hobby;

  const dayXp = calcDailyPoints(entry, settings);
  if (dayXp >= 100) total += c.greatDayBonus;
  else if (dayXp >= 70) total += c.goodDayBonus;

  return total;
}

export function calcWeeklyCoinBonuses(
  weekStartDate: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  const weekly = getWeeklySettingsForDate(weekStartDate, settings);
  const bonuses = calcWeeklyBonuses(weekStartDate, entries, measurements, settings);
  const c = COIN_AWARDS;
  let total = 0;

  if (bonuses.gymWeeklyBonus > 0) total += c.gymWeeklyBonus;
  if (bonuses.noAlcoholWeekBonus > 0) total += c.noAlcoholWeekBonus;
  if (bonuses.caloriesWeekBonus > 0) total += c.caloriesWeekBonus;
  if (bonuses.measurementsMondayBonus > 0) total += c.measurementsMondayBonus;

  const weekDailyXp = entries
    .filter((e) => weekStart(e.date) === weekStartDate)
    .reduce((sum, e) => sum + calcDailyPoints(e, settings), 0);
  const weekTotal = weekDailyXp + bonuses.total;
  if (weekTotal >= weekly.weeklyPointsGoal) total += c.weekGoalBonus;

  return total;
}

export function calcAchievementCoins(unlocked: UnlockedAchievement[]): number {
  return unlocked.reduce((sum, u) => {
    const achievement = ACHIEVEMENT_BY_ID[u.achievementId];
    if (!achievement) return sum;
    return sum + ACHIEVEMENT_COIN_BONUS[achievement.tier];
  }, 0);
}

export function calcTotalEarnedCoins(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
  unlockedAchievements: UnlockedAchievement[] = [],
): number {
  const processedWeeks = new Set<string>();
  let total = 0;

  for (const entry of entries) {
    total += calcDailyCoins(entry, settings);
    const ws = weekStart(entry.date);
    if (!processedWeeks.has(ws)) {
      processedWeeks.add(ws);
      total += calcWeeklyCoinBonuses(ws, entries, measurements, settings);
    }
  }

  total += calcAchievementCoins(unlockedAchievements);

  return Math.max(0, total);
}

export function calcManualCoinAdjustment(extraTransactions: CoinTransaction[]): number {
  return extraTransactions.reduce((sum, tx) => sum + tx.amount, 0);
}

export function calcSpentCoins(rewards: Reward[]): number {
  return rewards
    .filter((r) => r.purchasedAt)
    .reduce((sum, r) => sum + r.cost, 0);
}

export function calcAvailableCoins(
  totalEarned: number,
  spent: number,
  manualAdjustment = 0,
): number {
  return Math.max(0, totalEarned - spent + manualAdjustment);
}

export function buildCoinWalletSummary(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  rewards: Reward[],
  settings: AppSettings,
  today: string,
  unlockedAchievements: UnlockedAchievement[] = [],
  extraTransactions: CoinTransaction[] = [],
): CoinWalletSummary {
  const totalEarned = calcTotalEarnedCoins(
    entries,
    measurements,
    settings,
    unlockedAchievements,
  );
  const totalSpent = calcSpentCoins(rewards);
  const manualAdjustment = calcManualCoinAdjustment(extraTransactions);
  const available = calcAvailableCoins(totalEarned, totalSpent, manualAdjustment);
  const todayEntry = entries.find((e) => e.date === today);
  const todayEarned = todayEntry ? calcDailyCoins(todayEntry, settings) : 0;

  return { totalEarned, totalSpent, available, todayEarned };
}

export function buildCoinTransactionHistory(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  rewards: Reward[],
  settings: AppSettings,
  unlockedAchievements: UnlockedAchievement[] = [],
  extraTransactions: CoinTransaction[] = [],
): CoinTransaction[] {
  const txs: CoinTransaction[] = [];
  const processedWeeks = new Set<string>();

  for (const entry of entries) {
    const dailyCoins = calcDailyCoins(entry, settings);
    if (dailyCoins > 0) {
      txs.push({
        id: `daily-${entry.date}`,
        type: 'earned',
        source: 'daily',
        amount: dailyCoins,
        title: 'День',
        description: `Запись за ${entry.date}`,
        date: entry.date,
        relatedId: entry.id,
      });
    }

    const ws = weekStart(entry.date);
    if (!processedWeeks.has(ws)) {
      processedWeeks.add(ws);
      const weeklyCoins = calcWeeklyCoinBonuses(ws, entries, measurements, settings);
      if (weeklyCoins > 0) {
        txs.push({
          id: `weekly-${ws}`,
          type: 'earned',
          source: 'weekly',
          amount: weeklyCoins,
          title: 'Недельные бонусы',
          description: `Неделя с ${ws}`,
          date: ws,
        });
      }
    }
  }

  for (const u of unlockedAchievements) {
    const achievement = ACHIEVEMENT_BY_ID[u.achievementId];
    if (!achievement) continue;
    const amount = ACHIEVEMENT_COIN_BONUS[achievement.tier];
    txs.push({
      id: `achievement-${u.achievementId}`,
      type: 'bonus',
      source: 'achievement',
      amount,
      title: achievement.title,
      description: 'Бонус за достижение',
      date: u.unlockedAt.slice(0, 10),
      relatedId: u.achievementId,
    });
  }

  for (const r of rewards) {
    if (!r.purchasedAt) continue;
    txs.push({
      id: `reward-${r.id}`,
      type: 'spent',
      source: 'reward',
      amount: -r.cost,
      title: r.title,
      description: 'Покупка награды',
      date: r.purchasedAt.slice(0, 10),
      relatedId: r.id,
    });
  }

  txs.push(...extraTransactions);

  return txs.sort((a, b) => b.date.localeCompare(a.date));
}
