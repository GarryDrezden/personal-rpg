import { describe, expect, it } from 'vitest';
import {
  BODY_ABILITY_BANK,
  BODY_ABILITY_BANK_VERSION,
} from '../constants/bodyAbilityBank';
import {
  PROFILE_A_LARGE_ATHLETIC,
  PROFILE_B_SMALL_APPEARANCE,
  PROFILE_C_LARGE_LOW_MOBILITY,
  PROFILE_D_ATHLETE_COMEBACK,
} from '../fixtures/bodyAbilityProfiles';
import {
  explainBodyAbilitySelection,
  selectPersonalBodyAbilities,
} from './bodyAbilitySelectionEngine';
import {
  applyBodyAbilityProfile,
  emptyPersonalState,
  getPersonalBodyAbilitiesState,
  previewBodyAbilitySelection,
  regenerateBodyAbilityMap,
} from './bodyAbilityPersonalEngine';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { AppSettings } from '../types';

const BAD_BASIC_MOBILITY = [
  'tie_shoes_easier',
  'stand_from_floor_easier',
  'stairs_easier',
  'stairs_as_stage',
  'breath_after_stairs',
  'walk_easier_short',
  'steps_minimum_held',
  'car_seat_easier',
  'chores_without_drain',
  'get_up_easier',
  'chair_space_easier',
];

function idsOf(profile: Parameters<typeof selectPersonalBodyAbilities>[0]) {
  return selectPersonalBodyAbilities(profile).map((a) => a.id);
}

