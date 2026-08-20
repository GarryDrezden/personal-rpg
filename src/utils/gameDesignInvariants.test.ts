import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { PROFILE_A_LARGE_ATHLETIC } from '../fixtures/bodyAbilityProfiles';
import { selectPersonalBodyAbilities } from './bodyAbilitySelectionEngine';
import { resolveAvatarStageSnapshot } from '../game/avatar/avatarStageEngine';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import {
  applyCozyRewardsOnSave,
  getCozyHomeState,
} from './cozyHomeEngine';
import { getCozyRewardsForEntry } from './cozyHomeRewardsEngine';
import { getCoinTransactionsFromDailyEntries } from './coinEngine';
import { getAllJourneyStageProgress } from './journeyMapEngine';
import {
  scaleJourneyWeightTarget,
  resolvePersonalWeightGoalKg,
} from './journeyWeightGates';
import { getMomentumSummary } from './momentumEngine';
import { getNextBestAction } from './nextBestActionEngine';
import { calcDailyPoints, getDayStatus } from './points';
import { calcWeightJourney } from './weightJourney';

const BEGINNER_MOBILITY = [
  'tie_shoes_easier',
  'stand_from_floor_easier',
  'stairs_easier',
];

function baseEntry(partial: Partial<DailyEntry> = {}): DailyEntry {
  return {
    id: 'd1',
    date: '2026-08-01',
    calories: null,
    steps: null,
    alcohol: null,
    morningExercise: false,
    gym: false,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    dayMode: 'normal',
    energyLevel: null,
    nutritionLevel: null,
    ...partial,
  };
}

function goodDay(date: string): DailyEntry {
  return baseEntry({
    id: `g-${date}`,
    date,
    calories: 2300,
    nutritionLevel: 'light',
    steps: 12000,
    alcohol: 'none',
    journal: true,
    comment: 'ok',
    gym: true,
    sleepQuality: 'good',
    cognitiveBreaks: 'good',
    energyLevel: 4,
  });
}

function measurement(
  date: string,
  weight: number,
  waist = 100,
): MeasurementEntry {
  return {
    id: `m-${date}`,
    date,
    weight,
    chest: null,
    waist,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  };
}

