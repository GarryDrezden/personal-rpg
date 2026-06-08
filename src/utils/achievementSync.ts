import { calcTotalEarnedXP } from './points';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import { useAchievementStore } from '../store/achievementStore';

export function syncAchievementsFromData(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): void {
  const totalXp = calcTotalEarnedXP(dailyEntries, measurements, settings);
  useAchievementStore.getState().syncAchievements({
    dailyEntries,
    measurements,
    settings,
    totalXp,
  });
}
