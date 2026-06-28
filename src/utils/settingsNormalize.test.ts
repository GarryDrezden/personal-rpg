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
});
