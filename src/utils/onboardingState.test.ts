import { describe, expect, it } from 'vitest';
import type { UserProfile } from '../api/authApi';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { AppSettings } from '../types';
import {
  applyRouteModeDefaults,
  getOnboardingStep,
  isLegacyProfileComplete,
  isOnboardingCompleted,
  mergeOnboardingDraft,
  needsOnboarding,
  validateBodyGoalDraft,
  ONBOARDING_STEP_COUNT,
} from './onboardingState';
import { shouldTreatAsOnboarded } from './onboardingCompletion';
import { ONBOARDING_DEFAULT_STEPS } from './onboardingDefaults';

function profile(partial: Partial<UserProfile>): UserProfile {
  return {
    id: '1',
    userId: '1',
    displayName: null,
    heroGender: null,
    startWeight: null,
    targetWeight: null,
    height: null,
    createdAt: '',
    updatedAt: '',
    ...partial,
  };
}

describe('onboardingState', () => {
  it('treats onboardingCompleted as done', () => {
    expect(isOnboardingCompleted({ ...DEFAULT_APP_SETTINGS, onboardingCompleted: true })).toBe(
      true,
    );
    expect(needsOnboarding({ ...DEFAULT_APP_SETTINGS, onboardingCompleted: true }, null)).toBe(
      false,
    );
  });

  it('shows onboarding for new users without profile data', () => {
    expect(needsOnboarding(DEFAULT_APP_SETTINGS, profile({}))).toBe(true);
  });

  it('skips onboarding for legacy complete profiles', () => {
    expect(
      needsOnboarding(
        DEFAULT_APP_SETTINGS,
        profile({ heroGender: 'female', startWeight: 90, targetWeight: 75 }),
      ),
    ).toBe(false);
    expect(
      isLegacyProfileComplete(profile({ heroGender: 'male', startWeight: 80 })),
    ).toBe(true);
  });

  it('skips onboarding when user already has progress data', () => {
    expect(
      needsOnboarding(DEFAULT_APP_SETTINGS, profile({}), { hasProgressData: true }),
    ).toBe(false);
    expect(
      shouldTreatAsOnboarded(DEFAULT_APP_SETTINGS, profile({}), { hasProgressData: true }),
    ).toBe(true);
  });

  it('clamps onboarding step', () => {
    expect(getOnboardingStep({ ...DEFAULT_APP_SETTINGS, onboardingStep: 99 })).toBe(
      ONBOARDING_STEP_COUNT - 1,
    );
    expect(getOnboardingStep({ ...DEFAULT_APP_SETTINGS, onboardingStep: -2 })).toBe(0);
  });

  it('merges onboarding draft into settings', () => {
    const merged = mergeOnboardingDraft(DEFAULT_APP_SETTINGS, { startWeight: 90 });
    expect(merged.onboardingDraft?.startWeight).toBe(90);
  });

  it('applies soft route defaults', () => {
    const base: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      defaultWeeklyPointsGoal: 500,
      defaultStepsNormal: 8000,
    };
    const soft = applyRouteModeDefaults(base, 'soft');
    expect(soft.defaultWeeklyPointsGoal).toBe(425);
    expect(soft.defaultStepsNormal).toBe(7200);
  });

  it('soft-validates body goal', () => {
    expect(validateBodyGoalDraft({ height: 175, startWeight: 90 }).ok).toBe(true);
    expect(validateBodyGoalDraft({ height: 50 }).ok).toBe(false);
    expect(
      validateBodyGoalDraft({ startWeight: 90, targetWeight: 95 }).message,
    ).toMatch(/меньше/);
  });

  it('exposes step defaults', () => {
    expect(ONBOARDING_DEFAULT_STEPS.minimum).toBe(7000);
    expect(ONBOARDING_DEFAULT_STEPS.normal).toBe(11500);
    expect(ONBOARDING_DEFAULT_STEPS.excellent).toBe(14000);
  });
});
