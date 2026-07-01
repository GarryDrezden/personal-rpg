import { create } from 'zustand';
import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
  BankDeposit,
} from '../types';
import { getRepository } from '../storage/storageClient';
import { hydrateLocalSidecarsFromRemote } from '../storage/sidecarSync';
import { syncAchievementsFromData } from '../utils/achievementSync';
import {
  rebuildAndSaveMomentumHistory,
  rebuildMomentumHistoryFromDate,
} from '../utils/momentumStorage';
import { resolveMomentumRebuildOnSettingsChange } from '../utils/momentumSettingsImpact';
import { useAchievementStore } from './achievementStore';
import { useCoinStore } from './coinStore';
import { buildCoinWalletSummary } from '../utils/coinEngine';
import { resolveThemeId } from '../constants/themes';
import { getStoredThemeId } from '../utils/themeApply';
import { migrateNutritionSettings } from '../utils/nutritionEngine';
import { normalizeAppSettings } from '../utils/settingsNormalize';

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
  };
}

interface AppState extends AppData {
  loading: boolean;
  error: string | null;
  init: () => Promise<void>;
  updateDaily: (entry: DailyEntry) => Promise<void>;
  deleteDaily: (date: string) => Promise<void>;
  addMeasurement: (entry: Omit<MeasurementEntry, 'id'>) => Promise<void>;
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

  init: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getRepository().loadAll();
      await hydrateLocalSidecarsFromRemote();
      const migratedSettings = migrateNutritionSettings(data.settings, data.dailyEntries);
      set({
        ...data,
        bankDeposits: data.bankDeposits ?? [],
        settings: normalizeAppSettings({
          ...migratedSettings,
          coinSettings: migratedSettings.coinSettings,
          avatarSettings: migratedSettings.avatarSettings,
          themeId: resolveThemeId(
            migratedSettings.themeId ?? getStoredThemeId(),
          ),
          habitConfig: migratedSettings.habitConfig,
        }),
        loading: false,
      });
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
      });
    }
  },

  updateDaily: async (entry) => {
    const saved = await getRepository().upsertDaily(entry);
    const entries = get().dailyEntries.filter((e) => e.date !== saved.date);
    const dailyEntries = [...entries, saved].sort((a, b) => a.date.localeCompare(b.date));
    set({ dailyEntries });
    syncAchievementsFromData(dailyEntries, get().measurements, get().settings);
    rebuildMomentumHistoryFromDate({
      changedDate: saved.date,
      dailyEntries,
      settings: get().settings,
    });
  },

  deleteDaily: async (date) => {
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
    const saved = await getRepository().addMeasurement(entry);
    const measurements = [...get().measurements, saved].sort((a, b) => a.date.localeCompare(b.date));
    set({ measurements });
    syncAchievementsFromData(get().dailyEntries, measurements, get().settings);
  },

  addReward: async (reward) => {
    const saved = await getRepository().addReward(reward);
    set({ rewards: [...get().rewards, saved] });
  },

  updateReward: async (id, patch) => {
    const saved = await getRepository().updateReward(id, patch);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  deleteReward: async (id) => {
    await getRepository().deleteReward(id);
    set({
      rewards: get().rewards.filter((r) => r.id !== id),
    });
  },

  purchaseReward: async (id) => {
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
    const saved = await getRepository().addBankDeposit(entry);
    set({
      bankDeposits: [saved, ...get().bankDeposits].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    });
  },

  deleteBankDeposit: async (id) => {
    await getRepository().deleteBankDeposit(id);
    set({
      bankDeposits: get().bankDeposits.filter((d) => d.id !== id),
    });
  },

  saveSettings: async (settings) => {
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
