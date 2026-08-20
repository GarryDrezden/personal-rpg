import { describe, expect, it } from 'vitest';
import { addDays, format, parseISO } from 'date-fns';
import { pickTodayReaction } from './todayReactions';
import { pickObstacleFlavor } from './obstacles';
import { pickCompanionReaction } from './companions';

function daysFrom(start: string, count: number): string[] {
  const origin = parseISO(start);
  return Array.from({ length: count }, (_, i) => format(addDays(origin, i), 'yyyy-MM-dd'));
}

function consecutiveRate(ids: string[]): { rate: number; max: number } {
  let dup = 0;
  let run = 1;
  let max = 1;
  for (let i = 1; i < ids.length; i += 1) {
    if (ids[i] === ids[i - 1]) {
      dup += 1;
      run += 1;
      if (run > max) max = run;
    } else {
      run = 1;
    }
  }
  return { rate: dup / Math.max(1, ids.length - 1), max };
}

describe('content anti-repeat', () => {
  it('avoids consecutive Today duplicates over 30 days when the pool is large', () => {
    const ids = daysFrom('2026-03-01', 30).map(
      (date) => pickTodayReaction({ themeId: 'cozy', context: 'minimal', date }).id,
    );
    const { rate, max } = consecutiveRate(ids);
    expect(rate).toBe(0);
    expect(max).toBe(1);
    expect(new Set(ids).size).toBeGreaterThan(3);
  });

  it('avoids consecutive obstacle duplicates over 90 days', () => {
    const ids = daysFrom('2026-01-01', 90).map(
      (date) => pickObstacleFlavor({ themeId: 'darkFantasy', mobId: 'sofa_magnet', date }).id,
    );
    expect(consecutiveRate(ids).rate).toBe(0);
    expect(new Set(ids).size).toBeGreaterThan(2);
  });

  it('keeps same-day companion line stable', () => {
    const a = pickCompanionReaction({
      companionId: 'raven',
      themeId: 'cozy',
      context: 'good_day',
      date: '2026-08-20',
    });
    const b = pickCompanionReaction({
      companionId: 'raven',
      themeId: 'cozy',
      context: 'good_day',
      date: '2026-08-20',
    });
    expect(a.id).toBe(b.id);
    expect(a.text).toBe(b.text);
  });
});
