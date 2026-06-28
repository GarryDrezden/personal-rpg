import type { AppSettings, DailyEntry } from '../types';
import type {
  NutritionSettings,
  NutritionStatus,
  NutritionTrackingMode,
} from '../types/nutrition';
import { getWeeklySettingsForDate } from './points';
import { addDays, format, parseISO } from 'date-fns';

const XP_BY_STATUS: Record<NutritionStatus, number> = {
  disabled: 0,
  missing: 0,
  light: 35,
  medium: 15,
  heavy: 5,
  precise_in_limit: 40,
  precise_medium_over: 15,
  precise_heavy_over: 5,
};

const MOMENTUM_BY_STATUS: Record<NutritionStatus, number> = {
  disabled: 0,
  missing: -1,
  light: 5,
  medium: 1,
  heavy: -8,
  precise_in_limit: 6,
  precise_medium_over: -4,
  precise_heavy_over: -10,
};

const FREEDOM_BY_STATUS: Record<NutritionStatus, number> = {
  disabled: 0,
  missing: 0,
  light: 1,
  medium: 0.5,
  heavy: 0.15,
  precise_in_limit: 1,
  precise_medium_over: 0.5,
  precise_heavy_over: 0.15,
};

export function getTrackingMode(settings: AppSettings): NutritionTrackingMode {
  return settings.nutritionTrackingMode ?? 'simple';
}

export function resolveNutritionSettings(settings: AppSettings): NutritionSettings {
  return {
    trackingMode: getTrackingMode(settings),
    dailyCalorieLimit: settings.dailyCalorieLimit ?? settings.defaultCaloriesLimit ?? null,
    mediumOverThreshold: settings.nutritionMediumOverThreshold ?? 300,
    heavyOverThreshold: settings.nutritionHeavyOverThreshold ?? 700,
  };
}

export function getEffectiveCalorieLimit(settings: AppSettings, date: string): number | null {
  if (getTrackingMode(settings) !== 'precise') return null;
  const direct = settings.dailyCalorieLimit ?? settings.defaultCaloriesLimit ?? null;
  if (direct != null && direct > 0) return direct;
  return getWeeklySettingsForDate(date, settings).caloriesLimit;
}

export function isNutritionTrackingEnabled(settings: AppSettings): boolean {
  return getTrackingMode(settings) !== 'disabled';
}

export function getNutritionLevelFromCalories(params: {
  calories: number | null | undefined;
  limit: number | null | undefined;
  mediumOverThreshold: number;
  heavyOverThreshold: number;
}): NutritionStatus {
  const { calories, limit, heavyOverThreshold } = params;
  if (calories === null || calories === undefined) return 'missing';
  if (limit === null || limit === undefined || limit <= 0) return 'missing';

  if (calories <= limit) return 'precise_in_limit';
  if (calories > limit + heavyOverThreshold) return 'precise_heavy_over';
  if (calories > limit) return 'precise_medium_over';
  return 'precise_in_limit';
}

export function getNutritionStatus(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): NutritionStatus {
  const { entry, settings } = params;
  const mode = getTrackingMode(settings);

  if (mode === 'disabled') return 'disabled';

  if (mode === 'simple') {
    const level = entry?.nutritionLevel;
    if (!level) return 'missing';
    return level;
  }

  const ns = resolveNutritionSettings(settings);
  const date = entry?.date ?? format(new Date(), 'yyyy-MM-dd');
  const limit = getEffectiveCalorieLimit(settings, date);
  return getNutritionLevelFromCalories({
    calories: entry?.calories,
    limit,
    mediumOverThreshold: ns.mediumOverThreshold,
    heavyOverThreshold: ns.heavyOverThreshold,
  });
}

export function getNutritionPoints(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): number {
  const status = getNutritionStatus(params);
  return XP_BY_STATUS[status] ?? 0;
}

export function getNutritionMomentumDelta(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): number {
  const status = getNutritionStatus(params);
  if (status === 'disabled') return 0;
  return MOMENTUM_BY_STATUS[status] ?? 0;
}

export function getNutritionMomentumLabel(status: NutritionStatus): string {
  const labels: Record<NutritionStatus, string> = {
    disabled: 'Учёт питания выключен',
    missing: 'Питание не отмечено',
    light: 'Лёгкий день питания поддержал систему',
    medium: 'Питание отмечено честно',
    heavy: 'Тяжёлый день питания снизил ход',
    precise_in_limit: 'Калории внесены и остались в лимите',
    precise_medium_over: 'Калории вышли за лимит, но день удержан',
    precise_heavy_over: 'Большой перебор — системе нужна мягкая поддержка',
  };
  return labels[status];
}

