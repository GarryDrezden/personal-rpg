import type { DailyEntry } from '../types';
import type { MeasurementEntry } from '../types';
import type { ArtifactId, AssetUnlockStatus, HeroStageNumber } from '../types/gameAssets';
import { hasAnyDailyData } from '../utils/achievementHelpers';
import { hasJournalEntry } from '../utils/journalEntry';

function countDaysMatching(
  entries: DailyEntry[],
  predicate: (entry: DailyEntry) => boolean,
): number {
  return entries.filter(predicate).length;
}

function consecutiveNoAlcoholDays(entries: DailyEntry[]): number {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let count = 0;
  for (const entry of sorted) {
    if (!hasAnyDailyData(entry)) continue;
    if (entry.alcohol === 'none') {
      count++;
      continue;
    }
    break;
  }
  return count;
}

export function getArtifactUnlockStatus(params: {
  artifactId: ArtifactId;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  currentStage: HeroStageNumber;
  momentumValue?: number;
}): AssetUnlockStatus {
  const { artifactId, dailyEntries, currentStage, momentumValue = 0 } = params;

  const unlocked = (() => {
    switch (artifactId) {
      case 'beer_staff':
        return consecutiveNoAlcoholDays(dailyEntries) >= 30;
      case 'clarity_crystal':
        return consecutiveNoAlcoholDays(dailyEntries) >= 7;
      case 'recovery_shield':
        return countDaysMatching(
          dailyEntries,
          (e) => e.dayMode === 'recovery' || e.dayMode === 'minimal',
        ) >= 3;
      case 'return_shield':
        return countDaysMatching(dailyEntries, hasJournalEntry) >= 5;
      case 'step_boots':
        return countDaysMatching(dailyEntries, (e) => (e.steps ?? 0) >= 7000) >= 7;
      case 'iron_boots':
        return countDaysMatching(dailyEntries, (e) => (e.steps ?? 0) >= 10000) >= 14;
      case 'control_compass':
        return countDaysMatching(dailyEntries, (e) => e.calories !== null) >= 7;
      case 'journal_quill':
        return countDaysMatching(dailyEntries, hasJournalEntry) >= 7;
      case 'momentum_core':
        return momentumValue >= 40;
      case 'body_key':
        return currentStage >= 5;
      case 'stability_seal':
        return currentStage >= 17;
      case 'night_lantern':
        return consecutiveNoAlcoholDays(dailyEntries) >= 14;
      case 'resource_flask':
        return countDaysMatching(dailyEntries, (e) => e.dayMode === 'recovery') >= 5;
      case 'boss_chain_fragment':
        return currentStage >= 10;
      case 'golden_collar':
        return dailyEntries.length >= 14;
      default:
        return false;
    }
  })();

  return unlocked ? 'unlocked' : 'locked';
}
