import { describe, expect, it } from 'vitest';
import {
  BODY_ABILITIES_ACTIVE_COUNT,
  BODY_ABILITIES_FUTURE_COUNT,
  BODY_ABILITIES_ROADMAP_TOTAL,
  BODY_ABILITIES_V1,
  getActiveBodyAbilities,
  getFutureBodyAbilities,
} from './bodyAbilities/bodyAbilityConfig';
import {
  BODY_ABILITY_NEW_MOBILITY_DISPLAY_ORDER,
  BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER,
  BODY_ABILITY_SKILL_BOARD_SECTIONS,
  BODY_ABILITY_STABLE_FORM_DISPLAY_ORDER,
} from './bodyAbilityAssetUi';

describe('body abilities roadmap (36 entries)', () => {
  it('catalog has 36 total entries', () => {
    expect(BODY_ABILITIES_ROADMAP_TOTAL).toBe(36);
    expect(BODY_ABILITIES_V1).toHaveLength(36);
    expect(BODY_ABILITIES_ACTIVE_COUNT).toBe(12);
    expect(BODY_ABILITIES_FUTURE_COUNT).toBe(24);
  });

  it('active v1 abilities keep in-app art status', () => {
    for (const ability of getActiveBodyAbilities()) {
      expect(ability.availability).toBe('active');
      expect(ability.artStatus).toBe('inApp');
      expect(ability.progressionRing).toBe('early_signals');
      expect(ability.hintSignals.length).toBeGreaterThan(0);
    }
  });

  it('future abilities are placeholder roadmap entries', () => {
    for (const ability of getFutureBodyAbilities()) {
      expect(ability.availability).toBe('future');
      expect(ability.artStatus).toBe('placeholder');
      expect(ability.hintSignals).toHaveLength(0);
      expect(['stable_form', 'new_mobility']).toContain(ability.progressionRing);
    }
  });

  it('skill board sections cover all 36 abilities', () => {
    expect(BODY_ABILITY_SKILL_BOARD_SECTIONS).toHaveLength(3);
    const allIds = BODY_ABILITY_SKILL_BOARD_SECTIONS.flatMap((s) => [...s.displayOrder]);
    expect(allIds).toHaveLength(36);
    expect(new Set(allIds).size).toBe(36);
    expect(allIds).toEqual([
      ...BODY_ABILITY_SKILL_BOARD_DISPLAY_ORDER,
      ...BODY_ABILITY_STABLE_FORM_DISPLAY_ORDER,
      ...BODY_ABILITY_NEW_MOBILITY_DISPLAY_ORDER,
    ]);
  });
});
