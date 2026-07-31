import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import {
  getHeavyLoadRecoveryWarning,
  getMovementCredit,
  hasMarkedPhysicalActivity,
} from './movementCreditEngine';

function entry(partial: Partial<DailyEntry>): DailyEntry {
  return { ...emptyDaily('2026-07-02'), ...partial };
}

describe('getMovementCredit', () => {
  it('holds minimum via steps when steps reach minimum', () => {
    const result = getMovementCredit(
      entry({ steps: 7000 }),
      DEFAULT_APP_SETTINGS,
    );
    expect(result.holdsMinimumMovement).toBe(true);
    expect(result.sources).toContain('steps');
    expect(result.status === 'minimum_held' || result.status === 'normal' || result.status === 'strong').toBe(
      true,
    );
  });

  it('holds minimum via medium physical activity when steps are low', () => {
    const result = getMovementCredit(
      entry({
        steps: 4200,
        physicalActivityLevel: 'medium',
        physicalActivityDuration: '3_6h',
      }),
      DEFAULT_APP_SETTINGS,
    );
    expect(result.holdsMinimumMovement).toBe(true);
    expect(result.sources).toContain('physical_activity');
    expect(result.status).toBe('minimum_held');
  });

  it('gives partial credit for light activity', () => {
    const result = getMovementCredit(
      entry({ steps: 2000, physicalActivityLevel: 'light' }),
      DEFAULT_APP_SETTINGS,
    );
    expect(result.status).toBe('partial');
    expect(result.holdsMinimumMovement).toBe(false);
  });

  it('treats heavy + 6h as strong movement credit', () => {
    const result = getMovementCredit(
      entry({
        steps: 3000,
        physicalActivityLevel: 'heavy',
        physicalActivityDuration: '6h_plus',
      }),
      DEFAULT_APP_SETTINGS,
    );
    expect(result.holdsMinimumMovement).toBe(true);
    expect(result.status).toBe('strong');
    expect(result.suggestion).toBeTruthy();
  });

  it('does not mark none as physical activity', () => {
    expect(hasMarkedPhysicalActivity(entry({ physicalActivityLevel: 'none' }))).toBe(false);
  });
});

describe('getHeavyLoadRecoveryWarning', () => {
  it('warns after consecutive heavy drained days', () => {
    const entries = [
      entry({
        date: '2026-07-02',
        physicalActivityLevel: 'heavy',
        energyLevel: 2,
      }),
      {
        ...emptyDaily('2026-07-01'),
        physicalActivityLevel: 'heavy' as const,
        energyLevel: 1 as const,
      },
    ];
    expect(getHeavyLoadRecoveryWarning(entries, '2026-07-02')).toMatch(/Пожиратель/);
  });
});
