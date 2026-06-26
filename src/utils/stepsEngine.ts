import type { AppSettings } from '../types';
import type { DayMode } from '../types';
import type { StepsStatus, StepsStatusInfo } from '../types/steps';
import {
  DEFAULT_STEPS_POINTS,
  DEFAULT_STEPS_THRESHOLDS,
  MINIMAL_DAY_STEPS_THRESHOLD,
  RECOVERY_STEPS_THRESHOLDS,
} from '../constants/steps';
import { getWeeklySettingsForDate } from './points';
import { weekDays } from './dates';
import type { DailyEntry } from '../types';

export type StepsThresholds = {
  minimum: number;
  normal: number;
  excellent: number;
};

export function getStepsThresholds(settings: AppSettings, date: string): StepsThresholds {
  const weekly = getWeeklySettingsForDate(date, settings);
  return {
    minimum:
      weekly.stepsMinimum ??
      settings.defaultStepsMinimum ??
      DEFAULT_STEPS_THRESHOLDS.minimum,
    normal:
      weekly.stepsNormal ??
      weekly.stepsGoal ??
      settings.defaultStepsNormal ??
      settings.defaultStepsGoal ??
      DEFAULT_STEPS_THRESHOLDS.normal,
    excellent:
      weekly.stepsExcellent ??
      settings.defaultStepsExcellent ??
      DEFAULT_STEPS_THRESHOLDS.excellent,
  };
}

export function getDayMode(dayMode?: DayMode | null): DayMode {
  return dayMode ?? 'normal';
}

function buildInfo(
  status: StepsStatus,
  title: string,
  description: string,
  points: number,
  steps: number,
  targetNormal: number,
  nextTarget?: number,
  nextLabel?: string,
): StepsStatusInfo {
  const percentToNormal =
    targetNormal > 0 ? Math.min(100, Math.round((steps / targetNormal) * 100)) : 0;
  return {
    status,
    title,
    description,
    points,
    percentToNormal,
    nextTargetLabel: nextLabel,
    stepsToNextTarget:
      nextTarget !== undefined ? Math.max(0, nextTarget - steps) : undefined,
  };
}

export function getStepsStatus(params: {
  steps: number | null | undefined;
  settings: AppSettings;
  date?: string;
  dayMode?: DayMode | null;
}): StepsStatusInfo {
  const { steps, settings, date = '', dayMode } = params;
  const mode = getDayMode(dayMode);
  const thresholds = getStepsThresholds(settings, date);
  const s = steps ?? 0;
  const hasSteps = steps !== null && steps !== undefined;

  if (!hasSteps) {
    return buildInfo('none', 'Шаги ещё не внесены', '', 0, 0, thresholds.normal);
  }

  if (mode === 'minimal') {
    if (s < MINIMAL_DAY_STEPS_THRESHOLD) {
      if (s <= 0) return buildInfo('none', 'Шаги ещё не внесены', '', 0, s, thresholds.minimum);
      return buildInfo(
        'low',
        'Ниже минимума',
        `До минимального дня осталось ${MINIMAL_DAY_STEPS_THRESHOLD - s}`,
        DEFAULT_STEPS_POINTS.low,
        s,
        MINIMAL_DAY_STEPS_THRESHOLD,
        MINIMAL_DAY_STEPS_THRESHOLD,
        'минимального дня',
      );
    }
    return buildInfo(
      'minimum',
      'Минимальный день удержан',
      `${s.toLocaleString('ru')} шагов`,
      DEFAULT_STEPS_POINTS.minimalMinimum,
      s,
      MINIMAL_DAY_STEPS_THRESHOLD,
    );
  }

  if (mode === 'recovery') {
    const { minimum: recMin, normal: recNorm } = RECOVERY_STEPS_THRESHOLDS;
    if (s < recMin) {
      if (s <= 0) return buildInfo('none', 'Шаги ещё не внесены', '', 0, s, recNorm);
      return buildInfo(
        'low',
        'Ниже минимума',
        `Облегчённый порог: ${recMin.toLocaleString('ru')}`,
        DEFAULT_STEPS_POINTS.low,
        s,
        recNorm,
        recMin,
        'минимума восстановления',
      );
    }
    if (s < recNorm) {
      return buildInfo(
        'minimum',
        'Минимум восстановления',
        `${s.toLocaleString('ru')} шагов`,
        DEFAULT_STEPS_POINTS.recoveryMinimum,
        s,
        recNorm,
        recNorm,
        'удержания дня',
      );
    }
    return buildInfo(
      'normal',
      'День удержан хорошо',
      `${s.toLocaleString('ru')} шагов`,
      DEFAULT_STEPS_POINTS.recoveryNormal,
      s,
      recNorm,
    );
  }

  const { minimum, normal, excellent } = thresholds;

  if (s < minimum) {
    if (s <= 0) return buildInfo('none', 'Шаги ещё не внесены', '', 0, s, normal);
    return buildInfo(
      'low',
      'Ниже минимума',
      `До минимума осталось ${minimum - s}`,
      DEFAULT_STEPS_POINTS.low,
      s,
      normal,
      minimum,
      'минимума',
    );
  }
  if (s < normal) {
    return buildInfo(
      'minimum',
      'Минимум выполнен',
      `До нормы осталось ${normal - s}`,
      DEFAULT_STEPS_POINTS.minimum,
      s,
      normal,
      normal,
      'нормы',
    );
  }
  if (s < excellent) {
    return buildInfo(
      'normal',
      'Норма выполнена',
      `До «Отлично» осталось ${excellent - s}`,
      DEFAULT_STEPS_POINTS.normal,
      s,
      normal,
      excellent,
      '«Отлично»',
    );
  }
  return buildInfo(
    'excellent',
    'Отлично',
    'Максимальный бонус получен',
    DEFAULT_STEPS_POINTS.excellent,
    s,
    normal,
  );
}

