import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { PROFILE_C_LARGE_LOW_MOBILITY } from '../fixtures/bodyAbilityProfiles';
import type { AppSettings } from '../types';
import type { SeasonSnapshot } from '../game/seasons/seasonTypes';
import type { JourneyMapSummary } from '../types/journeyMap';
import { applyBodyAbilityProfile, getPersonalBodyAbilitiesState } from './bodyAbilityPersonalEngine';
import {
  getDashboardNextProgress,
  isSeasonNearCompletion,
} from './dashboardNextProgress';
import { DEFAULT_COZY_HOME_STATE } from './cozyHomeEngine';
import { getJourneyMapSummary } from './journeyMapEngine';
import { COZY_HOME_MAX_LEVEL, COZY_HOME_ZONE_IDS } from '../constants/cozyHomeConfig';

function emptySeason(over: Partial<SeasonSnapshot> = {}): SeasonSnapshot {
  const quests = over.quests ?? [
    {
      id: 'q1',
      type: 'daysSaved',
      target: 10,
      label: 'Дни',
      current: 0,
      completed: false,
    },
    {
      id: 'q2',
      type: 'daysSaved',
      target: 10,
      label: 'Дни 2',
      current: 0,
      completed: false,
    },
    {
      id: 'q3',
      type: 'daysSaved',
      target: 10,
      label: 'Дни 3',
      current: 0,
      completed: false,
    },
    {
      id: 'q4',
      type: 'daysSaved',
      target: 10,
      label: 'Дни 4',
      current: 0,
      completed: false,
    },
  ];
  return {
    config: {
      id: 's1',
      actId: 'I',
      index: 1,
      title: 'Сезон',
      shortTitle: 'С1',
      focus: '',
      description: '',
      miniBossName: '',
      miniBossHint: '',
      rewardName: '',
      quests: quests.map(({ current: _c, completed: _d, ...def }) => def),
    },
    seasonIndex: 1,
    dayNumber: 20,
    seasonLength: 28,
    seasonStartDate: '2026-01-01',
    seasonEndDate: '2026-01-28',
    campaignStartDate: '2026-01-01',
    timeProgressPercent: 70,
    quests,
    completedQuestCount: 0,
    partialStatus: 'started',
    partialStatusLabel: '',
    questsNearCompletion: 0,
    ...over,
  };
}

function journeyFromSettings(settings: AppSettings): JourneyMapSummary {
  return getJourneyMapSummary({
    dailyEntries: [],
    measurements: [],
    settings,
  });
}

function settingsWithHome(
  resources: Partial<typeof DEFAULT_COZY_HOME_STATE.resources>,
): AppSettings {
  return {
    ...DEFAULT_APP_SETTINGS,
    cozyHome: {
      ...DEFAULT_COZY_HOME_STATE,
      resources: { ...DEFAULT_COZY_HOME_STATE.resources, ...resources },
    },
  };
}

function settingsWithCompletedHome(): AppSettings {
  const zones = Object.fromEntries(
    COZY_HOME_ZONE_IDS.map((id) => [id, { zoneId: id, level: COZY_HOME_MAX_LEVEL }]),
  ) as typeof DEFAULT_COZY_HOME_STATE.zones;
  return {
    ...DEFAULT_APP_SETTINGS,
    cozyHome: {
      ...DEFAULT_COZY_HOME_STATE,
      zones,
      totalUpgrades: COZY_HOME_ZONE_IDS.length * COZY_HOME_MAX_LEVEL,
      resources: { comfort: 40, materials: 40, garden: 40, clarity: 40 },
    },
  };
}

function completedJourney(settings: AppSettings = DEFAULT_APP_SETTINGS): JourneyMapSummary {
  const base = journeyFromSettings(settings);
  return {
    ...base,
    completedStages: base.totalStages,
    overallProgressPercent: 100,
    currentStage: base.currentStage
      ? { ...base.currentStage, status: 'completed' }
      : null,
  };
}

describe('isSeasonNearCompletion', () => {
  it('is true at 75% quests complete', () => {
    const season = emptySeason({
      completedQuestCount: 3,
      quests: emptySeason().quests.map((q, i) => ({
        ...q,
        completed: i < 3,
        current: i < 3 ? 10 : 0,
      })),
    });
    expect(isSeasonNearCompletion(season)).toBe(true);
  });

  it('is false early in the season', () => {
    expect(isSeasonNearCompletion(emptySeason())).toBe(false);
  });
});

