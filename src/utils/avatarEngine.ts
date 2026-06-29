import type { AppSettings, MeasurementEntry } from '../types';
import type { AvatarGender, AvatarSettings, AvatarStage, AvatarState } from '../types/avatar';
import {
  AVATAR_STAGE_COUNT,
  AVATAR_STAGE_LABELS,
  getAvatarStageFileName,
  resolveAvatarSettings,
} from '../constants/avatar';
import { sortMeasurementsByDate } from './measurements';

/** v1.0: новые PNG в public/avatars/{gender}/ */
export function getAvatarImagePath(gender: AvatarGender, stage: AvatarStage): string {
  return `/avatars/${gender}/${getAvatarStageFileName(stage)}`;
}

/** Legacy: public/images/weight/{gender}/stage-N.png (до v1.0) */
export function getLegacyAvatarImagePath(gender: AvatarGender, stage: AvatarStage): string {
  return `/images/weight/${gender}/stage-${stage}.png`;
}

/** Сначала новый путь, затем legacy — пока нет финальных PNG v1.0 */
export function getAvatarImageCandidates(
  gender: AvatarGender,
  stage: AvatarStage,
): string[] {
  return [getAvatarImagePath(gender, stage), getLegacyAvatarImagePath(gender, stage)];
}

export function getWeightLossFromMeasurements(measurements: MeasurementEntry[]): {
  weightLossKg: number;
  hasWeightData: boolean;
  startWeight: number | null;
  currentWeight: number | null;
} {
  const withWeight = sortMeasurementsByDate(measurements).filter(
    (m) => m.weight !== null && m.weight > 0,
  );

  if (withWeight.length === 0) {
    return {
      weightLossKg: 0,
      hasWeightData: false,
      startWeight: null,
      currentWeight: null,
    };
  }

  const startWeight = withWeight[0]!.weight!;
  const currentWeight = withWeight[withWeight.length - 1]!.weight!;
  const weightLossKg = Math.max(0, startWeight - currentWeight);

  return {
    weightLossKg,
    hasWeightData: true,
    startWeight,
    currentWeight,
  };
}

export function calcAutoAvatarStage(
  weightLossKg: number,
  thresholds: AvatarSettings['stageThresholdsKg'],
): AvatarStage {
  let stage: AvatarStage = 1;

  for (let s = 1; s <= AVATAR_STAGE_COUNT; s++) {
    const key = s as AvatarStage;
    if (weightLossKg >= thresholds[key]) {
      stage = key;
    }
  }

  return stage;
}

export function getAvatarStage(
  avatarSettings: AvatarSettings,
  weightLossKg: number,
): AvatarStage {
  if (avatarSettings.mode === 'manual') {
    return avatarSettings.manualStage;
  }
  return calcAutoAvatarStage(weightLossKg, avatarSettings.stageThresholdsKg);
}

export function getAvatarState(params: {
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): AvatarState {
  const { measurements, settings } = params;
  const avatarSettings = resolveAvatarSettings(settings);
  const { weightLossKg, hasWeightData } = getWeightLossFromMeasurements(measurements);
  const stage = getAvatarStage(avatarSettings, weightLossKg);

  return {
    stage,
    gender: avatarSettings.gender,
    imagePath: getAvatarImagePath(avatarSettings.gender, stage),
    weightLossKg,
    hasWeightData,
    stageLabel: AVATAR_STAGE_LABELS[stage],
  };
}
