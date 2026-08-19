import { describe, expect, it } from 'vitest';
import { normalizeAppSettings } from './settingsNormalize';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

describe('normalizeAppSettings', () => {
  it('uses weightGoal when targetWeight is missing', () => {
    const normalized = normalizeAppSettings({
      ...DEFAULT_APP_SETTINGS,
      targetWeight: undefined,
    });
    expect(normalized.weightGoal).toBe(100);
    expect(normalized.targetWeight).toBe(100);
  });

  it('preserves client fields when merging API response', () => {
    const prev = {
      ...DEFAULT_APP_SETTINGS,
      activeCompanionId: 'raven' as const,
      heroGender: 'female' as const,
    };
    const normalized = normalizeAppSettings(
      {
        ...DEFAULT_APP_SETTINGS,
        activeCompanionId: undefined,
        heroGender: undefined,
        weightGoal: 100,
      },
      prev,
    );
    expect(normalized.activeCompanionId).toBe('raven');
    expect(normalized.heroGender).toBe('female');
  });

  it('maps detailed nutrition mode from API payloads', () => {
    const normalized = normalizeAppSettings({
      ...DEFAULT_APP_SETTINGS,
      nutritionTrackingMode: 'detailed' as never,
      dailyCalorieLimit: 2800,
    });
    expect(normalized.nutritionTrackingMode).toBe('precise');
    expect(normalized.dailyCalorieLimit).toBe(2800);
  });

  it('maps unknown theme ids to cozy', () => {
    const normalized = normalizeAppSettings({
      ...DEFAULT_APP_SETTINGS,
      themeId: 'light' as never,
    });
    expect(normalized.themeId).toBe('cozy');
  });

  it('fills cozyHome lastDailyGrantDate safely for corrupt saves', () => {
    const normalized = normalizeAppSettings({
      ...DEFAULT_APP_SETTINGS,
      cozyHome: {
        resources: { comfort: 1, materials: 0, garden: 0, clarity: 0 },
        zones: {} as never,
        totalUpgrades: 0,
        lastDailyGrantDate: 'not-a-date',
        lastUpgrade: { zoneId: 'spaceship' as never, level: 9, title: 'x', at: '' },
      },
    });
    expect(normalized.cozyHome?.lastDailyGrantDate).toBeNull();
    expect(normalized.cozyHome?.lastUpgrade).toBeNull();
    expect(normalized.cozyHome?.zones.porch.level).toBe(0);
  });
});
