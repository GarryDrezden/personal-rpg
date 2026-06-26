import { describe, expect, it } from 'vitest';
import type { WeeklySettings } from '../types';
import { getEarliestAffectedDateFromWeeklySettingsChange } from './momentumRebuildUtils';

function week(
  weekStart: string,
  overrides: Partial<WeeklySettings> = {},
): WeeklySettings {
  return {
    id: weekStart,
    weekStart,
    caloriesLimit: 2000,
    stepsGoal: 10000,
    stepsMinimum: 8000,
    stepsNormal: 10000,
    stepsExcellent: 12000,
    gymTarget: 3,
    weeklyPointsGoal: 100,
    ...overrides,
  };
}

describe('getEarliestAffectedDateFromWeeklySettingsChange', () => {
  it('returns null when weekly settings are unchanged', () => {
    const settings = [week('2026-06-15'), week('2026-06-22')];
    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: settings,
        nextWeeklySettings: settings.map((w) => ({ ...w })),
      }),
    ).toBeNull();
  });

  it('returns weekStart when one week calorie limit changed', () => {
    const previous = [week('2026-06-15'), week('2026-06-22')];
    const next = [
      week('2026-06-15', { caloriesLimit: 1800 }),
      week('2026-06-22'),
    ];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBe('2026-06-15');
  });

  it('returns earliest weekStart when multiple weeks changed', () => {
    const previous = [week('2026-06-15'), week('2026-06-22'), week('2026-06-29')];
    const next = [
      week('2026-06-15'),
      week('2026-06-22', { caloriesLimit: 1700 }),
      week('2026-06-29', { stepsMinimum: 7000 }),
    ];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBe('2026-06-22');
  });

  it('returns weekStart when a new weekly setting is added', () => {
    const previous = [week('2026-06-15')];
    const next = [week('2026-06-15'), week('2026-06-29')];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBe('2026-06-29');
  });

  it('returns weekStart when a weekly setting is removed', () => {
    const previous = [week('2026-06-15'), week('2026-06-29')];
    const next = [week('2026-06-15')];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBe('2026-06-29');
  });

  it('returns null when only non-momentum fields changed', () => {
    const previous = [week('2026-06-15')];
    const next = [week('2026-06-15', { gymTarget: 5, weeklyPointsGoal: 150 })];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBeNull();
  });

  it('returns weekStart when steps thresholds changed', () => {
    const previous = [week('2026-06-15')];
    const next = [
      week('2026-06-15', {
        stepsMinimum: 6000,
        stepsNormal: 9000,
        stepsExcellent: 11000,
      }),
    ];

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: previous,
        nextWeeklySettings: next,
      }),
    ).toBe('2026-06-15');
  });

  it('returns null when array order differs but values are the same', () => {
    const a = week('2026-06-15');
    const b = week('2026-06-29');

    expect(
      getEarliestAffectedDateFromWeeklySettingsChange({
        previousWeeklySettings: [a, b],
        nextWeeklySettings: [b, a],
      }),
    ).toBeNull();
  });
});
