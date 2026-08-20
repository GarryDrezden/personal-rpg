import type { AppSettings, DailyEntry } from '../../types';
import type { SeasonHistoryArchive, SeasonHistoryEntry } from './seasonTypes';
import { getSeasonConfigByIndex } from './seasonConfig';
import {
  resolveActiveSeasonIndex,
  resolveCampaignStartDate,
  walkSeasonCampaignArcs,
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
  const arcs = walkSeasonCampaignArcs({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    campaignStartDate: campaignStart,
    today,
  });

  const entries: SeasonHistoryEntry[] = [];

  for (const arc of arcs) {
    const config = getSeasonConfigByIndex(arc.seasonIndex);
    if (arc.isLocked) {
      entries.push({
        seasonIndex: arc.seasonIndex,
        config,
        seasonStartDate: arc.windowStart,
        seasonEndDate: arc.calendarEndDate,
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

    const progress = arc.progress;
    const rewardStatus = getSeasonRewardStatus(progress.partialStatus, false);
    entries.push({
      seasonIndex: arc.seasonIndex,
      config,
      seasonStartDate: progress.seasonStartDate,
      seasonEndDate: arc.windowEnd,
      completedQuestCount: progress.completedQuestCount,
      questTotal: progress.quests.length,
      partialStatus: progress.partialStatus,
      partialStatusLabel: PARTIAL_STATUS_LABELS[progress.partialStatus],
      recapText: getSeasonHistoryRecapText(
        progress.partialStatus,
        config,
        !arc.isCurrent,
        {
          themeId: params.settings.themeId ?? 'darkFantasy',
          date: today,
        },
      ),
      rewardStatus,
      rewardLabel: getSeasonRewardLabel(rewardStatus, config.rewardName),
      isCurrent: arc.isCurrent,
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