export function isStepsMinimumDone(
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
): boolean {
  if (steps === null || steps === undefined) return false;
  return steps >= getStepsThresholds(settings, date).minimum;
}

export function isStepsNormalDone(
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
): boolean {
  if (steps === null || steps === undefined) return false;
  return steps >= getStepsThresholds(settings, date).normal;
}

export function isStepsExcellentDone(
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
): boolean {
  if (steps === null || steps === undefined) return false;
  return steps >= getStepsThresholds(settings, date).excellent;
}

export function getStepsProgressPercent(
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
  dayMode?: DayMode | null,
): number {
  const info = getStepsStatus({ steps, settings, date, dayMode });
  if (info.status === 'excellent') return 100;
  const thresholds = getStepsThresholds(settings, date);
  const mode = getDayMode(dayMode);
  const target =
    mode === 'minimal'
      ? MINIMAL_DAY_STEPS_THRESHOLD
      : mode === 'recovery'
        ? RECOVERY_STEPS_THRESHOLDS.normal
        : thresholds.excellent;
  const s = steps ?? 0;
  return target > 0 ? Math.min(100, Math.round((s / target) * 100)) : 0;
}

export type StepsBarColor = 'muted' | 'rose' | 'amber' | 'emerald' | 'gold';

export function getStepsBarColor(
  status: StepsStatus,
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
  dayMode?: DayMode | null,
): StepsBarColor {
  const mode = getDayMode(dayMode);
  if (status === 'none' || status === 'low') return 'rose';
  if (status === 'minimum') return 'amber';
  if (status === 'normal') return 'emerald';
  if (status === 'excellent') return 'gold';

  const s = steps ?? 0;
  const { minimum, normal, excellent } = getStepsThresholds(settings, date);
  if (mode !== 'normal') return s >= RECOVERY_STEPS_THRESHOLDS.normal ? 'emerald' : 'amber';
  if (s >= excellent) return 'gold';
  if (s >= normal) return 'emerald';
  if (s >= minimum) return 'amber';
  return 'rose';
}

export type WeeklyStepsDistribution = {
  low: number;
  minimum: number;
  normal: number;
  excellent: number;
};

function classifyStepsForWeekChart(
  steps: number | null | undefined,
  settings: AppSettings,
  date: string,
): keyof WeeklyStepsDistribution {
  if (steps === null || steps === undefined) return 'low';
  const { minimum, normal, excellent } = getStepsThresholds(settings, date);
  if (steps >= excellent) return 'excellent';
  if (steps >= normal) return 'normal';
  if (steps >= minimum) return 'minimum';
  return 'low';
}

export function getWeeklyStepsDistribution(params: {
  weekStart: string;
  dailyEntries: DailyEntry[];
  settings: AppSettings;
}): WeeklyStepsDistribution {
  const { weekStart: ws, dailyEntries, settings } = params;
  const dist: WeeklyStepsDistribution = { low: 0, minimum: 0, normal: 0, excellent: 0 };

  for (const date of weekDays(ws)) {
    const entry = dailyEntries.find((e) => e.date === date);
    const bucket = classifyStepsForWeekChart(entry?.steps ?? null, settings, date);
    dist[bucket]++;
  }

  return dist;
}
