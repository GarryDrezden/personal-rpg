import type { AppSettings, DailyEntry, MeasurementEntry, Reward } from '../types';
import type { CoinTransaction, CoinWalletSummary, NearestRewardInfo } from '../types/currency';
import { resolveCoinSettings } from '../constants/coins';
import {
  calcDailyPoints,
  calcWeeklyBonuses,
  getWeeklySettingsForDate,
} from './points';
import { isMonday, weekDays, weekStart } from './dates';
import {
  isCaloriesInLimit,
  isNoAlcohol,
  isStepsGoalDone,
} from './achievementEngine';

export function calculateCoinBalance(transactions: CoinTransaction[]): number {
  return Math.max(0, transactions.reduce((sum, tx) => sum + tx.amount, 0));
}

function weekPointsTotal(
  ws: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  const daily = weekDays(ws).reduce((sum, d) => {
    const e = entries.find((x) => x.date === d);
    return sum + (e ? calcDailyPoints(e, settings) : 0);
  }, 0);
  return daily + calcWeeklyBonuses(ws, entries, measurements, settings).total;
}

function weekPerfectBase(ws: string, entries: DailyEntry[], settings: AppSettings): boolean {
  const days = weekDays(ws);
  const weekEntries = days.map((d) => entries.find((e) => e.date === d));
  if (weekEntries.some((e) => !e)) return false;
  return weekEntries.every(
    (e) => e && isNoAlcohol(e) && isStepsGoalDone(e, settings) && isCaloriesInLimit(e, settings),
  );
}

export function getCoinTransactionsFromDailyEntries(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): CoinTransaction[] {
  const { dailyEntries, settings } = params;
  const cs = resolveCoinSettings(settings);
  const txs: CoinTransaction[] = [];

  for (const entry of dailyEntries) {
    const dayXp = calcDailyPoints(entry, settings);
    let amount = 0;
    const parts: string[] = [];

    if (dayXp >= 100) {
      amount += cs.greatDayCoins;
      parts.push('отличный день');
    } else if (dayXp >= 70) {
      amount += cs.goodDayCoins;
      parts.push('хороший день');
    }

    const heroDay =
      isCaloriesInLimit(entry, settings) &&
      isStepsGoalDone(entry, settings) &&
      isNoAlcohol(entry);
    const ironDay = heroDay && entry.gym;

    if (heroDay) {
      amount += cs.heroDayBonusCoins;
      parts.push('день героя');
    }
    if (ironDay) {
      amount += cs.ironDayBonusCoins;
      parts.push('железный день');
    }

    if (amount <= 0) continue;

    txs.push({
      id: `gen-daily-${entry.date}`,
      type: 'earned',
      source: 'daily',
      amount,
      title: 'Монеты за день',
      description: parts.join(' · '),
      date: entry.date,
      relatedId: `daily_${entry.date}`,
    });
  }

  return txs;
}

export function getCoinTransactionsFromWeeks(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): CoinTransaction[] {
  const { dailyEntries, measurements, settings } = params;
  const cs = resolveCoinSettings(settings);
  const processedWeeks = new Set<string>();
  const txs: CoinTransaction[] = [];

  for (const entry of dailyEntries) {
    const ws = weekStart(entry.date);
    if (processedWeeks.has(ws)) continue;
    processedWeeks.add(ws);

    const days = weekDays(ws);
    const weekEntries = days.map((d) => dailyEntries.find((e) => e.date === d));
    const allDaysLogged = weekEntries.every((e) => e !== undefined);
    const weekly = getWeeklySettingsForDate(ws, settings);
    const weekTotal = weekPointsTotal(ws, dailyEntries, measurements, settings);
    const percent =
      weekly.weeklyPointsGoal > 0
        ? (weekTotal / weekly.weeklyPointsGoal) * 100
        : 0;

    let amount = 0;
    const parts: string[] = [];

    if (percent >= 80 && percent < 100) {
      amount += cs.week80Coins;
      parts.push('80% недельной цели');
    }
    if (percent >= 100) {
      amount += cs.week100Coins;
      parts.push('100% недельной цели');
    }

    if (allDaysLogged && weekEntries.every((e) => e && isNoAlcohol(e))) {
      amount += cs.noAlcoholWeekCoins;
      parts.push('7 дней без алкоголя');
    }

    const gymCount = weekEntries.filter((e) => e?.gym).length;
    if (gymCount >= weekly.gymTarget) {
      amount += cs.gymWeekCoins;
      parts.push('норма зала');
    }

    if (
      allDaysLogged &&
      weekEntries.every((e) => e && e.calories !== null && isCaloriesInLimit(e, settings))
    ) {
      amount += cs.caloriesWeekCoins;
      parts.push('7 дней калории в лимите');
    }

    if (weekPerfectBase(ws, dailyEntries, settings)) {
      amount += cs.perfectBaseWeekCoins;
      parts.push('идеальная база');
    }

    if (amount <= 0) continue;

    txs.push({
      id: `gen-weekly-${ws}`,
      type: 'earned',
      source: 'weekly',
      amount,
      title: 'Монеты за неделю',
      description: parts.join(' · '),
      date: ws,
      relatedId: `weekly_${ws}`,
    });
  }

  return txs;
}

