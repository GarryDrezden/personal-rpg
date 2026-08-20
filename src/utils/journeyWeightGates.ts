import type { AppSettings, MeasurementEntry } from '../types';
import { getStartWeight } from '../game/heroProgressEngine';

/**
 * Campaign weight gates in Journey Map were written as absolute kilograms
 * (1 / 5 / 10 / 20 / 50). A −10 kg path cannot finish that campaign.
 * Scale gates to the personal goal; never harder than the original absolute.
 */
export const JOURNEY_WEIGHT_GATE_RATIOS: Record<number, number> = {
  1: 0.1,
  5: 0.25,
  10: 0.5,
  20: 0.8,
  50: 1,
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function formatJourneyKg(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Personal kg to lose: start − target, when that direction is weight loss. */
export function resolvePersonalWeightGoalKg(
  settings: Pick<AppSettings, 'weightGoal' | 'targetWeight' | 'bodyAbilityState'>,
  measurements: MeasurementEntry[],
): number | null {
  const start = getStartWeight(measurements);
  const target = settings.targetWeight ?? settings.weightGoal ?? null;
  if (start != null && target != null && start > target + 0.05) {
    return round1(start - target);
  }
  const profileGoal = settings.bodyAbilityState?.personal?.profile?.goalKg;
  if (typeof profileGoal === 'number' && profileGoal > 0) {
    return round1(profileGoal);
  }
  return null;
}

/**
 * Map an absolute Journey kg gate onto a personal goal.
 * Example (−10 kg path): 1 → 1, 5 → 2.5, 10 → 5, 20 → 8, 50 → 10.
 * Example (−80 kg path): 1/5/10/20 stay absolute; 50 stays 50 (never harder).
 */
export function scaleJourneyWeightTarget(
  absoluteKg: number,
  personalGoalKg: number | null | undefined,
): number {
  if (
    personalGoalKg == null ||
    personalGoalKg <= 0 ||
    !Number.isFinite(personalGoalKg)
  ) {
    return absoluteKg;
  }
  if (absoluteKg <= 1) {
    return round1(Math.min(absoluteKg, personalGoalKg));
  }
  const ratio = JOURNEY_WEIGHT_GATE_RATIOS[absoluteKg];
  const scaled = ratio != null ? personalGoalKg * ratio : absoluteKg;
  return round1(Math.min(absoluteKg, personalGoalKg, Math.max(0.5, scaled)));
}
