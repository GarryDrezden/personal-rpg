import { describe, expect, it } from 'vitest';
import type { AppSettings, DailyEntry } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import {
  getNutritionCoinEligible,
  getNutritionFreedomDayScore,
  getNutritionMomentumDelta,
  getNutritionPoints,
  getNutritionStatus,
  getTrackingMode,
} from './nutritionEngine';

function entry(partial: Partial<DailyEntry> & { date?: string }): DailyEntry {
  return {
    id: '1',
    date: partial.date ?? '2026-06-06',
    calories: null,
    steps: null,
    alcohol: null,
    morningExercise: false,
    gym: false,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    ...partial,
  };
}

function settings(partial: Partial<AppSettings> = {}): AppSettings {
  return { ...DEFAULT_APP_SETTINGS, ...partial };
}

describe('nutritionEngine', () => {
  it('disabled returns disabled and 0 points', () => {
    const s = settings({ nutritionTrackingMode: 'disabled' });
    const e = entry({ nutritionLevel: 'light', calories: 2000 });
    expect(getNutritionStatus({ entry: e, settings: s })).toBe('disabled');
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(0);
    expect(getNutritionMomentumDelta({ entry: e, settings: s })).toBe(0);
    expect(getNutritionCoinEligible({ entry: e, settings: s })).toBe(false);
  });

  it('simple light gives +35 XP and positive momentum', () => {
    const s = settings({ nutritionTrackingMode: 'simple' });
    const e = entry({ nutritionLevel: 'light' });
    expect(getNutritionStatus({ entry: e, settings: s })).toBe('light');
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(35);
    expect(getNutritionMomentumDelta({ entry: e, settings: s })).toBe(5);
    expect(getNutritionCoinEligible({ entry: e, settings: s })).toBe(true);
  });

  it('simple medium gives +15 XP', () => {
    const s = settings({ nutritionTrackingMode: 'simple' });
    const e = entry({ nutritionLevel: 'medium' });
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(15);
    expect(getNutritionCoinEligible({ entry: e, settings: s })).toBe(false);
  });

  it('simple heavy gives +5 XP and negative momentum', () => {
    const s = settings({ nutritionTrackingMode: 'simple' });
    const e = entry({ nutritionLevel: 'heavy' });
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(5);
    expect(getNutritionMomentumDelta({ entry: e, settings: s })).toBe(-8);
  });

  it('precise in limit gives +40 XP', () => {
    const s = settings({
      nutritionTrackingMode: 'precise',
      dailyCalorieLimit: 2000,
    });
    const e = entry({ calories: 1900 });
    expect(getNutritionStatus({ entry: e, settings: s })).toBe('precise_in_limit');
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(40);
  });

  it('precise medium over gives +15 XP', () => {
    const s = settings({
      nutritionTrackingMode: 'precise',
      dailyCalorieLimit: 2000,
      nutritionMediumOverThreshold: 300,
      nutritionHeavyOverThreshold: 700,
    });
    const e = entry({ calories: 2200 });
    expect(getNutritionStatus({ entry: e, settings: s })).toBe('precise_medium_over');
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(15);
  });

  it('precise heavy over gives +5 XP and negative momentum', () => {
    const s = settings({
      nutritionTrackingMode: 'precise',
      dailyCalorieLimit: 2000,
      nutritionHeavyOverThreshold: 700,
    });
    const e = entry({ calories: 2800 });
    expect(getNutritionStatus({ entry: e, settings: s })).toBe('precise_heavy_over');
    expect(getNutritionPoints({ entry: e, settings: s })).toBe(5);
    expect(getNutritionMomentumDelta({ entry: e, settings: s })).toBe(-10);
  });

  it('missing data does not crash', () => {
    const s = settings({ nutritionTrackingMode: 'simple' });
    expect(getNutritionStatus({ entry: null, settings: s })).toBe('missing');
    expect(getNutritionPoints({ entry: undefined, settings: s })).toBe(0);
  });

  it('disabled nutrition excluded from Freedom Score contribution', () => {
    const s = settings({ nutritionTrackingMode: 'disabled' });
    const e = entry({ nutritionLevel: 'heavy' });
    expect(getNutritionFreedomDayScore({ entry: e, settings: s })).toBe(0);
  });

  it('defaults to simple tracking mode', () => {
    const s = settings();
    delete (s as Partial<AppSettings>).nutritionTrackingMode;
    expect(getTrackingMode(s)).toBe('simple');
  });
});
