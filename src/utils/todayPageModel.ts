import type { AppSettings, DailyEntry, DayMode, MeasurementEntry } from '../types';
import type { AppThemeId } from '../types/theme';
import type { TodaySaveReaction } from './todayDayReaction';
import { getSeasonSnapshotWithRecap } from '../game/seasons/seasonEngine';
import { getTopBodyAbilityV1Hint } from '../game/bodyAbilities/bodyAbilityV1Engine';
import { getTopPersonalSuggestedAbility } from './bodyAbilityPersonalEngine';
import { getPlateauSnapshot } from '../game/plateau/plateauEngine';
import { getWeeklySettingsForDate, getDayStatus } from './points';
import {
  calculateMomentumHistory,
  getMomentumAdjustedDailyPoints,
  getMomentumSummary,
} from './momentumEngine';
import { previewDailyCoins } from './coinEngine';
import { getDailyQuests, getQuestCompletionStats, isDayEmpty } from './questEngine';
import { getDaysSinceLastEntry, getRecoveryState, shouldShowRecoveryCard } from './recoveryEngine';
import { hasAnyDailyData } from './achievementHelpers';
import { getDayMode } from './stepsEngine';
import { getOrCreateDailyMobForEntry } from '../game/dailyMobEngine';
import { getDailyMobContextLine } from './todayMobContext';
import { getTodaySaveReaction } from './todayDayReaction';
import { getBossCampaignSnapshot } from '../game/bosses/bossCampaignEngine';
import { shouldSuggestNutritionRecovery, isNutritionTrackingEnabled } from './nutritionEngine';
import { getCozyHomeState } from './cozyHomeEngine';
import {
  getCozyRewardsForEntry,
  sumCozyGrantedResources,
} from './cozyHomeRewardsEngine';

export function withSelectedDayMode(
  entry: DailyEntry,
  date: string,
  mode: DayMode,
): DailyEntry {
  return {
    ...entry,
    date,
    dayMode: mode,
    energyLevel:
      mode === 'minimal' || mode === 'recovery'
        ? (entry.energyLevel ?? 2)
        : entry.energyLevel,
  };
}

export function didCozyGrantOnSave(previous: DailyEntry, saved: DailyEntry): boolean {
  return !previous.cozyRewardsGranted && Boolean(saved.cozyRewardsGranted);
}

export function getTodaySaveButtonLabel(saving: boolean, dirty: boolean): string {
  if (saving) return 'Сохранение…';
  if (dirty) return 'Сохранить ход';
  return 'Сохранено';
}

export function getTodayPageTitle(isCozy: boolean): string {
  return isCozy ? 'Ход дня' : 'Квесты дня';
}

export function getTodayModeCaption(dayMode: DayMode): string | null {
  if (dayMode === 'minimal') return 'Минимальный день';
  if (dayMode === 'recovery') return 'День восстановления';
  return null;
}

export function getTodayMainQuestsLabel(params: {
  isEditingToday: boolean;
  recoveryState: ReturnType<typeof getRecoveryState>;
  isCozy: boolean;
}): string {
  if (params.isEditingToday && params.recoveryState === 'after_bad_day') {
    return 'Минимальный набор';
  }
  return params.isCozy ? 'Главное сегодня' : 'Основные квесты';
}

export function getTodayEmptyCopy(isCozy: boolean): string {
  return isCozy
    ? 'Дом пока тихий. Отметь хотя бы один след дня — питание, маршрут или ресурс.'
    : 'День ещё пустой — начни с одного шага или включи минимальный день. Маршрут не требует идеала.';
}

export type TodayDerivedInput = {
  today: string;
  selectedDate: string;
  isEditingToday: boolean;
  isCozy: boolean;
  themeId: AppThemeId;
  entry: DailyEntry;
  existing: DailyEntry | undefined;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  dirty: boolean;
  saving: boolean;
  saveReaction: TodaySaveReaction | null;
  suggestionDismissed: boolean;
  nutritionHelpDismissed: boolean;
  momentumHelpDismissed: boolean;
};

