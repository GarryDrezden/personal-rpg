import { dataApi } from '../api/dataApi';
import type { AppSettings } from '../types';
import type { OnboardingDraft } from '../types/onboarding';
import type { HeroGender } from '../types/gameAssets';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import { setStoredThemeId, applyThemeToDocument } from '../utils/themeApply';
import { resolveThemeId } from '../constants/themes';
import {
  applyFirstFocusDefaults,
  applyRouteModeDefaults,
} from './onboardingState';
import { normalizeAppSettings } from './settingsNormalize';

export async function completeOnboardingFlow(params: {
  draft: OnboardingDraft;
  currentSettings: AppSettings;
  saveSettings: (settings: AppSettings) => Promise<AppSettings | void>;
  refreshUser: () => Promise<boolean>;
  seedStartMeasurement?: (weight: number) => Promise<void>;
}): Promise<AppSettings> {
  const {
    draft,
    currentSettings,
    saveSettings,
    refreshUser,
    seedStartMeasurement,
  } = params;

  const heroGender = (draft.heroGender ?? 'male') as HeroGender;
  const themeId = resolveThemeId(draft.themeId ?? currentSettings.themeId);
  const companionId = draft.companionId ?? currentSettings.activeCompanionId ?? 'golden_chinchilla_cat';
  const startWeight = draft.startWeight ?? null;
  const targetWeight = draft.targetWeight ?? null;
  const height = draft.height ?? null;
  const routeMode = draft.routeMode ?? 'normal';
  const now = new Date().toISOString();

  if (startWeight != null && targetWeight != null && targetWeight >= startWeight) {
    throw new Error('Целевой вес должен быть меньше стартового');
  }

  await dataApi.patchProfile({
    heroGender,
    startWeight,
    targetWeight,
    height,
  });

  setStoredThemeId(themeId);
  applyThemeToDocument(themeId);
  setActiveCompanionId(companionId);

  let nextSettings = normalizeAppSettings({
    ...currentSettings,
    heroGender,
    gender: heroGender,
    themeId,
    activeCompanionId: companionId,
    weightGoal: targetWeight ?? currentSettings.weightGoal,
    targetWeight: targetWeight ?? currentSettings.targetWeight,
    onboardingCompleted: true,
    onboardingCompletedAt: now,
    startDate: currentSettings.startDate ?? now.slice(0, 10),
    onboardingStep: undefined,
    onboardingDraft: undefined,
  });

  nextSettings = applyRouteModeDefaults(nextSettings, routeMode);
  nextSettings = applyFirstFocusDefaults(nextSettings, draft.firstFocus);

  const saved = (await saveSettings(nextSettings)) ?? nextSettings;
  await refreshUser();

  if (startWeight != null && seedStartMeasurement) {
    await seedStartMeasurement(startWeight);
  }

  return saved;
}
