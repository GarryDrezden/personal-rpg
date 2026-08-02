import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry } from '../../types';
import { todayISO } from '../../utils/dates';
import {
  getSeasonConfigByIndex,
  SEASON_COUNT,
  SEASON_LENGTH_DAYS,
} from './seasonConfig';
import { buildQuestProgressList } from './seasonQuestProgress';
import {
  getSeasonPartialStatus,
  getSeasonRecapText,
  isSeasonArcCompleted,
  PARTIAL_STATUS_LABELS,
} from './seasonRecap';
import type { SeasonPartialStatus, SeasonQuestProgress, SeasonSnapshot } from './seasonTypes';

export function resolveCampaignStartDate(
  settings: AppSettings,
  dailyEntries: DailyEntry[],
  today: string = todayISO(),
): string {
  if (settings.startDate) return settings.startDate;
  if (dailyEntries.length > 0) {
    return [...dailyEntries].map((e) => e.date).sort()[0]!;
  }
  return today;
}

/** Calendar window index from startDate (28-day slices). Not the campaign active arc. */
export function getRawSeasonIndex(campaignStartDate: string, today: string): number {
  const days = differenceInCalendarDays(parseISO(today), parseISO(campaignStartDate));
  if (days < 0) return 1;
  return Math.floor(days / SEASON_LENGTH_DAYS) + 1;
}

/** Clamped calendar season window (1…SEASON_COUNT). Does not gate by completion. */
export function getCalendarSeasonIndex(campaignStartDate: string, today: string): number {
  return Math.min(SEASON_COUNT, getRawSeasonIndex(campaignStartDate, today));
}

/**
 * @deprecated Prefer `resolveActiveSeasonIndex` for campaign current,
 * or `getCalendarSeasonIndex` for 28-day window math.
 * Kept as calendar index for older call sites during migration.
 */
export function getSeasonIndex(campaignStartDate: string, today: string): number {
  return getCalendarSeasonIndex(campaignStartDate, today);
}

export function getSeasonDateRange(
  campaignStartDate: string,
  seasonIndex: number,
): { start: string; end: string } {
  const clampedIndex = Math.min(SEASON_COUNT, Math.max(1, seasonIndex));
  const offset = (clampedIndex - 1) * SEASON_LENGTH_DAYS;
  const start = format(addDays(parseISO(campaignStartDate), offset), 'yyyy-MM-dd');
  const end = format(addDays(parseISO(start), SEASON_LENGTH_DAYS - 1), 'yyyy-MM-dd');
  return { start, end };
}

export function getSeasonEntries(
  dailyEntries: DailyEntry[],
  seasonStart: string,
  seasonEnd: string,
): DailyEntry[] {
  return dailyEntries.filter((e) => e.date >= seasonStart && e.date <= seasonEnd);
}

export type SeasonProgressEvaluation = {
  seasonIndex: number;
  seasonStartDate: string;
  seasonEndDate: string;
  calendarEndDate: string;
  quests: SeasonQuestProgress[];
  completedQuestCount: number;
  partialStatus: SeasonPartialStatus;
  isCompleted: boolean;
};

/**
 * Quest progress for a specific season index.
 * When `extendOpenEnd` is true and today is past the 28-day window,
 * the window grows to `today` so an unfinished arc can still be completed.
 */
export function evaluateSeasonProgress(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  campaignStartDate: string;
  seasonIndex: number;
  today: string;
  extendOpenEnd?: boolean;
}): SeasonProgressEvaluation {
  const config = getSeasonConfigByIndex(params.seasonIndex);
  const { start, end: calendarEnd } = getSeasonDateRange(
    params.campaignStartDate,
    params.seasonIndex,
  );
  let end = calendarEnd;
  if (params.extendOpenEnd && params.today > calendarEnd) {
    end = params.today;
  }
  if (end > params.today) end = params.today;

  const seasonEntries = getSeasonEntries(params.dailyEntries, start, end);
  const quests = buildQuestProgressList(config.quests, seasonEntries, params.settings);
  const completedQuestCount = quests.filter((q) => q.completed).length;
  const partialStatus = getSeasonPartialStatus(completedQuestCount);

  return {
    seasonIndex: params.seasonIndex,
    seasonStartDate: start,
    seasonEndDate: end,
    calendarEndDate: calendarEnd,
    quests,
    completedQuestCount,
    partialStatus,
    isCompleted: isSeasonArcCompleted(partialStatus),
  };
}

/**
 * Active campaign season: first incomplete arc.
 * Calendar date alone never advances the arc.
 * Invalid “season 2 current while season 1 incomplete” normalizes here (derived state).
 */
export function resolveActiveSeasonIndex(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today?: string;
  campaignStartDate?: string;
}): number {
  const today = params.today ?? todayISO();
  const campaignStartDate =
    params.campaignStartDate ??
    resolveCampaignStartDate(params.settings, params.dailyEntries, today);

  for (let index = 1; index <= SEASON_COUNT; index += 1) {
    const progress = evaluateSeasonProgress({
      settings: params.settings,
      dailyEntries: params.dailyEntries,
      campaignStartDate,
      seasonIndex: index,
      today,
      extendOpenEnd: true,
    });
    if (!progress.isCompleted) return index;
  }

  return SEASON_COUNT;
}

/** Day number within a season window (may exceed 28 while an arc continues). */
export function getSeasonDayNumber(
  campaignStartDate: string,
  today: string,
  seasonIndex?: number,
): number {
  const index = seasonIndex ?? getCalendarSeasonIndex(campaignStartDate, today);
  const { start } = getSeasonDateRange(campaignStartDate, index);
  const days = differenceInCalendarDays(parseISO(today), parseISO(start));
  if (days < 0) return 1;
  return days + 1;
}

export function getSeasonSnapshot(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today?: string;
}): SeasonSnapshot {
  const today = params.today ?? todayISO();
  const campaignStartDate = resolveCampaignStartDate(
    params.settings,
    params.dailyEntries,
    today,
  );
  const seasonIndex = resolveActiveSeasonIndex({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
    campaignStartDate,
  });
  const progress = evaluateSeasonProgress({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    campaignStartDate,
    seasonIndex,
    today,
    extendOpenEnd: true,
  });
  const config = getSeasonConfigByIndex(seasonIndex);
  const dayNumber = getSeasonDayNumber(campaignStartDate, today, seasonIndex);
  const questsNearCompletion = progress.quests.filter(
    (q) => !q.completed && q.current >= Math.max(1, q.target - 2),
  ).length;

  return {
    config,
    seasonIndex,
    dayNumber,
    seasonLength: SEASON_LENGTH_DAYS,
    seasonStartDate: progress.seasonStartDate,
    seasonEndDate: progress.seasonEndDate,
    campaignStartDate,
    timeProgressPercent: Math.min(100, Math.round((dayNumber / SEASON_LENGTH_DAYS) * 100)),
    quests: progress.quests,
    completedQuestCount: progress.completedQuestCount,
    partialStatus: progress.partialStatus,
    partialStatusLabel: PARTIAL_STATUS_LABELS[progress.partialStatus],
    questsNearCompletion,
  };
}

export type SeasonSnapshotWithRecap = SeasonSnapshot & { recapText: string };

export function getSeasonSnapshotWithRecap(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today?: string;
}): SeasonSnapshotWithRecap {
  const snapshot = getSeasonSnapshot(params);
  const recapText = getSeasonRecapText(snapshot.partialStatus, snapshot.config);
  return { ...snapshot, recapText };
}
