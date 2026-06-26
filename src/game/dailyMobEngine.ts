import type { MobId, MobWeakness } from '../types/gameAssets';
import { MOB_IDS } from '../types/gameAssets';
import { getDailyMobId, setDailyMobId } from './gameAssetStorage';

export function getRandomMobId(): MobId {
  const index = Math.floor(Math.random() * MOB_IDS.length);
  return MOB_IDS[index] ?? 'empty_day';
}

export function getOrCreateDailyMob(date: string): MobId {
  const existing = getDailyMobId(date);
  if (existing) return existing;
  const mobId = getRandomMobId();
  setDailyMobId(date, mobId);
  return mobId;
}

export function getMobWeaknessText(weakness: MobWeakness): string {
  const map: Record<MobWeakness, string> = {
    steps: 'Уязвим к шагам',
    calories: 'Уязвим к учёту калорий',
    journal: 'Уязвим к дневнику',
    recovery: 'Уязвим к восстановлению',
    minimal_day: 'Уязвим к минимальному дню',
    no_alcohol: 'Уязвим к ясности',
    any_data: 'Уязвим к любым данным дня',
    base_day: 'Уязвим к базовому дню',
  };
  return map[weakness];
}
