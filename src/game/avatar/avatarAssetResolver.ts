import {
  DEFAULT_AVATAR_TRACK_ID,
  getAvatarAssetManifestEntry,
  getAvatarGenderPlaceholderPath,
  getCanonicalAvatarStagePath,
  padAvatarStage,
} from '../../constants/avatarAssetManifest';
import type {
  AvatarAssetGender,
  AvatarAssetSource,
  AvatarAssetStatus,
  AvatarTrackId,
  ResolveAvatarStageAssetParams,
  ResolvedAvatarStageAsset,
} from '../../types/avatarAssets';
import type { AppThemeId } from '../../types/theme';
import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { gameAsset } from '../assetBase';

function draftAssetsEnabled(): boolean {
  if (typeof import.meta === 'undefined') return false;
  if (import.meta.env?.DEV) return true;
  return import.meta.env?.VITE_ENABLE_DRAFT_AVATAR_ASSETS === 'true';
}

export function clampAvatarBodyStage(
  stage: number | null | undefined,
): HeroStageNumber {
  if (stage == null || Number.isNaN(Number(stage))) return 1;
  const n = Math.round(Number(stage));
  return Math.min(HERO_STAGE_COUNT, Math.max(1, n)) as HeroStageNumber;
}

export function resolveAvatarAssetGender(
  gender: AvatarAssetGender | null | undefined,
): AvatarAssetGender {
  if (gender === 'male' || gender === 'female' || gender === 'neutral') {
    return gender;
  }
  return 'neutral';
}

function toVersioned(relativePath: string): string {
  return gameAsset(relativePath);
}

