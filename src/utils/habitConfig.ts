import type { AppSettings } from '../types';
import type { BuiltinHabitId, HabitConfig } from '../types/habits';
import { BUILTIN_HABIT_IDS } from '../constants/builtinHabits';

export const DEFAULT_HABIT_CONFIG: HabitConfig = {
  hiddenBuiltinIds: [],
  builtinOverrides: {},
  customHabits: [],
};

export function resolveHabitConfig(settings: AppSettings): HabitConfig {
  const raw = settings.habitConfig;
  if (!raw) return { ...DEFAULT_HABIT_CONFIG };

  const hiddenBuiltinIds = (raw.hiddenBuiltinIds ?? []).filter((id): id is BuiltinHabitId =>
    BUILTIN_HABIT_IDS.includes(id as BuiltinHabitId),
  );

  return {
    hiddenBuiltinIds,
    builtinOverrides: raw.builtinOverrides ?? {},
    customHabits: (raw.customHabits ?? []).filter((h) => h.id && h.title.trim()),
  };
}

export function isCustomQuestId(id: string, settings: AppSettings): boolean {
  const config = resolveHabitConfig(settings);
  return config.customHabits.some((h) => h.id === id);
}

export function isBuiltinHabitId(id: string): id is BuiltinHabitId {
  return BUILTIN_HABIT_IDS.includes(id as BuiltinHabitId);
}
