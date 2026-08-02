import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import {
  BODY_STAGE_WEIGHTS,
  HERO_STATE_WEIGHTS,
  getAvatarStageFromProgress,
  getBodyStageFromProgress,
  getDefaultAvatarStageSnapshot,
  getHeroStateFromProgress,
  getHeroStateLabel,
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
  extras: Partial<Pick<MeasurementEntry, 'belly' | 'hips' | 'chest'>> = {},
): MeasurementEntry {
  return {
    id: date,
    date,
    weight,
    chest: extras.chest ?? null,
    waist,
    belly: extras.belly ?? null,
    hips: extras.hips ?? null,
    thigh: null,
    biceps: null,
    comment: '',
  };
}

function day(date: string, patch: Partial<DailyEntry> = {}): DailyEntry {
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

function idealHabitDays(count: number, startDay = 1): DailyEntry[] {
  const entries: DailyEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = `2026-07-${String(startDay + i).padStart(2, '0')}`;
    entries.push(
      day(d, {
        steps: 10000,
        nutritionLevel: 'light',
        alcohol: 'none',
        sleepHours: 8,
        energyLevel: 5,
        morningExercise: true,
        journal: true,
      }),
    );
  }
  return entries;
}

function unevenHabitDays(count: number): DailyEntry[] {
  const entries: DailyEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    const d = `2026-07-${String(i + 1).padStart(2, '0')}`;
    const good = i % 3 === 0;
    entries.push(
      day(d, {
        steps: good ? 7000 : 1200,
        nutritionLevel: good ? 'medium' : null,
        alcohol: good ? 'none' : 'moderate',
        sleepHours: good ? 7 : 4,
        energyLevel: good ? 3 : 1,
      }),
    );
  }
  return entries;
}

const baseSettings = (): AppSettings => ({
  ...DEFAULT_APP_SETTINGS,
  targetWeight: 80,
  weightGoal: 80,
  startDate: '2026-01-01',
  nutritionTrackingMode: 'simple',
  dailyCalorieLimit: 2000,
});

describe('AvatarStageEngine mapping', () => {
  it('maps bodyProgress to 20 body stages', () => {
    expect(getBodyStageFromProgress(0)).toBe(1);
    expect(getAvatarStageFromProgress(5)).toBe(2);
    expect(getBodyStageFromProgress(100)).toBe(20);
  });

  it('maps heroStateProgress to depleted/steady/energized/strong', () => {
    expect(getHeroStateFromProgress(0)).toBe('depleted');
    expect(getHeroStateFromProgress(30)).toBe('steady');
    expect(getHeroStateFromProgress(60)).toBe('energized');
    expect(getHeroStateFromProgress(90)).toBe('strong');
    expect(getHeroStateLabel('energized')).toBe('собран');
  });

  it('keeps body and hero layer weights summing to 1', () => {
    const bodySum = Object.values(BODY_STAGE_WEIGHTS).reduce((a, b) => a + b, 0);
    const heroSum = Object.values(HERO_STATE_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(bodySum).toBeCloseTo(1, 5);
    expect(heroSum).toBeCloseTo(1, 5);
    const physicalShare =
      BODY_STAGE_WEIGHTS.weight +
      BODY_STAGE_WEIGHTS.waist +
      BODY_STAGE_WEIGHTS.measurements;
    expect(physicalShare).toBeGreaterThanOrEqual(0.75);
  });

  it('gives safe defaults for legacy users', () => {
    const empty = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS },
      today: '2026-07-21',
    });
    expect(empty.bodyStage).toBe(1);
    expect(empty.stage).toBe(1);
    expect(empty.bodyProgress).toBe(0);
    expect(empty.heroState).toBe('depleted');
    expect(getDefaultAvatarStageSnapshot().bodyStage).toBe(1);
  });
});

