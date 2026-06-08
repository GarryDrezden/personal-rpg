import type { CharacterGender } from '../types';

export const WEIGHT_STAGE_COUNT = 7;

export const STAGE_LABELS = ['Старт', '', '', '', '', '', 'Цель'] as const;

export function getWeightStageImages(gender: CharacterGender): string[] {
  return Array.from(
    { length: WEIGHT_STAGE_COUNT },
    (_, i) => `/images/weight/${gender}/stage-${i + 1}.png`,
  );
}

export function getWeightStageImage(stage: number, gender: CharacterGender): string {
  const images = getWeightStageImages(gender);
  return images[Math.min(WEIGHT_STAGE_COUNT - 1, Math.max(0, stage))];
}
