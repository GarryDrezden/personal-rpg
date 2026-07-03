import type { LucideIcon } from 'lucide-react';
import { Compass, Dumbbell, Footprints, Home, Moon, Route, Shirt } from 'lucide-react';
import type { BodyAbilityProgressionRing, BodyAbilityV1Category } from '../types/bodyAbilityV1';
import { BODY_ABILITY_PROGRESSION_RING_LABELS } from './bodyAbilities/bodyAbilityConfig';

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

/** Stable form ring — future roadmap display order. */
export const BODY_ABILITY_STABLE_FORM_DISPLAY_ORDER = [
  'walk_without_planning',
  'longer_standing_tasks',
  'less_joint_pressure',
  'smoother_morning_start',
  'better_pace_control',
  'less_after_walk_fatigue',
  'easier_shower_routine',
  'easier_bag_carrying',
  'better_balance',
  'calmer_evening_body',
  'easier_public_routes',
  'waist_freedom',
] as const;

/** New mobility ring — future roadmap display order. */
export const BODY_ABILITY_NEW_MOBILITY_DISPLAY_ORDER = [
  'choose_longer_route',
  'stairs_without_pause',
  'active_day_capacity',
  'travel_comfort',
  'clothing_choice_confidence',
  'body_trust',
  'movement_without_shame',
  'recovery_self_control',
  'stable_week_body',
  'strength_in_daily_life',
  'free_movement_identity',
  'new_body_baseline',
] as const;

export type BodyAbilitySkillBoardSection = {
  ring: BodyAbilityProgressionRing;
  title: string;
  subtitle: string;
  displayOrder: readonly string[];
  defaultExpanded: boolean;
};

export const BODY_ABILITY_SKILL_BOARD_SECTIONS: BodyAbilitySkillBoardSection[] = [
  {
    ring: 'early_signals',
    ...BODY_ABILITY_PROGRESSION_RING_LABELS.early_signals,
    displayOrder: BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER,
    defaultExpanded: true,
  },
  {
    ring: 'stable_form',
    ...BODY_ABILITY_PROGRESSION_RING_LABELS.stable_form,
    displayOrder: BODY_ABILITY_STABLE_FORM_DISPLAY_ORDER,
    defaultExpanded: false,
  },
  {
    ring: 'new_mobility',
    ...BODY_ABILITY_PROGRESSION_RING_LABELS.new_mobility,
    displayOrder: BODY_ABILITY_NEW_MOBILITY_DISPLAY_ORDER,
    defaultExpanded: false,
  },
];

/** Sort skill board items by explicit display order within a section. */
export function sortBodyAbilitySkillBoardItems<T extends { ability: { id: string } }>(
  items: T[],
  displayOrder: readonly string[] = BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER,
): T[] {
  const orderIndex = new Map(displayOrder.map((id, index) => [id, index]));
  return [...items].sort(
    (a, b) =>
      (orderIndex.get(a.ability.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.ability.id) ?? Number.MAX_SAFE_INTEGER),
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
  strength: '⬡',
};

const CATEGORY_ROAD: Record<BodyAbilityV1Category, string> = {
  mobility: 'mobility',
  endurance: 'endurance',
  dailyLife: 'daily',
  confidence: 'confidence',
  clothing: 'clothing',
  recovery: 'recovery',
  strength: 'strength',
};

/** Monochrome RPG sigils for skill board when manifest art is absent. */
export const BODY_ABILITY_CATEGORY_ICON: Record<BodyAbilityV1Category, LucideIcon> = {
  mobility: Footprints,
  endurance: Route,
  dailyLife: Home,
  clothing: Shirt,
  confidence: Compass,
  recovery: Moon,
  strength: Dumbbell,
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
