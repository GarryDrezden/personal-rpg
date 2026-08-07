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
import { gameAsset } from '../assetBase';
import {
  AVATAR_VISUAL_STAGES,
  clampAvatarBodyStage,
  getAvatarVisualStage,
  type AvatarVisualStage,
} from './avatarVisualStage';

export { clampAvatarBodyStage } from './avatarVisualStage';

function draftAssetsEnabled(): boolean {
  if (typeof import.meta === 'undefined') return false;
  if (import.meta.env?.DEV) return true;
  return import.meta.env?.VITE_ENABLE_DRAFT_AVATAR_ASSETS === 'true';
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
    if (relativePath.startsWith('heroes/')) return false;
    if (relativePath.includes('dark-fantasy') || relativePath.includes('darkFantasy')) {
      return false;
    }
    return relativePath.startsWith('themes/cozy/');
  }
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

function canUseEntry(status: AvatarAssetStatus, allowDraft: boolean): boolean {
  if (status === 'approved') return true;
  if (status === 'draft') return allowDraft;
  return false;
}

/**
 * Unified avatar body asset resolver.
 *
 * Body Stage (1–20) → Avatar Visual Stage (1|5|10|15|20) → theme/gender/track asset.
 * Mapping is canonical production presentation — not nearest-stage fallback.
 * Hero State must never change the returned body path.
 */
export function getResolvedAvatarStageAsset(
  params: ResolveAvatarStageAssetParams,
): ResolvedAvatarStageAsset {
  const themeId = params.themeId;
  const trackId: AvatarTrackId = params.trackId ?? DEFAULT_AVATAR_TRACK_ID;
  const requestedStage = clampAvatarBodyStage(params.bodyStage);
  const visualStage: AvatarVisualStage = getAvatarVisualStage(requestedStage);
  const gender = resolveAvatarAssetGender(params.gender);
  const allowDraft = params.allowDraft ?? draftAssetsEnabled();
  // Dev/legacy only — production uses canonical visual mapping, not nearest search.
  const allowNearest = params.allowNearestStageFallback === true;

  const genderPlaceholderRel = getAvatarGenderPlaceholderPath(
    themeId,
    gender === 'neutral' ? 'neutral' : gender,
  );
  const neutralPlaceholderRel = getAvatarGenderPlaceholderPath(themeId, 'neutral');

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
      resolvedStage: visualStage as HeroStageNumber,
      visualStage,
      themeId,
      gender,
      trackId,
      status: 'placeholder',
      debugLabel: import.meta.env?.DEV
        ? `Missing avatar: ${themeId} / neutral / body ${padAvatarStage(requestedStage)} → visual ${padAvatarStage(visualStage)}`
        : null,
      bodyStage: requestedStage,
      heroStateIndependent: true,
    };
  }

  const heroGender: HeroGender = gender;

  const entry = getAvatarAssetManifestEntry({
    themeId,
    gender: heroGender,
    bodyStage: visualStage,
    trackId,
  });

  const candidatesRel: string[] = [];
  let source: AvatarAssetSource = 'placeholder';
  let status: AvatarAssetStatus = entry?.status ?? 'missing';
  let usedArtFallback = true;

  if (entry && canUseEntry(entry.status, allowDraft)) {
    candidatesRel.push(entry.path);
    for (const legacy of entry.legacyPaths ?? []) {
      if (assertSameThemePath(themeId, legacy)) {
        candidatesRel.push(legacy);
      }
    }
    source = statusToSource(entry.status);
    status = entry.status;
    // Canonical Body→Visual mapping is not a fallback.
    usedArtFallback = false;
  } else if (entry && entry.status === 'placeholder') {
    // Visual anchor slot exists but art not approved yet — try canonical path then placeholder.
    candidatesRel.push(entry.path);
    for (const legacy of entry.legacyPaths ?? []) {
      if (assertSameThemePath(themeId, legacy)) {
        candidatesRel.push(legacy);
      }
    }
    source = 'placeholder';
    status = 'placeholder';
    usedArtFallback = true;
  } else if (allowNearest) {
    // Dev-only: rarely used now that only 5 anchors exist.
    const nearest = findNearestUsableVisualAnchor({
      themeId,
      gender: heroGender,
      trackId,
      visualStage,
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
      usedArtFallback = nearest.bodyStage !== visualStage;
    }
  }

  if (candidatesRel.length === 0) {
    candidatesRel.push(
      getCanonicalAvatarStagePath(themeId, heroGender, visualStage, trackId),
    );
  }

  candidatesRel.push(genderPlaceholderRel, neutralPlaceholderRel);

  const versioned = unique(
    filterSameTheme(
      themeId,
      candidatesRel.map((p) => toVersioned(p)),
    ),
  );

  const primary = versioned[0] ?? toVersioned(neutralPlaceholderRel);
  const primaryIsPlaceholderSvg = primary.includes('/placeholders/');

  return {
    path: primary,
    fallbackCandidates: versioned.slice(1),
    source: primaryIsPlaceholderSvg ? 'placeholder' : source,
    // Body→Visual map itself is never "fallback"; only missing anchor art is.
    usedFallback: usedArtFallback || primaryIsPlaceholderSvg,
    requestedStage,
    resolvedStage: visualStage as HeroStageNumber,
    visualStage,
    themeId,
    gender,
    trackId,
    status: primaryIsPlaceholderSvg ? 'placeholder' : status,
    debugLabel: import.meta.env?.DEV
      ? `${primaryIsPlaceholderSvg ? 'Missing avatar' : 'Avatar'}: ${themeId} / ${gender} / body ${padAvatarStage(requestedStage)} → visual ${padAvatarStage(visualStage)}`
      : null,
    bodyStage: requestedStage,
    heroStateIndependent: true,
  };
}

function findNearestUsableVisualAnchor(params: {
  themeId: AppThemeId;
  gender: HeroGender;
  trackId: AvatarTrackId;
  visualStage: AvatarVisualStage;
  allowDraft: boolean;
}) {
  const idx = AVATAR_VISUAL_STAGES.indexOf(params.visualStage);
  for (let delta = 1; delta < AVATAR_VISUAL_STAGES.length; delta += 1) {
    for (const sign of [-1, 1] as const) {
      const nextIdx = idx + sign * delta;
      if (nextIdx < 0 || nextIdx >= AVATAR_VISUAL_STAGES.length) continue;
      const stage = AVATAR_VISUAL_STAGES[nextIdx]!;
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
  return (
    a.path === b.path &&
    a.resolvedStage === b.resolvedStage &&
    a.visualStage === b.visualStage
  );
}
