import { describe, expect, it } from 'vitest';
import { getCozyHomeZoneArtCandidates, getCozyHomeZoneArtPath } from './cozyHomeArt';

describe('cozy home zone art', () => {
  it('uses L0/L1 plates and never Dark Fantasy paths', () => {
    const l0 = getCozyHomeZoneArtCandidates('porch', 0);
    expect(l0[0]).toContain('/themes/cozy/home/porch/level-00.webp');
    expect(l0.every((p) => p.includes('/themes/cozy/'))).toBe(true);

    const l1 = getCozyHomeZoneArtPath('kitchen', 1);
    expect(l1).toContain('/themes/cozy/home/kitchen/level-01.webp');
  });

  it('maps missing L2 to L1 before the SVG placeholder', () => {
    const l2 = getCozyHomeZoneArtCandidates('workshop', 2);
    expect(l2[0]).toContain('/themes/cozy/home/workshop/level-02.webp');
    expect(l2[1]).toContain('/themes/cozy/home/workshop/level-01.webp');
    expect(l2.some((p) => p.includes('dark-fantasy'))).toBe(false);
  });

  it('keeps existing L3 plates for restored zones', () => {
    const l3 = getCozyHomeZoneArtPath('garden', 3);
    expect(l3).toContain('/themes/cozy/home/zones/garden.webp');
  });
});
