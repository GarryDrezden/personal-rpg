import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type {
  ActBossProgressEntry,
  BossArchiveEntry,
  BossCampaignArchive,
  BossStatus,
} from './bossTypes';
import {
  ACT_BOSSES,
  CHAPTER_BOSSES,
  SEASON_MINI_BOSSES,
  getSeasonMiniBossByIndex,
} from './bossConfig';
import {
  BOSS_STATUS_THRESHOLDS,
  computeBossProgressPercent,
  getBossCampaignSnapshot,
} from './bossCampaignEngine';
import { hasAnyDailyData } from '../../utils/achievementHelpers';
import { getDayMode } from '../../utils/stepsEngine';
import { getNutritionQuestCompleted, isNutritionTrackingEnabled } from '../../utils/nutritionEngine';
import { getBodyAbilityState } from '../bodyAbilities/bodyAbilityV1Engine';
import { getPlateauSnapshot } from '../plateau/plateauEngine';
import {
  getSeasonDateRange,
  getSeasonEntries,
  getSeasonIndex,
  getSeasonSnapshot,
  resolveCampaignStartDate,
} from '../seasons/seasonEngine';
import { getSeasonPartialStatus } from '../seasons/seasonRecap';
import { getAllJourneyStageProgress } from '../../utils/journeyMapEngine';
import { todayISO } from '../../utils/dates';
import { getSeasonCampaignBossArtUrl } from './bossArt';

/** Seasons belonging to each campaign act. */
export const ACT_SEASON_RANGES: Record<'I' | 'II' | 'III', [number, number]> = {
  I: [1, 4],
  II: [5, 9],
  III: [10, 13],
};

/** Journey chapters belonging to each campaign act. */
export const ACT_CHAPTER_RANGES: Record<'I' | 'II' | 'III', [number, number]> = {
  I: [1, 3],
  II: [4, 6],
  III: [7, 9],
};

function resolveBossStatus(progress: number, partialSealed: boolean): BossStatus {
  if (partialSealed || progress >= BOSS_STATUS_THRESHOLDS.sealed) return 'sealed';
  if (progress >= BOSS_STATUS_THRESHOLDS.broken) return 'broken';
  if (progress >= BOSS_STATUS_THRESHOLDS.weakened) return 'weakened';
  if (progress >= BOSS_STATUS_THRESHOLDS.noticed) return 'noticed';
  return 'untouched';
}

function isSavedDay(entry: DailyEntry): boolean {
  if (!entry.id) return false;
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal' || mode === 'recovery') return true;
  return hasAnyDailyData(entry);
}

function countSeasonSignals(
  seasonEntries: DailyEntry[],
  settings: AppSettings,
  seasonStart: string,
) {
  let routeHeld = 0;
  let minimal = 0;
  let recovery = 0;
  let movement = 0;
  let nutrition = 0;
  let resource = 0;
  let alcoholFree = 0;

  for (const entry of seasonEntries) {
    if (isSavedDay(entry)) routeHeld += 1;
    const mode = getDayMode(entry.dayMode);
    if (mode === 'minimal') minimal += 1;
    if (mode === 'recovery') recovery += 1;
    if ((entry.steps ?? 0) > 0 || entry.morningExercise || entry.gym) movement += 1;
    if (
      entry.energyLevel != null ||
      entry.sleepQuality != null ||
      (entry.cognitiveBreaks != null && entry.cognitiveBreaks !== 'none')
    ) {
      resource += 1;
    }
    if (entry.alcohol === 'none') alcoholFree += 1;
    if (
      isNutritionTrackingEnabled(settings) &&
      getNutritionQuestCompleted({ entry, settings })
    ) {
      nutrition += 1;
    }
  }

  const abilityUnlocks = getBodyAbilityState(settings).abilityUnlocks ?? [];
  const bodyAbilitiesInSeason = abilityUnlocks.filter(
    (u) => u.unlockedAt.slice(0, 10) >= seasonStart,
  ).length;

  return {
    routeHeld,
    minimal,
    recovery,
    movement,
    nutrition,
    resource,
    alcoholFree,
    bodyAbilitiesInSeason,
  };
}

