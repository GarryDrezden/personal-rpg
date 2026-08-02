import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import {
  AVATAR_STAGE_WEIGHTS,
  getAvatarStageFromProgress,
  getDefaultAvatarStageSnapshot,
  resolveAvatarStageSnapshot,
} from './avatarStageEngine';
import {
  getAvatarStageImageCandidates,
  getAvatarStagePlaceholderPath,
} from './avatarStageAssets';

function measurement(
  date: string,
  weight: number | null,
  waist: number | null = null,
): MeasurementEntry {
  return {
    id: date,
    date,
    weight,
    chest: null,
    waist,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  };
}

function day(
  date: string,
  patch: Partial<DailyEntry> = {},
): DailyEntry {
  return {
    id: date,
    date,
    steps: null,
    calories: null,
    alcohol: null,
    morningExercise: false,
    gym: false,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    ...patch,
  };
}

describe('AvatarStageEngine', () => {
  it('exposes 20 stages and progress 0–100 mapping', () => {
    expect(getAvatarStageFromProgress(0)).toBe(1);
    expect(getAvatarStageFromProgress(5)).toBe(2);
    expect(getAvatarStageFromProgress(100)).toBe(20);
  });

  it('gives safe defaults for legacy / empty users', () => {
    const empty = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS },
      today: '2026-07-21',
    });
    expect(empty.stage).toBe(1);
    expect(empty.avatarProgress).toBe(0);
    expect(empty.chapter).toBe(1);
    expect(getDefaultAvatarStageSnapshot().stage).toBe(1);
  });

  it('does not advance stage from weight alone to the weight-only ceiling', () => {
    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      targetWeight: 80,
      weightGoal: 80,
      startDate: '2026-01-01',
    };
    const measurements = [
      measurement('2026-01-01', 100),
      measurement('2026-03-01', 80),
    ];

    const snapshot = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements,
      settings,
      today: '2026-07-21',
    });

    // Full weight path alone contributes ~34 points → stage well below 20.
    expect(snapshot.weightOnlyStage).toBe(20);
    expect(snapshot.avatarProgress).toBeLessThanOrEqual(40);
    expect(snapshot.stage).toBeLessThan(snapshot.weightOnlyStage);
    expect(snapshot.stage).toBeGreaterThan(1);
  });

  it('can advance a little when weight is stalled but waist/abilities/stability grow', () => {
    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      targetWeight: 80,
      weightGoal: 80,
      startDate: '2026-01-01',
      nutritionTrackingMode: 'simple',
      dailyCalorieLimit: 2000,
    };

    const measurements = [
      measurement('2026-01-01', 100, 120),
      measurement('2026-02-01', 98, 110),
      measurement('2026-03-01', 98, 100),
    ];

    const dailyEntries: DailyEntry[] = [];
    for (let i = 0; i < 20; i += 1) {
      const d = `2026-07-${String(i + 1).padStart(2, '0')}`;
      dailyEntries.push(
        day(d, {
          steps: 9000,
          nutritionLevel: 'light',
          alcohol: 'none',
          sleepHours: 7.5,
          energyLevel: 4,
        }),
      );
    }

    const stalledWeightOnly = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [measurement('2026-01-01', 100), measurement('2026-03-01', 98)],
      settings,
      today: '2026-07-21',
    });

    const withBodySignals = resolveAvatarStageSnapshot({
      dailyEntries,
      measurements,
      settings,
      today: '2026-07-21',
    });

    expect(withBodySignals.avatarProgress).toBeGreaterThan(
      stalledWeightOnly.avatarProgress,
    );
    expect(withBodySignals.stage).toBeGreaterThanOrEqual(stalledWeightOnly.stage);
    expect(
      withBodySignals.signals
        .filter((s) => s.id !== 'weight')
        .some((s) => s.points > 0),
    ).toBe(true);
  });

  it('keeps signal weights summing to 1', () => {
    const sum = Object.values(AVATAR_STAGE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it('includes disclaimer that stages are not medical', () => {
    const snapshot = getDefaultAvatarStageSnapshot();
    expect(snapshot.disclaimer.toLowerCase()).toContain('не медицинская');
  });
});

describe('AvatarStageAssets', () => {
  it('uses shared stage id with theme-specific placeholder paths', () => {
    const cozy = getAvatarStagePlaceholderPath('cozy', 'male', 5);
    const dark = getAvatarStagePlaceholderPath('darkFantasy', 'male', 5);
    expect(cozy).toContain('themes/cozy/avatars/placeholders/male/stage-05.svg');
    expect(dark).toContain(
      'themes/dark-fantasy/avatars/placeholders/male/stage-05.svg',
    );
    expect(cozy).not.toEqual(dark);
  });

  it('lists stage placeholder among cozy candidates', () => {
    const candidates = getAvatarStageImageCandidates('female', 3, 'cozy');
    expect(
      candidates.some((c) => c.includes('placeholders/female/stage-03.svg')),
    ).toBe(true);
  });
});
