import type { UserProfile } from '../api/authApi';
import type { AppSettings } from '../types';
import type { OnboardingDraft, RouteMode } from '../types/onboarding';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

export const ONBOARDING_STEP_COUNT = 5;

export function isOnboardingCompleted(settings: AppSettings): boolean {
  return settings.onboardingCompleted === true;
}

/** Existing users with profile data are treated as already onboarded. */
export function isLegacyProfileComplete(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false;
  return Boolean(profile.heroGender && profile.startWeight != null && profile.targetWeight != null);
}

export function needsOnboarding(
  settings: AppSettings,
  profile: UserProfile | null | undefined,
): boolean {
  if (isOnboardingCompleted(settings)) return false;
  if (isLegacyProfileComplete(profile)) return false;
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
