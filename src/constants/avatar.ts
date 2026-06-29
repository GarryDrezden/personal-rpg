import type { AppSettings } from '../types';
import type { AvatarSettings, AvatarStage } from '../types/avatar';
import { HERO_STAGE_COUNT } from '../types/gameAssets';
import { HERO_STAGE_TITLES } from './heroStages';

export const AVATAR_STAGE_COUNT = HERO_STAGE_COUNT;

/** Max kg lost at stage 20 in default thresholds (user can edit in settings). */
export const DEFAULT_AVATAR_STAGE_MAX_KG = 50;

export const AVATAR_STAGES = Array.from(
  { length: AVATAR_STAGE_COUNT },
  (_, i) => (i + 1) as AvatarStage,
);

export function getAvatarStageFileName(stage: AvatarStage): string {
  return `stage-${String(stage).padStart(2, '0')}.png`;
}

export const AVATAR_STAGE_LABELS = Object.fromEntries(
  HERO_STAGE_TITLES.map((row) => [row.stage, row.title]),
) as Record<AvatarStage, string>;

export function buildDefaultAvatarStageThresholdsKg(
  maxKg = DEFAULT_AVATAR_STAGE_MAX_KG,
): Record<AvatarStage, number> {
  const thresholds = {} as Record<AvatarStage, number>;
  for (const row of HERO_STAGE_TITLES) {
    const stage = row.stage as AvatarStage;
    thresholds[stage] =
      stage === 1 ? 0 : Math.round((row.progressPercent / 100) * maxKg);
  }
  return thresholds;
}

export const DEFAULT_AVATAR_SETTINGS: AvatarSettings = {
  gender: 'male',
  mode: 'auto',
  manualStage: 1,
  stageThresholdsKg: buildDefaultAvatarStageThresholdsKg(),
};

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

  for (const stage of AVATAR_STAGES) {
    const value = merged.stageThresholdsKg[stage];
    if (typeof value !== 'number' || Number.isNaN(value)) {
      merged.stageThresholdsKg[stage] = DEFAULT_AVATAR_SETTINGS.stageThresholdsKg[stage];
    }
  }

  merged.stageThresholdsKg[1] = 0;

  if (merged.manualStage < 1 || merged.manualStage > AVATAR_STAGE_COUNT) {
    merged.manualStage = 1;
  }

  return merged;
}
