import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type { BossCampaignSnapshot, BossStatus } from './bossTypes';
import { getSeasonMiniBossByIndex } from './bossConfig';
import { hasAnyDailyData } from '../../utils/achievementHelpers';
import { getDayMode } from '../../utils/stepsEngine';
import { getNutritionQuestCompleted, isNutritionTrackingEnabled } from '../../utils/nutritionEngine';
import { getBodyAbilityState } from '../bodyAbilities/bodyAbilityV1Engine';
import { getPlateauSnapshot } from '../plateau/plateauEngine';
import { getSeasonSnapshot, getSeasonEntries, getSeasonDateRange, getSeasonIndex, resolveCampaignStartDate } from '../seasons/seasonEngine';
import { getSeasonPartialStatus } from '../seasons/seasonRecap';
import { todayISO } from '../../utils/dates';

export const BOSS_STATUS_THRESHOLDS = {
  noticed: 1,
  weakened: 25,
  broken: 50,
  sealed: 75,
} as const;

function isSavedDay(entry: DailyEntry): boolean {
  if (!entry.id) return false;
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal' || mode === 'recovery') return true;
  return hasAnyDailyData(entry);
}

function isRouteHeldDay(entry: DailyEntry): boolean {
  return isSavedDay(entry);
}

function isResourceMarked(entry: DailyEntry): boolean {
  return (
    entry.energyLevel != null ||
    entry.sleepQuality != null ||
    (entry.cognitiveBreaks != null && entry.cognitiveBreaks !== 'none')
  );
}

function isMovementDay(entry: DailyEntry): boolean {
  return (entry.steps ?? 0) > 0 || Boolean(entry.morningExercise) || Boolean(entry.gym);
}

function resolveBossStatus(progress: number, partialSealed: boolean): BossStatus {
  if (partialSealed || progress >= BOSS_STATUS_THRESHOLDS.sealed) return 'sealed';
  if (progress >= BOSS_STATUS_THRESHOLDS.broken) return 'broken';
  if (progress >= BOSS_STATUS_THRESHOLDS.weakened) return 'weakened';
  if (progress >= BOSS_STATUS_THRESHOLDS.noticed) return 'noticed';
  return 'untouched';
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
    if (isRouteHeldDay(entry)) routeHeld += 1;
    const mode = getDayMode(entry.dayMode);
    if (mode === 'minimal') minimal += 1;
    if (mode === 'recovery') recovery += 1;
    if (isMovementDay(entry)) movement += 1;
    if (isResourceMarked(entry)) resource += 1;
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

export function computeBossProgressPercent(params: {
  completedQuestCount: number;
  questTotal: number;
  seasonLength: number;
  signals: ReturnType<typeof countSeasonSignals>;
  plateauActive: boolean;
  baseScore?: number;
}): number {
  const questRatio =
    params.questTotal > 0 ? params.completedQuestCount / params.questTotal : 0;
  let progress = questRatio * 60;

  progress += Math.min(
    25,
    (params.signals.routeHeld / Math.max(1, params.seasonLength)) * 25 * 1.4,
  );
  progress += Math.min(5, (params.signals.minimal + params.signals.recovery) * 1.2);
  progress += Math.min(4, params.signals.movement * 0.3);
  progress += Math.min(3, params.signals.nutrition * 0.25);
  progress += Math.min(3, params.signals.bodyAbilitiesInSeason * 3);

  if (params.plateauActive && params.signals.routeHeld >= 3) {
    progress += 5;
  }

  if (params.baseScore != null && params.baseScore > 0) {
    progress += Math.min(5, Math.floor(params.baseScore / 40));
  }

  return Math.min(100, Math.round(progress));
}

function buildWeaknessSignals(signals: ReturnType<typeof countSeasonSignals>): string[] {
  const lines: string[] = [];
  if (signals.routeHeld > 0) lines.push(`${signals.routeHeld} сохранённых дней`);
  if (signals.minimal > 0) lines.push(`${signals.minimal} минимальных дней`);
  if (signals.recovery > 0) lines.push(`${signals.recovery} recovery`);
  if (signals.movement > 0) lines.push(`${signals.movement} дней движения`);
  if (signals.bodyAbilitiesInSeason > 0) {
    lines.push(`+${signals.bodyAbilitiesInSeason} способностей тела`);
  }
  if (lines.length === 0) return [];
  return lines.slice(0, 2);
}

export function getBossCampaignSnapshot(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  baseScore?: number;
}): BossCampaignSnapshot {
  const today = params.today ?? todayISO();
  const season = getSeasonSnapshot({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
  });
  const campaignStart = resolveCampaignStartDate(
    params.settings,
    params.dailyEntries,
    today,
  );
  const seasonIndex = getSeasonIndex(campaignStart, today);
  const currentBoss = getSeasonMiniBossByIndex(seasonIndex);
  const { start: seasonStart } = getSeasonDateRange(campaignStart, seasonIndex);
  const seasonEntries = getSeasonEntries(
    params.dailyEntries,
    season.seasonStartDate,
    season.seasonEndDate,
  );
  const signals = countSeasonSignals(seasonEntries, params.settings, seasonStart);
  const plateau = getPlateauSnapshot({
    dailyEntries: params.dailyEntries,
    measurements: params.measurements,
    settings: params.settings,
    today,
  });
  const partialStatus = getSeasonPartialStatus(season.completedQuestCount);
  const partialSealed = partialStatus === 'cleared' || partialStatus === 'empowered';

  const bossProgressPercent = computeBossProgressPercent({
    completedQuestCount: season.completedQuestCount,
    questTotal: season.quests.length,
    seasonLength: season.seasonLength,
    signals,
    plateauActive: plateau.mode === 'active',
    baseScore: params.baseScore,
  });

  const bossStatus = resolveBossStatus(bossProgressPercent, partialSealed);
  const weaknessSignals = buildWeaknessSignals(signals);

  return {
    currentBoss,
    seasonIndex,
    bossProgressPercent,
    bossStatus,
    bossStatusLabel: currentBoss.statusCopy[bossStatus],
    weaknessSignals,
    nextWeaknessHint: currentBoss.weaknessText,
    flavorLine: currentBoss.flavorLine,
    isWeakened: bossProgressPercent >= BOSS_STATUS_THRESHOLDS.weakened,
    isDefeatedNarratively:
      bossProgressPercent >= BOSS_STATUS_THRESHOLDS.sealed || partialSealed,
  };
}

export function isBossFirstCrackEligible(snapshot: BossCampaignSnapshot): boolean {
  return snapshot.bossProgressPercent >= 50;
}
