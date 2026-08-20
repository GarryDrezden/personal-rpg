import type { AppSettings, DailyEntry } from '../types';
import type { AppThemeId } from '../types/theme';
import type { CozyRewardsGranted } from '../types/cozyHome';
import type { TodayReactionContext } from '../content/todayReactions';
import { pickTodayReaction } from '../content/todayReactions';
import { getDayMode } from './stepsEngine';
import { getDailyResource } from './resourceEngine';
import { isNutritionLogged, isNutritionTrackingEnabled } from './nutritionEngine';
import { isDayEmpty } from './questEngine';
import {
  getMovementCredit,
  hasMarkedPhysicalActivity,
  isHeavyPhysicalActivity,
} from './movementCreditEngine';
import { sumCozyGrantedResources } from './cozyHomeRewardsEngine';

export type TodaySaveReaction = {
  headline: string;
  detail: string;
  baseLine?: string;
  contextId?: TodayReactionContext;
  variantId?: string;
  /**
   * Structured Cozy Home feedback for the save moment.
   * Set only when resources were just granted (not on reload re-display).
   */
  cozyFeedback?: CozyRewardsGranted | null;
};

export type TodayReactionMeta = {
  daysAway?: number;
  loggedDayCount?: number;
};

function alcoholTrackingOn(settings: AppSettings): boolean {
  return settings.enableAlcoholTracking !== false;
}

function physicalTrackingOn(settings: AppSettings): boolean {
  return settings.enablePhysicalActivityTracking !== false;
}

export function resolveTodayReactionContext(params: {
  entry: DailyEntry;
  settings: AppSettings;
  questDone: number;
  questTotal: number;
  points: number;
  meta?: TodayReactionMeta;
}): TodayReactionContext {
  const { entry, settings, questDone, questTotal, points, meta } = params;
  const mode = getDayMode(entry.dayMode);
  const resource = getDailyResource(entry);
  const movement = getMovementCredit(entry, settings);
  const logged = meta?.loggedDayCount ?? 0;
  const daysAway = meta?.daysAway ?? 0;
  const nutritionOn = isNutritionTrackingEnabled(settings);
  const alcoholOn = alcoholTrackingOn(settings);
  const paOn = physicalTrackingOn(settings);

  if (mode === 'minimal') return 'minimal';
  if (mode === 'recovery') return 'recovery';
  if (Number.isFinite(daysAway) && daysAway >= 3) return 'return';
  if (logged <= 1) return 'first_day';

  if (paOn && isHeavyPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return 'heavy_physical';
  }
  if (paOn && hasMarkedPhysicalActivity(entry) && movement.holdsMinimumMovement) {
    return 'physical';
  }
  if ((entry.steps ?? 0) > 0) return 'steps';

  if (resource.level === 'low' || (entry.energyLevel != null && entry.energyLevel <= 2)) {
    return 'low_resource';
  }

  const nutritionHeld = nutritionOn && isNutritionLogged({ entry, settings });
  const eveningClear = alcoholOn && entry.alcohol === 'none';
  if (nutritionHeld && eveningClear && questDone > 0 && points < 70) {
    return 'mixed';
  }
  if (nutritionHeld && points < 40) {
    return 'imperfect';
  }
  if (nutritionHeld) return 'nutrition';
  if (eveningClear) return 'alcohol_free';

  if (logged >= 90 && questDone > 0) return 'veteran';

  if (questDone > 0 && questTotal > 0) {
    if (questDone >= Math.ceil(questTotal * 0.6)) return 'good_day';
    return 'quests_progress';
  }

  if (!isDayEmpty(entry, settings) && points > 0) return 'points_saved';
  if (isDayEmpty(entry, settings)) return 'empty_saved';
  return 'default';
}

export function getTodaySaveReaction(params: {
  entry: DailyEntry;
  settings: AppSettings;
  questDone: number;
  questTotal: number;
  points: number;
  themeId?: AppThemeId;
  meta?: TodayReactionMeta;
}): TodaySaveReaction {
  const themeId = params.themeId ?? params.settings.themeId ?? 'cozy';
  const context = resolveTodayReactionContext(params);
  const picked = pickTodayReaction({
    themeId,
    context,
    date: params.entry.date,
  });
  return {
    headline: picked.headline,
    detail: picked.detail,
    contextId: context,
    variantId: picked.id,
  };
}

export function attachCozySaveFeedback(
  reaction: TodaySaveReaction,
  rewards: CozyRewardsGranted | null | undefined,
  justGranted: boolean,
): TodaySaveReaction {
  if (!justGranted || !rewards) return { ...reaction, cozyFeedback: null };
  if (sumCozyGrantedResources(rewards.resources) <= 0) {
    return { ...reaction, cozyFeedback: null };
  }
  return { ...reaction, cozyFeedback: rewards };
}
