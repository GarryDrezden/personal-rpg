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
  PARTIAL_STATUS_LABELS,
} from './seasonRecap';
import type { SeasonSnapshot } from './seasonTypes';

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

export function getRawSeasonIndex(campaignStartDate: string, today: string): number {
  const days = differenceInCalendarDays(parseISO(today), parseISO(campaignStartDate));
  if (days < 0) return 1;
  return Math.floor(days / SEASON_LENGTH_DAYS) + 1;
}

export function getSeasonIndex(campaignStartDate: string, today: string): number {
  return Math.min(SEASON_COUNT, getRawSeasonIndex(campaignStartDate, today));
}

export function getSeasonDayNumber(campaignStartDate: string, today: string): number {
  const days = differenceInCalendarDays(parseISO(today), parseISO(campaignStartDate));
  if (days < 0) return 1;
  const rawSeason = getRawSeasonIndex(campaignStartDate, today);
  if (rawSeason > SEASON_COUNT) return SEASON_LENGTH_DAYS;
  return (days % SEASON_LENGTH_DAYS) + 1;
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
  const seasonIndex = getSeasonIndex(campaignStartDate, today);
  const dayNumber = getSeasonDayNumber(campaignStartDate, today);
  const config = getSeasonConfigByIndex(seasonIndex);
  const { start: seasonStartDate, end: seasonEndDate } = getSeasonDateRange(
    campaignStartDate,
    seasonIndex,
  );
  const seasonEntries = getSeasonEntries(params.dailyEntries, seasonStartDate, seasonEndDate);
  const quests = buildQuestProgressList(config.quests, seasonEntries, params.settings);
  const completedQuestCount = quests.filter((q) => q.completed).length;
  const partialStatus = getSeasonPartialStatus(completedQuestCount);
  const questsNearCompletion = quests.filter(
    (q) => !q.completed && q.current >= Math.max(1, q.target - 2),
  ).length;

  return {
    config,
    seasonIndex,
    dayNumber,
    seasonLength: SEASON_LENGTH_DAYS,
    seasonStartDate,
    seasonEndDate,
    campaignStartDate,
    timeProgressPercent: Math.round((dayNumber / SEASON_LENGTH_DAYS) * 100),
    quests,
    completedQuestCount,
    partialStatus,
    partialStatusLabel: PARTIAL_STATUS_LABELS[partialStatus],
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
