import type { AppSettings } from '../types';
import type { UserProfile } from '../api/authApi';
import { isOnboardingCompleted, needsOnboarding } from './onboardingState';

/**
 * Soft migration marker: legacy users with profile/progress should not be forced
 * into onboarding. Caller may persist `onboardingCompleted` when convenient.
 */
export function shouldTreatAsOnboarded(
  settings: AppSettings,
  profile: UserProfile | null | undefined,
  options?: { hasProgressData?: boolean },
): boolean {
  return !needsOnboarding(settings, profile, options);
}

export function withOnboardingCompletedFlag(
  settings: AppSettings,
  completedAt: string = new Date().toISOString(),
): AppSettings {
  if (isOnboardingCompleted(settings)) return settings;
  return {
    ...settings,
    onboardingCompleted: true,
    onboardingCompletedAt: settings.onboardingCompletedAt ?? completedAt,
    onboardingStep: undefined,
    onboardingDraft: undefined,
  };
}