function computeSeasonBossEntry(params: {
  seasonIndex: number;
  currentSeasonIndex: number;
  campaignStart: string;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today: string;
  baseScore?: number;
}): BossArchiveEntry {
  const boss = getSeasonMiniBossByIndex(params.seasonIndex);
  const isLocked = params.seasonIndex > params.currentSeasonIndex;
  const isCurrent = params.seasonIndex === params.currentSeasonIndex;
  const artUrl = getSeasonCampaignBossArtUrl(params.seasonIndex);

  if (isLocked) {
    return {
      boss,
      progressPercent: 0,
      status: 'untouched',
      statusLabel: 'Ещё в тумане сезона.',
      isCurrent: false,
      isLocked: true,
      artUrl,
    };
  }

  const { start: seasonStart, end: seasonEnd } = getSeasonDateRange(
    params.campaignStart,
    params.seasonIndex,
  );
  const referenceDay = isCurrent ? params.today : seasonEnd;
  const season = getSeasonSnapshot({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today: referenceDay,
  });
  const seasonEntries = getSeasonEntries(params.dailyEntries, seasonStart, seasonEnd);
  const signals = countSeasonSignals(seasonEntries, params.settings, seasonStart);
  const plateau = getPlateauSnapshot({
    dailyEntries: params.dailyEntries,
    measurements: params.measurements,
    settings: params.settings,
    today: referenceDay,
  });
  const partialStatus = getSeasonPartialStatus(season.completedQuestCount);
  const partialSealed = partialStatus === 'cleared' || partialStatus === 'empowered';

  const progressPercent = computeBossProgressPercent({
    completedQuestCount: season.completedQuestCount,
    questTotal: season.quests.length,
    seasonLength: season.seasonLength,
    signals,
    plateauActive: plateau.mode === 'active' && isCurrent,
    baseScore: params.baseScore,
  });
  const status = resolveBossStatus(progressPercent, partialSealed);

  return {
    boss,
    progressPercent,
    status,
    statusLabel: boss.statusCopy[status],
    isCurrent,
    isLocked: false,
    artUrl,
  };
}

function chapterEntryFromJourney(
  boss: BossArchiveEntry['boss'],
  chapterId: number,
  stages: ReturnType<typeof getAllJourneyStageProgress>,
): BossArchiveEntry {
  const stage = stages.find((s) => s.stage.order === chapterId);

  if (!stage || stage.status === 'locked') {
    return {
      boss,
      progressPercent: 0,
      status: 'untouched',
      statusLabel: 'Глава ещё впереди.',
      isCurrent: false,
      isLocked: true,
      artUrl: null,
    };
  }

  if (stage.status === 'completed') {
    return {
      boss,
      progressPercent: 100,
      status: 'sealed',
      statusLabel: boss.statusCopy.sealed,
      isCurrent: false,
      isLocked: false,
      artUrl: null,
    };
  }

  const progressPercent = Math.min(99, Math.max(1, stage.progressPercent));
  const status = resolveBossStatus(progressPercent, false);
  return {
    boss,
    progressPercent,
    status,
    statusLabel: boss.statusCopy[status],
    isCurrent: true,
    isLocked: false,
    artUrl: null,
  };
}

