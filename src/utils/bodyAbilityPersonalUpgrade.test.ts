import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { BODY_ABILITY_BANK_VERSION } from '../constants/bodyAbilityBank';
import { PROFILE_B_SMALL_APPEARANCE, PROFILE_C_LARGE_LOW_MOBILITY } from '../fixtures/bodyAbilityProfiles';
import type { AppSettings } from '../types';
import {
  applyBodyAbilityProfile,
  getArchivedUnlockedAbilityItems,
  getPersonalAbilityItems,
  getPersonalBodyAbilitiesState,
  hasLegacyBodyAbilityUnlocks,
  isBodyAbilityProfileConfigured,
  needsBodyAbilityMapUpgrade,
  regenerateBodyAbilityMap,
} from './bodyAbilityPersonalEngine';

function withConfiguredProfile(base: AppSettings = DEFAULT_APP_SETTINGS): AppSettings {
  return applyBodyAbilityProfile(base, {
    ...PROFILE_C_LARGE_LOW_MOBILITY,
    configuredAt: '2026-08-02T00:00:00.000Z',
  });
}

describe('Body Ability map upgrade for existing users', () => {
  it('legacy user without profile is not treated as configured (no forced setup gate)', () => {
    expect(isBodyAbilityProfileConfigured(DEFAULT_APP_SETTINGS)).toBe(false);
    expect(needsBodyAbilityMapUpgrade(DEFAULT_APP_SETTINGS)).toBe(true);
  });

  it('detects legacy v1 unlocks without personal profile', () => {
    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      bodyAbilityState: {
        unlockedAbilityIds: ['tie_shoes_easier'],
        abilityUnlocks: [],
        dismissedAbilityHintIds: [],
      },
    };
    expect(hasLegacyBodyAbilityUnlocks(settings)).toBe(true);
    expect(isBodyAbilityProfileConfigured(settings)).toBe(false);
  });

  it('completing setup for existing user creates profile and selected ids', () => {
    const next = applyBodyAbilityProfile(DEFAULT_APP_SETTINGS, {
      ...PROFILE_B_SMALL_APPEARANCE,
      configuredAt: '2026-08-02T12:00:00.000Z',
    });
    expect(isBodyAbilityProfileConfigured(next)).toBe(true);
    const personal = getPersonalBodyAbilitiesState(next);
    expect(personal.profile?.goalKg).toBe(10);
    expect(personal.selectedAbilityIds.length).toBeGreaterThanOrEqual(20);
    expect(personal.generatedFromVersion).toBe(BODY_ABILITY_BANK_VERSION);
    expect(personal.abilityBankVersion).toBe(BODY_ABILITY_BANK_VERSION);
    expect(needsBodyAbilityMapUpgrade(next)).toBe(false);
  });

  it('setup regenerates selectedAbilityIds and updates bank version', () => {
    let settings = withConfiguredProfile();
    settings = {
      ...settings,
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...getPersonalBodyAbilitiesState(settings),
          abilityBankVersion: 'old-bank',
          generatedFromVersion: 'old-bank',
        },
      },
    };
    expect(needsBodyAbilityMapUpgrade(settings)).toBe(true);

    const next = applyBodyAbilityProfile(settings, {
      ...PROFILE_B_SMALL_APPEARANCE,
      configuredAt: '2026-08-02T13:00:00.000Z',
    });
    const personal = getPersonalBodyAbilitiesState(next);
    expect(personal.selectedAbilityIds.length).toBeGreaterThanOrEqual(20);
    expect(personal.generatedFromVersion).toBe(BODY_ABILITY_BANK_VERSION);
  });

  it('unlocked abilities are retained on regenerate', () => {
    let settings = withConfiguredProfile();
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
              unlockedAt: '2026-08-02T10:00:00.000Z',
              confirmedByUser: true,
            },
          },
        },
      },
    };

    const next = regenerateBodyAbilityMap(settings, {
      ...PROFILE_B_SMALL_APPEARANCE,
      configuredAt: '2026-08-02T14:00:00.000Z',
    });
    const personal = getPersonalBodyAbilitiesState(next);
    expect(personal.abilities[firstId]?.status).toBe('unlocked');
    expect(
      personal.selectedAbilityIds.includes(firstId) ||
        (personal.archivedUnlockedIds ?? []).includes(firstId),
    ).toBe(true);
  });

  it('hidden topics remove from active grid but keep unlocked history', () => {
    let settings = applyBodyAbilityProfile(DEFAULT_APP_SETTINGS, {
      ...PROFILE_B_SMALL_APPEARANCE,
      hiddenTopics: [],
      configuredAt: '2026-08-02T00:00:00.000Z',
    });
    const alcoholId =
      getPersonalBodyAbilitiesState(settings).selectedAbilityIds.find((id) =>
        id.includes('alcohol'),
      ) ?? 'alcohol_free_week';

    // Force an unlocked alcohol ability into state even if not selected.
    settings = {
      ...settings,
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...getPersonalBodyAbilitiesState(settings),
          selectedAbilityIds: Array.from(
            new Set([
              ...getPersonalBodyAbilitiesState(settings).selectedAbilityIds,
              alcoholId,
            ]),
          ),
          abilities: {
            ...getPersonalBodyAbilitiesState(settings).abilities,
            [alcoholId]: {
              abilityId: alcoholId,
              status: 'unlocked',
              selectedAt: '2026-08-02T00:00:00.000Z',
              unlockedAt: '2026-08-02T00:00:00.000Z',
              confirmedByUser: true,
            },
          },
        },
      },
    };

    const next = applyBodyAbilityProfile(settings, {
      ...PROFILE_B_SMALL_APPEARANCE,
      hiddenTopics: ['alcohol'],
      configuredAt: '2026-08-02T15:00:00.000Z',
    });
    const personal = getPersonalBodyAbilitiesState(next);
    expect(personal.selectedAbilityIds).not.toContain(alcoholId);
    expect(personal.archivedUnlockedIds).toContain(alcoholId);
    expect(personal.abilities[alcoholId]?.status).toBe('unlocked');
    expect(getPersonalAbilityItems(next).some((i) => i.definition.id === alcoholId)).toBe(
      false,
    );
    expect(
      getArchivedUnlockedAbilityItems(next).some((i) => i.definition.id === alcoholId),
    ).toBe(true);
  });

  it('cancel path: reading settings without apply leaves map unchanged', () => {
    const settings = withConfiguredProfile();
    const before = getPersonalBodyAbilitiesState(settings);
    // Simulates cancel: no applyBodyAbilityProfile call.
    const after = getPersonalBodyAbilitiesState(settings);
    expect(after.selectedAbilityIds).toEqual(before.selectedAbilityIds);
    expect(after.generatedAt).toBe(before.generatedAt);
  });

  it('stale bank version triggers soft upgrade flag', () => {
    const settings = withConfiguredProfile();
    const stale: AppSettings = {
      ...settings,
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...getPersonalBodyAbilitiesState(settings),
          abilityBankVersion: '2026.01.01',
          generatedFromVersion: '2026.01.01',
        },
      },
    };
    expect(needsBodyAbilityMapUpgrade(stale)).toBe(true);
    expect(isBodyAbilityProfileConfigured(stale)).toBe(true);
  });
});
