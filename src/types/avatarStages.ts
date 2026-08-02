import type { HeroStageNumber } from './gameAssets';
import type { AppThemeId } from './theme';

/** Shared body silhouette stage id across themes (1–20). */
export type AvatarStageId = HeroStageNumber;

/** Visual energy / posture layer — not body volume. */
export type HeroStateLevel = 'depleted' | 'steady' | 'energized' | 'strong';

export type AvatarStageLayer = 'body' | 'hero';

export type AvatarStageSignalId =
  | 'weight'
  | 'waist'
  | 'measurements'
  | 'abilities'
  | 'steps'
  | 'nutrition'
  | 'lifestyle'
  | 'momentum'
  | 'campaign';

export type AvatarStageSignal = {
  id: AvatarStageSignalId;
  layer: AvatarStageLayer;
  /** 0–1 normalized contribution within its layer. */
  ratio: number;
  /** Points contributed inside its layer (0–100 scale). */
  points: number;
  maxPoints: number;
  label: string;
  detail: string;
};

export type AvatarStageDriver = {
  id: AvatarStageSignalId;
  layer: AvatarStageLayer;
  label: string;
  detail: string;
  /** Positive delta narrative for Freedom UI. */
  why: string;
};

export type AvatarStageSnapshot = {
  /** Body silhouette progress 0–100 (weight + measurements). */
  bodyProgress: number;
  /** Hero energy / posture progress 0–100 (habits, abilities, campaign). */
  heroStateProgress: number;
  /** Silhouette stage 1–20 — selects body art. */
  bodyStage: AvatarStageId;
  /** Visual state band for posture / energy chrome. */
  heroState: HeroStateLevel;
  /**
   * Soft UI journey blend (body + hero). Not used for body assets.
   * Prefer bodyStage / heroState in Dashboard copy.
   */
  avatarProgress: number;
  /** Alias of bodyStage for asset selection and legacy call sites. */
  stage: AvatarStageId;
  chapter: 1 | 2 | 3 | 4 | 5;
  bodySignals: AvatarStageSignal[];
  heroSignals: AvatarStageSignal[];
  bodyDrivers: AvatarStageDriver[];
  heroDrivers: AvatarStageDriver[];
  /** All signals (body then hero). */
  signals: AvatarStageSignal[];
  /** Top drivers across both layers (legacy / compact). */
  drivers: AvatarStageDriver[];
  /** Weight-path stage for diagnostics (best weight vs target). */
  weightOnlyStage: AvatarStageId;
  weightOnlyProgress: number;
  /** True when waist/measurements lift bodyStage above weight-only path. */
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
