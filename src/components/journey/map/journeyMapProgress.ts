import type { JourneyStageProgress } from '../../../types/journeyMap';

export function computeJourneyPathProgress(stages: JourneyStageProgress[]): number {
  const sorted = [...stages].sort((a, b) => a.stage.order - b.stage.order);
  if (sorted.length <= 1) {
    const only = sorted[0];
    return only?.status === 'completed' ? 1 : (only?.progressPercent ?? 0) / 100;
  }

  const completedCount = sorted.filter((s) => s.status === 'completed').length;
  const current = sorted.find((s) => s.status === 'current');
  const segments = sorted.length - 1;

  if (current) {
    return Math.min(1, (completedCount + current.progressPercent / 100) / segments);
  }
  if (completedCount >= sorted.length) return 1;
  return completedCount / segments;
}