export function getCoinTransactionsFromMeasurements(params: {
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): CoinTransaction[] {
  const { measurements, settings } = params;
  const cs = resolveCoinSettings(settings);
  const txs: CoinTransaction[] = [];

  for (const m of measurements) {
    if (!isMonday(m.date)) continue;
    txs.push({
      id: `gen-measurement-${m.date}`,
      type: 'earned',
      source: 'measurement',
      amount: cs.measurementsMondayCoins,
      title: 'Замер в понедельник',
      description: 'Внесены замеры',
      date: m.date,
      relatedId: `measurement_${m.date}`,
    });
  }

  return txs;
}

export function mergeCoinTransactions(params: {
  existingTransactions: CoinTransaction[];
  generatedTransactions: CoinTransaction[];
}): CoinTransaction[] {
  const { existingTransactions, generatedTransactions } = params;
  const map = new Map<string, CoinTransaction>();

  for (const tx of generatedTransactions) {
    const key = tx.relatedId ?? tx.id;
    map.set(key, tx);
  }

  for (const tx of existingTransactions) {
    if (tx.type === 'spent' || tx.type === 'manual' || tx.type === 'refund') {
      const key = tx.relatedId ?? tx.id;
      map.set(key, tx);
    }
  }

  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function generateEarnedCoinTransactions(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): CoinTransaction[] {
  return [
    ...getCoinTransactionsFromDailyEntries({ dailyEntries, settings }),
    ...getCoinTransactionsFromWeeks({ dailyEntries, measurements, settings }),
    ...getCoinTransactionsFromMeasurements({ measurements, settings }),
  ];
}

export function buildAllCoinTransactions(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
  storedTransactions: CoinTransaction[],
): CoinTransaction[] {
  const generated = generateEarnedCoinTransactions(dailyEntries, measurements, settings);
  const persisted = storedTransactions.filter(
    (tx) => tx.type === 'spent' || tx.type === 'manual' || tx.type === 'refund',
  );
  return mergeCoinTransactions({
    existingTransactions: persisted,
    generatedTransactions: generated,
  });
}

export function buildCoinWalletSummary(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
  today: string,
  storedTransactions: CoinTransaction[],
): CoinWalletSummary {
  const transactions = buildAllCoinTransactions(
    dailyEntries,
    measurements,
    settings,
    storedTransactions,
  );
  const available = calculateCoinBalance(transactions);
  const totalEarned = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const ws = weekStart(today);
  const weekEarned = transactions
    .filter((tx) => tx.amount > 0 && tx.date >= ws && tx.date <= today)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const todayEarned = transactions
    .filter((tx) => tx.relatedId === `daily_${today}` && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalEarned,
    totalSpent,
    available,
    todayEarned,
    weekEarned,
    transactions,
  };
}

export function getNearestRewards(
  rewards: Reward[],
  balance: number,
): { affordable: NearestRewardInfo; unaffordable: NearestRewardInfo } {
  const available = rewards.filter((r) => !r.purchasedAt && !r.hidden);
  const sorted = [...available].sort((a, b) => a.cost - b.cost);

  const affordableList = sorted.filter((r) => r.cost <= balance);
  const unaffordableList = sorted.filter((r) => r.cost > balance);

  const affordable = affordableList.length
    ? {
        rewardId: affordableList[affordableList.length - 1]!.id,
        title: affordableList[affordableList.length - 1]!.title,
        cost: affordableList[affordableList.length - 1]!.cost,
      }
    : null;

  const unaffordable = unaffordableList.length
    ? {
        rewardId: unaffordableList[0]!.id,
        title: unaffordableList[0]!.title,
        cost: unaffordableList[0]!.cost,
        missing: unaffordableList[0]!.cost - balance,
      }
    : null;

  return { affordable, unaffordable };
}

/** Превью монет за один день (без записи в localStorage) */
export function previewDailyCoins(entry: DailyEntry, settings: AppSettings): number {
  const txs = getCoinTransactionsFromDailyEntries({
    dailyEntries: [entry],
    settings,
  });
  return txs.reduce((sum, tx) => sum + tx.amount, 0);
}
