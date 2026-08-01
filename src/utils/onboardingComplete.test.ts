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

vi.mock('./onboardingDraft', () => ({
  clearOnboardingDraftStorage: vi.fn(),
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
        heroName: 'Гарри',
        startWeight: 95,
        targetWeight: 80,
        height: 175,
        heroGender: 'male',
        themeId: 'darkFantasy',
        companionId: 'raven',
        stepsMinimum: 7000,
        stepsNormal: 11500,
        stepsExcellent: 14000,
        nutritionTrackingMode: 'simple',
        alcoholTrackingEnabled: true,
        sleepTrackingEnabled: true,
        physicalActivityEnabled: true,
      },
      currentSettings: DEFAULT_APP_SETTINGS,
      saveSettings,
      refreshUser,
    });

    expect(dataApi.patchProfile).toHaveBeenCalledWith({
      displayName: 'Гарри',
      heroGender: 'male',
      startWeight: 95,
      targetWeight: 80,
      height: 175,
    });
    expect(saved.onboardingCompleted).toBe(true);
    expect(saved.themeId).toBe('darkFantasy');
    expect(saved.activeCompanionId).toBe('raven');
    expect(saved.defaultStepsNormal).toBe(11500);
    expect(saved.enableSleepTracking).toBe(true);
    expect(refreshUser).toHaveBeenCalled();
  });

  it('allows skipping target weight', async () => {
    const saveSettings = vi.fn().mockImplementation(async (s) => s);
    const refreshUser = vi.fn().mockResolvedValue(true);

    const saved = await completeOnboardingFlow({
      draft: {
        startWeight: 90,
        height: 180,
        heroGender: 'neutral',
        themeId: 'cozy',
      },
      currentSettings: DEFAULT_APP_SETTINGS,
      saveSettings,
      refreshUser,
    });

    expect(dataApi.patchProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'Герой',
        heroGender: 'neutral',
        startWeight: 90,
        targetWeight: null,
      }),
    );
    expect(saved.onboardingCompleted).toBe(true);
    expect(saved.heroGender).toBe('male');
  });

  it('rejects invalid body ranges softly', async () => {
    await expect(
      completeOnboardingFlow({
        draft: { height: 50, startWeight: 90 },
        currentSettings: DEFAULT_APP_SETTINGS,
        saveSettings: vi.fn(),
        refreshUser: vi.fn(),
      }),
    ).rejects.toThrow(/Рост/);
  });
});
