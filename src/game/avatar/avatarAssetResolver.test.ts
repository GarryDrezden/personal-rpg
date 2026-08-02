import { describe, expect, it } from 'vitest';
import {
  AVATAR_ASSET_MANIFEST,
  findAvatarManifestDuplicates,
  getAvatarAssetManifestEntry,
  isValidAvatarStageFileName,
} from '../../constants/avatarAssetManifest';
import {
  assertHeroStateDoesNotChangeBodyAsset,
  clampAvatarBodyStage,
  getAvatarStageAssetCandidates,
  getResolvedAvatarStageAsset,
} from './avatarAssetResolver';

describe('Avatar Assets Pipeline v1 resolver', () => {
  it('1) Cozy male stage 1 resolves cozy path/placeholder only', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 1,
    });
    expect(resolved.path).toContain('themes/cozy/');
    expect(resolved.path).not.toContain('dark-fantasy');
    expect(resolved.path).not.toContain('/heroes/');
  });

  it('2) Cozy never receives Dark Fantasy fallback', () => {
    const candidates = getAvatarStageAssetCandidates({
      themeId: 'cozy',
      gender: 'female',
      bodyStage: 7,
    });
    expect(candidates.every((c) => c.includes('themes/cozy/'))).toBe(true);
    expect(candidates.some((c) => c.includes('dark-fantasy'))).toBe(false);
    expect(candidates.some((c) => c.includes('/heroes/'))).toBe(false);
  });

  it('3) Dark Fantasy never receives Cozy fallback', () => {
    const candidates = getAvatarStageAssetCandidates({
      themeId: 'darkFantasy',
      gender: 'male',
      bodyStage: 3,
    });
    expect(candidates.some((c) => c.includes('themes/cozy/'))).toBe(false);
  });

  it('4) Missing cozy stage returns same-theme placeholder', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 12,
    });
    expect(resolved.source).toBe('placeholder');
    expect(resolved.usedFallback).toBe(true);
    expect(resolved.path).toContain('themes/cozy/');
  });

  it('5) Draft assets are not used when allowDraft is false', () => {
    const entry = getAvatarAssetManifestEntry({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 1,
    });
    expect(entry?.status).toBe('placeholder');
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 1,
      allowDraft: false,
    });
    expect(resolved.source).toBe('placeholder');
  });

  it('6) Approved DF asset is preferred (legacy same-theme allowed)', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'darkFantasy',
      gender: 'male',
      bodyStage: 1,
      allowDraft: false,
    });
    expect(resolved.source).toBe('approved');
    expect(
      resolved.path.includes('dark-fantasy') || resolved.path.includes('/heroes/'),
    ).toBe(true);
    expect(resolved.path.includes('themes/cozy/')).toBe(false);
  });

  it('7) Invalid stage clamps to 1–20', () => {
    expect(clampAvatarBodyStage(0)).toBe(1);
    expect(clampAvatarBodyStage(99)).toBe(20);
    expect(clampAvatarBodyStage(null)).toBe(1);
    expect(
      getResolvedAvatarStageAsset({
        themeId: 'cozy',
        gender: 'female',
        bodyStage: -5,
      }).requestedStage,
    ).toBe(1);
  });

  it('8) Missing gender returns neutral same-theme placeholder', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: null,
      bodyStage: 5,
    });
    expect(resolved.gender).toBe('neutral');
    expect(resolved.path).toContain('placeholders/neutral');
    expect(resolved.path).toContain('themes/cozy/');
  });

  it('9) Body Stage asset does not depend on Hero State', () => {
    expect(
      assertHeroStateDoesNotChangeBodyAsset({
        themeId: 'darkFantasy',
        gender: 'male',
        bodyStage: 8,
      }),
    ).toBe(true);
  });

  it('10) Hero State independence flag is always true on resolved body', () => {
    const a = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 4,
      heroState: 'depleted',
    });
    const b = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 4,
      heroState: 'strong',
    });
    expect(a.path).toBe(b.path);
    expect(a.heroStateIndependent).toBe(true);
  });

  it('11) Manifest has no duplicates and covers 80 default entries', () => {
    expect(findAvatarManifestDuplicates()).toEqual([]);
    expect(AVATAR_ASSET_MANIFEST).toHaveLength(80);
  });

  it('12) Stage naming validation accepts stage-01..20.webp only', () => {
    expect(isValidAvatarStageFileName('stage-01.webp')).toBe(true);
    expect(isValidAvatarStageFileName('stage-20.webp')).toBe(true);
    expect(isValidAvatarStageFileName('stage1.webp')).toBe(false);
    expect(isValidAvatarStageFileName('final-final-v2.webp')).toBe(false);
  });

  it('13) Old user safe defaults: stage 1, default track, placeholder ok', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: undefined,
      bodyStage: undefined,
      trackId: undefined,
    });
    expect(resolved.requestedStage).toBe(1);
    expect(resolved.trackId).toBe('default');
    expect(resolved.source).toBe('placeholder');
  });

  it('14) Dashboard/Freedom/Codex share the same resolver candidates API', () => {
    const a = getAvatarStageAssetCandidates({
      themeId: 'darkFantasy',
      gender: 'female',
      bodyStage: 10,
    });
    const b = getResolvedAvatarStageAsset({
      themeId: 'darkFantasy',
      gender: 'female',
      bodyStage: 10,
    });
    expect(a[0]).toBe(b.path);
    expect(a.slice(1)).toEqual(b.fallbackCandidates);
  });

  it('production nearest-stage fallback stays off by default', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 7,
    });
    expect(resolved.resolvedStage).toBe(7);
    expect(resolved.allowNearestStageFallback).toBeUndefined();
  });
});
