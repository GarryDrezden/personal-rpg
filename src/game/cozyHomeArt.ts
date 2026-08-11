import { cozyThemeAsset } from './themeAssetRegistry';
import type { CozyHomeZoneId } from '../types/cozyHome';

/** Cozy Home Batch C3 — exterior hero + zone plates. */

export function getCozyHomeHeroPath(): string {
  return cozyThemeAsset('home/exterior/home-hero.webp');
}

const ZONE_ART: Partial<Record<CozyHomeZoneId, string>> = {
  porch: 'home/zones/porch.webp',
  hallway: 'home/zones/hallway.webp',
  kitchen: 'home/zones/kitchen.webp',
  bedroom: 'home/zones/bedroom.webp',
  yard: 'home/zones/yard.webp',
  garden: 'home/zones/garden.webp',
  workshop: 'home/zones/workshop.webp',
  pet_corner: 'home/zones/pet_corner.webp',
};

export function getCozyHomeZoneArtPath(zoneId: CozyHomeZoneId): string | null {
  const rel = ZONE_ART[zoneId];
  return rel ? cozyThemeAsset(rel) : null;
}
