import type { LucideIcon } from 'lucide-react';
import { Compass, Footprints, Home, Moon, Route, Shirt } from 'lucide-react';
import type { BodyAbilityV1Category } from '../types/bodyAbilityV1';

/** Manifest asset id for a body ability v1 entry (`ability-{entityId}`). */
export function getBodyAbilityManifestAssetId(abilityId: string): string {
  return `ability-${abilityId}`;
}

/** First visual group wired for UI — art may be replaced after generation. */
export const BODY_ABILITY_FEATURED_IDS = [
  'tie_shoes_easier',
  'stand_from_floor',
  'stairs_breath',
  'long_route',
] as const;

const CATEGORY_GLYPH: Record<BodyAbilityV1Category, string> = {
  mobility: '◈',
  endurance: '▲',
  dailyLife: '⌂',
  confidence: '✦',
  clothing: '◆',
  recovery: '◉',
};

const CATEGORY_ROAD: Record<BodyAbilityV1Category, string> = {
  mobility: 'mobility',
  endurance: 'endurance',
  dailyLife: 'daily',
  confidence: 'confidence',
  clothing: 'clothing',
  recovery: 'recovery',
};

/** Monochrome RPG sigils for skill board when manifest art is absent. */
export const BODY_ABILITY_CATEGORY_ICON: Record<BodyAbilityV1Category, LucideIcon> = {
  mobility: Footprints,
  endurance: Route,
  dailyLife: Home,
  clothing: Shirt,
  confidence: Compass,
  recovery: Moon,
};

export function getBodyAbilityCategoryIcon(category: BodyAbilityV1Category): LucideIcon {
  return BODY_ABILITY_CATEGORY_ICON[category];
}

export function getBodyAbilityCategoryGlyph(category: BodyAbilityV1Category): string {
  return CATEGORY_GLYPH[category];
}

export function getBodyAbilityCategoryRoad(category: BodyAbilityV1Category): string {
  return CATEGORY_ROAD[category];
}
