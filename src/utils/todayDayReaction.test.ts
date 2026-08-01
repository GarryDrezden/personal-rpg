import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import { attachCozySaveFeedback, getTodaySaveReaction } from './todayDayReaction';

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

  it('attaches cozy feedback only on first grant with resources', () => {
    const base = getTodaySaveReaction({
      entry: entry({ steps: 1000 }),
      settings: DEFAULT_APP_SETTINGS,
      questDone: 0,
      questTotal: 5,
      points: 10,
    });
    const rewards = {
      resources: { comfort: 1, materials: 2 },
      grantedAt: '2026-08-01T12:00:00.000Z',
      reasons: ['Питание отмечено — в доме стало чуть больше порядка.'],
    };
    expect(attachCozySaveFeedback(base, rewards, true).cozyFeedback).toEqual(rewards);
    expect(attachCozySaveFeedback(base, rewards, false).cozyFeedback).toBeNull();
    expect(
      attachCozySaveFeedback(
        base,
        { resources: {}, grantedAt: '2026-08-01T12:00:00.000Z' },
        true,
      ).cozyFeedback,
    ).toBeNull();
  });
});
