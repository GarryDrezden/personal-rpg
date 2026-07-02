import type { AppSettings, DailyEntry } from '../types';
import type { MobId } from '../types/gameAssets';
import { MOB_IDS } from '../types/gameAssets';
import { getDailyResource } from './resourceEngine';
import { getDayMode } from './stepsEngine';
import { isDayEmpty } from './questEngine';
import { isNutritionTrackingEnabled } from './nutritionEngine';

export function resolveDailyMobForEntry(
  entry: DailyEntry,
  settings: AppSettings,
): MobId {
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);

  if (mode === 'minimal') return 'empty_day';
  if (mode === 'recovery') return 'fog_of_fatigue';
  if (isDayEmpty(entry, settings)) return 'empty_day';
  if (entry.steps === null || entry.steps === 0) return 'sofa_magnet';
  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return 'fog_of_fatigue';
  }
  if (
    isNutritionTrackingEnabled(settings) &&
    entry.nutritionLevel == null &&
    entry.calories === null
  ) {
    return 'sweet_whisper';
  }

  const index = Math.abs(hashDate(entry.date)) % MOB_IDS.length;
  return MOB_IDS[index] ?? 'empty_day';
}

function hashDate(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i += 1) {
    h = (h * 31 + date.charCodeAt(i)) | 0;
  }
  return h;
}

export function getDailyMobContextLine(
  mobId: MobId,
  entry: DailyEntry,
  settings: AppSettings,
): string {
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);

  if (mode === 'minimal') {
    return 'Образ минимального дня — маршрут удержан без идеала.';
  }
  if (mode === 'recovery') {
    return 'Моб слабеет, когда день восстановления отмечен.';
  }
  if (resource.level === 'low') {
    return 'Низкий ресурс — игровой образ усталости, не приговор.';
  }
  if (mobId === 'sofa_magnet') {
    return 'Диванный магнит слабеет от любого движения в квестах.';
  }
  if (mobId === 'empty_day') {
    return 'Пустой день можно заполнить одной отметкой — моб отступит.';
  }
  if (mobId === 'fog_of_fatigue') {
    return 'Туман усталости рассеивается, когда день отмечен.';
  }
  if (mobId === 'gray_heaviness') {
    return 'Серая тягость — знак перегруза. Мягкий день тоже ход.';
  }
  if (isDayEmpty(entry, settings)) {
    return 'Отметь главное в квестах — образ дня прояснится.';
  }
  return 'Моб дня — игровой образ состояния, не оценка тебя.';
}
