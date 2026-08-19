import type { AppSettings } from '../types';

/**
 * Settings fields edited locally on Settings until explicit Save.
 * Autosave islands (theme, sidebar, sleep, body map, progression flags) are NOT listed.
 */
export const SETTINGS_DRAFT_OWNED_KEYS = [
  'weightGoal',
  'targetWeight',
  'heroGender',
  'gender',
  'transformationMode',
  'activeCompanionId',
  'avatarSettings',
  'nutritionTrackingMode',
  'dailyCalorieLimit',
  'defaultCaloriesLimit',
  'defaultStepsMinimum',
  'defaultStepsNormal',
  'defaultStepsGoal',
  'defaultStepsExcellent',
  'defaultGymTarget',
  'defaultWeeklyPointsGoal',
  'weeklySettings',
  'coinSettings',
  'pointSettings',
  'habitConfig',
] as const satisfies ReadonlyArray<keyof AppSettings>;

export type SettingsDraftOwnedKey = (typeof SETTINGS_DRAFT_OWNED_KEYS)[number];

export function isSettingsDraftOwnedKey(key: string): key is SettingsDraftOwnedKey {
  return (SETTINGS_DRAFT_OWNED_KEYS as readonly string[]).includes(key);
}

export function dirtyKeysFromPatch(patch: Partial<AppSettings>): SettingsDraftOwnedKey[] {
  return (Object.keys(patch) as string[]).filter(isSettingsDraftOwnedKey);
}

/**
 * Overlay dirty draft-owned fields onto the latest persisted settings.
 * Used both for incoming store sync and for explicit Save.
 */
export function mergePersistedIntoDraft(params: {
  persisted: AppSettings;
  draft: AppSettings;
  dirtyKeys: ReadonlySet<string>;
}): AppSettings {
  const next: AppSettings = { ...params.persisted };
  for (const key of SETTINGS_DRAFT_OWNED_KEYS) {
    if (!params.dirtyKeys.has(key)) continue;
    (next as unknown as Record<string, unknown>)[key] = params.draft[key];
  }
  return next;
}

export function addDirtyKeys(
  current: ReadonlySet<string>,
  keys: readonly SettingsDraftOwnedKey[],
): Set<string> {
  if (keys.length === 0) return new Set(current);
  const next = new Set(current);
  for (const key of keys) next.add(key);
  return next;
}
