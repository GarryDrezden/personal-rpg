import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { completeOnboardingFlow } from './onboardingComplete';

vi.mock('../utils/themeApply', () => ({
  setStoredThemeId: vi.fn(),
  applyThemeToDocument: vi.fn(),
}));

vi.mock('../game/gameAssetStorage', () => ({
  setActiveCompanionId: vi.fn(),
}));

vi.mock('../api/dataApi', () => ({
  dataApi: {
    patchProfile: vi.fn().mockResolvedValue({}),
  },
}));

import { dataApi } from '../api/dataApi';

describe('completeOnboardingFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('patches profile and saves completed settings', async () => {
    const saveSettings = vi.fn().mockImplementation(async (s) => s);
    const refreshUser = vi.fn().mockResolvedValue(true);

    const saved = await completeOnboardingFlow({
      draft: {
        startWeight: 95,
        targetWeight: 80,
        height: 175,
        heroGender: 'male',
        themeId: 'darkFantasy',
        companionId: 'raven',
        routeMode: 'soft',
        firstFocus: 'nutrition',
      },
      currentSettings: DEFAULT_APP_SETTINGS,
      saveSettings,
      refreshUser,
    });

    expect(dataApi.patchProfile).toHaveBeenCalledWith({
      heroGender: 'male',
      startWeight: 95,
      targetWeight: 80,
      height: 175,
    });
    expect(saved.onboardingCompleted).toBe(true);
    expect(saved.themeId).toBe('darkFantasy');
    expect(saved.activeCompanionId).toBe('raven');
    expect(saved.routeMode).toBe('soft');
    expect(saved.firstFocus).toBe('nutrition');
    expect(refreshUser).toHaveBeenCalled();
  });
});
