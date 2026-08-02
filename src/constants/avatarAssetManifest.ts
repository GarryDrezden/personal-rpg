import type {
  AvatarAssetManifestEntry,
  AvatarAssetStatus,
  AvatarTrackId,
} from '../types/avatarAssets';
import type { AppThemeId } from '../types/theme';
import type { HeroGender, HeroStageNumber } from '../types/gameAssets';
import { HERO_STAGE_COUNT } from '../types/gameAssets';

export const AVATAR_STAGE_PAD_WIDTH = 2;
export const AVATAR_CANVAS_WIDTH = 1536;
export const AVATAR_CANVAS_HEIGHT = 2048;
export const DEFAULT_AVATAR_TRACK_ID: AvatarTrackId = 'default';

export const AVATAR_ASSET_GENDERS: HeroGender[] = ['male', 'female'];
export const AVATAR_ASSET_THEMES: AppThemeId[] = ['cozy', 'darkFantasy'];

export function padAvatarStage(stage: number): string {
  return String(stage).padStart(AVATAR_STAGE_PAD_WIDTH, '0');
}

export function themeFolderId(themeId: AppThemeId): 'cozy' | 'dark-fantasy' {
  return themeId === 'cozy' ? 'cozy' : 'dark-fantasy';
}

/** Canonical runtime path (relative to /game-assets/). */
export function getCanonicalAvatarStagePath(
  themeId: AppThemeId,
  gender: HeroGender,
  bodyStage: number,
  trackId: AvatarTrackId = 'default',
): string {
  const n = padAvatarStage(bodyStage);
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

function darkFantasyLegacyPaths(gender: HeroGender, stage: number): string[] {
  const n = padAvatarStage(stage);
  return [
    `heroes/${gender}/variants/dark-fantasy/stage-${n}.webp`,
    `heroes/${gender}/stage-${n}.webp`,
    `heroes/${gender}/variants/dark-fantasy/stage-${n}.png`,
    `heroes/${gender}/stage-${n}.png`,
  ];
}

function initialStatus(themeId: AppThemeId, gender: HeroGender): AvatarAssetStatus {
  // Cozy body art not shipped yet — placeholders.
  // Dark Fantasy male ships via legacy paths (migration TODO).
  // Female DF set not on disk yet → same-theme placeholder until approved drop.
  if (themeId === 'darkFantasy' && gender === 'male') return 'approved';
  return 'placeholder';
}

function buildDefaultTrackManifest(): AvatarAssetManifestEntry[] {
  const entries: AvatarAssetManifestEntry[] = [];

  for (const themeId of AVATAR_ASSET_THEMES) {
    for (const gender of AVATAR_ASSET_GENDERS) {
      for (let stage = 1; stage <= HERO_STAGE_COUNT; stage += 1) {
        const bodyStage = stage as HeroStageNumber;
        const path = getCanonicalAvatarStagePath(themeId, gender, bodyStage);
        const status = initialStatus(themeId, gender);
        entries.push({
          themeId,
          gender,
          bodyStage,
          trackId: 'default',
          path,
          status,
          legacyPaths:
            themeId === 'darkFantasy'
              ? darkFantasyLegacyPaths(gender, bodyStage)
              : [],
          sourceId: null,
          version: null,
          notes:
            status === 'approved'
              ? 'TODO migration: copy approved DF art into theme-scoped avatars/ path'
              : themeId === 'darkFantasy'
                ? 'Awaiting Dark Fantasy female set — same-theme placeholder'
                : 'Awaiting Cozy avatar set — same-theme placeholder until approved',
          approvedAt: status === 'approved' ? '2026-07-01' : null,
        });
      }
    }
  }

  return entries;
}

export const AVATAR_ASSET_MANIFEST: AvatarAssetManifestEntry[] =
  buildDefaultTrackManifest();

export function getAvatarAssetManifestEntry(params: {
  themeId: AppThemeId;
  gender: HeroGender;
  bodyStage: number;
  trackId?: AvatarTrackId;
}): AvatarAssetManifestEntry | null {
  const trackId = params.trackId ?? 'default';
  const stage = Math.min(
    HERO_STAGE_COUNT,
    Math.max(1, Math.round(params.bodyStage)),
  ) as HeroStageNumber;

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

export function isValidAvatarStageFileName(name: string): boolean {
  return /^stage-(0[1-9]|1[0-9]|20)\.webp$/i.test(name);
}
