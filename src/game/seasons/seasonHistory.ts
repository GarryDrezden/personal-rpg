import type { AppSettings, DailyEntry } from '../../types';
import type { SeasonHistoryArchive, SeasonHistoryEntry } from './seasonTypes';
import { SEASON_COUNT, getSeasonConfigByIndex } from './seasonConfig';
import {
  evaluateSeasonProgress,
  resolveActiveSeasonIndex,
  resolveCampaignStartDate,
} from './seasonEngine';
import {
  getSeasonHistoryRecapText,
  getSeasonRewardLabel,
  getSeasonRewardStatus,
  PARTIAL_STATUS_LABELS,
} from './seasonRecap';
import { todayISO } from '../../utils/dates';

export function getSeasonHistoryArchive(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today?: string;
}): SeasonHistoryArchive {
  const today = params.today ?? todayISO();
  const campaignStart = resolveCampaignStartDate(
    params.settings,
    params.dailyEntries,
    today,
  );
  const currentSeasonIndex = resolveActiveSeasonIndex({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
    campaignStartDate: campaignStart,
  });

  const entries: SeasonHistoryEntry[] = [];

  for (let index = 1; index <= SEASON_COUNT; index += 1) {
    const config = getSeasonConfigByIndex(index);
    const isLocked = index > currentSeasonIndex;
    const isCurrent = index === currentSeasonIndex;

    if (isLocked) {
      const { seasonStartDate, calendarEndDate } = evaluateSeasonProgress({
        settings: params.settings,
        dailyEntries: params.dailyEntries,
        campaignStartDate: campaignStart,
        seasonIndex: index,
        today,
        extendOpenEnd: false,
      });
      entries.push({
        seasonIndex: index,
        config,
        seasonStartDate,
        seasonEndDate: calendarEndDate,
        completedQuestCount: 0,
        questTotal: config.quests.length,
        partialStatus: 'started',
        partialStatusLabel: 'Ещё в тумане',
        recapText: 'Новая арка откроется после завершения текущей.',
        rewardStatus: 'fog',
        rewardLabel: getSeasonRewardLabel('fog', config.rewardName),
        isCurrent: false,
        isLocked: true,
        isCompleted: false,
      });
      continue;
    }

    const progress = evaluateSeasonProgress({
      settings: params.settings,
      dailyEntries: params.dailyEntries,
      campaignStartDate: campaignStart,
      seasonIndex: index,
      today,
      extendOpenEnd: true,
    });

    const rewardStatus = getSeasonRewardStatus(progress.partialStatus, false);
    entries.push({
      seasonIndex: index,
      config,
      seasonStartDate: progress.seasonStartDate,
      seasonEndDate: progress.seasonEndDate,
      completedQuestCount: progress.completedQuestCount,
      questTotal: progress.quests.length,
      partialStatus: progress.partialStatus,
      partialStatusLabel: PARTIAL_STATUS_LABELS[progress.partialStatus],
      recapText: getSeasonHistoryRecapText(
        progress.partialStatus,
        config,
        !isCurrent && progress.isCompleted,
      ),
      rewardStatus,
      rewardLabel: getSeasonRewardLabel(rewardStatus, config.rewardName),
      isCurrent,
      isLocked: false,
      isCompleted: progress.isCompleted,
    });
  }

  return {
    currentSeasonIndex,
    entries,
    earnedRewardCount: entries.filter((e) => e.rewardStatus === 'earned').length,
  };
}

export function getVisibleSeasonHistory(
  archive: SeasonHistoryArchive,
  fogLimit = 2,
): SeasonHistoryEntry[] {
  const open = archive.entries.filter((e) => !e.isLocked);
  const fog = archive.entries.filter((e) => e.isLocked).slice(0, fogLimit);
  return [...open, ...fog];
}

/** Split chronicle sections — completed never includes waiting/incomplete. */
export function partitionSeasonHistory(archive: SeasonHistoryArchive) {
  const visible = getVisibleSeasonHistory(archive, 2);
  return {
    current: visible.find((e) => e.isCurrent) ?? null,
    completed: visible.filter((e) => e.isCompleted && !e.isCurrent),
    upcoming: visible.filter((e) => e.isLocked),
  };
}
