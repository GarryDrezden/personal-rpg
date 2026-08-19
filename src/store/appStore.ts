import { create } from 'zustand';
import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
  BankDeposit,
} from '../types';
import { getRepository, getStorageMode } from '../storage/storageClient';
import { hydrateLocalSidecarsFromRemote } from '../storage/sidecarSync';
import { getLastHydrationMeta } from '../storage/remoteStorageClient';
import { assertHydrationReady, type HydrationStatus } from '../storage/hydrationGuard';
import { syncAchievementsFromData } from '../utils/achievementSync';
import {
  rebuildAndSaveMomentumHistory,
  rebuildMomentumHistoryFromDate,
} from '../utils/momentumStorage';
import { resolveMomentumRebuildOnSettingsChange } from '../utils/momentumSettingsImpact';
import { useAchievementStore } from './achievementStore';
import { useCoinStore } from './coinStore';
import { buildCoinWalletSummary } from '../utils/coinEngine';
import { normalizeAppSettings } from '../utils/settingsNormalize';
import { applyCozyRewardsOnSave } from '../utils/cozyHomeEngine';

function emptyDaily(date: string): DailyEntry {
  return {
    id: '',
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
    customCompletions: {},
    dayMode: 'normal',
    energyLevel: null,
    cognitiveBreaks: null,
    nutritionLevel: null,
    physicalActivityLevel: null,
    physicalActivityDuration: null,
    physicalActivityNote: null,
    cozyRewardsGranted: null,
  };
}

interface AppState extends AppData {
  loading: boolean;
  error: string | null;
  hydrationStatus: HydrationStatus;
  hydrationGeneration: number;
  init: () => Promise<void>;
  updateDaily: (entry: DailyEntry) => Promise<DailyEntry>;
  deleteDaily: (date: string) => Promise<void>;
  addMeasurement: (entry: Omit<MeasurementEntry, 'id'>) => Promise<void>;
  updateMeasurement: (id: string, entry: Omit<MeasurementEntry, 'id'>) => Promise<void>;
  addReward: (reward: Omit<Reward, 'id' | 'purchasedAt'>) => Promise<void>;
  updateReward: (id: string, patch: Partial<Pick<Reward, 'title' | 'description' | 'cost' | 'category' | 'moneyGoal'>>) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  purchaseReward: (id: string) => Promise<void>;
  addBankDeposit: (entry: Omit<BankDeposit, 'id'>) => Promise<void>;
  deleteBankDeposit: (id: string) => Promise<void>;
  saveSettings: (settings: AppSettings) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  dailyEntries: [],
  measurements: [],
  rewards: [],
  bankDeposits: [],
  settings: {
    defaultCaloriesLimit: 2500,
    defaultStepsGoal: 8000,
    defaultGymTarget: 2,
    defaultWeeklyPointsGoal: 500,
    pointSettings: {
      caloriesOk: 40,
      stepsOk: 35,
      noAlcohol: 35,
      alcoholModerate: -20,
      alcoholHeavy: -60,
      morningExercise: 20,
      gym: 25,
      journal: 20,
      cooking: 10,
      repair: 10,
      plants: 10,
      hobby: 10,
      gymWeeklyBonus: 50,
      noAlcoholWeekBonus: 70,
      caloriesWeekBonus: 70,
      measurementsMondayBonus: 30,
    },
    weeklySettings: [],
    gender: 'male',
    weightGoal: 100,
    enableSleepTracking: false,
  },
  loading: true,
  error: null,
  hydrationStatus: 'pending',
  hydrationGeneration: 0,

  init: async () => {
    try {
      set({ loading: true, error: null, hydrationStatus: 'pending' });
      const data = await getRepository().loadAll();
      await hydrateLocalSidecarsFromRemote();
      set({
        ...data,
        bankDeposits: data.bankDeposits ?? [],
        settings: normalizeAppSettings(data.settings),
        loading: false,
        error: null,
        hydrationStatus: 'ready',
        hydrationGeneration: get().hydrationGeneration + 1,
      });
      if (getStorageMode() === 'remote' && getLastHydrationMeta().needsWriteback) {
        try {
          await get().saveSettings(get().settings);
        } catch {
          // In-memory data is already migrated; writeback can retry on next save.
        }
      }
      useAchievementStore.getState().hydrate();
      useCoinStore.getState().hydrate();
      useCoinStore.getState().syncFromRewards(get().rewards);
      syncAchievementsFromData(
        get().dailyEntries,
        get().measurements,
        get().settings,
      );
      rebuildAndSaveMomentumHistory({
        dailyEntries: get().dailyEntries,
        settings: get().settings,
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Ошибка загрузки',
        hydrationStatus: 'failed',
      });
    }
  },

