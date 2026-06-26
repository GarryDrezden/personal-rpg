import type { CoinTransaction } from '../types/currency';
import type { AppSettings, DailyEntry } from '../types';
import type { MomentumLevel } from '../types/momentum';
import {
  getMomentumSummary,
  isBaseMomentumDay,
  isStrongMomentumDay,
} from './momentumEngine';
import { hasAnyDailyData } from './achievementHelpers';

export function buildMomentumCoinTransaction(params: {
  date: string;
  entry: DailyEntry;
  levelId: MomentumLevel['id'];
  settings: AppSettings;
}): CoinTransaction | null {
  const { date, entry, levelId, settings } = params;

  if (!hasAnyDailyData(entry)) return null;

  let title: string | null = null;

  if (levelId === 'boost' && isStrongMomentumDay(entry, settings)) {
    title = 'Бонус инерции: сильный день';
  } else if (levelId === 'flow' && isBaseMomentumDay(entry, settings)) {
    title = 'Бонус инерции: день с базой';
  }

  if (!title) return null;

  return {
    id: `momentum-coin-${date}`,
    type: 'bonus',
    source: 'momentum',
    amount: 1,
    title,
    description: 'Награда за устойчивый режим',
    date,
    relatedId: `momentum_coin_bonus_${date}`,
  };
}

export function evaluateMomentumCoinBonuses(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): CoinTransaction[] {
  const { today, dailyEntries, settings } = params;
  const summary = getMomentumSummary({ today, dailyEntries, settings });
  const todayEntry = dailyEntries.find((e) => e.date === today);

  if (!todayEntry || !summary.coinBonusAvailable) return [];

  const tx = buildMomentumCoinTransaction({
    date: today,
    entry: todayEntry,
    levelId: summary.currentLevel.id,
    settings,
  });

  return tx ? [tx] : [];
}
