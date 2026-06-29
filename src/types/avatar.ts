import type { HeroStageNumber } from '../types/gameAssets';

export type AvatarGender = 'male' | 'female';

export type AvatarMode = 'auto' | 'manual';

/** Same 20 stages as hero progression (game-assets). */
export type AvatarStage = HeroStageNumber;

export type AvatarSettings = {
  gender: AvatarGender;
  mode: AvatarMode;
  manualStage: AvatarStage;
  stageThresholdsKg: Record<AvatarStage, number>;
};

export type AvatarState = {
  stage: AvatarStage;
  gender: AvatarGender;
  imagePath: string;
  weightLossKg: number;
  hasWeightData: boolean;
  stageLabel: string;
};
