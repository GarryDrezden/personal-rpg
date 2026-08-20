import type { AppSettings, DailyEntry } from '../types';
import type { MobId } from '../types/gameAssets';
import type { AppThemeId } from '../types/theme';
import { getDailyResource, normalizeSleepQuality } from './resourceEngine';
import { getDayMode } from './stepsEngine';
import { isDayEmpty } from './questEngine';
import { isNutritionTrackingEnabled } from './nutritionEngine';
import {
  getMovementCredit,
  getPhysicalActivityLevel,
  isHeavyPhysicalActivity,
} from './movementCreditEngine';
import {
  getEligibleDailyMobs,
  pickObstacleFlavor,
} from '../content/obstacles';

export function resolveDailyMobForEntry(
  entry: DailyEntry,
  settings: AppSettings,
): MobId {
  const eligible = getEligibleDailyMobs(entry, settings);
  const allows = (id: MobId) => eligible.includes(id);
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);
  const paLevel = getPhysicalActivityLevel(entry);
  const sleep = normalizeSleepQuality(entry.sleepQuality);
  const pickOr = (preferred: MobId, fallback: MobId): MobId =>
    allows(preferred) ? preferred : allows(fallback) ? fallback : (eligible[0] ?? 'empty_day');

  if (mode === 'minimal') return pickOr('empty_day', 'gray_heaviness');
  if (mode === 'recovery') return pickOr('fog_of_fatigue', 'gray_heaviness');
  if (isDayEmpty(entry, settings)) return pickOr('empty_day', 'impulse_of_rollback');

  if (
    isHeavyPhysicalActivity(entry) &&
    (resource.level === 'low' ||
      (entry.energyLevel != null && entry.energyLevel <= 2) ||
      sleep === 'poor' ||
      entry.physicalActivityDuration === '6h_plus')
  ) {
    return pickOr('fog_of_fatigue', 'gray_heaviness');
  }

  if (
    (entry.steps === null || entry.steps === 0) &&
    !(paLevel === 'medium' || paLevel === 'heavy') &&
    !movement.holdsMinimumMovement
  ) {
    if (allows('sofa_magnet')) return 'sofa_magnet';
  }

  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return pickOr('fog_of_fatigue', 'gray_heaviness');
  }
  if (
    isNutritionTrackingEnabled(settings) &&
    entry.nutritionLevel == null &&
    entry.calories === null &&
    allows('sweet_whisper')
  ) {
    return 'sweet_whisper';
  }

  const index = Math.abs(hashDate(entry.date)) % eligible.length;
  return eligible[index] ?? 'empty_day';
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
  _settings: AppSettings,
  themeId: AppThemeId = 'darkFantasy',
): string {
  const mode = getDayMode(entry.dayMode);
  if (mode === 'minimal' || mode === 'recovery') {
    return pickObstacleFlavor({
      themeId,
      mobId: mode === 'minimal' ? 'empty_day' : 'fog_of_fatigue',
      date: entry.date,
    }).text;
  }
  return pickObstacleFlavor({ themeId, mobId, date: entry.date }).text;
}
