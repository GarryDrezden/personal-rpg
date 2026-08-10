import type {
  AvatarAssetManifestEntry,
  AvatarAssetStatus,
  AvatarTrackId,
} from '../types/avatarAssets';
import type { AppThemeId } from '../types/theme';
import type { HeroGender, HeroStageNumber } from '../types/gameAssets';
import {
  AVATAR_VISUAL_STAGES,
  type AvatarVisualStage,
  isAvatarVisualStage,
} from '../game/avatar/avatarVisualStage';

export const AVATAR_STAGE_PAD_WIDTH = 2;
export const AVATAR_CANVAS_WIDTH = 1536;
export const AVATAR_CANVAS_HEIGHT = 2048;
export const DEFAULT_AVATAR_TRACK_ID: AvatarTrackId = 'default';

export const AVATAR_ASSET_GENDERS: HeroGender[] = ['male', 'female'];
export const AVATAR_ASSET_THEMES: AppThemeId[] = ['cozy', 'darkFantasy'];

/** @deprecated Prefer AVATAR_VISUAL_STAGES — same five production anchors. */
export const COZY_MALE_APPROVED_STAGES: ReadonlySet<number> = new Set(
  AVATAR_VISUAL_STAGES,
);

export function padAvatarStage(stage: number): string {
  return String(stage).padStart(AVATAR_STAGE_PAD_WIDTH, '0');
}

export function themeFolderId(themeId: AppThemeId): 'cozy' | 'dark-fantasy' {
  return themeId === 'cozy' ? 'cozy' : 'dark-fantasy';
}

/** Canonical runtime path for a visual anchor (relative to /game-assets/). */
export function getCanonicalAvatarStagePath(
  themeId: AppThemeId,
  gender: HeroGender,
  visualStage: number,
  trackId: AvatarTrackId = 'default',
): string {
  const n = padAvatarStage(visualStage);
  const theme = themeFolderId(themeId);
  if (trackId !== 'default') {
    return `themes/${theme}/avatars/${gender}/tracks/${trackId}/stage-${n}.webp`;
  }
  return `themes/${theme}/avatars/${gender}/stage-${n}.webp`;
}

export function getAvatarGenderPlaceholderPath(
  themeId: AppThemeId,
  gender: 'male' | 'female' | 'neutral',
): string {
  const theme = themeFolderId(themeId);
  return `themes/${theme}/avatars/placeholders/${gender}.svg`;
}

export function getAvatarHeroStateOverlayPath(
  themeId: AppThemeId,
  heroState: string,
): string {
  const theme = themeFolderId(themeId);
  return `themes/${theme}/avatars/hero-state/${heroState}-overlay.svg`;
}

function darkFantasyLegacyPaths(gender: HeroGender, visualStage: number): string[] {
  const n = padAvatarStage(visualStage);
  return [
    `heroes/${gender}/variants/dark-fantasy/stage-${n}.webp`,
    `heroes/${gender}/stage-${n}.webp`,
    `heroes/${gender}/variants/dark-fantasy/stage-${n}.png`,
    `heroes/${gender}/stage-${n}.png`,
  ];
}

function initialStatus(
  themeId: AppThemeId,
  gender: HeroGender,
  visualStage: AvatarVisualStage,
): AvatarAssetStatus {
  // Male visual anchors approved for both themes (canonical theme folders).
  if (gender === 'male' && isAvatarVisualStage(visualStage)) {
    if (themeId === 'darkFantasy') return 'approved';
    if (themeId === 'cozy') return 'approved';
  }
  // Cozy female visual anchors from progression sheet (100→90→75→62→50).
  if (gender === 'female' && themeId === 'cozy' && isAvatarVisualStage(visualStage)) {
    return 'approved';
  }
  return 'placeholder';
}

