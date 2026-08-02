import { describe, expect, it } from 'vitest';
import { BODY_ABILITY_BANK } from '../constants/bodyAbilityBank';
import type { BodyAbilityProfile } from '../types/bodyAbilityPersonal';
import { selectPersonalBodyAbilities } from './bodyAbilitySelectionEngine';
import { getThemedBodyAbilityPresentation } from '../game/bodyAbilityThemePresentation';
import {
  applyBodyAbilityProfile,
  emptyPersonalState,
  getPersonalBodyAbilitiesState,
  respondToSuggestedAbility,
  syncPersonalBodyAbilityProgress,
} from './bodyAbilityPersonalEngine';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { AppSettings, DailyEntry } from '../types';
import { emptyDaily } from '../store/appStore';

function profile(partial: Partial<BodyAbilityProfile>): BodyAbilityProfile {
  return {
    goalKg: 15,
    goalBand: '10_20',
    pathTypes: ['control_return'],
    interests: ['endurance', 'nutrition_control'],
    baselineEasy: [],
    hiddenTopics: [],
    configuredAt: '2026-08-02T00:00:00.000Z',
    ...partial,
  };
}

describe('selectPersonalBodyAbilities', () => {
  it('under_10 profile does not select deep mobility abilities by default', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalKg: 8,
        goalBand: 'under_10',
        pathTypes: ['shape_tuning', 'appearance_focus'],
        interests: ['appearance', 'nutrition_control', 'measurements'],
      }),
    );
    const ids = selected.map((a) => a.id);
    expect(ids).not.toContain('tie_shoes_easier');
    expect(ids).not.toContain('stand_from_floor_easier');
    expect(ids).not.toContain('car_seat_easier');
    expect(selected.length).toBeGreaterThanOrEqual(20);
    expect(selected.length).toBeLessThanOrEqual(30);
  });

  it('80_plus profile can select deep mobility abilities', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalKg: 90,
        goalBand: '80_plus',
        pathTypes: ['mobility_return', 'load_reduction'],
        interests: ['mobility', 'daily_life', 'stairs_routes', 'flexibility'],
      }),
    );
    const ids = selected.map((a) => a.id);
    expect(
      ids.some((id) =>
        [
          'tie_shoes_easier',
          'stand_from_floor_easier',
          'stairs_easier',
          'mobility_return_felt',
          'chores_without_drain',
        ].includes(id),
      ),
    ).toBe(true);
  });

  it('baselineEasy tie_shoes excludes shoes ability', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalKg: 70,
        goalBand: '50_80',
        pathTypes: ['mobility_return'],
        interests: ['flexibility', 'mobility', 'daily_life'],
        baselineEasy: ['tie_shoes'],
      }),
    );
    expect(selected.map((a) => a.id)).not.toContain('tie_shoes_easier');
  });

  it('baselineEasy walk_15k excludes beginner walking abilities', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalKg: 40,
        goalBand: '20_50',
        pathTypes: ['mobility_return'],
        interests: ['endurance', 'stairs_routes'],
        baselineEasy: ['walk_15k'],
      }),
    );
    const ids = selected.map((a) => a.id);
    expect(ids).not.toContain('walk_easier_short');
    expect(ids).not.toContain('steps_minimum_held');
  });

  it('hiddenTopics alcohol excludes alcohol abilities', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        interests: ['alcohol_evening', 'confidence'],
        hiddenTopics: ['alcohol'],
      }),
    );
    expect(selected.every((a) => a.category !== 'alcohol_evening')).toBe(true);
    expect(selected.every((a) => !(a.hiddenByTopics ?? []).includes('alcohol'))).toBe(true);
  });

  it('hiddenTopics appearance excludes appearance abilities', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalBand: 'under_10',
        interests: ['appearance', 'measurements'],
        hiddenTopics: ['appearance'],
      }),
    );
    expect(selected.every((a) => a.category !== 'appearance')).toBe(true);
  });

  it('selected count is between 20 and 30', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalBand: '20_50',
        pathTypes: ['control_return', 'shape_tuning'],
        interests: ['nutrition_control', 'endurance', 'confidence'],
      }),
    );
    expect(selected.length).toBeGreaterThanOrEqual(20);
    expect(selected.length).toBeLessThanOrEqual(30);
  });

  it('selection has category diversity', () => {
    const selected = selectPersonalBodyAbilities(
      profile({
        goalBand: '20_50',
        pathTypes: ['control_return', 'mobility_return', 'athlete_return'],
        interests: [
          'endurance',
          'nutrition_control',
          'sport_training',
          'confidence',
          'sleep_resource',
        ],
      }),
    );
    const categories = new Set(selected.map((a) => a.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });

  it('bank has at least 80 abilities', () => {
    expect(BODY_ABILITY_BANK.length).toBeGreaterThanOrEqual(80);
  });
});

