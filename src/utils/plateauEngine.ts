import { addDays, format, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { PlateauResult } from '../types/plateau';
import { isCaloriesInLimit } from './achievementEngine';
import { sortMeasurementsByDate } from './measurements';
import {
  isStepsMinimumDone,
  isStepsNormalDone,
  getDayMode,
} from './stepsEngine';

const DEFAULT_DAYS = 14;

export function detectPlateau(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  days?: number;
}): PlateauResult {
  const { dailyEntries, measurements, settings, days = DEFAULT_DAYS } = params;
  const empty: PlateauResult = {
    status: 'none',
    title: '',
    description: '',
    daysChecked: days,
    weightChangeKg: 0,
    positiveSignals: [],
    suggestions: [],
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const windowStart = format(addDays(parseISO(today), -(days - 1)), 'yyyy-MM-dd');

  const windowMeasurements = sortMeasurementsByDate(measurements).filter(
    (m) =>
      m.weight !== null &&
      m.weight > 0 &&
      m.date >= windowStart &&
      m.date <= today,
  );

  if (windowMeasurements.length < 2) {
    return empty;
  }

  const firstWeight = windowMeasurements[0]!.weight!;
  const lastWeight = windowMeasurements[windowMeasurements.length - 1]!.weight!;
  const weightChangeKg = Math.round((lastWeight - firstWeight) * 10) / 10;

  if (weightChangeKg < -0.5 || weightChangeKg > 0.5) {
    return empty;
  }

  const windowEntries = dailyEntries.filter((e) => e.date >= windowStart && e.date <= today);

  const positiveSignals: string[] = [];

  const trackingDays = windowEntries.filter(
    (e) => e.calories !== null && e.calories !== undefined,
  ).length;
  if (trackingDays >= 7) positiveSignals.push(`Учёт калорий: ${trackingDays} дней`);
  else if (trackingDays >= 3) positiveSignals.push(`Частичный учёт: ${trackingDays} дней`);

  const stepsMinDays = windowEntries.filter((e) =>
    isStepsMinimumDone(e.steps, settings, e.date),
  ).length;
  if (stepsMinDays >= 7) positiveSignals.push(`Минимум шагов: ${stepsMinDays} дней`);

  const stepsNormalDays = windowEntries.filter((e) =>
    isStepsNormalDone(e.steps, settings, e.date),
  ).length;
  if (stepsNormalDays >= 4) positiveSignals.push(`Норма шагов: ${stepsNormalDays} дней`);

  const noAlcoholDays = windowEntries.filter((e) => e.alcohol === 'none').length;
  if (noAlcoholDays >= 7) positiveSignals.push(`Дни без алкоголя: ${noAlcoholDays}`);

  const gymDays = windowEntries.filter((e) => e.gym).length;
  if (gymDays >= 2) positiveSignals.push(`Тренировки: ${gymDays}`);

  const recoveryDays = windowEntries.filter((e) => {
    const mode = getDayMode(e.dayMode);
    return mode === 'recovery' || mode === 'minimal';
  }).length;
  if (recoveryDays >= 2) positiveSignals.push(`Recovery/minimal: ${recoveryDays} дней`);

  const limitDays = windowEntries.filter((e) => isCaloriesInLimit(e, settings)).length;
  if (limitDays >= 5) positiveSignals.push(`Дни в лимите: ${limitDays}`);

  const windowWaist = sortMeasurementsByDate(measurements).filter(
    (m) => m.waist !== null && m.waist > 0 && m.date >= windowStart && m.date <= today,
  );
  if (windowWaist.length >= 2) {
    const waistChange =
      windowWaist[0]!.waist! - windowWaist[windowWaist.length - 1]!.waist!;
    if (waistChange > 0.5) positiveSignals.push('Талия уменьшается');
  }

  const totalSignals = positiveSignals.length;
  const suggestions =
    totalSignals >= 3
      ? [
          'Продолжай текущий ритм — система работает, даже если вес стоит.',
          'Смотри на шаги, талию и ясность как дополнительные сигналы прогресса.',
        ]
      : [
          'Вернуть учёт калорий',
          'Держать минимум 7000 шагов',
          'Не добавлять давление — собрать 3 базовых дня',
          'Проверить недельные цели',
        ];

  if (totalSignals >= 3) {
    return {
      status: 'plateau_but_system_active',
      title: 'Вес стоит, но персонаж не стоит',
      description:
        'За последние две недели вес почти не изменился, но система продолжает строиться.',
      daysChecked: days,
      weightChangeKg,
      positiveSignals,
      suggestions,
    };
  }

  return {
    status: 'plateau_and_system_low',
    title: 'Похоже, система просела',
    description:
      'Вес почти не меняется, а опорных действий стало меньше. Лучше вернуться к базе без героизма.',
    daysChecked: days,
    weightChangeKg,
    positiveSignals,
    suggestions,
  };
}