describe('Body Abilities quality pass — QA archetypes', () => {
  it('bank version is set and bank has kinds', () => {
    expect(BODY_ABILITY_BANK_VERSION).toBeTruthy();
    expect(BODY_ABILITY_BANK.every((a) => a.kind)).toBe(true);
    expect(BODY_ABILITY_BANK.length).toBeGreaterThanOrEqual(80);
  });

  it('selection is deterministic', () => {
    const a = idsOf(PROFILE_A_LARGE_ATHLETIC);
    const b = idsOf(PROFILE_A_LARGE_ATHLETIC);
    expect(a).toEqual(b);
  });

  it('Profile A: athletic large goal avoids basic limitations', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_A_LARGE_ATHLETIC);
    const ids = explanation.selected.map((s) => s.abilityId);

    expect(explanation.stats.count).toBeGreaterThanOrEqual(20);
    expect(explanation.stats.count).toBeLessThanOrEqual(30);
    for (const bad of BAD_BASIC_MOBILITY) {
      expect(ids).not.toContain(bad);
    }
    expect(explanation.stats.byCategory.daily_life ?? 0).toBeLessThanOrEqual(2);
    expect(
      ids.some((id) =>
        [
          'training_return_base',
          'stable_training_mode',
          'strength_base',
          'technique_returns',
          'resource_after_load',
          'training_load_recover',
        ].includes(id),
      ),
    ).toBe(true);
    expect(
      ids.some((id) => id.startsWith('weight_pass_') || id.startsWith('waist_')),
    ).toBe(true);
    expect(
      ids.some((id) =>
        ['alcohol_free_week', 'alcohol_free_month', 'evening_ritual_calm'].includes(id),
      ),
    ).toBe(true);
    expect(explanation.stats.universalCount).toBeLessThanOrEqual(3);
    expect(explanation.stats.weightMilestoneCount).toBeLessThanOrEqual(
      Math.floor(explanation.stats.count * 0.2) + 1,
    );
  });

  it('Profile B: small appearance goal without heavy mobility', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_B_SMALL_APPEARANCE);
    const ids = explanation.selected.map((s) => s.abilityId);

    for (const bad of BAD_BASIC_MOBILITY) {
      expect(ids).not.toContain(bad);
    }
    expect(
      ids.some((id) =>
        ['clothes_fit_better', 'silhouette_cleaner', 'photo_progress', 'size_looser'].includes(
          id,
        ),
      ),
    ).toBe(true);
    expect(
      ids.some((id) =>
        ['weight_pass_2', 'weight_pass_5', 'weight_pass_10', 'waist_minus_2', 'waist_minus_5'].includes(
          id,
        ),
      ),
    ).toBe(true);
    expect(
      ids.some((id) =>
        ['nutrition_logged_week', 'nutrition_limit_streak', 'less_evening_food_chaos'].includes(
          id,
        ),
      ),
    ).toBe(true);
  });

  it('Profile C: low mobility gets functional progression, no alcohol', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_C_LARGE_LOW_MOBILITY);
    const ids = explanation.selected.map((s) => s.abilityId);

    expect(
      ids.some((id) =>
        [
          'tie_shoes_easier',
          'stand_from_floor_easier',
          'stairs_easier',
          'walk_easier_short',
          'chores_without_drain',
        ].includes(id),
      ),
    ).toBe(true);
    expect(ids.every((id) => !id.includes('alcohol'))).toBe(true);
    expect(
      explanation.selected.every((s) => s.category !== 'alcohol_evening'),
    ).toBe(true);
    const diffs = new Set(explanation.selected.map((s) => s.difficulty));
    expect(diffs.has('early')).toBe(true);
    expect(diffs.has('late') || diffs.has('epic') || diffs.has('middle')).toBe(true);
  });

  it('Profile D: athlete comeback without chores/alcohol/basic walk', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_D_ATHLETE_COMEBACK);
    const ids = explanation.selected.map((s) => s.abilityId);

    for (const bad of [
      'tie_shoes_easier',
      'chores_without_drain',
      'walk_easier_short',
      'steps_minimum_held',
      'alcohol_free_week',
      'alcohol_free_month',
    ]) {
      expect(ids).not.toContain(bad);
    }
    expect(
      ids.some((id) =>
        [
          'training_return_base',
          'stable_training_mode',
          'strength_base',
          'technique_returns',
          'resource_after_load',
          'training_load_recover',
        ].includes(id),
      ),
    ).toBe(true);
  });

  it('quality caps: category diversity and count bounds', () => {
    for (const profile of [
      PROFILE_A_LARGE_ATHLETIC,
      PROFILE_B_SMALL_APPEARANCE,
      PROFILE_C_LARGE_LOW_MOBILITY,
      PROFILE_D_ATHLETE_COMEBACK,
    ]) {
      const explanation = explainBodyAbilitySelection(profile);
      expect(explanation.stats.count).toBeGreaterThanOrEqual(20);
      expect(explanation.stats.count).toBeLessThanOrEqual(30);
      expect(Object.keys(explanation.stats.byCategory).length).toBeGreaterThanOrEqual(4);
      const maxCat = Math.max(...Object.values(explanation.stats.byCategory));
      expect(maxCat).toBeLessThanOrEqual(Math.max(3, Math.floor(explanation.stats.count * 0.25)));
      expect(explanation.stats.byDifficulty.early ?? 0).toBeGreaterThanOrEqual(2);
      expect(explanation.stats.subjectiveCount).toBeGreaterThanOrEqual(3);
    }
  });

  it('hiddenTopics never violated including fallback', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_C_LARGE_LOW_MOBILITY);
    expect(
      explanation.selected.every((s) => s.category !== 'alcohol_evening'),
    ).toBe(true);
    expect(
      explanation.rejectedExamples.some((r) => r.reason === 'hiddenTopics'),
    ).toBe(true);
  });

  it('baseline exclusions never return via fallback', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_A_LARGE_ATHLETIC);
    const baselineRejected = explanation.rejectedExamples
      .filter((r) => r.reason === 'baselineEasy')
      .map((r) => r.abilityId);
    expect(baselineRejected.length).toBeGreaterThan(0);
    for (const id of baselineRejected) {
      expect(explanation.selected.some((s) => s.abilityId === id)).toBe(false);
    }
    expect(explanation.selected.every((s) => !s.viaFallback || !baselineRejected.includes(s.abilityId))).toBe(
      true,
    );
  });

  it('explain output includes scores and reject samples', () => {
    const explanation = explainBodyAbilitySelection(PROFILE_A_LARGE_ATHLETIC);
    expect(explanation.selected[0]?.finalScore).toBeTypeOf('number');
    expect(explanation.selected[0]?.whySelected.length).toBeGreaterThan(0);
    expect(explanation.rejectedExamples.length).toBeGreaterThan(0);
  });

  it('preview matches future saved grid ids', () => {
    const preview = previewBodyAbilitySelection(PROFILE_B_SMALL_APPEARANCE);
    const settings = applyBodyAbilityProfile(DEFAULT_APP_SETTINGS, {
      ...PROFILE_B_SMALL_APPEARANCE,
      configuredAt: '2026-08-02T00:00:00.000Z',
    });
    const saved = getPersonalBodyAbilitiesState(settings).selectedAbilityIds;
    for (const item of preview.selected) {
      expect(saved).toContain(item.abilityId);
    }
  });

  it('regenerate keeps unlocked abilities', () => {
    let settings: AppSettings = applyBodyAbilityProfile(DEFAULT_APP_SETTINGS, {
      ...PROFILE_C_LARGE_LOW_MOBILITY,
      configuredAt: '2026-08-02T00:00:00.000Z',
    });
    const firstId = getPersonalBodyAbilitiesState(settings).selectedAbilityIds[0]!;
    settings = {
      ...settings,
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...getPersonalBodyAbilitiesState(settings),
          abilities: {
            ...getPersonalBodyAbilitiesState(settings).abilities,
            [firstId]: {
              ...getPersonalBodyAbilitiesState(settings).abilities[firstId]!,
              status: 'unlocked',
              unlockedAt: '2026-08-02T12:00:00.000Z',
              confirmedByUser: true,
            },
          },
        },
      },
    };

    const regenerated = regenerateBodyAbilityMap(settings, {
      ...PROFILE_A_LARGE_ATHLETIC,
      configuredAt: '2026-08-02T13:00:00.000Z',
    });
    const personal = getPersonalBodyAbilitiesState(regenerated);
    expect(personal.abilities[firstId]?.status).toBe('unlocked');
    expect(personal.selectedAbilityIds).toContain(firstId);
    expect(personal.abilityBankVersion).toBe(BODY_ABILITY_BANK_VERSION);
    expect(personal.generatedFromVersion).toBe(BODY_ABILITY_BANK_VERSION);
    expect(
      personal.retainedUnlockedIds?.includes(firstId) ||
        personal.archivedUnlockedIds?.includes(firstId),
    ).toBe(true);
  });

  it('old empty profile does not crash', () => {
    expect(emptyPersonalState().selectedAbilityIds).toEqual([]);
    expect(getPersonalBodyAbilitiesState(DEFAULT_APP_SETTINGS).profile).toBeNull();
  });
});
