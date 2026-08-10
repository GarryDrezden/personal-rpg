import { cozyThemeAsset } from './themeAssetRegistry';
import type { CozyHomeZoneId } from '../types/cozyHome';

/** Cozy Home Batch C3 — exterior hero + first zone plates. */

export function getCozyHomeHeroPath(): string {
  return cozyThemeAsset('home/exterior/home-hero.webp');
}

const ZONE_ART: Partial<Record<CozyHomeZoneId, string>> = {
  porch: 'home/zones/porch.webp',
  kitchen: 'home/zones/kitchen.webp',
  garden: 'home/zones/garden.webp',
};

export function getCozyHomeZoneArtPath(zoneId: CozyHomeZoneId): string | null {
  const rel = ZONE_ART[zoneId];
  return rel ? cozyThemeAsset(rel) : null;
}
