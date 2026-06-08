import type { CharacterGender } from '../types';
import type { AvatarStage } from '../types/avatar';
import { getAvatarImagePath } from './avatarEngine';

export const WEIGHT_STAGE_COUNT = 7;

export const STAGE_LABELS = ['Старт', '', '', '', '', '', 'Цель'] as const;

/** @deprecated Use getAvatarImagePath from avatarEngine */
export function getWeightStageImages(gender: CharacterGender): string[] {
  return Array.from({ length: WEIGHT_STAGE_COUNT }, (_, i) =>
    getAvatarImagePath(gender, (i + 1) as AvatarStage),
  );
}

export function getWeightStageImage(stage: number, gender: CharacterGender): string {
  const clamped = Math.min(WEIGHT_STAGE_COUNT, Math.max(1, stage + 1)) as AvatarStage;
  return getAvatarImagePath(gender, clamped);
}

export function getActiveWeightStageImages(
  gender: CharacterGender,
  startImage: number,
  count: number,
): string[] {
  return getWeightStageImages(gender).slice(startImage, startImage + count);
}
