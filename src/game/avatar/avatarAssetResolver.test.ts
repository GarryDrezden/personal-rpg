import { describe, expect, it } from 'vitest';
import {
  AVATAR_ASSET_MANIFEST,
  AVATAR_ASSET_MANIFEST_EXPECTED_COUNT,
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
import { getAvatarVisualStage } from './avatarVisualStage';

describe('Avatar Assets Pipeline — 5 visual anchors', () => {
  it('1) Cozy male stage 1 resolves cozy path only', () => {
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

  it('4) Intermediate body stage maps to visual anchor without nearest fallback', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 7,
    });
    expect(resolved.requestedStage).toBe(7);
    expect(resolved.visualStage).toBe(5);
    expect(resolved.resolvedStage).toBe(5);
    expect(resolved.source).toBe('approved');
    expect(resolved.usedFallback).toBe(false);
    expect(resolved.path).toContain('stage-05.webp');
  });

  it('5) Cozy / DF male anchors are approved for all five visuals', () => {
    for (const stage of [1, 5, 10, 15, 20] as const) {
      expect(
        getAvatarAssetManifestEntry({
          themeId: 'cozy',
          gender: 'male',
          bodyStage: stage,
        })?.status,
      ).toBe('approved');
      expect(
        getAvatarAssetManifestEntry({
          themeId: 'darkFantasy',
          gender: 'male',
          bodyStage: stage,
        })?.status,
      ).toBe('approved');
    }
  });

  it('6) bodyStage 11 → visual 10 on both themes (same body, different worlds)', () => {
    const cozy = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 11,
    });
    const df = getResolvedAvatarStageAsset({
      themeId: 'darkFantasy',
      gender: 'male',
      bodyStage: 11,
    });
    expect(cozy.visualStage).toBe(10);
    expect(df.visualStage).toBe(10);
    expect(cozy.path).toContain('themes/cozy/avatars/male/stage-10.webp');
    expect(df.path).toContain('themes/dark-fantasy/avatars/male/stage-10.webp');
    expect(df.path).not.toContain('themes/cozy/');
    expect(df.usedFallback).toBe(false);
  });

  it('7) Invalid stage clamps to 1–20', () => {
    expect(clampAvatarBodyStage(0)).toBe(1);
    expect(clampAvatarBodyStage(99)).toBe(20);
    expect(clampAvatarBodyStage(null)).toBe(1);
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

  it('9) Hero State does not change body / visual stage', () => {
    expect(
      assertHeroStateDoesNotChangeBodyAsset({
        themeId: 'darkFantasy',
        gender: 'male',
        bodyStage: 8,
      }),
    ).toBe(true);
    expect(getAvatarVisualStage(8)).toBe(5);
  });

  it('10) Manifest has 20 visual-anchor entries (not 80 body files)', () => {
    expect(findAvatarManifestDuplicates()).toEqual([]);
    expect(AVATAR_ASSET_MANIFEST).toHaveLength(AVATAR_ASSET_MANIFEST_EXPECTED_COUNT);
    expect(AVATAR_ASSET_MANIFEST_EXPECTED_COUNT).toBe(20);
    expect(
      getAvatarAssetManifestEntry({
        themeId: 'cozy',
        gender: 'male',
        bodyStage: 7,
      }),
    ).toBeNull();
  });

  it('11) Stage naming accepts only visual anchors', () => {
    expect(isValidAvatarStageFileName('stage-01.webp')).toBe(true);
    expect(isValidAvatarStageFileName('stage-07.webp')).toBe(false);
    expect(isValidAvatarStageFileName('stage-20.webp')).toBe(true);
  });

  it('12) Absence of stage-07 is not treated as missing asset lookup', () => {
    const resolved = getResolvedAvatarStageAsset({
      themeId: 'cozy',
      gender: 'male',
      bodyStage: 7,
    });
    expect(resolved.path).not.toContain('stage-07');
    expect(resolved.path).toContain('stage-05.webp');
  });

  it('13) Full body→visual matrix samples', () => {
    const samples: Array<[number, number]> = [
      [1, 1],
      [4, 1],
      [5, 5],
      [8, 5],
      [9, 10],
      [12, 10],
      [13, 15],
      [16, 15],
      [17, 20],
      [20, 20],
    ];
    for (const [body, visual] of samples) {
      const resolved = getResolvedAvatarStageAsset({
        themeId: 'cozy',
        gender: 'male',
        bodyStage: body,
      });
      expect(resolved.visualStage).toBe(visual);
      expect(resolved.usedFallback).toBe(false);
    }
  });
});
