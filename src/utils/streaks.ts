import { subDays, format } from 'date-fns';
import type { AppSettings, DailyEntry } from '../types';
import { getWeeklySettingsForDate } from './points';

function countStreak(
  entries: DailyEntry[],
  settings: AppSettings,
  predicate: (entry: DailyEntry | undefined, settings: AppSettings, date: string) => boolean,
): number {
  let count = 0;
  let current = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = format(current, 'yyyy-MM-dd');
    const entry = entries.find((e) => e.date === dateStr);
    if (predicate(entry, settings, dateStr)) {
      count++;
      current = subDays(current, 1);
    } else {
      break;
    }
  }

  return count;
}

export interface Streaks {
  noAlcohol: number;
  caloriesOk: number;
  stepsOk: number;
  journal: number;
}

export function calcStreaks(
  entries: DailyEntry[],
  settings: AppSettings,
): Streaks {
  return {
    noAlcohol: countStreak(entries, settings, (e) => e?.alcohol === 'none'),
    caloriesOk: countStreak(entries, settings, (e, s, d) => {
      if (!e || e.calories === null) return false;
      const weekly = getWeeklySettingsForDate(d, s);
      return e.calories <= weekly.caloriesLimit;
    }),
    stepsOk: countStreak(entries, settings, (e, s, d) => {
      if (!e || e.steps === null) return false;
      const weekly = getWeeklySettingsForDate(d, s);
      return e.steps >= weekly.stepsGoal;
    }),
    journal: countStreak(entries, settings, (e) => e?.journal === true),
  };
}
