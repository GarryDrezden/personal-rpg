import { useAppStore } from '../store/appStore';
import { useAchievementStore } from '../store/achievementStore';
import { useCoinStore } from '../store/coinStore';
import { useDerivedStats } from '../store/selectors';
import { todayISO } from '../utils/dates';

export function useGameStats(today = todayISO()) {
  const { dailyEntries, measurements, rewards, settings } = useAppStore();
  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);
  const manualCoinTransactions = useCoinStore((s) => s.manualTransactions);

  return useDerivedStats(
    dailyEntries,
    measurements,
    rewards,
    settings,
    today,
    unlockedAchievements,
    manualCoinTransactions,
  );
}
