import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type {
  PlateauModeLevel,
  PlateauRouteHoldingSnapshot,
  PlateauSnapshot,
  PlateauState,
} from '../../types/plateauV1';
import { sortMeasurementsByDate } from '../../utils/measurements';
import { hasAnyDailyData } from '../../utils/achievementHelpers';
import { getDayMode } from '../../utils/stepsEngine';
import { getNutritionQuestCompleted, isNutritionTrackingEnabled } from '../../utils/nutritionEngine';
import { getBodyAbilityState } from '../bodyAbilities/bodyAbilityV1Engine';
import { getSeasonSnapshot } from '../seasons/seasonEngine';
import { todayISO } from '../../utils/dates';
import { hasJournalEntry } from '../../utils/journalEntry';

export const PLATEAU_SOFT_DAYS = 10;
export const PLATEAU_STRONG_DAYS = 21;
export const PLATEAU_ROUTE_WINDOW_DAYS = 10;
export const PLATEAU_ACHIEVEMENT_WINDOW_DAYS = 7;
export const PLATEAU_ACHIEVEMENT_ROUTE_DAYS = 4;

export function normalizePlateauState(state: PlateauState | undefined): PlateauState {
  return {
    manualActive: state?.manualActive ?? false,
    manualStartedAt: state?.manualStartedAt,
    dismissedHintAt: state?.dismissedHintAt,
    lastAcknowledgedAt: state?.lastAcknowledgedAt,
    completedPlateauIds: state?.completedPlateauIds ?? [],
  };
}

export function getPlateauState(settings: AppSettings): PlateauState {
  return normalizePlateauState(settings.plateauState);
}

export function setManualPlateauActive(
  settings: AppSettings,
  active: boolean,
): AppSettings {
  const state = getPlateauState(settings);
  if (active) {
    return {
      ...settings,
      plateauState: {
        ...state,
        manualActive: true,
        manualStartedAt: state.manualStartedAt ?? new Date().toISOString(),
        dismissedHintAt: undefined,
      },
    };
  }
  return {
    ...settings,
    plateauState: {
      ...state,
      manualActive: false,
    },
  };
}

export function dismissPlateauSoftHint(settings: AppSettings): AppSettings {
  const state = getPlateauState(settings);
  return {
    ...settings,
    plateauState: {
      ...state,
      dismissedHintAt: new Date().toISOString(),
    },
  };
}

export function getDaysSinceBestWeight(
  measurements: MeasurementEntry[],
  today: string = todayISO(),
): { daysSinceBest: number; lastBestDate: string | null; hasWeightData: boolean } {
  const withWeight = sortMeasurementsByDate(measurements).filter(
    (m) => m.weight !== null && m.weight > 0,
  );
  if (withWeight.length === 0) {
    return { daysSinceBest: 0, lastBestDate: null, hasWeightData: false };
  }

  let runningBest = withWeight[0]!.weight!;
  let lastImprovementDate = withWeight[0]!.date;

  for (let i = 1; i < withWeight.length; i += 1) {
    const row = withWeight[i]!;
    if (row.weight! < runningBest - 0.05) {
      runningBest = row.weight!;
      lastImprovementDate = row.date;
    }
  }

  const daysSinceBest = differenceInCalendarDays(
    parseISO(today),
    parseISO(lastImprovementDate),
  );

  return {
    daysSinceBest: Math.max(0, daysSinceBest),
    lastBestDate: lastImprovementDate,
    hasWeightData: true,
  };
}

function isResourceMarked(entry: DailyEntry): boolean {
  return (
    entry.energyLevel != null ||
    entry.sleepQuality != null ||
    (entry.cognitiveBreaks != null && entry.cognitiveBreaks !== 'none')
  );
}

function isMovementDay(entry: DailyEntry): boolean {
  return (entry.steps ?? 0) > 0 || entry.morningExercise || entry.gym;
}

function isRouteHeldDay(entry: DailyEntry, settings: AppSettings): boolean {
  if (!entry.id) return false;
  if (getDayMode(entry.dayMode) !== 'normal') return true;
  return hasAnyDailyData(entry) || getNutritionQuestCompleted({ entry, settings });
}

