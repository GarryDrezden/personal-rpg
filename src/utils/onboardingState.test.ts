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
} from './onboardingState';

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
    expect(isLegacyProfileComplete(profile({ heroGender: 'male', startWeight: 80, targetWeight: 70 }))).toBe(
      true,
    );
  });

  it('clamps onboarding step', () => {
    expect(getOnboardingStep({ ...DEFAULT_APP_SETTINGS, onboardingStep: 99 })).toBe(4);
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
});
