import { addDays, format, parseISO } from 'date-fns';
import type { MomentumDayResult } from '../types/momentum';
import type { AppSettings, DailyEntry } from '../types';
import { MOMENTUM_STORAGE_KEY } from '../constants/momentum';
import { scheduleSidecarRemoteSave } from '../storage/sidecarSync';
import { calculateMomentumDay, calculateMomentumHistory } from './momentumEngine';
import { hasAnyDailyData } from './achievementHelpers';
import { migrateMomentumHistoryRecord } from './momentumFactorMigration';

export function getMomentumHistoryFromStorage(): Record<string, MomentumDayResult> {
  try {
    const raw = localStorage.getItem(MOMENTUM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, MomentumDayResult>;
    if (!parsed || typeof parsed !== 'object') return {};

    const { history, changed } = migrateMomentumHistoryRecord(parsed);
    if (changed) {
      localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(history));
      scheduleSidecarRemoteSave();
    }
    return history;
  } catch {
    return {};
  }
}

export function historyRecordToArray(
  record: Record<string, MomentumDayResult>,
): MomentumDayResult[] {
  return Object.values(record).sort((a, b) => a.date.localeCompare(b.date));
}

export function sortIsoDates(dates: string[]): string[] {
  return [...dates].sort((a, b) => a.localeCompare(b));
}

export function isSameOrAfter(date: string, start: string): boolean {
  return date >= start;
}

export function saveMomentumHistoryToStorage(history: MomentumDayResult[]): void {
  const map: Record<string, MomentumDayResult> = {};
  for (const day of history) {
    map[day.date] = day;
  }
  const { history: migrated } = migrateMomentumHistoryRecord(map);
  localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(migrated));
  scheduleSidecarRemoteSave();
}

export function saveMomentumDayResult(result: MomentumDayResult): void {
  const map = getMomentumHistoryFromStorage();
  map[result.date] = result;
  const { history: migrated } = migrateMomentumHistoryRecord(map);
  localStorage.setItem(MOMENTUM_STORAGE_KEY, JSON.stringify(migrated));
  scheduleSidecarRemoteSave();
}

export function clearMomentumHistoryStorage(): void {
  localStorage.removeItem(MOMENTUM_STORAGE_KEY);
  scheduleSidecarRemoteSave();
}

export function rebuildAndSaveMomentumHistory(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumDayResult[] {
  const history = calculateMomentumHistory(params);
  if (history.length === 0) {
    clearMomentumHistoryStorage();
    return [];
  }
  saveMomentumHistoryToStorage(history);
  return history;
}

function countEntriesWithData(dailyEntries: DailyEntry[]): number {
  return dailyEntries.filter((e) => hasAnyDailyData(e)).length;
}

function getPreviousMomentumFromCache(
  cached: Record<string, MomentumDayResult>,
  beforeDate: string,
): number | null {
  const priorDates = sortIsoDates(Object.keys(cached)).filter((d) => d < beforeDate);
  if (priorDates.length === 0) return null;
  return cached[priorDates[priorDates.length - 1]!]!.endValue;
}

/**
 * Momentum depends on previous day value, so editing a past day requires
 * recalculating from that date forward.
 */
export function rebuildMomentumHistoryFromDate(params: {
  changedDate: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumDayResult[] {
  const { changedDate, dailyEntries, settings } = params;
  const cached = getMomentumHistoryFromStorage();
  const cacheKeys = Object.keys(cached);

  if (countEntriesWithData(dailyEntries) === 0) {
    clearMomentumHistoryStorage();
    return [];
  }

  if (cacheKeys.length === 0) {
    return rebuildAndSaveMomentumHistory({ dailyEntries, settings });
  }

  const withData = dailyEntries.filter((e) => hasAnyDailyData(e));
  const sortedWithData = [...withData].sort((a, b) => a.date.localeCompare(b.date));
  const firstDataDate = sortedWithData[0]!.date;
  const lastDataDate = sortedWithData[sortedWithData.length - 1]!.date;
  const earliestCached = sortIsoDates(cacheKeys)[0]!;

  if (changedDate < earliestCached) {
    return rebuildAndSaveMomentumHistory({ dailyEntries, settings });
  }

  const startDate = changedDate < firstDataDate ? firstDataDate : changedDate;

  let previousMomentum: number;
  if (startDate === firstDataDate) {
    previousMomentum = 0;
  } else {
    const fromCache = getPreviousMomentumFromCache(cached, startDate);
    if (fromCache === null) {
      return rebuildAndSaveMomentumHistory({ dailyEntries, settings });
    }
    previousMomentum = fromCache;
  }

  const updatedMap = { ...cached };
  const byDate = new Map(dailyEntries.map((e) => [e.date, e]));
  let momentum = previousMomentum;

  for (let d = parseISO(startDate); ; d = addDays(d, 1)) {
    const dateStr = format(d, 'yyyy-MM-dd');
    if (dateStr > lastDataDate) break;

    const entry = byDate.get(dateStr) ?? null;
    const previousEntries = dailyEntries.filter((e) => e.date < dateStr);

    const dayResult = calculateMomentumDay({
      date: dateStr,
      previousMomentum: momentum,
      entry: entry && hasAnyDailyData(entry) ? entry : null,
      previousEntries,
      settings,
    });

    updatedMap[dateStr] = dayResult;
    momentum = dayResult.endValue;
  }

  for (const key of Object.keys(updatedMap)) {
    if (key > lastDataDate) {
      delete updatedMap[key];
    }
  }

  const history = historyRecordToArray(updatedMap);
  saveMomentumHistoryToStorage(history);
  return history;
}

export function isMomentumCacheStale(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): boolean {
  const cached = getMomentumHistoryFromStorage();
  const cachedCount = Object.keys(cached).length;
  const computed = calculateMomentumHistory(params);
  if (computed.length === 0) return cachedCount > 0;
  if (cachedCount === 0) return true;
  if (cachedCount !== computed.length) return true;

  const lastComputed = computed[computed.length - 1]!;
  const lastCached = cached[lastComputed.date];
  if (!lastCached) return true;
  return lastCached.endValue !== lastComputed.endValue;
}

export function getOrRebuildMomentumHistory(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  force?: boolean;
}): MomentumDayResult[] {
  const { dailyEntries, settings, force = false } = params;

  if (countEntriesWithData(dailyEntries) === 0) {
    clearMomentumHistoryStorage();
    return [];
  }

  if (!force && !isMomentumCacheStale({ dailyEntries, settings })) {
    return historyRecordToArray(getMomentumHistoryFromStorage());
  }

  return rebuildAndSaveMomentumHistory({ dailyEntries, settings });
}

/** @deprecated use rebuildAndSaveMomentumHistory */
export function rebuildMomentumHistory(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): MomentumDayResult[] {
  return rebuildAndSaveMomentumHistory(params);
}