export function getPlateauRouteHoldingSnapshot(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
  plateauStartedAt?: string;
}): PlateauRouteHoldingSnapshot {
  const today = params.today ?? todayISO();
  const windowStart = format(
    addDays(parseISO(today), -(PLATEAU_ROUTE_WINDOW_DAYS - 1)),
    'yyyy-MM-dd',
  );
  const windowEntries = params.dailyEntries.filter(
    (e) => e.date >= windowStart && e.date <= today,
  );

  const routeHeldDays = windowEntries.filter((e) =>
    isRouteHeldDay(e, params.settings),
  ).length;
  const nutritionDays = windowEntries.filter(
    (e) =>
      isNutritionTrackingEnabled(params.settings) &&
      getNutritionQuestCompleted({ entry: e, settings: params.settings }),
  ).length;
  const movementDays = windowEntries.filter((e) => isMovementDay(e)).length;
  const resourceDays = windowEntries.filter((e) => isResourceMarked(e)).length;
  const minimalOrRecoveryDays = windowEntries.filter((e) => {
    const mode = getDayMode(e.dayMode);
    return mode === 'minimal' || mode === 'recovery';
  }).length;
  const alcoholFreeDays = windowEntries.filter((e) => e.alcohol === 'none').length;
  const journalDays = windowEntries.filter(hasJournalEntry).length;

  const plateauStart = params.plateauStartedAt?.slice(0, 10) ?? windowStart;
  const abilityUnlocks = getBodyAbilityState(params.settings).abilityUnlocks ?? [];
  const bodyAbilitiesUnlockedDuringPlateau = abilityUnlocks.filter(
    (u) => u.unlockedAt.slice(0, 10) >= plateauStart,
  ).length;

  const season = getSeasonSnapshot({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
  });
  const seasonQuestsCompleted = season.completedQuestCount;

  const signalLines: string[] = [];
  if (nutritionDays > 0) signalLines.push(`Питание отмечалось: ${nutritionDays} дн.`);
  if (movementDays > 0) signalLines.push(`Движение: ${movementDays} дн.`);
  if (resourceDays > 0) signalLines.push(`Ресурс отмечен: ${resourceDays} дн.`);
  if (minimalOrRecoveryDays > 0) {
    signalLines.push(`Мягкие дни: ${minimalOrRecoveryDays}`);
  }
  if (bodyAbilitiesUnlockedDuringPlateau > 0) {
    signalLines.push(`Способности тела: +${bodyAbilitiesUnlockedDuringPlateau}`);
  }
  if (seasonQuestsCompleted > 0) {
    signalLines.push(`Сезон движется: ${seasonQuestsCompleted} квестов`);
  }

  let supportiveMessage =
    'На перевале важны не рывки, а удержание маршрута. Сегодня можно идти мягко.';
  if (routeHeldDays >= 6) {
    supportiveMessage =
      'Перевал удерживается: маршрут жив, даже когда вес стоит. Персонаж не стоит.';
  } else if (routeHeldDays >= 3) {
    supportiveMessage =
      'Маршрут отмечен несколькими днями — это уже ход через перевал.';
  }

  return {
    windowDays: PLATEAU_ROUTE_WINDOW_DAYS,
    routeHeldDays,
    nutritionDays,
    movementDays,
    resourceDays,
    minimalOrRecoveryDays,
    alcoholFreeDays,
    journalDays,
    bodyAbilitiesUnlockedDuringPlateau,
    seasonQuestsCompleted,
    supportiveMessage,
    signalLines: signalLines.slice(0, 4),
  };
}

function resolvePlateauMode(params: {
  daysSinceBest: number;
  hasWeightData: boolean;
  manualActive: boolean;
  dismissedHint: boolean;
}): PlateauModeLevel {
  if (params.manualActive) return 'active';
  if (!params.hasWeightData) return 'none';
  if (params.daysSinceBest >= PLATEAU_STRONG_DAYS) return 'active';
  if (params.daysSinceBest >= PLATEAU_SOFT_DAYS && !params.dismissedHint) return 'soft_hint';
  return 'none';
}

