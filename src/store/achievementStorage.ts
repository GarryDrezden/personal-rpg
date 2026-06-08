import type { UnlockedAchievement } from '../types/achievements';

export const ACHIEVEMENTS_STORAGE_KEY = 'personal-rpg-unlocked-achievements';

export function loadUnlockedAchievements(): UnlockedAchievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UnlockedAchievement[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(items: UnlockedAchievement[]): void {
  localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(items));
}

export function mergeUnlocked(
  existing: UnlockedAchievement[],
  newIds: string[],
): UnlockedAchievement[] {
  const known = new Set(existing.map((u) => u.achievementId));
  const now = new Date().toISOString();
  const added = newIds
    .filter((id) => !known.has(id))
    .map((id) => ({ achievementId: id, unlockedAt: now }));
  return added.length > 0 ? [...existing, ...added] : existing;
}
