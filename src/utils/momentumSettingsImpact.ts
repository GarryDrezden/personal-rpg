import type { AppSettings } from '../types';
import { getEarliestAffectedDateFromWeeklySettingsChange } from './momentumRebuildUtils';
import type { MomentumRebuildStrategy } from './momentumRebuildUtils';

/** Global defaults that affect momentum for every day */
export function settingsAffectMomentumGlobally(
  prev: AppSettings,
  next: AppSettings,
): boolean {
  if (prev.defaultCaloriesLimit !== next.defaultCaloriesLimit) return true;
  if (prev.defaultStepsMinimum !== next.defaultStepsMinimum) return true;
  if (prev.defaultStepsNormal !== next.defaultStepsNormal) return true;
  if (prev.defaultStepsGoal !== next.defaultStepsGoal) return true;
  if (prev.defaultStepsExcellent !== next.defaultStepsExcellent) return true;
  return false;
}

/** @deprecated use resolveMomentumRebuildOnSettingsChange */
export function settingsAffectMomentum(prev: AppSettings, next: AppSettings): boolean {
  if (settingsAffectMomentumGlobally(prev, next)) return true;
  return (
    getEarliestAffectedDateFromWeeklySettingsChange({
      previousWeeklySettings: prev.weeklySettings,
      nextWeeklySettings: next.weeklySettings,
    }) !== null
  );
}

export function resolveMomentumRebuildOnSettingsChange(
  prev: AppSettings,
  next: AppSettings,
): MomentumRebuildStrategy {
  if (settingsAffectMomentumGlobally(prev, next)) {
    return { type: 'full' };
  }

  const affectedDate = getEarliestAffectedDateFromWeeklySettingsChange({
    previousWeeklySettings: prev.weeklySettings,
    nextWeeklySettings: next.weeklySettings,
  });

  if (affectedDate) {
    return { type: 'fromDate', date: affectedDate };
  }

  return { type: 'none' };
}
