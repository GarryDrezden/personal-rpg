import type { CompanionId, BossId, ArtifactId, MobId } from '../types/gameAssets';
import { COMPANION_IDS, MOB_IDS } from '../types/gameAssets';

export const ACTIVE_COMPANION_STORAGE_KEY = 'personal-rpg-active-companion';
export const DAILY_MOB_STORAGE_KEY = 'personal-rpg-daily-mob';
export const UNLOCKED_ARTIFACTS_STORAGE_KEY = 'personal-rpg-unlocked-artifacts';
export const DEFEATED_BOSSES_STORAGE_KEY = 'personal-rpg-defeated-bosses';

const DEFAULT_COMPANION: CompanionId = 'golden_chinchilla_cat';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getActiveCompanionId(): CompanionId {
  const raw = localStorage.getItem(ACTIVE_COMPANION_STORAGE_KEY);
  if (raw && COMPANION_IDS.includes(raw as CompanionId)) {
    return raw as CompanionId;
  }
  return DEFAULT_COMPANION;
}

export function setActiveCompanionId(id: CompanionId): void {
  localStorage.setItem(ACTIVE_COMPANION_STORAGE_KEY, id);
}

export function getDailyMobId(date: string): MobId | null {
  const map = readJson<Record<string, MobId>>(DAILY_MOB_STORAGE_KEY, {});
  return map[date] ?? null;
}

export function setDailyMobId(date: string, mobId: MobId): void {
  const map = readJson<Record<string, MobId>>(DAILY_MOB_STORAGE_KEY, {});
  map[date] = mobId;
  writeJson(DAILY_MOB_STORAGE_KEY, map);
}

export function getUnlockedArtifactIds(): ArtifactId[] {
  return readJson<ArtifactId[]>(UNLOCKED_ARTIFACTS_STORAGE_KEY, []);
}

export function unlockArtifact(id: ArtifactId): void {
  const current = new Set(getUnlockedArtifactIds());
  if (current.has(id)) return;
  current.add(id);
  writeJson(UNLOCKED_ARTIFACTS_STORAGE_KEY, [...current]);
}

export function getDefeatedBossIds(): BossId[] {
  return readJson<BossId[]>(DEFEATED_BOSSES_STORAGE_KEY, []);
}

export function markBossDefeated(id: BossId): void {
  const current = new Set(getDefeatedBossIds());
  if (current.has(id)) return;
  current.add(id);
  writeJson(DEFEATED_BOSSES_STORAGE_KEY, [...current]);
}

export { MOB_IDS };
