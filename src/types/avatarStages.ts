import type { HeroStageNumber } from './gameAssets';
import type { AppThemeId } from './theme';

/** Shared stage id across themes (1–20). */
export type AvatarStageId = HeroStageNumber;

export type AvatarStageSignalId =
  | 'weight'
  | 'waist'
  | 'abilities'
  | 'steps'
  | 'nutrition'
  | 'lifestyle'
  | 'campaign';

export type AvatarStageSignal = {
  id: AvatarStageSignalId;
  /** 0–1 normalized contribution before weight. */
  ratio: number;
  /** Points contributed to avatarProgress (0–100 scale). */
  points: number;
  maxPoints: number;
  label: string;
  detail: string;
};

export type AvatarStageDriver = {
  id: AvatarStageSignalId;
  label: string;
  detail: string;
  /** Positive delta narrative for Freedom UI. */
  why: string;
};

export type AvatarStageSnapshot = {
  /** Composite visual progress 0–100 (not a medical score). */
  avatarProgress: number;
  stage: AvatarStageId;
  chapter: 1 | 2 | 3 | 4 | 5;
  signals: AvatarStageSignal[];
  /** Top reasons the stage moved / is held. */
  drivers: AvatarStageDriver[];
  /** Weight-only implied stage for comparison (diagnostics). */
  weightOnlyStage: AvatarStageId;
  weightOnlyProgress: number;
  /** True when non-weight signals lift stage above weight-only. */
  advancedBeyondWeight: boolean;
  disclaimer: string;
};

export type AvatarStageAssetRef = {
  stage: AvatarStageId;
  themeId: AppThemeId;
  gender: 'male' | 'female';
  /** Preferred art path for this theme + stage. */
  path: string;
  /** Theme-local placeholder when art is missing. */
  placeholderPath: string;
};
