import { DEFAULT_STEPS_THRESHOLDS } from '../constants/steps';
import type { OnboardingDraft } from '../types/onboarding';

export const ONBOARDING_DEFAULT_STEPS = {
  minimum: DEFAULT_STEPS_THRESHOLDS.minimum,
  normal: DEFAULT_STEPS_THRESHOLDS.normal,
  excellent: DEFAULT_STEPS_THRESHOLDS.excellent,
} as const;

export const ONBOARDING_DEFAULT_HERO_NAME = 'Герой';

export function applyOnboardingDraftDefaults(draft: OnboardingDraft): OnboardingDraft {
  return {
    ...draft,
    stepsMinimum: draft.stepsMinimum ?? ONBOARDING_DEFAULT_STEPS.minimum,
    stepsNormal: draft.stepsNormal ?? ONBOARDING_DEFAULT_STEPS.normal,
    stepsExcellent: draft.stepsExcellent ?? ONBOARDING_DEFAULT_STEPS.excellent,
    nutritionTrackingMode: draft.nutritionTrackingMode ?? 'simple',
    alcoholTrackingEnabled: draft.alcoholTrackingEnabled ?? true,
    sleepTrackingEnabled: draft.sleepTrackingEnabled ?? false,
    resourceTrackingEnabled:
      draft.resourceTrackingEnabled ?? draft.sleepTrackingEnabled ?? false,
    physicalActivityEnabled: draft.physicalActivityEnabled ?? true,
  };
}

export function resolveHeroDisplayName(heroName?: string | null): string {
  const trimmed = heroName?.trim();
  return trimmed ? trimmed : ONBOARDING_DEFAULT_HERO_NAME;
}
