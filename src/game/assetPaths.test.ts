import { describe, expect, it } from 'vitest';
import {
  getGameHeroStageLegacyPath,
  getGameHeroStageVariantPath,
  getHeroStageImageCandidates,
  resolveHeroAssetVariant,
} from './assetPaths';

describe('resolveHeroAssetVariant', () => {
  it('maps cozy to light and darkFantasy to dark-fantasy', () => {
    expect(resolveHeroAssetVariant('cozy')).toBe('light');
    expect(resolveHeroAssetVariant('darkFantasy')).toBe('dark-fantasy');
  });
});

describe('getHeroStageImageCandidates', () => {
  it('uses light variant first for cozy theme', () => {
    const [first] = getHeroStageImageCandidates('male', 5, 'cozy');
    expect(first).toContain('/variants/light/stage-05.png');
  });

  it('uses dark-fantasy variant first for dark theme', () => {
    const [first] = getHeroStageImageCandidates('male', 5, 'darkFantasy');
    expect(first).toContain('/variants/dark-fantasy/stage-05.png');
  });

  it('falls back to legacy root path for same stage', () => {
    const candidates = getHeroStageImageCandidates('male', 1, 'darkFantasy');
    expect(candidates).toContain(getGameHeroStageLegacyPath('male', 1));
  });

  it('includes variant paths for anchor stages', () => {
    const candidates = getHeroStageImageCandidates('male', 10, 'darkFantasy');
    expect(candidates.some((p) => p.includes('stage-10.png'))).toBe(true);
    expect(candidates.some((p) => p.includes('stage-19.png') || p.includes('stage-02.png'))).toBe(
      true,
    );
  });
});

describe('variant path helpers', () => {
  it('builds expected variant URLs', () => {
    expect(getGameHeroStageVariantPath('female', 12, 'light')).toMatch(
      /heroes\/female\/variants\/light\/stage-12\.png\?v=/,
    );
  });
});