export function getNutritionCoinEligible(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): boolean {
  const status = getNutritionStatus(params);
  return status === 'light' || status === 'precise_in_limit';
}

export function isNutritionHeavyDay(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): boolean {
  const status = getNutritionStatus(params);
  return status === 'heavy' || status === 'precise_heavy_over';
}

export function getNutritionQuestCompleted(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): boolean {
  if (!isNutritionTrackingEnabled(params.settings)) return false;
  const mode = getTrackingMode(params.settings);
  if (mode === 'simple') {
    return params.entry?.nutritionLevel != null;
  }
  if (getEffectiveCalorieLimit(params.settings, params.entry?.date ?? '') == null) {
    return false;
  }
  return params.entry?.calories !== null && params.entry?.calories !== undefined;
}

export function isNutritionLogged(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): boolean {
  if (!isNutritionTrackingEnabled(params.settings)) return true;
  return getNutritionQuestCompleted(params);
}

export function getNutritionFreedomDayScore(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): number {
  const status = getNutritionStatus(params);
  return FREEDOM_BY_STATUS[status] ?? 0;
}

export function isNutritionGoodForWeekBonus(params: {
  entry: DailyEntry | null | undefined;
  settings: AppSettings;
}): boolean {
  const status = getNutritionStatus(params);
  return status === 'light' || status === 'precise_in_limit';
}

export function getNutritionStatusLabel(status: NutritionStatus): string {
  const labels: Record<NutritionStatus, string> = {
    disabled: 'Выключено',
    missing: 'Не заполнено',
    light: 'Лёгкий день',
    medium: 'Средний день',
    heavy: 'Тяжёлый день',
    precise_in_limit: 'В лимите',
    precise_medium_over: 'Средний перебор',
    precise_heavy_over: 'Тяжёлый перебор',
  };
  return labels[status];
}

export function getNutritionWeaknessText(settings: AppSettings, weakness: 'calories' | 'snack' | 'sweet'): string {
  const mode = getTrackingMode(settings);
  if (weakness === 'calories' || weakness === 'snack') {
    if (mode === 'simple') return 'Уязвим к честной отметке питания';
    if (mode === 'precise') return 'Уязвим к внесению калорий';
    return 'Уязвим к учёту питания';
  }
  if (weakness === 'sweet') {
    if (mode === 'simple') return 'Уязвим к лёгкому или среднему дню';
    if (mode === 'precise') return 'Уязвим к удержанию лимита';
    return 'Уязвим к стабильному питанию';
  }
  return 'Уязвим к учёту питания';
}

export function shouldSuggestNutritionRecovery(params: {
  today: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): boolean {
  if (!isNutritionTrackingEnabled(params.settings)) return false;

  const yesterday = format(addDays(parseISO(params.today), -1), 'yyyy-MM-dd');
  const yesterdayEntry = params.dailyEntries.find((e) => e.date === yesterday);

  if (yesterdayEntry && isNutritionHeavyDay({ entry: yesterdayEntry, settings: params.settings })) {
    return true;
  }

  let heavyStreak = 0;
  let d = parseISO(params.today);
  for (let i = 0; i < 7; i++) {
    d = addDays(d, -1);
    const dateStr = format(d, 'yyyy-MM-dd');
    const entry = params.dailyEntries.find((e) => e.date === dateStr);
    if (entry && isNutritionHeavyDay({ entry, settings: params.settings })) {
      heavyStreak++;
      if (heavyStreak >= 2) return true;
    } else {
      break;
    }
  }

  return false;
}

export function migrateNutritionSettings(
  settings: AppSettings,
  dailyEntries: DailyEntry[],
): AppSettings {
  const next = { ...settings };

  if (!next.nutritionTrackingMode) {
    const hasCalorieEntries = dailyEntries.some(
      (e) => e.calories !== null && e.calories !== undefined,
    );
    next.nutritionTrackingMode = hasCalorieEntries ? 'precise' : 'simple';
  }

  if (next.dailyCalorieLimit === undefined) {
    next.dailyCalorieLimit = next.defaultCaloriesLimit ?? null;
  }
  if (next.nutritionMediumOverThreshold === undefined) {
    next.nutritionMediumOverThreshold = 300;
  }
  if (next.nutritionHeavyOverThreshold === undefined) {
    next.nutritionHeavyOverThreshold = 700;
  }

  return next;
}
