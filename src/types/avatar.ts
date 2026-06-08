export type AvatarGender = 'male' | 'female';

export type AvatarMode = 'auto' | 'manual';

export type AvatarStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
