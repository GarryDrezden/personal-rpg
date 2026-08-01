import type { AppSettings, DailyEntry } from '../types';
import type { MobId } from '../types/gameAssets';
import type { AppThemeId } from '../types/theme';
import { MOB_IDS } from '../types/gameAssets';
import { getDailyResource, normalizeSleepQuality } from './resourceEngine';
import { getDayMode } from './stepsEngine';
import { isDayEmpty } from './questEngine';
import { isNutritionTrackingEnabled } from './nutritionEngine';
import {
  getMovementCredit,
  getPhysicalActivityLevel,
  hasMarkedPhysicalActivity,
  isHeavyPhysicalActivity,
} from './movementCreditEngine';

export function resolveDailyMobForEntry(
  entry: DailyEntry,
  settings: AppSettings,
): MobId {
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);
  const paLevel = getPhysicalActivityLevel(entry);
  const sleep = normalizeSleepQuality(entry.sleepQuality);

  if (mode === 'minimal') return 'empty_day';
  if (mode === 'recovery') return 'fog_of_fatigue';
  if (isDayEmpty(entry, settings)) return 'empty_day';

  // Heavy body load + poor recovery → fog of fatigue (resource cost, not weakness)
  if (
    isHeavyPhysicalActivity(entry) &&
    (resource.level === 'low' ||
      (entry.energyLevel != null && entry.energyLevel <= 2) ||
      sleep === 'poor' ||
      entry.physicalActivityDuration === '6h_plus')
  ) {
    return 'fog_of_fatigue';
  }

  // Low steps but medium/heavy physical activity — not a "sofa" day
  if (
    (entry.steps === null || entry.steps === 0) &&
    !(paLevel === 'medium' || paLevel === 'heavy') &&
    !movement.holdsMinimumMovement
  ) {
    return 'sofa_magnet';
  }

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
  themeId: AppThemeId = 'darkFantasy',
): string {
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);
  const cozy = themeId === 'cozy';

  if (mode === 'minimal') {
    return cozy
      ? 'Минимальный день — дом всё равно чуть теплее.'
      : 'Образ минимального дня — маршрут удержан без идеала.';
  }
  if (mode === 'recovery') {
    return cozy
      ? 'Помеха смягчается, когда отмечен день восстановления.'
      : 'Моб слабеет, когда день восстановления отмечен.';
  }
  if (mobId === 'fog_of_fatigue' && hasMarkedPhysicalActivity(entry)) {
    return cozy
      ? 'Туман над двором после тяжёлой нагрузки. Уходит после сна, паузы и восстановления.'
      : 'Туман поднялся после тяжёлой нагрузки. Он уязвим к сну, перерывам и восстановлению.';
  }
  if (resource.level === 'low') {
    return cozy
      ? 'Низкий ресурс — мягкий образ усталости, не приговор.'
      : 'Низкий ресурс — игровой образ усталости, не приговор.';
  }
  if (mobId === 'sofa_magnet') {
    return cozy
      ? 'Сонный плед слабеет от любого движения в задачах дня.'
      : 'Диванный магнит слабеет от любого движения в квестах.';
  }
  if (mobId === 'empty_day') {
    return cozy
      ? 'Тихую комнату можно согреть одной отметкой — помеха уйдёт.'
      : 'Пустой день можно заполнить одной отметкой — моб отступит.';
  }
  if (mobId === 'fog_of_fatigue') {
    return cozy
      ? 'Туман над двором рассеивается, когда день отмечен.'
      : 'Туман усталости рассеивается, когда день отмечен.';
  }
  if (mobId === 'gray_heaviness') {
    return 'Серая тягость — знак перегруза. Мягкий день тоже ход.';
  }
  if (movement.holdsMinimumMovement && movement.sources.includes('physical_activity')) {
    return 'День не пустой: активность была не в шагах, а в работе тела.';
  }
  if (isDayEmpty(entry, settings)) {
    return cozy
      ? 'Отметь главное в задачах дня — помеха прояснится.'
      : 'Отметь главное в квестах — образ дня прояснится.';
  }
  return cozy
    ? 'Помеха дня — мягкий образ состояния, не оценка тебя.'
    : 'Моб дня — игровой образ состояния, не оценка тебя.';
}
