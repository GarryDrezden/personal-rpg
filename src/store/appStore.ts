import { create } from 'zustand';
import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
  BankDeposit,
} from '../types';
import { apiRepository } from './apiRepository';
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
      const data = await apiRepository.loadAll();
      set({
        ...data,
        bankDeposits: data.bankDeposits ?? [],
        settings: {
          ...data.settings,
          gender: data.settings.gender ?? 'male',
          weightGoal: data.settings.weightGoal ?? 100,
          coinSettings: data.settings.coinSettings,
          avatarSettings: data.settings.avatarSettings,
          themeId: resolveThemeId(
            data.settings.themeId ?? getStoredThemeId(),
          ),
          habitConfig: data.settings.habitConfig,
          enableSleepTracking: data.settings.enableSleepTracking ?? false,
        },
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
    const saved = await apiRepository.upsertDaily(entry);
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
    await apiRepository.deleteDaily(date);
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
    const saved = await apiRepository.addMeasurement(entry);
    const measurements = [...get().measurements, saved].sort((a, b) => a.date.localeCompare(b.date));
    set({ measurements });
    syncAchievementsFromData(get().dailyEntries, measurements, get().settings);
  },

  addReward: async (reward) => {
    const saved = await apiRepository.addReward(reward);
    set({ rewards: [...get().rewards, saved] });
  },

  updateReward: async (id, patch) => {
    const saved = await apiRepository.updateReward(id, patch);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  deleteReward: async (id) => {
    await apiRepository.deleteReward(id);
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
    const saved = await apiRepository.purchaseReward(id);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  addBankDeposit: async (entry) => {
    const saved = await apiRepository.addBankDeposit(entry);
    set({
      bankDeposits: [saved, ...get().bankDeposits].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    });
  },

  deleteBankDeposit: async (id) => {
    await apiRepository.deleteBankDeposit(id);
    set({
      bankDeposits: get().bankDeposits.filter((d) => d.id !== id),
    });
  },

  saveSettings: async (settings) => {
    const prev = get().settings;
    const saved = await apiRepository.saveSettings({
      ...settings,
      enableSleepTracking: settings.enableSleepTracking ?? false,
    });
    set({ settings: saved });

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
