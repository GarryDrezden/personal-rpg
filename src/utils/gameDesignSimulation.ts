/**
 * Dev/test-only journey simulator for game-design audits.
 * Not wired to production UI. Weight change is a synthetic fixture, not a
 * medical model.
 */
import { addDays, format, getISODay, parseISO } from 'date-fns';
import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { DEFAULT_COIN_SETTINGS } from '../constants/coins';
import { resolveAvatarStageSnapshot } from '../game/avatar/avatarStageEngine';
import { getSeasonSnapshot } from '../game/seasons/seasonEngine';
import { getBodyAbilityStats } from './bodyAbilityEngine';
import {
  applyCozyRewardsOnSave,
  findAffordableUpgrade,
  getCozyHomeProgress,
  getCozyHomeState,
  upgradeCozyZone,
} from './cozyHomeEngine';
import {
  getCoinTransactionsFromDailyEntries,
  getCoinTransactionsFromWeeks,
} from './coinEngine';
import { getJourneyMapSummary } from './journeyMapEngine';
import { getLevelInfo } from './levels';
import { calcMomentumBonusXp, getMomentumSummary } from './momentumEngine';
import { calcTotalEarnedXP } from './points';

export const SIM_HORIZONS = [28, 60, 90, 180, 365] as const;
export type SimHorizon = (typeof SIM_HORIZONS)[number];

export const SIM_PROFILE_IDS = [
  'casual',
  'balanced',
  'active',
  'recovery_heavy',
  'inconsistent',
] as const;
export type SimProfileId = (typeof SIM_PROFILE_IDS)[number];

export type SimDayKind =
  | 'skip'
  | 'light'
  | 'good'
  | 'stacked'
  | 'recovery'
  | 'minimal'
  | 'bad';

/** Share of personal goal reached after 365 synthetic days. Not medical. */
const YEAR_GOAL_FRACTION: Record<SimProfileId, number> = {
  casual: 0.4,
  balanced: 0.7,
  active: 0.9,
  recovery_heavy: 0.5,
  inconsistent: 0.3,
};

const DEFAULT_START_DATE = '2025-01-06';

export type SimulateUserJourneyParams = {
  profileId: SimProfileId;
  days: number;
  startDate?: string;
  startWeight: number;
  targetWeight: number;
  waistStartCm?: number;
  autoUpgradeHome?: boolean;
};

export type SimSnapshot = {
  profileId: SimProfileId;
  days: number;
  loggedDays: number;
  skippedDays: number;
  xp: number;
  xpWithMomentumBonus: number;
  level: number;
  coins: number;
  homeUpgrades: number;
  homePercent: number;
  homeResources: { comfort: number; materials: number; garden: number; clarity: number };
  seasonIndex: number;
  seasonQuestsCompleted: number;
  journeyCompleted: number;
  journeyTotal: number;
  journeyPercent: number;
  momentum: number;
  abilitiesUnlocked: number;
  bodyStage: number;
  heroState: string;
  currentWeight: number;
  weightLostKg: number;
};

function cloneSettings(weightGoal: number): AppSettings {
  return {
    ...DEFAULT_APP_SETTINGS,
    weightGoal,
    targetWeight: weightGoal,
    weeklySettings: [],
    cozyHome: structuredClone(DEFAULT_APP_SETTINGS.cozyHome),
    pointSettings: { ...DEFAULT_APP_SETTINGS.pointSettings },
    coinSettings: { ...DEFAULT_COIN_SETTINGS },
  };
}

function emptyDaily(date: string): DailyEntry {
  return {
    id: `sim-${date}`,
    date,
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
  };
}

export function simDayKind(profileId: SimProfileId, dayIndex: number, date: string): SimDayKind {
  const weekday = getISODay(parseISO(date));
  if (profileId === 'inconsistent') {
    return dayIndex % 14 < 5 ? 'light' : 'skip';
  }
  if (profileId === 'casual') {
    return weekday <= 4 ? 'light' : 'skip';
  }
  if (profileId === 'active') {
    return weekday === 7 ? 'recovery' : 'stacked';
  }
  if (profileId === 'recovery_heavy') {
    if (weekday === 7) return 'skip';
    if (weekday === 2 || weekday === 5) return 'recovery';
    if (weekday === 3 || weekday === 6) return 'minimal';
    return 'good';
  }
  if (weekday === 7) return 'skip';
  if (weekday === 6) return 'recovery';
  return 'good';
}

