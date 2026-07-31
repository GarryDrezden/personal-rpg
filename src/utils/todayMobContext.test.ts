import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';
import { resolveDailyMobForEntry } from './todayMobContext';

function entry(partial: Partial<DailyEntry>): DailyEntry {
  return { ...emptyDaily('2026-07-02'), ...partial };
}

describe('resolveDailyMobForEntry', () => {
  it('picks empty_day for minimal mode', () => {
    expect(resolveDailyMobForEntry(entry({ dayMode: 'minimal' }), DEFAULT_APP_SETTINGS)).toBe(
      'empty_day',
    );
  });

  it('picks fog for recovery mode', () => {
    expect(resolveDailyMobForEntry(entry({ dayMode: 'recovery' }), DEFAULT_APP_SETTINGS)).toBe(
      'fog_of_fatigue',
    );
  });

  it('picks sofa_magnet when no steps on a marked day', () => {
    expect(
      resolveDailyMobForEntry(
        entry({ steps: 0, dayMode: 'normal', energyLevel: 4, journal: true }),
        DEFAULT_APP_SETTINGS,
      ),
    ).toBe('sofa_magnet');
  });

  it('does not pick sofa_magnet when medium physical activity holds movement', () => {
    const mob = resolveDailyMobForEntry(
      entry({
        steps: 0,
        dayMode: 'normal',
        energyLevel: 4,
        journal: true,
        physicalActivityLevel: 'medium',
        physicalActivityDuration: '3_6h',
      }),
      DEFAULT_APP_SETTINGS,
    );
    expect(mob).not.toBe('sofa_magnet');
  });

  it('picks fog after heavy physical activity with low energy', () => {
    expect(
      resolveDailyMobForEntry(
        entry({
          steps: 2000,
          dayMode: 'normal',
          energyLevel: 2,
          physicalActivityLevel: 'heavy',
          physicalActivityDuration: '6h_plus',
          journal: true,
        }),
        DEFAULT_APP_SETTINGS,
      ),
    ).toBe('fog_of_fatigue');
  });
});