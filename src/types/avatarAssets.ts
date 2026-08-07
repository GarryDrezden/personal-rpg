import type { AppThemeId } from './theme';
import type { HeroGender, HeroStageNumber } from './gameAssets';
import type { HeroStateLevel } from './avatarStages';

/** Future-ready progression tracks (v1 runtime uses `default` only). */
export type AvatarTrackId =
  | 'default'
  | 'small_goal'
  | 'medium_goal'
  | 'large_goal'
  | 'very_large_goal';

export type AvatarAssetGender = HeroGender | 'neutral';

export type AvatarAssetStatus =
  | 'missing'
  | 'placeholder'
  | 'draft'
  | 'approved'
  | 'deprecated';

export type AvatarAssetSource = 'approved' | 'draft' | 'placeholder';

/** Production art anchors — Body Stage stays 1–20. */
export type AvatarVisualStage = 1 | 5 | 10 | 15 | 20;

export type AvatarAssetManifestEntry = {
  themeId: AppThemeId;
  gender: HeroGender;
  bodyStage: HeroStageNumber;
  /** Future goal-band track; v1 always `default`. */
  trackId: AvatarTrackId;
  /**
   * Canonical theme-scoped relative path under /game-assets/
   * e.g. themes/cozy/avatars/male/stage-01.webp
   */
  path: string;
  status: AvatarAssetStatus;
  /**
   * Same-theme legacy paths (Dark Fantasy migration).
   * Never points at the opposite theme.
   */
  legacyPaths?: string[];
  sourceId?: string | null;
  version?: string | null;
  notes?: string | null;
  approvedAt?: string | null;
};

export type ResolvedAvatarStageAsset = {
  path: string;
  fallbackCandidates: string[];
  source: AvatarAssetSource;
  /**
   * True only when same-theme placeholder SVG is used because the visual anchor
   * art is missing/unapproved — never true merely because Body Stage mapped to
   * a Visual Stage (e.g. body 7 → visual 5).
   */
  usedFallback: boolean;
  /** Requested Body Stage (1–20). */
  requestedStage: HeroStageNumber;
  /** Visual stage used for the asset file (alias of visualStage). */
  resolvedStage: HeroStageNumber;
  /** Production art key: 1 | 5 | 10 | 15 | 20 */
  visualStage: AvatarVisualStage;
  themeId: AppThemeId;
  gender: AvatarAssetGender;
  trackId: AvatarTrackId;
  status: AvatarAssetStatus;
  /** Dev-only human label; never show raw path in production UI. */
  debugLabel: string | null;
  /** Hero State never changes this body path — exposed for QA assertions. */
  bodyStage: HeroStageNumber;
  heroStateIndependent: true;
};

export type ResolveAvatarStageAssetParams = {
  themeId: AppThemeId;
  gender: AvatarAssetGender | null | undefined;
  bodyStage: number | null | undefined;
  trackId?: AvatarTrackId | null;
  /** Prefer draft entries (dev / VITE_ENABLE_DRAFT_AVATAR_ASSETS). */
  allowDraft?: boolean;
  /**
   * Dev preview only: allow nearest same-theme stage art.
   * Production default must stay false (placeholder instead).
   */
  allowNearestStageFallback?: boolean;
  /** Unused for body path — kept to assert independence. */
  heroState?: HeroStateLevel | null;
};
