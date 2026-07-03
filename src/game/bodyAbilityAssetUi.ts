import type { LucideIcon } from 'lucide-react';
import { Compass, Footprints, Home, Moon, Route, Shirt } from 'lucide-react';
import type { BodyAbilityV1Category } from '../types/bodyAbilityV1';

/** Manifest asset id for a body ability v1 entry (`ability-{entityId}`). */
export function getBodyAbilityManifestAssetId(abilityId: string): string {
  return `ability-${abilityId}`;
}

/** First visual group with in-app manifest art (styling only; display order is separate). */
export const BODY_ABILITY_FEATURED_IDS = [
  'tie_shoes_easier',
  'stand_from_floor',
  'stairs_breath',
  'long_route',
] as const;

/** Skill board display order — progression of body freedom (UI only). */
export const BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER = [
  'stand_easier',
  'tie_shoes_easier',
  'stand_from_floor',
  'stairs_breath',
  'long_route',
  'car_easier',
  'clothing_freer',
  'household_easier',
  'movement_confidence',
  'recovery_awareness',
  'journal_clarity',
  'stairs_easier',
] as const;

const SKILL_BOARD_ORDER_INDEX = new Map<string, number>(
  BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER.map((id, index) => [id, index]),
);

/** Sort skill board items by explicit display order; unknown ids trail config order. */
export function sortBodyAbilitySkillBoardItems<T extends { ability: { id: string } }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) =>
      (SKILL_BOARD_ORDER_INDEX.get(a.ability.id) ?? Number.MAX_SAFE_INTEGER) -
      (SKILL_BOARD_ORDER_INDEX.get(b.ability.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function isBodyAbilityFeaturedOnSkillBoard(abilityId: string): boolean {
  return (BODY_ABILITY_FEATURED_IDS as readonly string[]).includes(abilityId);
}

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