  updateDaily: async (entry) => {
    assertHydrationReady(get().hydrationStatus);
    const previousEntry =
      get().dailyEntries.find((e) => e.date === entry.date) ?? null;
    const applied = applyCozyRewardsOnSave({
      entry,
      settings: get().settings,
      previousEntry,
    });

    // Persist resources before stamping the day. lastDailyGrantDate still
    // blocks a second grant if the entry write later fails.
    if (applied.granted) {
      await get().saveSettings(applied.settings);
    }

    const saved = await getRepository().upsertDaily(applied.entry);
    const entries = get().dailyEntries.filter((e) => e.date !== saved.date);
    const dailyEntries = [...entries, saved].sort((a, b) => a.date.localeCompare(b.date));
    set({ dailyEntries });

    syncAchievementsFromData(dailyEntries, get().measurements, get().settings);
    rebuildMomentumHistoryFromDate({
      changedDate: saved.date,
      dailyEntries,
      settings: get().settings,
    });
    return saved;
  },

  deleteDaily: async (date) => {
    assertHydrationReady(get().hydrationStatus);
    await getRepository().deleteDaily(date);
    const dailyEntries = get().dailyEntries.filter((e) => e.date !== date);
    set({ dailyEntries });
    syncAchievementsFromData(dailyEntries, get().measurements, get().settings);
    rebuildMomentumHistoryFromDate({
      changedDate: date,
      dailyEntries,
      settings: get().settings,
    });
  },

  addMeasurement: async (entry) => {
    assertHydrationReady(get().hydrationStatus);
    const saved = await getRepository().addMeasurement(entry);
    const measurements = [...get().measurements, saved].sort((a, b) => a.date.localeCompare(b.date));
    set({ measurements });
    syncAchievementsFromData(get().dailyEntries, measurements, get().settings);
  },

  updateMeasurement: async (id, entry) => {
    assertHydrationReady(get().hydrationStatus);
    const saved = await getRepository().updateMeasurement(id, entry);
    const measurements = get()
      .measurements.filter((m) => m.id !== id)
      .concat(saved)
      .sort((a, b) => a.date.localeCompare(b.date));
    set({ measurements });
    syncAchievementsFromData(get().dailyEntries, measurements, get().settings);
  },

  addReward: async (reward) => {
    assertHydrationReady(get().hydrationStatus);
    const saved = await getRepository().addReward(reward);
    set({ rewards: [...get().rewards, saved] });
  },

  updateReward: async (id, patch) => {
    assertHydrationReady(get().hydrationStatus);
    const saved = await getRepository().updateReward(id, patch);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  deleteReward: async (id) => {
    assertHydrationReady(get().hydrationStatus);
    await getRepository().deleteReward(id);
    set({
      rewards: get().rewards.filter((r) => r.id !== id),
    });
  },

  purchaseReward: async (id) => {
    assertHydrationReady(get().hydrationStatus);
    const reward = get().rewards.find((r) => r.id === id);
    if (!reward || reward.purchasedAt) return;

    const balance = buildCoinWalletSummary(
      get().dailyEntries,
      get().measurements,
      get().settings,
      new Date().toISOString().slice(0, 10),
      useCoinStore.getState().transactions,
    ).available;

    if (balance < reward.cost) {
      throw new Error('Не хватает монет');
    }

    useCoinStore.getState().addSpentForReward(reward);
    const saved = await getRepository().purchaseReward(id);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  addBankDeposit: async (entry) => {
    assertHydrationReady(get().hydrationStatus);
    const saved = await getRepository().addBankDeposit(entry);
    set({
      bankDeposits: [saved, ...get().bankDeposits].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    });
  },

  deleteBankDeposit: async (id) => {
    assertHydrationReady(get().hydrationStatus);
    await getRepository().deleteBankDeposit(id);
    set({
      bankDeposits: get().bankDeposits.filter((d) => d.id !== id),
    });
  },

  saveSettings: async (settings) => {
    assertHydrationReady(get().hydrationStatus);
    const prev = get().settings;
    const payload = normalizeAppSettings(settings, prev);
    const saved = await getRepository().saveSettings({
      ...payload,
      weightGoal: payload.weightGoal,
      enableSleepTracking: payload.enableSleepTracking ?? false,
    });
    set({ settings: normalizeAppSettings(saved, payload) });

    const strategy = resolveMomentumRebuildOnSettingsChange(prev, saved);
    if (strategy.type === 'full') {
      rebuildAndSaveMomentumHistory({
        dailyEntries: get().dailyEntries,
        settings: saved,
      });
    } else if (strategy.type === 'fromDate') {
      rebuildMomentumHistoryFromDate({
        changedDate: strategy.date,
        dailyEntries: get().dailyEntries,
        settings: saved,
      });
    }
  },
}));

export { emptyDaily };