function buildNotes(
  themeId: AppThemeId,
  gender: HeroGender,
  status: AvatarAssetStatus,
  visualStage: AvatarVisualStage,
): string {
  if (status === 'approved' && themeId === 'cozy' && gender === 'male') {
    return `Cozy male visual anchor ${padAvatarStage(visualStage)} — approved`;
  }
  if (status === 'approved' && themeId === 'darkFantasy' && gender === 'male') {
    return `Dark Fantasy male visual anchor ${padAvatarStage(visualStage)} — approved (themes/dark-fantasy/avatars/male)`;
  }
  if (status === 'approved' && themeId === 'cozy' && gender === 'female') {
    return `Cozy female visual anchor ${padAvatarStage(visualStage)} — approved (progression sheet slice)`;
  }
  if (gender === 'female') {
    return `Awaiting ${themeId} female visual anchor ${padAvatarStage(visualStage)} — same-theme placeholder`;
  }
  return `Awaiting visual anchor ${padAvatarStage(visualStage)}`;
}

/**
 * Production manifest: one entry per theme × gender × visual anchor (5).
 * Intermediate body stages 02–04, 06–09, … are not separate assets.
 */
function buildDefaultTrackManifest(): AvatarAssetManifestEntry[] {
  const entries: AvatarAssetManifestEntry[] = [];

  for (const themeId of AVATAR_ASSET_THEMES) {
    for (const gender of AVATAR_ASSET_GENDERS) {
      for (const visualStage of AVATAR_VISUAL_STAGES) {
        const bodyStage = visualStage as HeroStageNumber;
        const path = getCanonicalAvatarStagePath(themeId, gender, visualStage);
        const status = initialStatus(themeId, gender, visualStage);
        entries.push({
          themeId,
          gender,
          bodyStage,
          trackId: 'default',
          path,
          status,
          legacyPaths:
            themeId === 'darkFantasy'
              ? darkFantasyLegacyPaths(gender, visualStage)
              : [],
          sourceId: null,
          version: null,
          notes: buildNotes(themeId, gender, status, visualStage),
          approvedAt:
            status === 'approved'
              ? themeId === 'cozy' || (themeId === 'darkFantasy' && gender === 'male')
                ? '2026-08-07'
                : '2026-07-01'
              : null,
        });
      }
    }
  }

  return entries;
}

export const AVATAR_ASSET_MANIFEST: AvatarAssetManifestEntry[] =
  buildDefaultTrackManifest();

/** Expected production entry count: 2 themes × 2 genders × 5 visual anchors. */
export const AVATAR_ASSET_MANIFEST_EXPECTED_COUNT =
  AVATAR_ASSET_THEMES.length *
  AVATAR_ASSET_GENDERS.length *
  AVATAR_VISUAL_STAGES.length;

export function getAvatarAssetManifestEntry(params: {
  themeId: AppThemeId;
  gender: HeroGender;
  /** Prefer visual stage; body stages are mapped by the resolver before lookup. */
  bodyStage: number;
  trackId?: AvatarTrackId;
}): AvatarAssetManifestEntry | null {
  const trackId = params.trackId ?? 'default';
  if (!isAvatarVisualStage(params.bodyStage)) {
    return null;
  }
  const stage = params.bodyStage as HeroStageNumber;

  return (
    AVATAR_ASSET_MANIFEST.find(
      (e) =>
        e.themeId === params.themeId &&
        e.gender === params.gender &&
        e.bodyStage === stage &&
        e.trackId === trackId,
    ) ?? null
  );
}

export function findAvatarManifestDuplicates(
  manifest: AvatarAssetManifestEntry[] = AVATAR_ASSET_MANIFEST,
): string[] {
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  for (const e of manifest) {
    const key = `${e.themeId}|${e.gender}|${e.trackId}|${e.bodyStage}`;
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count === 2) dupes.push(key);
  }
  return dupes;
}

/** Production filenames are the five visual anchors only. */
export function isValidAvatarStageFileName(name: string): boolean {
  return /^stage-(01|05|10|15|20)\.webp$/i.test(name);
}

export function isValidAvatarVisualStageFileName(name: string): boolean {
  return isValidAvatarStageFileName(name);
}
