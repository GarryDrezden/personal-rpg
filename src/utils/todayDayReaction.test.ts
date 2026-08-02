import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import { attachCozySaveFeedback, getTodaySaveReaction } from './todayDayReaction';

function entry(partial: Partial<DailyEntry>): DailyEntry {
  return { ...emptyDaily('2026-07-02'), ...partial };
}

const darkSettings = { ...DEFAULT_APP_SETTINGS, themeId: 'darkFantasy' as const };
const cozySettings = { ...DEFAULT_APP_SETTINGS, themeId: 'cozy' as const };

describe('getTodaySaveReaction', () => {
  it('returns dark fantasy minimal day reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: darkSettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'darkFantasy',
    });
    expect(reaction.headline).toBe('Маршрут удержан.');
  });

  it('returns cozy minimal day reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'minimal' }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 10,
      themeId: 'cozy',
    });
    expect(reaction.headline).toBe('Минимальный день тоже удержал дом живым.');
  });

  it('returns dark fantasy recovery reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'recovery' }),
      settings: darkSettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'darkFantasy',
    });
    expect(reaction.headline).toBe('Ядро стабилизируется.');
  });

  it('returns cozy recovery reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ dayMode: 'recovery' }),
      settings: cozySettings,
      questDone: 1,
      questTotal: 5,
      points: 20,
      themeId: 'cozy',
    });
    expect(reaction.headline).toBe('Дом не требует рывка.');
    expect(reaction.detail).toMatch(/сон|пауз|восстановление/i);
  });

  it('returns dark fantasy movement reaction when steps marked', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ steps: 6000 }),
      settings: darkSettings,
      questDone: 0,
      questTotal: 5,
      points: 30,
      themeId: 'darkFantasy',
    });
    expect(reaction.headline).toBe('Движение зафиксировано.');
  });

  it('returns cozy steps reaction', () => {
    const reaction = getTodaySaveReaction({
      entry: entry({ steps: 6000 }),
      settings: cozySettings,
      questDone: 0,
      questTotal: 5,
      points: 30,
      themeId: 'cozy',
    });
    expect(reaction.headline).toBe('Маршрут дня отмечен.');
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
