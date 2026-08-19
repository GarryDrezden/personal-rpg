import { DEFAULT_APP_SETTINGS, DEFAULT_WEIGHT_GOAL_KG } from '../constants/defaults';
import type { AppSettings } from '../types';
import { resolveThemeId } from '../constants/themes';
import { normalizeBodyAbilityState } from '../game/bodyAbilities/bodyAbilityV1Engine';
import { normalizePlateauState } from '../game/plateau/plateauEngine';
import { normalizeNutritionTrackingMode } from './nutritionEngine';
import { normalizeCozyHomeState } from './cozyHomeEngine';
import { normalizeThemeSidebarSettings } from './sidebarVisibility';
import { DEFAULT_THEME_SIDEBAR_SETTINGS } from '../constants/sidebarVisibility';

/** Синхронизирует weightGoal / targetWeight после загрузки или сохранения через API. */
export function normalizeAppSettings(
  settings: AppSettings,
  fallback: AppSettings = DEFAULT_APP_SETTINGS,
): AppSettings {
  const weightGoal =
    settings.weightGoal ??
    settings.targetWeight ??
    fallback.weightGoal ??
    fallback.targetWeight ??
    DEFAULT_WEIGHT_GOAL_KG;

  const targetWeight =
    settings.targetWeight ?? settings.weightGoal ?? fallback.targetWeight ?? weightGoal;

  return {
    ...fallback,
    ...settings,
    weightGoal,
    targetWeight,
    gender: settings.gender ?? fallback.gender ?? 'male',
    themeId: resolveThemeId(settings.themeId ?? fallback.themeId),
    heroGender: settings.heroGender ?? fallback.heroGender,
    transformationMode: settings.transformationMode ?? fallback.transformationMode,
    activeCompanionId: settings.activeCompanionId ?? fallback.activeCompanionId,
    enableSleepTracking:
      settings.enableSleepTracking ?? fallback.enableSleepTracking ?? false,
    enableAlcoholTracking:
      settings.enableAlcoholTracking ?? fallback.enableAlcoholTracking ?? true,
    enablePhysicalActivityTracking:
      settings.enablePhysicalActivityTracking ??
      fallback.enablePhysicalActivityTracking ??
      true,
    onboardingCompleted: settings.onboardingCompleted ?? fallback.onboardingCompleted,
    onboardingCompletedAt: settings.onboardingCompletedAt ?? fallback.onboardingCompletedAt,
    onboardingStep: settings.onboardingStep ?? fallback.onboardingStep,
    onboardingDraft: settings.onboardingDraft ?? fallback.onboardingDraft,
    routeMode: settings.routeMode ?? fallback.routeMode,
    firstFocus: settings.firstFocus ?? fallback.firstFocus,
    startDate: settings.startDate ?? fallback.startDate,
    nutritionTrackingMode: normalizeNutritionTrackingMode(
      settings.nutritionTrackingMode ?? fallback.nutritionTrackingMode,
    ),
    dailyCalorieLimit:
      settings.dailyCalorieLimit !== undefined
        ? settings.dailyCalorieLimit
        : (fallback.dailyCalorieLimit ?? null),
    bodyAbilityState: normalizeBodyAbilityState(
      settings.bodyAbilityState ?? fallback.bodyAbilityState,
    ),
    plateauState: normalizePlateauState(settings.plateauState ?? fallback.plateauState),
    cozyHome: normalizeCozyHomeState(settings.cozyHome ?? fallback.cozyHome),
    sidebarVisibility: normalizeThemeSidebarSettings(
      settings.sidebarVisibility ?? fallback.sidebarVisibility ?? DEFAULT_THEME_SIDEBAR_SETTINGS,
    ),
  };
}
