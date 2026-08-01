import { dataApi } from '../api/dataApi';
import type { AppSettings } from '../types';
import type { OnboardingDraft, OnboardingHeroGender } from '../types/onboarding';
import type { HeroGender } from '../types/gameAssets';
import { setActiveCompanionId } from '../game/gameAssetStorage';
import { setStoredThemeId, applyThemeToDocument } from '../utils/themeApply';
import { resolveThemeId } from '../constants/themes';
import {
  applyFirstFocusDefaults,
  applyRouteModeDefaults,
  validateBodyGoalDraft,
} from './onboardingState';
import {
  applyOnboardingDraftDefaults,
  ONBOARDING_DEFAULT_STEPS,
  resolveHeroDisplayName,
} from './onboardingDefaults';
import { clearOnboardingDraftStorage } from './onboardingDraft';
import { normalizeAppSettings } from './settingsNormalize';

function toAssetHeroGender(gender: OnboardingHeroGender | undefined): HeroGender {
  return gender === 'female' ? 'female' : 'male';
}

function toProfileHeroGender(
  gender: OnboardingHeroGender | undefined,
): 'male' | 'female' | 'neutral' {
  if (gender === 'female' || gender === 'neutral') return gender;
  return 'male';
}

export async function completeOnboardingFlow(params: {
  draft: OnboardingDraft;
  currentSettings: AppSettings;
  saveSettings: (settings: AppSettings) => Promise<AppSettings | void>;
  refreshUser: () => Promise<boolean>;
  seedStartMeasurement?: (weight: number) => Promise<void>;
}): Promise<AppSettings> {
  const {
    draft: rawDraft,
    currentSettings,
    saveSettings,
    refreshUser,
    seedStartMeasurement,
  } = params;

  const draft = applyOnboardingDraftDefaults(rawDraft);
  const bodyCheck = validateBodyGoalDraft(draft);
  if (!bodyCheck.ok) {
    throw new Error(bodyCheck.message ?? 'Проверь данные тела');
  }

  const profileGender = toProfileHeroGender(draft.heroGender);
  const assetGender = toAssetHeroGender(draft.heroGender);
  const themeId = resolveThemeId(draft.themeId ?? currentSettings.themeId);
  const companionId =
    draft.companionId ?? currentSettings.activeCompanionId ?? 'golden_chinchilla_cat';
  const startWeight = draft.startWeight ?? null;
  const targetWeight = draft.targetWeight ?? null;
  const height = draft.height ?? null;
  const displayName = resolveHeroDisplayName(draft.heroName);
  const routeMode = draft.routeMode ?? 'normal';
  const now = new Date().toISOString();

  const sleepEnabled =
    draft.sleepTrackingEnabled ?? draft.resourceTrackingEnabled ?? false;

  await dataApi.patchProfile({
    displayName,
    heroGender: profileGender,
    startWeight,
    targetWeight,
    height,
  });

  setStoredThemeId(themeId);
  applyThemeToDocument(themeId);
  setActiveCompanionId(companionId);

  let nextSettings = normalizeAppSettings({
    ...currentSettings,
    heroGender: assetGender,
    gender: assetGender,
    themeId,
    activeCompanionId: companionId,
    weightGoal: targetWeight ?? currentSettings.weightGoal,
    targetWeight: targetWeight ?? currentSettings.targetWeight,
    defaultStepsMinimum: draft.stepsMinimum ?? ONBOARDING_DEFAULT_STEPS.minimum,
    defaultStepsNormal: draft.stepsNormal ?? ONBOARDING_DEFAULT_STEPS.normal,
    defaultStepsExcellent: draft.stepsExcellent ?? ONBOARDING_DEFAULT_STEPS.excellent,
    defaultStepsGoal: draft.stepsNormal ?? ONBOARDING_DEFAULT_STEPS.normal,
    nutritionTrackingMode: draft.nutritionTrackingMode,
    dailyCalorieLimit:
      draft.nutritionTrackingMode === 'precise'
        ? (draft.dailyCalorieLimit ?? currentSettings.dailyCalorieLimit ?? null)
        : (draft.dailyCalorieLimit ?? currentSettings.dailyCalorieLimit ?? null),
    enableSleepTracking: sleepEnabled,
    enableAlcoholTracking: draft.alcoholTrackingEnabled ?? true,
    enablePhysicalActivityTracking: draft.physicalActivityEnabled ?? true,
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
  clearOnboardingDraftStorage();

  if (startWeight != null && seedStartMeasurement) {
    await seedStartMeasurement(startWeight);
  }

  return saved;
}