export function buildTodayDerivedState(input: TodayDerivedInput) {
  const {
    today,
    selectedDate,
    isEditingToday,
    isCozy,
    themeId,
    entry,
    existing,
    dailyEntries,
    measurements,
    settings,
    dirty,
    saving,
    saveReaction,
    suggestionDismissed,
    nutritionHelpDismissed,
    momentumHelpDismissed,
  } = input;

  const others = dailyEntries.filter((item) => item.date !== selectedDate);
  const entriesForQuests = [...others, entry];
  const weekly = getWeeklySettingsForDate(selectedDate, settings);
  const quests = getDailyQuests({
    date: selectedDate,
    dailyEntries: entriesForQuests,
    settings,
    themeId,
  });
  const stats = getQuestCompletionStats(quests);
  const momentumSummary = getMomentumSummary({
    today,
    dailyEntries: entriesForQuests,
    settings,
  });
  const history = calculateMomentumHistory({
    dailyEntries: entriesForQuests,
    settings,
  });
  const todayMomentumResult = history.find((result) => result.date === selectedDate) ?? null;
  const momentumPoints = getMomentumAdjustedDailyPoints(entry, settings, entriesForQuests);
  const points = momentumPoints.adjusted;
  const coins = previewDailyCoins(entry, settings);
  const dayStatus = getDayStatus(points);
  const dayEmpty = isDayEmpty(existing, settings) && isDayEmpty(entry, settings);
  const showRecovery =
    isEditingToday &&
    (shouldShowRecoveryCard({
      today,
      dailyEntries: entriesForQuests,
      settings,
      todayEntry: entry,
    }) ||
      (entry.dayMode && entry.dayMode !== 'normal'));
  const recoveryState = getRecoveryState({
    today,
    dailyEntries: entriesForQuests,
    settings,
    todayEntry: isEditingToday ? entry : null,
  });
  const mainQuestsLabel = getTodayMainQuestsLabel({
    isEditingToday,
    recoveryState,
    isCozy,
  });
  const previewReaction = getTodaySaveReaction({
    entry,
    settings,
    questDone: stats.done,
    questTotal: stats.total,
    points,
    themeId,
    meta: {
      daysAway: getDaysSinceLastEntry(selectedDate, dailyEntries),
      loggedDayCount: dailyEntries.filter((item) => hasAnyDailyData(item)).length,
    },
  });
  const granted = entry.cozyRewardsGranted
    ? null
    : getCozyRewardsForEntry(entry, settings);
  const cozyRewardPreview =
    granted && sumCozyGrantedResources(granted.resources) > 0 ? granted.resources : null;
  const showReactionPreview = dirty || (!saveReaction && !dayEmpty);
  const dayMode = getDayMode(entry.dayMode);
  const showRecoverySuggestion =
    isEditingToday &&
    recoveryState === 'after_bad_day' &&
    dayMode === 'normal' &&
    !suggestionDismissed;
  const showNutritionRecovery =
    isEditingToday &&
    isNutritionTrackingEnabled(settings) &&
    !nutritionHelpDismissed &&
    dayMode === 'normal' &&
    shouldSuggestNutritionRecovery({
      today,
      dailyEntries: entriesForQuests,
      settings,
    });
  const showMomentumHelp =
    isEditingToday &&
    !momentumHelpDismissed &&
    !showNutritionRecovery &&
    dayMode === 'normal' &&
    (momentumSummary.recoverySuggested || momentumSummary.minimalModeSuggested);
  const mainQuests = quests.filter((quest) => quest.category === 'main' && quest.id !== 'nutrition');
  const mediumQuests = quests.filter((quest) => quest.category === 'medium');
  const bonusQuests = quests.filter((quest) => quest.category === 'bonus');
  const dailyMobId = isEditingToday
    ? getOrCreateDailyMobForEntry(today, entry, settings)
    : null;
  const dailyMobContext =
    dailyMobId && isEditingToday
      ? getDailyMobContextLine(dailyMobId, entry, settings, themeId)
      : undefined;
  const seasonSnapshot = getSeasonSnapshotWithRecap({ settings, dailyEntries, today });
  const bossSnapshot = isEditingToday
    ? getBossCampaignSnapshot({
        dailyEntries: entriesForQuests,
        measurements,
        settings,
        today,
      })
    : null;
  const bodyAbilityHint = isEditingToday
    ? getTopBodyAbilityV1Hint({ settings, dailyEntries, measurements })
    : null;
  const personalAbilityHint =
    isEditingToday && (dirty || saveReaction)
      ? getTopPersonalSuggestedAbility(settings)
      : null;
  const plateauSnapshot = getPlateauSnapshot({
    dailyEntries: entriesForQuests,
    measurements,
    settings,
    today,
  });

  return {
    entriesForQuests,
    weekly,
    quests,
    stats,
    momentumSummary,
    todayMomentumResult,
    momentumPoints,
    points,
    coins,
    dayStatus,
    dayEmpty,
    showRecovery,
    recoveryState,
    mainQuestsLabel,
    previewReaction,
    cozyRewardPreview,
    showReactionPreview,
    showRecoverySuggestion,
    showNutritionRecovery,
    showMomentumHelp,
    mainQuests,
    mediumQuests,
    bonusQuests,
    dailyMobId,
    dailyMobContext,
    dayMode,
    seasonSnapshot,
    bossSnapshot,
    bodyAbilityHint,
    personalAbilityHint,
    plateauSnapshot,
    cozyHomeState: getCozyHomeState(settings),
    saveButtonLabel: getTodaySaveButtonLabel(saving, dirty),
    title: getTodayPageTitle(isCozy),
    modeCaption: getTodayModeCaption(dayMode),
    emptyCopy: getTodayEmptyCopy(isCozy),
  };
}

export type TodayDerivedState = ReturnType<typeof buildTodayDerivedState>;
