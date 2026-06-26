import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { WeeklyStoryReport } from '../types/weeklyStory';
import { weekStart } from './dates';
import { generateWeeklyStoryReport } from './weeklyStoryEngine';
import { hasAnyDailyData } from './achievementHelpers';

function collectWeekStarts(
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
): string[] {
  const weeks = new Set<string>();

  for (const entry of dailyEntries) {
    if (hasAnyDailyData(entry)) {
      weeks.add(weekStart(entry.date));
    }
  }

  for (const m of measurements) {
    if (m.weight !== null || m.waist !== null) {
      weeks.add(weekStart(m.date));
    }
  }

  return [...weeks].sort((a, b) => b.localeCompare(a));
}

export function getWeeklyStoryHistory(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  limit?: number;
}): WeeklyStoryReport[] {
  const { dailyEntries, measurements, settings, limit = 12 } = params;
  const weekStarts = collectWeekStarts(dailyEntries, measurements).slice(0, limit);

  return weekStarts.map((ws) =>
    generateWeeklyStoryReport({
      weekStart: ws,
      dailyEntries,
      measurements,
      settings,
    }),
  );
}
