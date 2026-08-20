import { getCozyHomeScenePlaceholderPath, cozyThemeAsset } from './themeAssetRegistry';
import type { CozyHomeZoneId } from '../types/cozyHome';
import { COZY_HOME_MAX_LEVEL } from '../constants/cozyHomeConfig';

/** Cozy Home plates: L0/L1 per zone, existing `zones/{id}.webp` as L3. L2 falls back to L1. */

export function getCozyHomeHeroPath(): string {
  return cozyThemeAsset('home/exterior/home-hero.webp');
}

/** Wider crop for Dashboard «Дом становится теплее» card. */
export function getCozyDashboardHomeBannerPath(): string {
  return cozyThemeAsset('home/exterior/dashboard-home-banner.webp');
}

const ZONE_L3: Record<CozyHomeZoneId, string> = {
  porch: 'home/zones/porch.webp',
  hallway: 'home/zones/hallway.webp',
  kitchen: 'home/zones/kitchen.webp',
  bedroom: 'home/zones/bedroom.webp',
  yard: 'home/zones/yard.webp',
  garden: 'home/zones/garden.webp',
  workshop: 'home/zones/workshop.webp',
  pet_corner: 'home/zones/pet_corner.webp',
};

function clampZoneLevel(level: number): number {
  if (!Number.isFinite(level) || level < 0) return 0;
  return Math.min(COZY_HOME_MAX_LEVEL, Math.floor(level));
}

/**
 * Same-theme candidates for a zone at a given upgrade level.
 * Never includes Dark Fantasy paths.
 */
export function getCozyHomeZoneArtCandidates(
  zoneId: CozyHomeZoneId,
  level = COZY_HOME_MAX_LEVEL,
): string[] {
  const n = clampZoneLevel(level);
  const l3 = cozyThemeAsset(ZONE_L3[zoneId]);
  const placeholder = getCozyHomeScenePlaceholderPath();

  if (n >= COZY_HOME_MAX_LEVEL) {
    return [l3, placeholder];
  }

  const exact = cozyThemeAsset(`home/${zoneId}/level-0${n}.webp`);
  const list = [exact];
  if (n === 2) {
    list.push(cozyThemeAsset(`home/${zoneId}/level-01.webp`));
  }
  list.push(placeholder);
  return list;
}

export function getCozyHomeZoneArtPath(
  zoneId: CozyHomeZoneId,
  level = COZY_HOME_MAX_LEVEL,
): string | null {
  return getCozyHomeZoneArtCandidates(zoneId, level)[0] ?? null;
}
