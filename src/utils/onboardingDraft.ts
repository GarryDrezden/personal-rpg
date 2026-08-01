import type { OnboardingDraft } from '../types/onboarding';
import { resolveThemeId } from '../constants/themes';

export const ONBOARDING_DRAFT_STORAGE_KEY = 'personal-rpg-onboarding-draft';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readOnboardingDraftFromStorage(): OnboardingDraft | null {
  const ls = storage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const draft: OnboardingDraft = {};
    if (typeof parsed.heroName === 'string') draft.heroName = parsed.heroName;
    if (typeof parsed.startWeight === 'number') draft.startWeight = parsed.startWeight;
    if (typeof parsed.targetWeight === 'number') draft.targetWeight = parsed.targetWeight;
    if (typeof parsed.height === 'number') draft.height = parsed.height;
    if (
      parsed.heroGender === 'male' ||
      parsed.heroGender === 'female' ||
      parsed.heroGender === 'neutral'
    ) {
      draft.heroGender = parsed.heroGender;
    }
    if (typeof parsed.themeId === 'string') {
      draft.themeId = resolveThemeId(parsed.themeId);
    }
    if (typeof parsed.companionId === 'string') {
      draft.companionId = parsed.companionId as OnboardingDraft['companionId'];
    }
    if (typeof parsed.stepsMinimum === 'number') draft.stepsMinimum = parsed.stepsMinimum;
    if (typeof parsed.stepsNormal === 'number') draft.stepsNormal = parsed.stepsNormal;
    if (typeof parsed.stepsExcellent === 'number') draft.stepsExcellent = parsed.stepsExcellent;
    if (
      parsed.nutritionTrackingMode === 'disabled' ||
      parsed.nutritionTrackingMode === 'simple' ||
      parsed.nutritionTrackingMode === 'precise'
    ) {
      draft.nutritionTrackingMode = parsed.nutritionTrackingMode;
    }
    if (parsed.dailyCalorieLimit === null || typeof parsed.dailyCalorieLimit === 'number') {
      draft.dailyCalorieLimit = parsed.dailyCalorieLimit;
    }
    if (typeof parsed.alcoholTrackingEnabled === 'boolean') {
      draft.alcoholTrackingEnabled = parsed.alcoholTrackingEnabled;
    }
    if (typeof parsed.sleepTrackingEnabled === 'boolean') {
      draft.sleepTrackingEnabled = parsed.sleepTrackingEnabled;
    }
    if (typeof parsed.resourceTrackingEnabled === 'boolean') {
      draft.resourceTrackingEnabled = parsed.resourceTrackingEnabled;
    }
    if (typeof parsed.physicalActivityEnabled === 'boolean') {
      draft.physicalActivityEnabled = parsed.physicalActivityEnabled;
    }
    if (parsed.routeMode === 'soft' || parsed.routeMode === 'normal' || parsed.routeMode === 'strong') {
      draft.routeMode = parsed.routeMode;
    }
    if (
      parsed.firstFocus === 'nutrition' ||
      parsed.firstFocus === 'movement' ||
      parsed.firstFocus === 'resource' ||
      parsed.firstFocus === 'clarity' ||
      parsed.firstFocus === 'minimal'
    ) {
      draft.firstFocus = parsed.firstFocus;
    }
    return draft;
  } catch {
    return null;
  }
}

export function writeOnboardingDraftToStorage(draft: OnboardingDraft): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.setItem(ONBOARDING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // quota / private mode — ignore
  }
}

export function clearOnboardingDraftStorage(): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}
