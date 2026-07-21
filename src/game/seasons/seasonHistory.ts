import type { AppSettings, DailyEntry } from '../../types';
import type { SeasonHistoryArchive, SeasonHistoryEntry } from './seasonTypes';
import { SEASON_COUNT, getSeasonConfigByIndex } from './seasonConfig';
import {
  getSeasonDateRange,
  getSeasonIndex,
  getSeasonSnapshot,
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
  const currentSeasonIndex = getSeasonIndex(campaignStart, today);

  const entries: SeasonHistoryEntry[] = [];

  for (let index = 1; index <= SEASON_COUNT; index += 1) {
    const config = getSeasonConfigByIndex(index);
    const { start: seasonStartDate, end: seasonEndDate } = getSeasonDateRange(
      campaignStart,
      index,
    );
    const isLocked = index > currentSeasonIndex;
    const isCurrent = index === currentSeasonIndex;

    if (isLocked) {
      entries.push({
        seasonIndex: index,
        config,
        seasonStartDate,
        seasonEndDate,
        completedQuestCount: 0,
        questTotal: config.quests.length,
        partialStatus: 'started',
        partialStatusLabel: 'Ещё в тумане',
        recapText: 'Сезон ещё впереди — без спешки.',
        rewardStatus: 'fog',
        rewardLabel: getSeasonRewardLabel('fog', config.rewardName),
        isCurrent: false,
        isLocked: true,
      });
      continue;
    }

    const referenceDay = isCurrent ? today : seasonEndDate;
    const snapshot = getSeasonSnapshot({
      settings: params.settings,
      dailyEntries: params.dailyEntries,
      today: referenceDay,
    });

    const rewardStatus = getSeasonRewardStatus(snapshot.partialStatus, false);
    entries.push({
      seasonIndex: index,
      config,
      seasonStartDate,
      seasonEndDate,
      completedQuestCount: snapshot.completedQuestCount,
      questTotal: snapshot.quests.length,
      partialStatus: snapshot.partialStatus,
      partialStatusLabel: PARTIAL_STATUS_LABELS[snapshot.partialStatus],
      recapText: getSeasonHistoryRecapText(
        snapshot.partialStatus,
        snapshot.config,
        !isCurrent,
      ),
      rewardStatus,
      rewardLabel: getSeasonRewardLabel(rewardStatus, snapshot.config.rewardName),
      isCurrent,
      isLocked: false,
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