function buildActProgress(
  actId: 'I' | 'II' | 'III',
  seasonEntries: BossArchiveEntry[],
  chapterEntries: BossArchiveEntry[],
  currentSeasonIndex: number,
): ActBossProgressEntry {
  const boss = ACT_BOSSES.find((b) => b.actId === actId)!;
  const [sStart, sEnd] = ACT_SEASON_RANGES[actId];
  const [cStart, cEnd] = ACT_CHAPTER_RANGES[actId];

  const isLocked = currentSeasonIndex < sStart;
  const isCurrentAct = currentSeasonIndex >= sStart && currentSeasonIndex <= sEnd;

  const seasonsInAct = seasonEntries.filter((e) => {
    const id = e.boss.seasonId ?? 0;
    return id >= sStart && id <= sEnd;
  });
  const chaptersInAct = chapterEntries.filter((e) => {
    const id = e.boss.chapterId ?? 0;
    return id >= cStart && id <= cEnd;
  });

  const seasonTotal = sEnd - sStart + 1;
  const chapterTotal = cEnd - cStart + 1;
  const sealedSeasonCount = seasonsInAct.filter((e) => e.status === 'sealed').length;
  const completedChapterCount = chaptersInAct.filter((e) => e.status === 'sealed').length;

  if (isLocked) {
    return {
      boss,
      progressPercent: 0,
      status: 'untouched',
      statusLabel: 'Акт ещё не открыт.',
      seasonRange: [sStart, sEnd],
      chapterRange: [cStart, cEnd],
      sealedSeasonCount: 0,
      seasonTotal,
      completedChapterCount: 0,
      chapterTotal,
      isCurrentAct: false,
      isLocked: true,
    };
  }

  const seasonAvg =
    seasonsInAct.length > 0
      ? seasonsInAct.reduce((sum, e) => sum + e.progressPercent, 0) / seasonsInAct.length
      : 0;
  const chapterRatio = (completedChapterCount / chapterTotal) * 100;
  const progressPercent = Math.min(100, Math.round(seasonAvg * 0.7 + chapterRatio * 0.3));
  const status = resolveBossStatus(
    progressPercent,
    sealedSeasonCount === seasonTotal && completedChapterCount === chapterTotal,
  );

  return {
    boss,
    progressPercent,
    status,
    statusLabel: boss.statusCopy[status],
    seasonRange: [sStart, sEnd],
    chapterRange: [cStart, cEnd],
    sealedSeasonCount,
    seasonTotal,
    completedChapterCount,
    chapterTotal,
    isCurrentAct,
    isLocked: false,
  };
}

export function getBossCampaignArchive(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  baseScore?: number;
}): BossCampaignArchive {
  const today = params.today ?? todayISO();
  const campaignStart = resolveCampaignStartDate(
    params.settings,
    params.dailyEntries,
    today,
  );
  const currentSeasonIndex = getSeasonIndex(campaignStart, today);
  const current = getBossCampaignSnapshot(params);

  const seasonBosses = SEASON_MINI_BOSSES.map((def) =>
    computeSeasonBossEntry({
      seasonIndex: def.seasonId!,
      currentSeasonIndex,
      campaignStart,
      dailyEntries: params.dailyEntries,
      measurements: params.measurements,
      settings: params.settings,
      today,
      baseScore: params.baseScore,
    }),
  );

  const journeyStages = getAllJourneyStageProgress({
    dailyEntries: params.dailyEntries,
    measurements: params.measurements,
    settings: params.settings,
  });

  const chapterBosses = CHAPTER_BOSSES.map((boss) =>
    chapterEntryFromJourney(boss, boss.chapterId!, journeyStages),
  );

  const actBosses = (['I', 'II', 'III'] as const).map((actId) =>
    buildActProgress(actId, seasonBosses, chapterBosses, currentSeasonIndex),
  );

  return {
    current,
    seasonBosses,
    chapterBosses,
    actBosses,
  };
}

export function getCurrentActBoss(archive: BossCampaignArchive): ActBossProgressEntry {
  return (
    archive.actBosses.find((a) => a.isCurrentAct) ??
    archive.actBosses.find((a) => !a.isLocked) ??
    archive.actBosses[0]!
  );
}

export function countSealedCampaignBosses(archive: BossCampaignArchive): number {
  return (
    archive.seasonBosses.filter((e) => e.status === 'sealed').length +
    archive.chapterBosses.filter((e) => e.status === 'sealed').length +
    archive.actBosses.filter((e) => e.status === 'sealed').length
  );
}