export function getPlateauSnapshot(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
}): PlateauSnapshot {
  const today = params.today ?? todayISO();
  const plateauState = getPlateauState(params.settings);
  const weightInfo = getDaysSinceBestWeight(params.measurements, today);
  const dismissedHint = Boolean(
    plateauState.dismissedHintAt &&
      weightInfo.daysSinceBest < PLATEAU_STRONG_DAYS &&
      !plateauState.manualActive,
  );
  const mode = resolvePlateauMode({
    daysSinceBest: weightInfo.daysSinceBest,
    hasWeightData: weightInfo.hasWeightData,
    manualActive: Boolean(plateauState.manualActive),
    dismissedHint,
  });

  const plateauStartedAt =
    plateauState.manualStartedAt ??
    (weightInfo.lastBestDate && weightInfo.daysSinceBest >= PLATEAU_SOFT_DAYS
      ? weightInfo.lastBestDate
      : undefined);

  const routeHolding = getPlateauRouteHoldingSnapshot({
    ...params,
    today,
    plateauStartedAt,
  });

  const routeGuardianEligible = isPlateauRouteGuardianEligible(
    mode,
    routeHolding,
    params.dailyEntries,
    params.settings,
    today,
  );

  let title = '';
  let description = '';
  let supportiveLine = routeHolding.supportiveMessage;

  if (mode === 'soft_hint') {
    title = 'Вес стоит — это может быть перевал';
    description =
      'Новый лучший вес не отмечался уже некоторое время. Это не тупик — маршрут можно удержать мягко.';
    supportiveLine =
      'Если чувствуешь перевал — можно отметить его вручную. Или просто продолжить минимальными днями.';
  } else if (mode === 'active') {
    title = 'Удержание перевала';
    description =
      'Вес стоит, но персонаж не стоит. На перевале важны не рывки, а удержание маршрута.';
    supportiveLine = routeHolding.supportiveMessage;
  }

  return {
    mode,
    daysSinceBestWeight: weightInfo.daysSinceBest,
    lastBestWeightDate: weightInfo.lastBestDate,
    hasWeightData: weightInfo.hasWeightData,
    manualActive: Boolean(plateauState.manualActive),
    hintDismissed: dismissedHint,
    title,
    description,
    supportiveLine,
    routeHolding,
    routeGuardianEligible,
  };
}

function countRouteHeldInWindow(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string,
  windowDays: number,
): number {
  const windowStart = format(addDays(parseISO(today), -(windowDays - 1)), 'yyyy-MM-dd');
  return dailyEntries.filter(
    (e) => e.date >= windowStart && e.date <= today && isRouteHeldDay(e, settings),
  ).length;
}

export function isPlateauRouteGuardianEligible(
  mode: PlateauModeLevel,
  _routeHolding: PlateauRouteHoldingSnapshot,
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string = todayISO(),
): boolean {
  if (mode !== 'active') return false;
  const last7 = countRouteHeldInWindow(
    dailyEntries,
    settings,
    today,
    PLATEAU_ACHIEVEMENT_WINDOW_DAYS,
  );
  const minimalLast7 = dailyEntries.filter((e) => {
    const windowStart = format(
      addDays(parseISO(today), -(PLATEAU_ACHIEVEMENT_WINDOW_DAYS - 1)),
      'yyyy-MM-dd',
    );
    if (e.date < windowStart || e.date > today) return false;
    const m = getDayMode(e.dayMode);
    return m === 'minimal' || m === 'recovery';
  }).length;

  return (
    last7 >= PLATEAU_ACHIEVEMENT_ROUTE_DAYS ||
    (last7 >= 3 && minimalLast7 >= 1)
  );
}

// Fix duplicate signature - merge into getPlateauSnapshot
export function checkPlateauRouteGuardianEligible(
  snapshot: PlateauSnapshot,
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today?: string,
): boolean {
  return isPlateauRouteGuardianEligible(
    snapshot.mode,
    snapshot.routeHolding,
    dailyEntries,
    settings,
    today,
  );
}