describe('getDashboardNextProgress', () => {
  const journey = journeyFromSettings(DEFAULT_APP_SETTINGS);

  it('prefers a confirmable Body Ability over an affordable Home upgrade', () => {
    let settings = applyBodyAbilityProfile(DEFAULT_APP_SETTINGS, {
      ...PROFILE_C_LARGE_LOW_MOBILITY,
      configuredAt: '2026-08-02T00:00:00.000Z',
    });
    const personal = getPersonalBodyAbilitiesState(settings);
    const abilityId = personal.selectedAbilityIds[0];
    expect(abilityId).toBeTruthy();
    const current = personal.abilities[abilityId!];
    settings = {
      ...settings,
      cozyHome: {
        ...DEFAULT_COZY_HOME_STATE,
        resources: { comfort: 0, materials: 5, garden: 0, clarity: 0 },
      },
      bodyAbilityState: {
        ...settings.bodyAbilityState!,
        personal: {
          ...personal,
          abilities: {
            ...personal.abilities,
            [abilityId!]: {
              ...current!,
              status: 'suggested',
              suggestedAt: '2026-08-02T00:00:00.000Z',
            },
          },
        },
      },
    };

    const next = getDashboardNextProgress({
      themeId: 'cozy',
      settings,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journeyFromSettings(settings),
      bodyStage: 1,
    });
    expect(next?.kind).toBe('ability_confirm');
    expect(next?.description).toMatch(/^Можно проверить:/);
  });

  it('shows an affordable Home upgrade on Cozy when no ability is waiting', () => {
    const next = getDashboardNextProgress({
      themeId: 'cozy',
      settings: settingsWithHome({ materials: 2 }),
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journey,
      bodyStage: 1,
    });
    expect(next?.kind).toBe('home_upgrade');
    expect(next?.title).toMatch(/Крыльцо/);
    expect(next?.targetRoute).toBe('/home');
  });

  it('does not use Home as NEXT on Dark Fantasy even if an upgrade is affordable', () => {
    const next = getDashboardNextProgress({
      themeId: 'darkFantasy',
      settings: settingsWithHome({ materials: 2 }),
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journey,
      bodyStage: 1,
    });
    expect(next?.kind).not.toBe('home_upgrade');
    expect(next?.kind).not.toBe('home_missing');
  });

  it('uses concrete missing-resource copy when Home is not yet affordable', () => {
    const next = getDashboardNextProgress({
      themeId: 'cozy',
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journey,
      bodyStage: 1,
    });
    expect(next?.kind).toBe('home_missing');
    expect(next?.description).toMatch(/не хватает/i);
  });

  it('surfaces a nearly complete season before Journey', () => {
    const next = getDashboardNextProgress({
      themeId: 'darkFantasy',
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
      season: emptySeason({
        completedQuestCount: 3,
        questsNearCompletion: 1,
        quests: emptySeason().quests.map((q, i) => ({
          ...q,
          completed: i < 3,
          current: i < 3 ? 10 : 8,
        })),
      }),
      journeySummary: journey,
      bodyStage: 1,
    });
    expect(next?.kind).toBe('season_near');
  });

  it('surfaces a nearby Body Stage visual anchor', () => {
    const next = getDashboardNextProgress({
      themeId: 'darkFantasy',
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journey,
      bodyStage: 4,
    });
    expect(next?.kind).toBe('body_stage_near');
    expect(next?.description).toMatch(/якорь 5/);
  });

  it('falls back to Journey chapter copy', () => {
    const next = getDashboardNextProgress({
      themeId: 'darkFantasy',
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journey,
      bodyStage: 1,
    });
    expect(next?.kind).toBe('journey_milestone');
    expect(next?.title).toMatch(/Глава 1 из 9/);
  });

  it('does not keep Home as NEXT after 24/24 upgrades', () => {
    const settings = settingsWithCompletedHome();
    const next = getDashboardNextProgress({
      themeId: 'cozy',
      settings,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: journeyFromSettings(settings),
      bodyStage: 1,
    });
    expect(next.kind).toBe('journey_milestone');
    expect(next.kind).not.toBe('home_upgrade');
    expect(next.kind).not.toBe('home_missing');
    expect(next.title).not.toMatch(/До восстановления|Можно улучшить|До следующего/i);
  });

  it('falls back to a Today rhythm step when Home and Journey are complete', () => {
    const settings = settingsWithCompletedHome();
    const next = getDashboardNextProgress({
      themeId: 'cozy',
      settings,
      dailyEntries: [],
      measurements: [],
      season: emptySeason(),
      journeySummary: completedJourney(settings),
      bodyStage: 1,
    });
    expect(next.kind).toBe('continue_rhythm');
    expect(next.targetRoute).toBe('/today');
    expect(next.title).not.toMatch(/До восстановления|Можно улучшить|До следующего/i);
  });
});
