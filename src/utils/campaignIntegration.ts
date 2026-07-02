import type { PlateauModeLevel } from '../types/plateauV1';

/** Body ability hint yields to plateau messaging on Today. */
export function shouldShowBodyAbilityHintOnToday(plateauMode: PlateauModeLevel): boolean {
  return plateauMode === 'none';
}

/** Plateau summary on Dashboard only when mode is active or soft hint. */
export function shouldShowPlateauDashboardSummary(mode: PlateauModeLevel): boolean {
  return mode !== 'none';
}
