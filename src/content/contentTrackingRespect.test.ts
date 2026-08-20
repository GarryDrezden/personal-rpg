import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { emptyDaily } from '../store/appStore';
import { resolveDailyMobForEntry } from '../utils/todayMobContext';
import { resolveTodayReactionContext } from '../utils/todayDayReaction';
import { getEligibleDailyMobs, isAlcoholFlavorObstacle, isFoodObstacle } from './obstacles';
import { pickTodayReaction } from './todayReactions';

describe('content tracking respect', () => {
  it('never selects food obstacles when nutrition tracking is disabled', () => {
    const settings = { ...DEFAULT_APP_SETTINGS, nutritionTrackingMode: 'disabled' as const };
    const entry = emptyDaily('2026-07-15');
    entry.journal = true;
    entry.energyLevel = 3;
    const eligible = getEligibleDailyMobs(entry, settings);
    expect(eligible.some(isFoodObstacle)).toBe(false);
    expect(isFoodObstacle(resolveDailyMobForEntry(entry, settings))).toBe(false);
  });

  it('never selects alcohol-flavored obstacles when alcohol tracking is off', () => {
    const settings = { ...DEFAULT_APP_SETTINGS, enableAlcoholTracking: false };
    const entry = emptyDaily('2026-07-16');
    entry.journal = true;
    const eligible = getEligibleDailyMobs(entry, settings);
    expect(eligible.some(isAlcoholFlavorObstacle)).toBe(false);
    expect(isAlcoholFlavorObstacle(resolveDailyMobForEntry(entry, settings))).toBe(false);
  });

  it('does not pick sofa_magnet on an active good-sleep day', () => {
    const entry = emptyDaily('2026-07-17');
    entry.steps = 8000;
    entry.energyLevel = 4;
    entry.sleepQuality = 'good';
    entry.journal = true;
    expect(resolveDailyMobForEntry(entry, DEFAULT_APP_SETTINGS)).not.toBe('sofa_magnet');
  });

  it('does not pick alcohol_free Today context when alcohol tracking is off', () => {
    const entry = emptyDaily('2026-07-18');
    entry.alcohol = 'none';
    entry.journal = true;
    const ctx = resolveTodayReactionContext({
      entry,
      settings: { ...DEFAULT_APP_SETTINGS, enableAlcoholTracking: false },
      questDone: 0,
      questTotal: 5,
      points: 10,
    });
    expect(ctx).not.toBe('alcohol_free');
  });

  it('does not pick physical Today context when PA tracking is off', () => {
    const entry = emptyDaily('2026-07-19');
    entry.physicalActivityLevel = 'heavy';
    entry.physicalActivityDuration = '3_6h';
    entry.journal = true;
    const ctx = resolveTodayReactionContext({
      entry,
      settings: { ...DEFAULT_APP_SETTINGS, enablePhysicalActivityTracking: false },
      questDone: 1,
      questTotal: 5,
      points: 20,
    });
    expect(ctx).not.toBe('physical');
    expect(ctx).not.toBe('heavy_physical');
  });

  it('same saved day keeps the same Today reaction', () => {
    const a = pickTodayReaction({ themeId: 'cozy', context: 'recovery', date: '2026-07-02' });
    const b = pickTodayReaction({ themeId: 'cozy', context: 'recovery', date: '2026-07-02' });
    expect(a.id).toBe(b.id);
  });
});
