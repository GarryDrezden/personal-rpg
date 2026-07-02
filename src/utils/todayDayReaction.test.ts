import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import { getTodaySaveReaction } from './todayDayReaction';

function entry(partial: Partial<DailyEntry>): DailyEntry {
  return { ...emptyDaily('2026-07-02'), ...partial };
}

describe('getTodaySaveReaction', () => {
  it('returns minimal day reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: DEFAULT_APP_SETTINGS,
      questDone: 0,
      questTotal: 5,
      points: 10,
    });
    expect(reaction.headline).toBe('Маршрут удержан.');
  });

  it('returns recovery reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'recovery' }),
      settings: DEFAULT_APP_SETTINGS,
      questDone: 1,
      questTotal: 5,
      points: 20,
    });
    expect(reaction.headline).toBe('Ядро стабилизируется.');
  });

  it('returns movement reaction when steps marked', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ steps: 6000 }),
      settings: DEFAULT_APP_SETTINGS,
      questDone: 0,
      questTotal: 5,
      points: 30,
    });
    expect(reaction.headline).toBe('Движение зафиксировано.');
  });
});
