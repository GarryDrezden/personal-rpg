import { addDays, format, parseISO } from 'date-fns';
import type { DailyEntry } from '../types';
import { getDayMode } from './stepsEngine';
import { weekDays, weekStart } from './dates';

export function hasAnyDailyData(entry: DailyEntry | undefined | null): boolean {
  if (!entry) return false;
  if (entry.calories !== null && entry.calories !== undefined) return true;
  if (entry.steps !== null && entry.steps !== undefined) return true;
  if (entry.alcohol !== null && entry.alcohol !== undefined) return true;
  if (entry.morningExercise) return true;
  if (entry.gym) return true;
  if (entry.journal) return true;
  if (entry.cooking) return true;
  if (entry.repair) return true;
  if (entry.plants) return true;
  if (entry.hobby) return true;
  if (entry.comment.trim().length > 0) return true;
  if (entry.energyLevel !== null && entry.energyLevel !== undefined) return true;
  const mode = entry.dayMode;
  if (mode !== undefined && mode !== 'normal') return true;
  if (entry.customCompletions && Object.values(entry.customCompletions).some(Boolean)) {
    return true;
  }
  return false;
}

export function isRecoveryDayMode(entry: DailyEntry): boolean {
  const mode = getDayMode(entry.dayMode);
  return mode === 'recovery' || mode === 'minimal';
}

function weekHasAnyData(ws: string, byDate: Map<string, DailyEntry>): boolean {
  return weekDays(ws).some((d) => hasAnyDailyData(byDate.get(d)));
}

function weekIsBalanced(ws: string, byDate: Map<string, DailyEntry>): boolean {
  const days = weekDays(ws);
  let hasGym = false;
  let hasRecoveryDay = false;

  for (const d of days) {
    const e = byDate.get(d);
    if (!e) continue;
    if (e.gym) hasGym = true;
    if (isRecoveryDayMode(e)) hasRecoveryDay = true;
  }

  return hasGym && hasRecoveryDay;
}

function collectWeekStarts(entries: DailyEntry[]): string[] {
  const weeks = new Set<string>();
  for (const e of entries) {
    if (hasAnyDailyData(e)) weeks.add(weekStart(e.date));
  }
  return [...weeks].sort();
}

/** Максимальная серия подряд недель с залом и днём восстановления */
export function getConsecutiveBalancedWeeks(entries: DailyEntry[]): number {
  const weeks = collectWeekStarts(entries);
  if (weeks.length === 0) return 0;

  const byDate = new Map(entries.map((e) => [e.date, e]));
  let maxStreak = 0;
  let current = 0;

  for (const ws of weeks) {
    if (!weekHasAnyData(ws, byDate)) {
      current = 0;
      continue;
    }
    if (weekIsBalanced(ws, byDate)) {
      current++;
      maxStreak = Math.max(maxStreak, current);
    } else {
      current = 0;
    }
  }

  return maxStreak;
}

/** Макс. recovery/minimal дней внутри одной непрерывной серии учёта */
export function getMaxRecoveryDaysWithoutBreakingTracking(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(sorted.map((e) => [e.date, e]));
  const start = parseISO(sorted[0]!.date);
  const end = parseISO(sorted[sorted.length - 1]!.date);

  let maxRecovery = 0;
  let currentRecovery = 0;

  for (let d = start; d <= end; d = addDays(d, 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    const entry = byDate.get(dateStr);

    if (hasAnyDailyData(entry)) {
      if (entry && isRecoveryDayMode(entry)) {
        currentRecovery++;
        maxRecovery = Math.max(maxRecovery, currentRecovery);
      }
    } else {
      currentRecovery = 0;
    }
  }

  return maxRecovery;
}
