import type { AppSettings, DailyEntry, MeasurementEntry, WeeklySettings } from '../types';
import { isMonday, weekDays, weekStart } from './dates';
import { getStepsStatus } from './stepsEngine';
import { calcResourceRestBonusPoints } from './resourceEngine';
import {
  getNutritionPoints,
  getTrackingMode,
  isNutritionGoodForWeekBonus,
  isNutritionTrackingEnabled,
} from './nutritionEngine';

export function getWeeklySettingsForDate(
  date: string,
  settings: AppSettings,
): WeeklySettings {
  const ws = weekStart(date);
  const found = settings.weeklySettings.find((w) => w.weekStart === ws);
  if (found) return found;
  return {
    id: 'default',
    weekStart: ws,
    caloriesLimit: settings.defaultCaloriesLimit,
    stepsGoal: settings.defaultStepsGoal,
    stepsMinimum: settings.defaultStepsMinimum,
    stepsNormal: settings.defaultStepsNormal ?? settings.defaultStepsGoal,
    stepsExcellent: settings.defaultStepsExcellent,
    gymTarget: settings.defaultGymTarget,
    weeklyPointsGoal: settings.defaultWeeklyPointsGoal,
  };
}

/** Реальные очки дня — могут быть отрицательными */
export function calcDailyPoints(entry: DailyEntry, settings: AppSettings): number {
  const p = settings.pointSettings;
  let total = 0;

  if (isNutritionTrackingEnabled(settings)) {
    total += getNutritionPoints({ entry, settings });
  }

  const stepsInfo = getStepsStatus({
    steps: entry.steps,
    settings,
    date: entry.date,
    dayMode: entry.dayMode ?? 'normal',
  });
  total += stepsInfo.points;
  if (entry.alcohol === 'none') total += p.noAlcohol;
  else if (entry.alcohol === 'moderate') total += p.alcoholModerate;
  else if (entry.alcohol === 'heavy') total += p.alcoholHeavy;

  if (entry.morningExercise) total += p.morningExercise;
  if (entry.gym) total += p.gym;
  if (entry.journal) total += p.journal;
  if (entry.cooking) total += p.cooking;
  if (entry.repair) total += p.repair;
  if (entry.plants) total += p.plants;
  if (entry.hobby) total += p.hobby;

  for (const custom of settings.habitConfig?.customHabits ?? []) {
    if (entry.customCompletions?.[custom.id]) {
      total += custom.points;
    }
  }

  total += calcResourceRestBonusPoints(entry);

  return total;
}

export interface WeeklyBonuses {
  gymWeeklyBonus: number;
  noAlcoholWeekBonus: number;
  caloriesWeekBonus: number;
  measurementsMondayBonus: number;
  total: number;
}

export function calcWeeklyBonuses(
  weekStartDate: string,
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): WeeklyBonuses {
  const days = weekDays(weekStartDate);
  const weekly = getWeeklySettingsForDate(weekStartDate, settings);
  const p = settings.pointSettings;
  const weekEntries = days.map(
    (d) => entries.find((e) => e.date === d) ?? null,
  );

  const gymCount = weekEntries.filter((e) => e?.gym).length;
  const gymWeeklyBonus =
    gymCount >= weekly.gymTarget ? p.gymWeeklyBonus : 0;

  const allNoAlcohol = weekEntries.every((e) => e?.alcohol === 'none');
  const noAlcoholWeekBonus = allNoAlcohol ? p.noAlcoholWeekBonus : 0;

  const nutritionMode = getTrackingMode(settings);
  const allNutritionOk = weekEntries.every(
    (e) => e !== null && isNutritionGoodForWeekBonus({ entry: e, settings }),
  );
  const caloriesWeekBonus =
    nutritionMode !== 'disabled' && allNutritionOk ? p.caloriesWeekBonus : 0;

  const mondayMeasurement = measurements.some(
    (m) => m.date === weekStartDate,
  );
  const measurementsMondayBonus = mondayMeasurement
    ? p.measurementsMondayBonus
    : 0;

  return {
    gymWeeklyBonus,
    noAlcoholWeekBonus,
    caloriesWeekBonus,
    measurementsMondayBonus,
    total:
      gymWeeklyBonus +
      noAlcoholWeekBonus +
      caloriesWeekBonus +
      measurementsMondayBonus,
  };
}

export function calcTotalEarnedXP(
  entries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): number {
  const processedWeeks = new Set<string>();
  let total = 0;

  for (const entry of entries) {
    total += calcDailyPoints(entry, settings);
    const ws = weekStart(entry.date);
    if (!processedWeeks.has(ws)) {
      processedWeeks.add(ws);
      total += calcWeeklyBonuses(ws, entries, measurements, settings).total;
    }
  }

  return total;
}

/** @deprecated XP не тратится — используйте coinEngine.calcAvailableCoins */
export function calcAvailablePoints(
  totalEarnedXP: number,
  purchasedCosts: number[],
): number {
  const spent = purchasedCosts.reduce((a, b) => a + b, 0);
  return totalEarnedXP - spent;
}

export function getDayStatus(points: number): string {
  const display = Math.max(0, points);
  if (display >= 100) return 'Отличный день';
  if (display >= 70) return 'Хороший день';
  if (display >= 40) return 'Нормально';
  return 'День выживания';
}

export function getWeekStatus(percent: number): string {
  if (percent >= 100) return 'Сильная неделя';
  if (percent >= 80) return 'Хорошая неделя';
  if (percent >= 50) return 'Нормальная неделя';
  return 'Слабая неделя';
}

export function hasMondayMeasurementBonus(
  measurements: MeasurementEntry[],
  date: string,
): boolean {
  return isMonday(date) && measurements.some((m) => m.date === date);
}
