import type { UserProfile } from '../api/authApi';
import type { AppSettings } from '../types';
import type { OnboardingDraft, RouteMode } from '../types/onboarding';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

export const ONBOARDING_STEP_COUNT = 6;

export function isOnboardingCompleted(settings: AppSettings): boolean {
  return settings.onboardingCompleted === true;
}

/** Existing users with basic profile data are treated as already onboarded. */
export function isLegacyProfileComplete(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return Boolean(profile.heroGender && profile.startWeight != null);
}

export function needsOnboarding(
  settings: AppSettings,
  profile: UserProfile | null | undefined,
  options?: { hasProgressData?: boolean },
): boolean {
  if (isOnboardingCompleted(settings)) return false;
  if (isLegacyProfileComplete(profile)) return false;
  if (options?.hasProgressData) return false;
  return true;
}

export function getOnboardingStep(settings: AppSettings): number {
  const step = settings.onboardingStep ?? 0;
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(0, Math.floor(step)), ONBOARDING_STEP_COUNT - 1);
}

export function mergeOnboardingDraft(
  settings: AppSettings,
  draft: OnboardingDraft,
): AppSettings {
  return {
    ...settings,
    onboardingDraft: { ...settings.onboardingDraft, ...draft },
  };
}

export type BodyGoalValidation = {
  ok: boolean;
  message?: string;
};

/** Soft validation for body step — never medical, allows skipping target. */
export function validateBodyGoalDraft(draft: OnboardingDraft): BodyGoalValidation {
  const { height, startWeight, targetWeight } = draft;

  if (height != null && (height < 100 || height > 250)) {
    return { ok: false, message: 'Рост обычно между 100 и 250 см. Можно поправить без спешки.' };
  }
  if (startWeight != null && (startWeight < 40 || startWeight > 300)) {
    return { ok: false, message: 'Стартовый вес обычно между 40 и 300 кг. Проверь цифру без давления.' };
  }
  if (targetWeight != null && (targetWeight < 40 || targetWeight > 300)) {
    return { ok: false, message: 'Целевой вес обычно между 40 и 300 кг. Можно оставить пустым.' };
  }
  if (
    startWeight != null &&
    targetWeight != null &&
    targetWeight >= startWeight
  ) {
    return {
      ok: false,
      message: 'Если цель — снижение веса, целевой обычно меньше стартового. Или пропусти цель.',
    };
  }
  return { ok: true };
}

export function applyRouteModeDefaults(
  settings: AppSettings,
  routeMode: RouteMode,
): AppSettings {
  const baseWeekly =
    settings.defaultWeeklyPointsGoal ?? DEFAULT_APP_SETTINGS.defaultWeeklyPointsGoal;
  const baseSteps =
    settings.defaultStepsNormal ??
    settings.defaultStepsGoal ??
    DEFAULT_APP_SETTINGS.defaultStepsNormal ??
    8000;

  if (routeMode === 'soft') {
    return {
      ...settings,
      routeMode,
      defaultWeeklyPointsGoal: Math.round(baseWeekly * 0.85),
      defaultStepsNormal: Math.round(baseSteps * 0.9),
      defaultStepsGoal: Math.round(baseSteps * 0.9),
    };
  }

  if (routeMode === 'strong') {
    return {
      ...settings,
      routeMode,
      defaultWeeklyPointsGoal: Math.round(baseWeekly * 1.1),
      defaultStepsNormal: Math.round(baseSteps * 1.05),
      defaultStepsGoal: Math.round(baseSteps * 1.05),
    };
  }

  return { ...settings, routeMode: 'normal' };
}

export function applyFirstFocusDefaults(
  settings: AppSettings,
  firstFocus: OnboardingDraft['firstFocus'],
): AppSettings {
  if (!firstFocus) return settings;

  if (firstFocus === 'nutrition') {
    return { ...settings, firstFocus, nutritionTrackingMode: 'simple' };
  }
  if (firstFocus === 'resource') {
    return { ...settings, firstFocus, enableSleepTracking: true };
  }
  return { ...settings, firstFocus };
}
