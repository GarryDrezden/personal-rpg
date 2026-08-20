import { describe, expect, it } from 'vitest';
import {
  getCompanionImageCandidates,
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

  it('maps intermediate body stages to visual anchors', () => {
    const [cozy7] = getHeroStageImageCandidates('male', 7, 'cozy');
    expect(cozy7).toContain('/themes/cozy/avatars/male/stage-05.webp');
    expect(cozy7).not.toContain('stage-07');
  });

  it('never falls back to dark-fantasy hero art in cozy', () => {
    const candidates = getHeroStageImageCandidates('male', 5, 'cozy');
    expect(candidates.some((p) => p.includes('dark-fantasy'))).toBe(false);
    expect(candidates.some((p) => p.includes('/heroes/male/stage-'))).toBe(false);
    expect(candidates.every((p) => p.includes('/themes/cozy/'))).toBe(true);
  });

  it('uses canonical dark-fantasy theme path first', () => {
    const [first] = getHeroStageImageCandidates('male', 5, 'darkFantasy');
    expect(first).toContain('/themes/dark-fantasy/avatars/male/stage-05.webp');
  });

  it('falls back to legacy same-theme paths for dark fantasy', () => {
    const candidates = getHeroStageImageCandidates('male', 1, 'darkFantasy');
    expect(candidates.some((p) => p.includes('/themes/dark-fantasy/avatars/male/stage-01.webp'))).toBe(
      true,
    );
  });

  it('does not use obsolete nearest-stage anchors 02/19', () => {
    const candidates = getHeroStageImageCandidates('male', 10, 'darkFantasy');
    expect(candidates.some((p) => p.includes('stage-10.webp'))).toBe(true);
    expect(candidates.some((p) => p.includes('stage-19.webp') || p.includes('stage-02.webp'))).toBe(
      false,
    );
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

  it('resolves cozy journey chapters and season vignettes inside cozy only', () => {
    const chapter = getThemeAsset({
      themeId: 'cozy',
      kind: 'chapter_background',
      entityId: '3',
    });
    expect(chapter.path).toContain('/themes/cozy/journey/chapters/chapter-03.webp');
    expect(chapter.fallbackPath).toContain('/themes/cozy/journey/');

    const season = getThemeAsset({
      themeId: 'cozy',
      kind: 'scene_backdrop',
      entityId: '13',
    });
    expect(season.path).toContain('/themes/cozy/ui/seasons/vignette-05.webp');
  });
});

describe('variant path helpers', () => {
  it('builds expected variant URLs', () => {
    expect(getGameHeroStageVariantPath('female', 12, 'light')).toMatch(
      /heroes\/female\/variants\/light\/stage-12\.webp\?v=/,
    );
  });
});