function fillEntry(kind: Exclude<SimDayKind, 'skip'>, date: string): DailyEntry {
  const entry = emptyDaily(date);
  if (kind === 'light') {
    return {
      ...entry,
      calories: 2400,
      nutritionLevel: 'light',
      steps: 8000,
      alcohol: 'none',
      journal: true,
      comment: 'sim light',
      sleepQuality: 'ok',
      cognitiveBreaks: 'small',
      energyLevel: 3,
    };
  }
  if (kind === 'good') {
    const weekday = getISODay(parseISO(date));
    return {
      ...entry,
      calories: 2300,
      nutritionLevel: 'light',
      steps: 12000,
      alcohol: 'none',
      morningExercise: weekday === 1,
      gym: weekday === 2 || weekday === 4,
      journal: true,
      comment: 'sim good',
      cooking: weekday === 3,
      sleepQuality: 'good',
      cognitiveBreaks: 'good',
      energyLevel: 4,
    };
  }
  if (kind === 'stacked') {
    const weekday = getISODay(parseISO(date));
    return {
      ...entry,
      calories: 2200,
      nutritionLevel: 'light',
      steps: 14000,
      alcohol: 'none',
      morningExercise: true,
      gym: weekday === 1 || weekday === 3 || weekday === 5,
      journal: true,
      comment: 'sim stacked',
      cooking: true,
      plants: weekday === 6,
      sleepQuality: 'good',
      cognitiveBreaks: 'deep',
      energyLevel: 4,
    };
  }
  if (kind === 'recovery') {
    return {
      ...entry,
      dayMode: 'recovery',
      calories: 2400,
      nutritionLevel: 'light',
      steps: 5000,
      alcohol: 'none',
      journal: true,
      comment: 'sim recovery',
      sleepQuality: 'good',
      cognitiveBreaks: 'deep',
      energyLevel: 2,
    };
  }
  if (kind === 'minimal') {
    return {
      ...entry,
      dayMode: 'minimal',
      calories: 2400,
      nutritionLevel: 'light',
      steps: 5000,
      alcohol: 'none',
      journal: true,
      comment: 'sim minimal',
      sleepQuality: 'ok',
      energyLevel: 3,
    };
  }
  return {
    ...entry,
    calories: 4200,
    nutritionLevel: 'heavy',
    steps: 1800,
    alcohol: 'heavy',
    comment: 'sim bad',
    energyLevel: 1,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function syntheticWeight(
  profileId: SimProfileId,
  dayIndex: number,
  startWeight: number,
  targetWeight: number,
): number {
  const goal = Math.max(0, startWeight - targetWeight);
  const lost = goal * YEAR_GOAL_FRACTION[profileId] * (dayIndex / 364);
  return round1(Math.max(targetWeight, startWeight - lost));
}

function spendHome(settings: AppSettings, at: string): AppSettings {
  let home = getCozyHomeState(settings);
  for (let i = 0; i < 24; i++) {
    const next = findAffordableUpgrade(home);
    if (!next) break;
    home = upgradeCozyZone(home, next.zoneId, at);
  }
  return { ...settings, cozyHome: home };
}

export function simulateUserJourney(params: SimulateUserJourneyParams): SimSnapshot {
  const startDate = params.startDate ?? DEFAULT_START_DATE;
  const autoUpgrade = params.autoUpgradeHome !== false;
  const waistStart = params.waistStartCm ?? 100;
  let settings = cloneSettings(params.targetWeight);
  const dailyEntries: DailyEntry[] = [];
  const measurements: MeasurementEntry[] = [
    {
      id: 'm-start',
      date: startDate,
      weight: params.startWeight,
      chest: null,
      waist: waistStart,
      belly: null,
      hips: null,
      thigh: null,
      biceps: null,
      comment: '',
    },
  ];

  let loggedDays = 0;
  let skippedDays = 0;

  for (let i = 0; i < params.days; i++) {
    const date = format(addDays(parseISO(startDate), i), 'yyyy-MM-dd');
    const kind = simDayKind(params.profileId, i, date);
    const weight = syntheticWeight(
      params.profileId,
      i,
      params.startWeight,
      params.targetWeight,
    );
    const waist = round1(waistStart - (waistStart - 80) * (params.startWeight - weight) / Math.max(1, params.startWeight - params.targetWeight));

    if (kind === 'skip') {
      skippedDays += 1;
      continue;
    }

    loggedDays += 1;
    const raw = fillEntry(kind, date);
    const applied = applyCozyRewardsOnSave({
      entry: raw,
      settings,
      previousEntry: null,
    });
    settings = applied.settings;
    dailyEntries.push(applied.entry);
    if (autoUpgrade) {
      settings = spendHome(settings, `${date}T12:00:00.000Z`);
    }

    const weekday = getISODay(parseISO(date));
    if (weekday === 1 || i === params.days - 1) {
      measurements.push({
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
      });
    }
  }

  const today = format(
    addDays(parseISO(startDate), Math.max(0, params.days - 1)),
    'yyyy-MM-dd',
  );
  const home = getCozyHomeState(settings);
  const homeProgress = getCozyHomeProgress(home);
  const xp = calcTotalEarnedXP(dailyEntries, measurements, settings);
  const xpBonus = calcMomentumBonusXp(dailyEntries, settings);
  const coins =
    getCoinTransactionsFromDailyEntries({ dailyEntries, settings }).reduce(
      (sum, tx) => sum + tx.amount,
      0,
    ) +
    getCoinTransactionsFromWeeks({
      dailyEntries,
      measurements,
      settings,
    }).reduce((sum, tx) => sum + tx.amount, 0);
  const journey = getJourneyMapSummary({ dailyEntries, measurements, settings });
  const season = getSeasonSnapshot({ settings, dailyEntries, today });
  const momentum = getMomentumSummary({ today, dailyEntries, settings });
  const abilities = getBodyAbilityStats({ dailyEntries, measurements, settings });
  const avatar = resolveAvatarStageSnapshot({
    dailyEntries,
    measurements,
    settings,
    today,
  });
  const lastWeight =
    measurements.filter((m) => m.weight != null).at(-1)?.weight ?? params.startWeight;

  return {
    profileId: params.profileId,
    days: params.days,
    loggedDays,
    skippedDays,
    xp,
    xpWithMomentumBonus: xp + xpBonus,
    level: getLevelInfo(xp).level,
    coins,
    homeUpgrades: homeProgress.done,
    homePercent: homeProgress.percent,
    homeResources: { ...home.resources },
    seasonIndex: season.seasonIndex,
    seasonQuestsCompleted: season.completedQuestCount,
    journeyCompleted: journey.completedStages,
    journeyTotal: journey.totalStages,
    journeyPercent: journey.overallProgressPercent,
    momentum: momentum.currentValue,
    abilitiesUnlocked: abilities.unlocked,
    bodyStage: avatar.bodyStage,
    heroState: avatar.heroState,
    currentWeight: lastWeight,
    weightLostKg: round1(Math.max(0, params.startWeight - lastWeight)),
  };
}

export function simulateHorizonMatrix(params: {
  startWeight: number;
  targetWeight: number;
}): Record<SimProfileId, Record<SimHorizon, SimSnapshot>> {
  const out = {} as Record<SimProfileId, Record<SimHorizon, SimSnapshot>>;
  for (const profileId of SIM_PROFILE_IDS) {
    out[profileId] = {} as Record<SimHorizon, SimSnapshot>;
    for (const days of SIM_HORIZONS) {
      out[profileId][days] = simulateUserJourney({
        profileId,
        days,
        startWeight: params.startWeight,
        targetWeight: params.targetWeight,
      });
    }
  }
  return out;
}
