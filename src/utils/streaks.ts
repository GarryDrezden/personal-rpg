import { subDays, format } from 'date-fns';
import type { AppSettings, DailyEntry } from '../types';
import { getWeeklySettingsForDate } from './points';
import { isStepsMinimumDone, isStepsNormalDone } from './stepsEngine';
import { hasJournalEntry } from './journalEntry';

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
  stepsMinimum: number;
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
      return isStepsNormalDone(e.steps, s, d);
    }),
    stepsMinimum: countStreak(entries, settings, (e, s, d) => {
      if (!e || e.steps === null) return false;
      return isStepsMinimumDone(e.steps, s, d);
    }),
    journal: countStreak(entries, settings, (e) => hasJournalEntry(e)),
  };
}
