import type { AppSettings, DailyEntry } from '../../types';
import { getDayMode } from '../../utils/stepsEngine';
import { getNutritionQuestCompleted, isNutritionTrackingEnabled } from '../../utils/nutritionEngine';
import { hasJournalEntry } from '../../utils/journalEntry';
import type { SeasonQuestDef, SeasonQuestProgress, SeasonQuestType } from './seasonTypes';

function isResourceMarked(entry: DailyEntry): boolean {
  return (
    entry.energyLevel != null ||
    entry.sleepQuality != null ||
    (entry.cognitiveBreaks != null && entry.cognitiveBreaks !== 'none')
  );
}

function hasMovement(entry: DailyEntry): boolean {
  return (entry.steps ?? 0) > 0 || entry.morningExercise || entry.gym;
}

function isAlcoholFree(entry: DailyEntry): boolean {
  return entry.alcohol === 'none';
}

function isDaySaved(entry: DailyEntry): boolean {
  return Boolean(entry.id);
}

export function countQuestProgress(
  quest: SeasonQuestDef,
  entries: DailyEntry[],
  settings: AppSettings,
): number {
  return entries.filter((entry) => questDayMatches(quest, entry, settings)).length;
}

function questDayMatches(
  quest: SeasonQuestDef,
  entry: DailyEntry,
  settings: AppSettings,
): boolean {
  switch (quest.type as SeasonQuestType) {
    case 'daysWithNutritionTracking':
      if (!isNutritionTrackingEnabled(settings)) return false;
      return getNutritionQuestCompleted({ entry, settings });
    case 'daysWithStepsAtLeast':
      return (entry.steps ?? 0) >= (quest.stepsMin ?? 5000);
    case 'alcoholFreeDays':
      return isAlcoholFree(entry);
    case 'daysWithResourceMarked':
      return isResourceMarked(entry);
    case 'minimalDaysHeld':
      return getDayMode(entry.dayMode) === 'minimal';
    case 'recoveryDays':
      return getDayMode(entry.dayMode) === 'recovery';
    case 'daysWithJournal':
      return hasJournalEntry(entry);
    case 'daysWithMovement':
      return hasMovement(entry);
    case 'daysSaved':
      return isDaySaved(entry);
    default:
      return false;
  }
}

export function buildQuestProgressList(
  quests: SeasonQuestDef[],
  entries: DailyEntry[],
  settings: AppSettings,
): SeasonQuestProgress[] {
  return quests.map((quest) => {
    const current = countQuestProgress(quest, entries, settings);
    return {
      ...quest,
      current: Math.min(current, quest.target),
      completed: current >= quest.target,
    };
  });
}
