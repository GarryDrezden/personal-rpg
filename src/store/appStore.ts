import { create } from 'zustand';
import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
} from '../types';
import { apiRepository } from './apiRepository';

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
  };
}

interface AppState extends AppData {
  loading: boolean;
  error: string | null;
  init: () => Promise<void>;
  updateDaily: (entry: DailyEntry) => Promise<void>;
  addMeasurement: (entry: Omit<MeasurementEntry, 'id'>) => Promise<void>;
  addReward: (reward: Omit<Reward, 'id' | 'purchasedAt'>) => Promise<void>;
  purchaseReward: (id: string) => Promise<void>;
  saveSettings: (settings: AppSettings) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  dailyEntries: [],
  measurements: [],
  rewards: [],
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
  },
  loading: true,
  error: null,

  init: async () => {
    try {
      set({ loading: true, error: null });
      const data = await apiRepository.loadAll();
      set({ ...data, loading: false });
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
    set({ dailyEntries: [...entries, saved].sort((a, b) => a.date.localeCompare(b.date)) });
  },

  addMeasurement: async (entry) => {
    const saved = await apiRepository.addMeasurement(entry);
    set({ measurements: [...get().measurements, saved].sort((a, b) => a.date.localeCompare(b.date)) });
  },

  addReward: async (reward) => {
    const saved = await apiRepository.addReward(reward);
    set({ rewards: [...get().rewards, saved] });
  },

  purchaseReward: async (id) => {
    const saved = await apiRepository.purchaseReward(id);
    set({
      rewards: get().rewards.map((r) => (r.id === id ? saved : r)),
    });
  },

  saveSettings: async (settings) => {
    const saved = await apiRepository.saveSettings(settings);
    set({ settings: saved });
  },
}));

export { emptyDaily };