function unique(paths: string[]): string[] {
  const seen = new Set<string>();
  return paths.filter((p) => {
    if (!p || seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}

function assertSameThemePath(themeId: AppThemeId, relativePath: string): boolean {
  if (themeId === 'cozy') {
    // Cozy may only use cozy theme folder — never DF legacy heroes/.
    if (relativePath.startsWith('heroes/')) return false;
    if (relativePath.includes('dark-fantasy') || relativePath.includes('darkFantasy')) {
      return false;
    }
    return relativePath.startsWith('themes/cozy/');
  }
  // Dark Fantasy: theme folder OR legacy heroes/* (same franchise branch)
  if (relativePath.startsWith('themes/cozy/')) return false;
  return (
    relativePath.startsWith('themes/dark-fantasy/') ||
    relativePath.startsWith('heroes/')
  );
}

function filterSameTheme(themeId: AppThemeId, paths: string[]): string[] {
  return paths.filter((p) => {
    const relative = p
      .replace(/^\/game-assets\//, '')
      .replace(/\?v=.*$/, '');
    return assertSameThemePath(themeId, relative);
  });
}

function statusToSource(status: AvatarAssetStatus): AvatarAssetSource {
  if (status === 'approved') return 'approved';
  if (status === 'draft') return 'draft';
  return 'placeholder';
}

function canUseEntry(
  status: AvatarAssetStatus,
  allowDraft: boolean,
): boolean {
  if (status === 'approved') return true;
  if (status === 'draft') return allowDraft;
  return false;
}

/**
 * Unified avatar body asset resolver.
 * Body path depends on theme + gender + bodyStage (+ track).
 * Hero State must never change the returned body path.
 */
export function getResolvedAvatarStageAsset(
  params: ResolveAvatarStageAssetParams,
): ResolvedAvatarStageAsset {
  const themeId = params.themeId;
  const trackId: AvatarTrackId = params.trackId ?? DEFAULT_AVATAR_TRACK_ID;
  const requestedStage = clampAvatarBodyStage(params.bodyStage);
  const gender = resolveAvatarAssetGender(params.gender);
  const allowDraft = params.allowDraft ?? draftAssetsEnabled();
  const allowNearest = params.allowNearestStageFallback === true;

  const genderPlaceholderRel = getAvatarGenderPlaceholderPath(
    themeId,
    gender === 'neutral' ? 'neutral' : gender,
  );
  const neutralPlaceholderRel = getAvatarGenderPlaceholderPath(themeId, 'neutral');

  // Neutral / missing gender → placeholders only (no male↔female swap).
  if (gender === 'neutral') {
    const path = toVersioned(genderPlaceholderRel);
    return {
      path,
      fallbackCandidates: unique([toVersioned(neutralPlaceholderRel)]).filter(
        (p) => p !== path,
      ),
      source: 'placeholder',
      usedFallback: true,
      requestedStage,
      resolvedStage: requestedStage,
      themeId,
      gender,
      trackId,
      status: 'placeholder',
      debugLabel: import.meta.env?.DEV
        ? `Missing avatar: ${themeId} / neutral / stage ${padAvatarStage(requestedStage)}`
        : null,
      bodyStage: requestedStage,
      heroStateIndependent: true,
    };
  }

  const heroGender: HeroGender = gender;

  const entry = getAvatarAssetManifestEntry({
    themeId,
    gender: heroGender,
    bodyStage: requestedStage,
    trackId,
  });

  const candidatesRel: string[] = [];
  let source: AvatarAssetSource = 'placeholder';
  let status: AvatarAssetStatus = entry?.status ?? 'missing';
  let resolvedStage = requestedStage;
  let usedFallback = true;

  if (entry && canUseEntry(entry.status, allowDraft)) {
    candidatesRel.push(entry.path);
    for (const legacy of entry.legacyPaths ?? []) {
      if (assertSameThemePath(themeId, legacy)) {
        candidatesRel.push(legacy);
      }
    }
    source = statusToSource(entry.status);
    status = entry.status;
    usedFallback = false;
  } else if (allowNearest) {
    // Dev-only nearest same-theme stage (explicit opt-in).
    const nearest = findNearestUsableStage({
      themeId,
      gender: heroGender,
      trackId,
      requestedStage,
      allowDraft,
    });
    if (nearest) {
      candidatesRel.push(nearest.path);
      for (const legacy of nearest.legacyPaths ?? []) {
        if (assertSameThemePath(themeId, legacy)) {
          candidatesRel.push(legacy);
        }
      }
      source = statusToSource(nearest.status);
      status = nearest.status;
      resolvedStage = nearest.bodyStage;
      usedFallback = nearest.bodyStage !== requestedStage;
    }
  }

  // Always append same-theme placeholders (never opposite theme / opposite gender).
  candidatesRel.push(genderPlaceholderRel, neutralPlaceholderRel);

  // Also keep canonical path as first attempt when status is placeholder so
  // progressive drops of stage-XX.webp light up without manifest edits.
  if (source === 'placeholder') {
    const canonical = getCanonicalAvatarStagePath(
      themeId,
      heroGender,
      requestedStage,
      trackId,
    );
    candidatesRel.unshift(canonical);
    // Cozy: do not inject DF legacy. DF: when placeholder status but legacy exists,
    // still allow legacy via entry above; if entry was placeholder-only, skip.
  }

  const versioned = unique(
    filterSameTheme(
      themeId,
      candidatesRel.map((p) => toVersioned(p)),
    ),
  );

  // If first candidate is a placeholder file, mark usedFallback.
  const primary = versioned[0] ?? toVersioned(neutralPlaceholderRel);
  const primaryIsPlaceholder =
    primary.includes('/placeholders/') || source === 'placeholder';

  return {
    path: primary,
    fallbackCandidates: versioned.slice(1),
    source: primaryIsPlaceholder && source !== 'approved' && source !== 'draft'
      ? 'placeholder'
      : source,
    usedFallback: usedFallback || primaryIsPlaceholder,
    requestedStage,
    resolvedStage,
    themeId,
    gender,
    trackId,
    status: primaryIsPlaceholder ? 'placeholder' : status,
    debugLabel: import.meta.env?.DEV
      ? `${primaryIsPlaceholder ? 'Missing avatar' : 'Avatar'}: ${themeId} / ${gender} / stage ${padAvatarStage(requestedStage)}`
      : null,
    bodyStage: requestedStage,
    heroStateIndependent: true,
  };
}

function findNearestUsableStage(params: {
  themeId: AppThemeId;
  gender: HeroGender;
  trackId: AvatarTrackId;
  requestedStage: HeroStageNumber;
  allowDraft: boolean;
}) {
  for (let delta = 1; delta < HERO_STAGE_COUNT; delta += 1) {
    for (const sign of [-1, 1] as const) {
      const stage = params.requestedStage + sign * delta;
      if (stage < 1 || stage > HERO_STAGE_COUNT) continue;
      const entry = getAvatarAssetManifestEntry({
        themeId: params.themeId,
        gender: params.gender,
        bodyStage: stage,
        trackId: params.trackId,
      });
      if (entry && canUseEntry(entry.status, params.allowDraft)) {
        return entry;
      }
    }
  }
  return null;
}

/** Candidate list for GameAssetImage (same-theme only). */
export function getAvatarStageAssetCandidates(params: {
  themeId: AppThemeId;
  gender: AvatarAssetGender | null | undefined;
  bodyStage: number | null | undefined;
  trackId?: AvatarTrackId | null;
  allowDraft?: boolean;
  allowNearestStageFallback?: boolean;
}): string[] {
  const resolved = getResolvedAvatarStageAsset(params);
  return unique([resolved.path, ...resolved.fallbackCandidates]);
}

/**
 * Assert Hero State does not affect body asset path.
 * Used by tests / QA.
 */
export function assertHeroStateDoesNotChangeBodyAsset(
  base: ResolveAvatarStageAssetParams,
): boolean {
  const a = getResolvedAvatarStageAsset({ ...base, heroState: 'depleted' });
  const b = getResolvedAvatarStageAsset({ ...base, heroState: 'strong' });
  return a.path === b.path && a.resolvedStage === b.resolvedStage;
}
