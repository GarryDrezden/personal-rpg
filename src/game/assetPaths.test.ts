import { describe, expect, it } from 'vitest';
import {
  getCompanionImageCandidates,
  getGameHeroStageLegacyPath,
  getGameHeroStageVariantPath,
  getHeroSceneBackdropPath,
  getHeroStageImageCandidates,
  resolveHeroAssetVariant,
} from './assetPaths';
import { getThemeAsset, getThemeAssetCandidates } from './themeAssetRegistry';

describe('resolveHeroAssetVariant', () => {
  it('maps cozy to light and darkFantasy to dark-fantasy', () => {
    expect(resolveHeroAssetVariant('cozy')).toBe('light');
    expect(resolveHeroAssetVariant('darkFantasy')).toBe('dark-fantasy');
  });
});

describe('getHeroStageImageCandidates', () => {
  it('uses cozy theme path first for cozy theme', () => {
    const [first] = getHeroStageImageCandidates('male', 5, 'cozy');
    expect(first).toContain('/themes/cozy/avatars/male/stage-05.webp');
  });

  it('never falls back to dark-fantasy hero art in cozy', () => {
    const candidates = getHeroStageImageCandidates('male', 5, 'cozy');
    expect(candidates.some((p) => p.includes('dark-fantasy'))).toBe(false);
    expect(candidates.some((p) => p.includes('/heroes/male/stage-'))).toBe(false);
    expect(candidates.some((p) => p.includes('cozy/avatars/placeholders/male-placeholder'))).toBe(
      true,
    );
  });

  it('uses dark-fantasy variant webp first for dark theme', () => {
    const [first] = getHeroStageImageCandidates('male', 5, 'darkFantasy');
    expect(first).toContain('/variants/dark-fantasy/stage-05.webp');
  });

  it('falls back to legacy root path for same stage', () => {
    const candidates = getHeroStageImageCandidates('male', 1, 'darkFantasy');
    expect(candidates).toContain(getGameHeroStageLegacyPath('male', 1, 'webp'));
    expect(candidates).toContain(getGameHeroStageLegacyPath('male', 1, 'png'));
  });

  it('includes variant paths for anchor stages', () => {
    const candidates = getHeroStageImageCandidates('male', 10, 'darkFantasy');
    expect(candidates.some((p) => p.includes('stage-10.webp'))).toBe(true);
    expect(
      candidates.some((p) => p.includes('stage-19.webp') || p.includes('stage-02.webp')),
    ).toBe(true);
  });
});

describe('theme-aware companions and backdrop', () => {
  it('keeps cozy companion candidates inside cozy theme paths', () => {
    const candidates = getCompanionImageCandidates('alabai', 'cozy');
    expect(candidates.every((p) => p.includes('/themes/cozy/'))).toBe(true);
    expect(candidates.some((p) => p.includes('dark-fantasy') || p.includes('/images/pets/'))).toBe(
      false,
    );
  });

  it('uses cozy home scene for cozy dashboard backdrop', () => {
    expect(getHeroSceneBackdropPath('cozy')).toContain(
      '/themes/cozy/home/interior/room-stage-01.webp',
    );
    expect(getHeroSceneBackdropPath('darkFantasy')).toContain('hero-cliff-sunrise');
  });
});

describe('getThemeAsset', () => {
  it('returns cozy placeholder fallback for missing cozy boss art', () => {
    const ref = getThemeAsset({ themeId: 'cozy', kind: 'boss', entityId: 'misty_baron' });
    const candidates = getThemeAssetCandidates(ref);
    expect(ref.path).toContain('/themes/cozy/bosses/misty_baron.webp');
    expect(candidates.at(-1)).toContain('/themes/cozy/bosses/placeholders/boss-placeholder');
  });
});

describe('variant path helpers', () => {
  it('builds expected variant URLs', () => {
    expect(getGameHeroStageVariantPath('female', 12, 'light')).toMatch(
      /heroes\/female\/variants\/light\/stage-12\.webp\?v=/,
    );
  });
});
