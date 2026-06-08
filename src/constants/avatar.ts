import type { AppSettings } from '../types';
import type { AvatarSettings, AvatarStage } from '../types/avatar';

export const AVATAR_STAGE_COUNT = 7;

export const AVATAR_STAGE_FILES = [
  '01_stage_heaviest.png',
  '02_stage_very_overweight.png',
  '03_stage_overweight.png',
  '04_stage_mid_progress.png',
  '05_stage_fit.png',
  '06_stage_lean.png',
  '07_stage_athletic.png',
] as const;

export const AVATAR_STAGE_LABELS: Record<AvatarStage, string> = {
  1: 'Старт пути',
  2: 'Первые изменения',
  3: 'Тело просыпается',
  4: 'Середина пути',
  5: 'Форма возвращается',
  6: 'Почти герой',
  7: 'Новая версия',
};

export const DEFAULT_AVATAR_SETTINGS: AvatarSettings = {
  gender: 'male',
  mode: 'auto',
  manualStage: 1,
  stageThresholdsKg: {
    1: 0,
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 40,
    7: 50,
  },
};

const STAGES: AvatarStage[] = [1, 2, 3, 4, 5, 6, 7];

export function resolveAvatarSettings(settings: AppSettings): AvatarSettings {
  const merged: AvatarSettings = {
    ...DEFAULT_AVATAR_SETTINGS,
    ...settings.avatarSettings,
    stageThresholdsKg: {
      ...DEFAULT_AVATAR_SETTINGS.stageThresholdsKg,
      ...settings.avatarSettings?.stageThresholdsKg,
    },
  };

  if (!settings.avatarSettings?.gender) {
    merged.gender = settings.gender;
  }

  for (const stage of STAGES) {
    const value = merged.stageThresholdsKg[stage];
    if (typeof value !== 'number' || Number.isNaN(value)) {
      merged.stageThresholdsKg[stage] = DEFAULT_AVATAR_SETTINGS.stageThresholdsKg[stage];
    }
  }

  merged.stageThresholdsKg[1] = 0;

  const manual = merged.manualStage;
  if (manual < 1 || manual > 7) {
    merged.manualStage = 1;
  }

  return merged;
}
