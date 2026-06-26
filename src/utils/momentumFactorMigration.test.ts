import { describe, expect, it } from 'vitest';
import type { MomentumDailyFactor, MomentumDayResult } from '../types/momentum';
import {
  migrateMomentumFactor,
  migrateMomentumFactorId,
  migrateMomentumHistoryRecord,
} from './momentumFactorMigration';

function factor(id: string, value: number): MomentumDailyFactor {
  return {
    id,
    title: id,
    value,
    type: value >= 0 ? 'positive' : 'negative',
  };
}

function day(date: string, factors: MomentumDailyFactor[]): MomentumDayResult {
  return {
    date,
    startValue: 0,
    decayValue: 0,
    dailyDelta: factors.reduce((s, f) => s + f.value, 0),
    endValue: factors.reduce((s, f) => s + f.value, 0),
    level: {
      id: 'neutral',
      min: -10,
      max: 10,
      title: 'Neutral',
      description: '',
      icon: '⚖️',
    },
    factors,
  };
}

describe('migrateMomentumFactorId', () => {
  it('migrates good_sleep to sleep_good', () => {
    expect(migrateMomentumFactorId('good_sleep')).toBe('sleep_good');
  });

  it('migrates low_sleep to sleep_low', () => {
    expect(migrateMomentumFactorId('low_sleep')).toBe('sleep_low');
  });

  it('migrates bad_sleep_streak to sleep_low_streak', () => {
    expect(migrateMomentumFactorId('bad_sleep_streak')).toBe('sleep_low_streak');
  });

  it('keeps unknown ids unchanged', () => {
    expect(migrateMomentumFactorId('steps_normal')).toBe('steps_normal');
  });
});

describe('migrateMomentumFactor', () => {
  it('preserves factor value after migration', () => {
    const migrated = migrateMomentumFactor(factor('good_sleep', 4));
    expect(migrated.id).toBe('sleep_good');
    expect(migrated.value).toBe(4);
    expect(migrated.source).toBe('sleep');
    expect(migrated.explanation).toBeTruthy();
  });
});

describe('migrateMomentumHistoryRecord', () => {
  it('migrates factors across multiple days', () => {
    const history = {
      '2026-06-01': day('2026-06-01', [factor('good_sleep', 4)]),
      '2026-06-02': day('2026-06-02', [factor('poor_sleep_streak', -10)]),
    };

    const { history: migrated, changed } = migrateMomentumHistoryRecord(history);

    expect(changed).toBe(true);
    expect(migrated['2026-06-01']!.factors[0]!.id).toBe('sleep_good');
    expect(migrated['2026-06-02']!.factors[0]!.id).toBe('sleep_low_streak');
    expect(migrated['2026-06-02']!.factors[0]!.value).toBe(-10);
  });

  it('returns changed=false when nothing to migrate', () => {
    const history = {
      '2026-06-01': day('2026-06-01', [factor('sleep_good', 4)]),
    };

    const { changed } = migrateMomentumHistoryRecord(history);
    expect(changed).toBe(false);
  });
});
