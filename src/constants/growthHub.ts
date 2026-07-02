import { Sparkles, Dna, Gift, Trophy, Swords, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const GROWTH_HUB_TABS = [
  { id: 'skills', label: 'Навыки', path: '/growth/skills', icon: Sparkles },
  { id: 'abilities', label: 'Способности', path: '/growth/abilities', icon: Dna },
  { id: 'camp', label: 'Лагерь', path: '/growth/camp', icon: Flame },
  { id: 'rewards', label: 'Награды', path: '/growth/rewards', icon: Gift },
  { id: 'achievements', label: 'Достижения', path: '/growth/achievements', icon: Trophy },
  { id: 'trials', label: 'Испытания', path: '/growth/trials', icon: Swords },
] as const;

export type GrowthHubTabId = (typeof GROWTH_HUB_TABS)[number]['id'];

export const GROWTH_HUB_LEGACY_PATHS = [
  '/skills',
  '/abilities',
  '/rewards',
  '/achievements',
  '/bosses',
] as const;

const LEGACY_TO_TAB: Record<(typeof GROWTH_HUB_LEGACY_PATHS)[number], GrowthHubTabId> = {
  '/skills': 'skills',
  '/abilities': 'abilities',
  '/rewards': 'rewards',
  '/achievements': 'achievements',
  '/bosses': 'trials',
};

export function isGrowthHubTab(value: string | undefined): value is GrowthHubTabId {
  return GROWTH_HUB_TABS.some((tab) => tab.id === value);
}

export function getGrowthHubTabFromPath(pathname: string): GrowthHubTabId | null {
  const match = pathname.match(/^\/growth\/([^/]+)/);
  if (match && isGrowthHubTab(match[1])) {
    return match[1];
  }
  if (GROWTH_HUB_LEGACY_PATHS.includes(pathname as (typeof GROWTH_HUB_LEGACY_PATHS)[number])) {
    return LEGACY_TO_TAB[pathname as (typeof GROWTH_HUB_LEGACY_PATHS)[number]];
  }
  return null;
}

export function isGrowthHubPath(pathname: string): boolean {
  return (
    pathname === '/growth' ||
    pathname.startsWith('/growth/') ||
    GROWTH_HUB_LEGACY_PATHS.some((path) => pathname === path)
  );
}

export type GrowthHubTab = {
  id: GrowthHubTabId;
  label: string;
  path: string;
  icon: LucideIcon;
};
