import type { WeeklySettings } from '../types';
import { weekStart as getWeekStartDateFromDate } from './dates';

export { getWeekStartDateFromDate as getWeekStartDate };

/** Fields that affect momentum calculation per week */
export const MOMENTUM_SENSITIVE_WEEKLY_SETTING_FIELDS = [
  'caloriesLimit',
  'stepsMinimum',
  'stepsNormal',
  'stepsExcellent',
  'stepsGoal',
] as const;

export type MomentumSensitiveWeeklyField =
  (typeof MOMENTUM_SENSITIVE_WEEKLY_SETTING_FIELDS)[number];

export type MomentumSensitiveWeeklySnapshot = Record<
  MomentumSensitiveWeeklyField,
  number | null | undefined
>;

export function pickMomentumSensitiveWeeklyFields(
  w: WeeklySettings,
): MomentumSensitiveWeeklySnapshot {
  return {
    caloriesLimit: w.caloriesLimit,
    stepsMinimum: w.stepsMinimum ?? null,
    stepsNormal: w.stepsNormal ?? w.stepsGoal,
    stepsExcellent: w.stepsExcellent ?? null,
    stepsGoal: w.stepsGoal,
  };
}

function fieldsEqual(
  a: MomentumSensitiveWeeklySnapshot,
  b: MomentumSensitiveWeeklySnapshot,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Momentum depends on calorie/step targets for each date. When weekly settings change,
 * rebuild from the earliest affected week forward.
 */
export function getEarliestAffectedDateFromWeeklySettingsChange(params: {
  previousWeeklySettings: WeeklySettings[];
  nextWeeklySettings: WeeklySettings[];
}): string | null {
  const { previousWeeklySettings, nextWeeklySettings } = params;

  const prevMap = new Map(
    previousWeeklySettings.map((w) => [w.weekStart, pickMomentumSensitiveWeeklyFields(w)]),
  );
  const nextMap = new Map(
    nextWeeklySettings.map((w) => [w.weekStart, pickMomentumSensitiveWeeklyFields(w)]),
  );

  const affectedWeekStarts: string[] = [];

  for (const [ws, nextFields] of nextMap) {
    const prevFields = prevMap.get(ws);
    if (!prevFields || !fieldsEqual(prevFields, nextFields)) {
      affectedWeekStarts.push(ws);
    }
  }

  for (const ws of prevMap.keys()) {
    if (!nextMap.has(ws)) {
      affectedWeekStarts.push(ws);
    }
  }

  if (affectedWeekStarts.length === 0) return null;

  return [...affectedWeekStarts].sort((a, b) => a.localeCompare(b))[0]!;
}

export function sortIsoDates(dates: string[]): string[] {
  return [...dates].sort((a, b) => a.localeCompare(b));
}

export function isSameOrAfter(date: string, start: string): boolean {
  return date >= start;
}

export type MomentumRebuildStrategy =
  | { type: 'none' }
  | { type: 'full' }
  | { type: 'fromDate'; date: string };
