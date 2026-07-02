import { describe, expect, it } from 'vitest';
import {
  shouldShowBodyAbilityHintOnToday,
  shouldShowPlateauDashboardSummary,
} from './campaignIntegration';

describe('campaignIntegration', () => {
  it('hides body ability hint on Today when plateau is active', () => {
    expect(shouldShowBodyAbilityHintOnToday('active')).toBe(false);
    expect(shouldShowBodyAbilityHintOnToday('soft_hint')).toBe(false);
  });

  it('shows body ability hint on Today when no plateau', () => {
    expect(shouldShowBodyAbilityHintOnToday('none')).toBe(true);
  });

  it('shows plateau dashboard summary only when plateau mode is on', () => {
    expect(shouldShowPlateauDashboardSummary('active')).toBe(true);
    expect(shouldShowPlateauDashboardSummary('soft_hint')).toBe(true);
    expect(shouldShowPlateauDashboardSummary('none')).toBe(false);
  });
});
