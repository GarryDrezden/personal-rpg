import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import { attachCozySaveFeedback, getTodaySaveReaction } from './todayDayReaction';
import { getTodayReactionPool } from '../content/todayReactions';

function entry(partial: Partial<DailyEntry>): DailyEntry {
  return { ...emptyDaily('2026-07-02'), ...partial };
}

const darkSettings = { ...DEFAULT_APP_SETTINGS, themeId: 'darkFantasy' as const };
const cozySettings = { ...DEFAULT_APP_SETTINGS, themeId: 'cozy' as const };

function headlines(theme: 'cozy' | 'darkFantasy', context: 'minimal' | 'recovery' | 'steps') {
  return getTodayReactionPool(theme, context).map((item) => item.headline);
}

describe('getTodaySaveReaction', () => {
  it('returns a dark fantasy minimal day reaction from the pool', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: darkSettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'darkFantasy',
    });
    expect(headlines('darkFantasy', 'minimal')).toContain(reaction.headline);
    expect(reaction.contextId).toBe('minimal');
  });

  it('returns a cozy minimal day reaction from the pool', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'cozy',
    });
    expect(headlines('cozy', 'minimal')).toContain(reaction.headline);
  });

  it('returns a dark fantasy recovery reaction from the pool', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'recovery' }),
      settings: darkSettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'darkFantasy',
    });
    expect(headlines('darkFantasy', 'recovery')).toContain(reaction.headline);
  });

  it('returns a cozy recovery reaction from the pool', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'recovery' }),
      settings: cozySettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'cozy',
    });
    expect(headlines('cozy', 'recovery')).toContain(reaction.headline);
    expect(reaction.detail).toMatch(/сон|пауз|восстановление|бережн|уход|рывка/i);
  });

  it('returns a movement reaction when steps are marked', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ steps: 6000 }),
      settings: darkSettings,
      questDone: 0,
      questTotal: 5,
      points: 30,
      themeId: 'darkFantasy',
      meta: { loggedDayCount: 12, daysAway: 0 },
    });
    expect(headlines('darkFantasy', 'steps')).toContain(reaction.headline);
  });

  it('returns a cozy steps reaction from the pool', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ steps: 6000 }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 30,
      themeId: 'cozy',
      meta: { loggedDayCount: 12, daysAway: 0 },
    });
    expect(headlines('cozy', 'steps')).toContain(reaction.headline);
  });

  it('is stable for the same saved day', () => {
    const a = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'cozy',
    });
    const b = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'cozy',
    });
    expect(a.headline).toBe(b.headline);
    expect(a.variantId).toBe(b.variantId);
  });

  it('uses first-day copy for a new user', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ journal: true }),
      settings: cozySettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'cozy',
      meta: { loggedDayCount: 1, daysAway: Number.POSITIVE_INFINITY },
    });
    expect(reaction.contextId).toBe('first_day');
  });

  it('uses return copy after a gap of three or more days', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ journal: true }),
      settings: cozySettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'cozy',
      meta: { loggedDayCount: 12, daysAway: 5 },
    });
    expect(reaction.contextId).toBe('return');
  });

  it('attaches cozy feedback only on first grant with resources', () => {
    const base = getTodaySaveReaction({
      entry: entry({ steps: 1000 }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'cozy',
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
