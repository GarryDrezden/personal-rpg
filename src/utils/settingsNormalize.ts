import { DEFAULT_APP_SETTINGS, DEFAULT_WEIGHT_GOAL_KG } from '../constants/defaults';
import type { AppSettings } from '../types';

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
    heroGender: settings.heroGender ?? fallback.heroGender,
    transformationMode: settings.transformationMode ?? fallback.transformationMode,
    activeCompanionId: settings.activeCompanionId ?? fallback.activeCompanionId,
    enableSleepTracking:
      settings.enableSleepTracking ?? fallback.enableSleepTracking ?? false,
  };
}