describe('body ability personal state / unlock', () => {
  it('old empty profile does not crash', () => {
    const empty = emptyPersonalState();
    expect(empty.selectedAbilityIds).toEqual([]);
    expect(getPersonalBodyAbilitiesState(DEFAULT_APP_SETTINGS).profile).toBeNull();
  });

  it('Dark/Cozy presentations resolve for selected ability', () => {
    const cozy = getThemedBodyAbilityPresentation('cozy', 'clothes_fit_better');
    const dark = getThemedBodyAbilityPresentation('darkFantasy', 'clothes_fit_better');
    expect(cozy.title).toBeTruthy();
    expect(dark.title).toBeTruthy();
    expect(cozy.flavor).not.toBe(dark.flavor);
  });

  it('suggested_confirmation abilities are not auto-unlocked', () => {
    let settings: AppSettings = applyBodyAbilityProfile(
      DEFAULT_APP_SETTINGS,
      profile({
        goalKg: 70,
        goalBand: '50_80',
        pathTypes: ['mobility_return'],
        interests: ['mobility', 'flexibility', 'daily_life'],
      }),
    );
    const personal = getPersonalBodyAbilitiesState(settings);
    const suggestedId = personal.selectedAbilityIds.find((id) => {
      const def = BODY_ABILITY_BANK.find((a) => a.id === id);
      return def?.unlockMode === 'suggested_confirmation';
    });
    expect(suggestedId).toBeTruthy();

    settings = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries: [],
      measurements: [
        { id: '1', date: '2026-01-01', weight: 120, waist: 120 },
        { id: '2', date: '2026-06-01', weight: 100, waist: 110 },
      ],
    });

    const after = getPersonalBodyAbilitiesState(settings).abilities[suggestedId!];
    expect(after?.status).not.toBe('unlocked');
  });

  it('auto abilities unlock only by data thresholds', () => {
    let settings: AppSettings = applyBodyAbilityProfile(
      DEFAULT_APP_SETTINGS,
      profile({
        goalKg: 12,
        goalBand: '10_20',
        pathTypes: ['control_return'],
        interests: ['nutrition_control', 'confidence', 'endurance'],
      }),
    );

    // Prefer a selected auto ability with a simple threshold.
    const autoId =
      getPersonalBodyAbilitiesState(settings).selectedAbilityIds.find((id) => {
        const def = BODY_ABILITY_BANK.find((a) => a.id === id);
        return def?.unlockMode === 'auto' && def.autoUnlock?.type === 'no_alcohol_days';
      }) ??
      getPersonalBodyAbilitiesState(settings).selectedAbilityIds.find((id) => {
        const def = BODY_ABILITY_BANK.find((a) => a.id === id);
        return def?.unlockMode === 'auto' && def.autoUnlock?.type === 'recovery_days';
      });

    expect(autoId).toBeTruthy();
    const def = BODY_ABILITY_BANK.find((a) => a.id === autoId)!;
    const target = def.autoUnlock!.target;

    const entries: DailyEntry[] = Array.from({ length: target }, (_, i) => ({
      ...emptyDaily(`2026-08-${String(i + 1).padStart(2, '0')}`),
      alcohol: 'none',
      dayMode: 'recovery',
    }));

    const before = getPersonalBodyAbilitiesState(settings).abilities[autoId!]?.status;
    expect(before).toBe('locked');

    settings = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries: entries,
      measurements: [],
    });

    expect(getPersonalBodyAbilitiesState(settings).abilities[autoId!]?.status).toBe('unlocked');
  });

  it('respondToSuggestedAbility can unlock or hide', () => {
    let settings = applyBodyAbilityProfile(
      DEFAULT_APP_SETTINGS,
      profile({
        goalKg: 70,
        goalBand: '50_80',
        pathTypes: ['mobility_return'],
        interests: ['mobility', 'daily_life'],
      }),
    );
    const id = getPersonalBodyAbilitiesState(settings).selectedAbilityIds[0]!;
    settings = {
      ...settings,
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...getPersonalBodyAbilitiesState(settings),
          abilities: {
            ...getPersonalBodyAbilitiesState(settings).abilities,
            [id]: {
              ...getPersonalBodyAbilitiesState(settings).abilities[id]!,
              status: 'suggested',
              suggestedAt: '2026-08-02T00:00:00.000Z',
            },
          },
        },
      },
    };
    const unlocked = respondToSuggestedAbility(settings, id, 'yes');
    expect(getPersonalBodyAbilitiesState(unlocked).abilities[id]?.status).toBe('unlocked');
    const hidden = respondToSuggestedAbility(settings, id, 'irrelevant');
    expect(getPersonalBodyAbilitiesState(hidden).abilities[id]?.status).toBe('hidden');
  });
});