describe('game-design invariants', () => {
  it('recovery day does not reset long-term home, XP, or journey progress', () => {
    const settings0 = {
      ...DEFAULT_APP_SETTINGS,
      cozyHome: structuredClone(DEFAULT_APP_SETTINGS.cozyHome),
    };
    const first = applyCozyRewardsOnSave({
      entry: goodDay('2026-08-03'),
      settings: settings0,
      previousEntry: null,
    });
    const xpBefore = calcDailyPoints(first.entry, first.settings);
    const homeBefore = getCozyHomeState(first.settings).resources.comfort;

    const recovery = applyCozyRewardsOnSave({
      entry: baseEntry({
        id: 'rec',
        date: '2026-08-04',
        dayMode: 'recovery',
        calories: 2400,
        nutritionLevel: 'light',
        steps: 5000,
        alcohol: 'none',
        journal: true,
        comment: 'recovery',
      }),
      settings: first.settings,
      previousEntry: null,
    });

    const xpAfter = xpBefore + calcDailyPoints(recovery.entry, recovery.settings);
    expect(xpAfter).toBeGreaterThanOrEqual(xpBefore);
    expect(getCozyHomeState(recovery.settings).resources.comfort).toBeGreaterThanOrEqual(
      homeBefore,
    );

    const measurements = [measurement('2026-08-03', 90), measurement('2026-08-04', 89.5)];
    const journey = getAllJourneyStageProgress({
      dailyEntries: [first.entry, recovery.entry],
      measurements,
      settings: { ...recovery.settings, weightGoal: 80, targetWeight: 80 },
    });
    expect(journey[0]?.status).not.toBe('locked');
    expect(journey.every((s) => s.status !== 'locked' || s.stage.order > 1)).toBe(true);
  });

  it('theme never changes reward mathematics', () => {
    const entry = goodDay('2026-08-10');
    const cozy: AppSettings = { ...DEFAULT_APP_SETTINGS, themeId: 'cozy' };
    const df: AppSettings = { ...DEFAULT_APP_SETTINGS, themeId: 'darkFantasy' };
    expect(calcDailyPoints(entry, cozy)).toBe(calcDailyPoints(entry, df));
    expect(getCozyRewardsForEntry(entry, cozy)).toEqual(getCozyRewardsForEntry(entry, df));
    const cozyCoins = getCoinTransactionsFromDailyEntries({
      dailyEntries: [entry],
      settings: cozy,
    }).reduce((s, t) => s + t.amount, 0);
    const dfCoins = getCoinTransactionsFromDailyEntries({
      dailyEntries: [entry],
      settings: df,
    }).reduce((s, t) => s + t.amount, 0);
    expect(cozyCoins).toBe(dfCoins);
  });

  it('recovery and minimal days grant non-zero Home resources, and a good day grants more', () => {
    const settings = DEFAULT_APP_SETTINGS;
    const recovery = getCozyRewardsForEntry(
      baseEntry({ date: '2026-08-12', dayMode: 'recovery' }),
      settings,
    );
    const minimal = getCozyRewardsForEntry(
      baseEntry({ date: '2026-08-12', dayMode: 'minimal' }),
      settings,
    );
    const good = getCozyRewardsForEntry(goodDay('2026-08-12'), settings);
    const sum = (r: typeof recovery) =>
      (r.resources.comfort ?? 0) +
      (r.resources.materials ?? 0) +
      (r.resources.garden ?? 0) +
      (r.resources.clarity ?? 0);
    expect(recovery.resources.comfort ?? 0).toBeGreaterThan(0);
    expect(minimal.resources.comfort ?? 0).toBeGreaterThan(0);
    expect(sum(minimal)).toBeLessThan(sum(good));
    expect(sum(recovery)).toBeLessThan(sum(good));
  });

  it('re-saving the same day does not duplicate cozy resources', () => {
    const settings = {
      ...DEFAULT_APP_SETTINGS,
      cozyHome: structuredClone(DEFAULT_APP_SETTINGS.cozyHome),
    };
    const entry = goodDay('2026-08-11');
    const first = applyCozyRewardsOnSave({ entry, settings, previousEntry: null });
    expect(first.granted).not.toBeNull();
    const second = applyCozyRewardsOnSave({
      entry: first.entry,
      settings: first.settings,
      previousEntry: first.entry,
    });
    expect(second.granted).toBeNull();
    expect(getCozyHomeState(second.settings).resources).toEqual(
      getCozyHomeState(first.settings).resources,
    );
  });

  it('small-goal path can complete every Journey weight gate at 100% of personal goal', () => {
    expect(scaleJourneyWeightTarget(1, 10)).toBe(1);
    expect(scaleJourneyWeightTarget(5, 10)).toBe(2.5);
    expect(scaleJourneyWeightTarget(10, 10)).toBe(5);
    expect(scaleJourneyWeightTarget(20, 10)).toBe(8);
    expect(scaleJourneyWeightTarget(50, 10)).toBe(10);

    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      weightGoal: 55,
      targetWeight: 55,
    };
    const measurements = [measurement('2026-01-01', 65), measurement('2026-06-01', 55)];
    expect(resolvePersonalWeightGoalKg(settings, measurements)).toBe(10);

    const stages = getAllJourneyStageProgress({
      dailyEntries: [],
      measurements,
      settings,
    });
    const weightGates = stages.flatMap((s) =>
      s.conditions.filter((c) => c.condition.type === 'weight_loss_kg'),
    );
    expect(weightGates.length).toBe(5);
    expect(weightGates.every((g) => g.completed)).toBe(true);
    expect(weightGates.find((g) => g.condition.id === 'weight_loss_50kg')?.target).toBe(10);
  });

  it('large-goal Journey weight gates never exceed the original campaign absolutes', () => {
    expect(scaleJourneyWeightTarget(1, 80)).toBe(1);
    expect(scaleJourneyWeightTarget(5, 80)).toBe(5);
    expect(scaleJourneyWeightTarget(10, 80)).toBe(10);
    expect(scaleJourneyWeightTarget(20, 80)).toBe(20);
    expect(scaleJourneyWeightTarget(50, 80)).toBe(50);

    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      weightGoal: 100,
      targetWeight: 100,
    };
    const measurements = [measurement('2026-01-01', 180), measurement('2026-06-01', 175)];
    const stages = getAllJourneyStageProgress({
      dailyEntries: [],
      measurements,
      settings,
    });
    const firstKg = stages
      .flatMap((s) => s.conditions)
      .find((c) => c.condition.id === 'weight_loss_1kg');
    expect(firstKg?.target).toBe(1);
    expect(firstKg?.completed).toBe(true);
  });

  it('athletic baselineEasy excludes beginner mobility abilities', () => {
    const ids = selectPersonalBodyAbilities(PROFILE_A_LARGE_ATHLETIC).map((a) => a.id);
    for (const beginner of BEGINNER_MOBILITY) {
      expect(ids).not.toContain(beginner);
    }
  });

  it('one bad day cannot erase a week of momentum', () => {
    const settings = DEFAULT_APP_SETTINGS;
    const dailyEntries = [
      goodDay('2026-08-03'),
      goodDay('2026-08-04'),
      goodDay('2026-08-05'),
      goodDay('2026-08-06'),
      goodDay('2026-08-07'),
      goodDay('2026-08-08'),
      goodDay('2026-08-09'),
      baseEntry({
        id: 'bad',
        date: '2026-08-10',
        calories: 4200,
        nutritionLevel: 'heavy',
        steps: 1200,
        alcohol: 'heavy',
      }),
    ];
    const afterGood = getMomentumSummary({
      today: '2026-08-09',
      dailyEntries: dailyEntries.slice(0, 7),
      settings,
    });
    const afterBad = getMomentumSummary({
      today: '2026-08-10',
      dailyEntries,
      settings,
    });
    expect(afterGood.currentValue).toBeGreaterThan(20);
    expect(afterBad.currentValue).toBeGreaterThan(-50);
    expect(afterGood.currentValue - afterBad.currentValue).toBeLessThan(80);
  });

  it('Body Stage stays stable when habits are perfect but measurements do not change', () => {
    const settings = DEFAULT_APP_SETTINGS;
    const measurements = [measurement('2026-08-01', 90, 100), measurement('2026-08-20', 90, 100)];
    const dailyEntries = Array.from({ length: 20 }, (_, i) => {
      const date = `2026-08-${String(i + 1).padStart(2, '0')}`;
      return goodDay(date);
    });
    const snap = resolveAvatarStageSnapshot({
      dailyEntries,
      measurements,
      settings,
      today: '2026-08-20',
    });
    expect(snap.bodyStage).toBe(1);
    expect(snap.heroState).not.toBe('depleted');
  });

  it('after 14-day absence Next Best Action offers a small return step', () => {
    const settings = DEFAULT_APP_SETTINGS;
    const dailyEntries = [goodDay('2026-07-20')];
    const action = getNextBestAction({
      today: '2026-08-04',
      todayEntry: null,
      dailyEntries,
      measurements: [measurement('2026-07-20', 90)],
      settings,
      recoveryState: 'after_absence',
    });
    expect(action.id).toBe('return_after_absence');
    expect(action.priority).toBe('recovery');
    expect(action.description.toLowerCase()).toContain('не нужно закрывать');
  });

  it('does not ask for calories or alcohol when that tracking is off', () => {
    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      nutritionTrackingMode: 'disabled',
      enableAlcoholTracking: false,
      enablePhysicalActivityTracking: false,
    };
    const yesterday = goodDay('2026-08-01');
    const todayEntry = baseEntry({
      id: 't-2026-08-02',
      date: '2026-08-02',
    });
    const action = getNextBestAction({
      today: '2026-08-02',
      todayEntry,
      dailyEntries: [yesterday, todayEntry],
      measurements: [measurement('2026-08-01', 90)],
      settings,
    });
    expect(action.id).not.toBe('log_calories');
    expect(action.id).not.toBe('log_alcohol');
  });

  it('quiet day copy replaces survival/shame status', () => {
    expect(getDayStatus(0)).toBe('Тихий день');
    expect(getDayStatus(39)).toBe('Тихий день');
    expect(getDayStatus(40)).toBe('Нормально');
  });

  it('weight journey never reports game-over or death countdown', () => {
    const journey = calcWeightJourney(
      [measurement('2026-01-01', 210), measurement('2026-02-01', 205)],
      100,
    );
    expect(journey.isGameOver).toBe(false);
    expect(journey.kgUntilDeath).toBeNull();
  });
});
