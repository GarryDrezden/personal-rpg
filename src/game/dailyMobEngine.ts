import type { MobId, MobWeakness } from '../types/gameAssets';
import type { AppSettings, DailyEntry } from '../types';
import { MOB_IDS } from '../types/gameAssets';
import { getDailyMobId, setDailyMobId } from './gameAssetStorage';
import { getNutritionWeaknessText } from '../utils/nutritionEngine';
import { resolveDailyMobForEntry } from '../utils/todayMobContext';

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

export function getOrCreateDailyMobForEntry(
  date: string,
  entry: DailyEntry,
  settings: AppSettings,
): MobId {
  const existing = getDailyMobId(date);
  if (existing) return existing;
  const mobId = resolveDailyMobForEntry(entry, settings);
  setDailyMobId(date, mobId);
  return mobId;
}

export function getMobWeaknessText(
  weakness: MobWeakness,
  context?: { settings?: AppSettings; mobId?: MobId },
): string {
  if (weakness === 'calories' && context?.settings) {
    const kind = context.mobId === 'sweet_whisper' ? 'sweet' : 'snack';
    return getNutritionWeaknessText(context.settings, kind);
  }

  const map: Record<MobWeakness, string> = {
    steps: 'Уязвим к шагам',
    calories: 'Уязвим к учёту питания',
    journal: 'Уязвим к дневнику',
    recovery: 'Уязвим к восстановлению',
    minimal_day: 'Уязвим к минимальному дню',
    no_alcohol: 'Уязвим к ясности',
    any_data: 'Уязвим к любым данным дня',
    base_day: 'Уязвим к базовому дню',
  };
  return map[weakness];
}

/** Подсказка на главной: как моб связан с квестами дня */
export function getMobDailyActionHint(weakness: MobWeakness): string {
  const map: Record<MobWeakness, string> = {
    steps: 'Добери шаги в квестах дня →',
    calories: 'Отметь питание в квестах дня →',
    journal: 'Запиши дневник в квестах дня →',
    recovery: 'Отметь сон, перерыв или восстановление →',
    minimal_day: 'Разгрузка головы или минимальный день →',
    no_alcohol: 'Отметь ясность в квестах дня →',
    any_data: 'Любые данные дня ослабят моба →',
    base_day: 'Базовый день в квестах →',
  };
  return map[weakness];
}
