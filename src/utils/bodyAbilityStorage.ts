import type { BodyAbilityProgress } from '../types/bodyAbilities';

const STORAGE_KEY = 'personal-rpg-seen-body-abilities';

type SeenBodyAbilities = Record<string, string>;

function readSeenMap(): SeenBodyAbilities {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SeenBodyAbilities;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSeenMap(map: SeenBodyAbilities): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getSeenBodyAbilityIds(): string[] {
  return Object.keys(readSeenMap());
}

export function markBodyAbilitySeen(abilityId: string): void {
  const map = readSeenMap();
  if (map[abilityId]) return;
  map[abilityId] = new Date().toISOString();
  writeSeenMap(map);
}

export function getNewlyUnlockedBodyAbilities(
  progress: BodyAbilityProgress[],
): BodyAbilityProgress[] {
  const seen = new Set(getSeenBodyAbilityIds());
  return progress.filter((p) => p.unlocked && !seen.has(p.ability.id));
}

export function isBodyAbilitySeen(abilityId: string): boolean {
  return abilityId in readSeenMap();
}