describe('Avatar Stages v1 Calibration QA', () => {
  it('1) stable weight/waist + ideal habits → bodyStage barely moves, heroState improves', () => {
    const settings = baseSettings();
    const measurements = [
      measurement('2026-01-01', 120, 130),
      measurement('2026-06-01', 120, 130),
    ];
    const withHabits = resolveAvatarStageSnapshot({
      dailyEntries: idealHabitDays(20),
      measurements,
      settings,
      today: '2026-07-21',
    });
    const withoutHabits = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements,
      settings,
      today: '2026-07-21',
    });

    expect(withHabits.bodyStage).toBe(1);
    expect(withHabits.bodyProgress).toBeLessThan(5);
    expect(withHabits.heroStateProgress).toBeGreaterThan(
      withoutHabits.heroStateProgress + 30,
    );
    expect(['energized', 'strong']).toContain(withHabits.heroState);
  });

  it('2) weight −10 kg, uneven habits → bodyStage grows, heroState mid', () => {
    const snapshot = resolveAvatarStageSnapshot({
      dailyEntries: unevenHabitDays(21),
      measurements: [
        measurement('2026-01-01', 100, 110),
        measurement('2026-04-01', 90, 108),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });

    expect(snapshot.bodyStage).toBeGreaterThan(1);
    expect(snapshot.bodyProgress).toBeGreaterThan(20);
    expect(snapshot.heroStateProgress).toBeGreaterThan(10);
    expect(snapshot.heroStateProgress).toBeLessThan(75);
    expect(['steady', 'energized', 'depleted']).toContain(snapshot.heroState);
  });

  it('3) weight flat, waist −5 cm → bodyStage nudges forward', () => {
    const flat = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [
        measurement('2026-01-01', 110, 120),
        measurement('2026-03-01', 110, 120),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });
    const waistDrop = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [
        measurement('2026-01-01', 110, 120),
        measurement('2026-03-01', 110, 115),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });

    expect(flat.bodyStage).toBe(1);
    expect(waistDrop.bodyProgress).toBeGreaterThan(flat.bodyProgress);
    expect(waistDrop.bodyStage).toBeGreaterThanOrEqual(flat.bodyStage);
    expect(waistDrop.bodySignals.find((s) => s.id === 'waist')?.points).toBeGreaterThan(
      0,
    );
  });

  it('4) +2 kg after best weight does not roll bodyStage back', () => {
    const atBest = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [
        measurement('2026-01-01', 100),
        measurement('2026-03-01', 88),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });
    const afterRebound = resolveAvatarStageSnapshot({
      dailyEntries: [],
      measurements: [
        measurement('2026-01-01', 100),
        measurement('2026-03-01', 88),
        measurement('2026-03-08', 90),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });

    expect(afterRebound.bodyStage).toBe(atBest.bodyStage);
    expect(afterRebound.bodyProgress).toBe(atBest.bodyProgress);
  });

  it('5) no weight/measurements, strong habits → bodyStage 1, heroState can improve', () => {
    const snapshot = resolveAvatarStageSnapshot({
      dailyEntries: idealHabitDays(20),
      measurements: [],
      settings: baseSettings(),
      today: '2026-07-21',
    });

    expect(snapshot.bodyStage).toBe(1);
    expect(snapshot.stage).toBe(1);
    expect(snapshot.bodyProgress).toBe(0);
    expect(snapshot.heroStateProgress).toBeGreaterThan(40);
    expect(['energized', 'strong']).toContain(snapshot.heroState);
  });

  it('habits alone never produce a lean bodyStage for a large starting body', () => {
    const largeStable = resolveAvatarStageSnapshot({
      dailyEntries: idealHabitDays(20),
      measurements: [
        measurement('2026-01-01', 140, 145),
        measurement('2026-06-01', 140, 145),
      ],
      settings: baseSettings(),
      today: '2026-07-21',
    });

    expect(largeStable.bodyStage).toBe(1);
    expect(largeStable.bodyProgress).toBeLessThan(5);
    expect(largeStable.heroStateProgress).toBeGreaterThan(40);
  });

  it('includes non-medical disclaimer', () => {
    expect(getDefaultAvatarStageSnapshot().disclaimer.toLowerCase()).toContain(
      'не медицинская',
    );
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
  });

  it('lists stage placeholder among cozy candidates', () => {
    const candidates = getAvatarStageImageCandidates('female', 3, 'cozy');
    expect(
      candidates.some((c) => c.includes('placeholders/female/stage-03.svg')),
    ).toBe(true);
  });
});
