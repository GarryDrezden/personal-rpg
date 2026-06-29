import type {
  AppData,
  AppSettings,
  BankDeposit,
  DailyEntry,
  MeasurementEntry,
  Reward,
} from '../types';
import { dataApi } from '../api/dataApi';
import type { DataRepository } from '../store/repository';
import { normalizeAppSettings } from '../utils/settingsNormalize';
import { migrateNutritionSettings } from '../utils/nutritionEngine';
import { resolveThemeId } from '../constants/themes';
import { debouncedRemoteSave, immediateRemoteSave } from './saveStatusStore';
import { getActiveCompanionId } from '../game/gameAssetStorage';
import { generateId } from '../utils/generateId';

function defaultSettings(): AppSettings {
  return normalizeAppSettings({
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
  });
}

function mergeRemoteSettings(
  serverSettings: { themeId: string; dailyCalorieLimit: number | null; nutritionTrackingMode: string; activeCompanionId: string },
  backup: AppSettings | null,
): AppSettings {
  const base = backup ?? defaultSettings();
  return normalizeAppSettings({
    ...base,
    themeId: resolveThemeId(serverSettings.themeId ?? base.themeId),
    defaultCaloriesLimit:
      serverSettings.dailyCalorieLimit ?? base.defaultCaloriesLimit,
    nutritionTrackingMode:
      (serverSettings.nutritionTrackingMode as AppSettings['nutritionTrackingMode']) ??
      base.nutritionTrackingMode,
    avatarSettings: base.avatarSettings,
  });
}

let cache: AppData | null = null;

async function ensureCache(): Promise<AppData> {
  if (!cache) {
    await remoteRepository.loadAll();
  }
  return cache!;
}

function persistType(type: string, payload: unknown, debounce = false) {
  const save = () => dataApi.putType(type, payload).then(() => undefined);
  if (debounce) {
    debouncedRemoteSave(type, save);
    return Promise.resolve();
  }
  return immediateRemoteSave(save);
}

export const remoteRepository: DataRepository & { resetCache: () => void } = {
  resetCache() {
    cache = null;
  },

  async loadAll(): Promise<AppData> {
    const res = await dataApi.getAll();
    const backup = (res.data.customSettingsBackup as AppSettings | undefined) ?? null;
    const dailyEntries = (res.data.dailyEntries as DailyEntry[] | undefined) ?? [];
    const measurements = (res.data.measurements as MeasurementEntry[] | undefined) ?? [];
    const rewards = (res.data.rewards as Reward[] | undefined) ?? [];
    const bankDeposits = (res.data.bankDeposits as BankDeposit[] | undefined) ?? [];
    let settings = mergeRemoteSettings(res.settings, backup);
    settings = migrateNutritionSettings(settings, dailyEntries);

    cache = {
      dailyEntries,
      measurements,
      rewards,
      bankDeposits,
      settings,
    };
    return cache;
  },

  async upsertDaily(entry: DailyEntry): Promise<DailyEntry> {
    const state = await ensureCache();
    const saved: DailyEntry = {
      ...entry,
      id: entry.id || generateId(),
    };
    const dailyEntries = [
      ...state.dailyEntries.filter((e) => e.date !== saved.date),
      saved,
    ].sort((a, b) => a.date.localeCompare(b.date));
    state.dailyEntries = dailyEntries;
    await persistType('dailyEntries', dailyEntries);
    return saved;
  },

  async deleteDaily(date: string): Promise<void> {
    const state = await ensureCache();
    state.dailyEntries = state.dailyEntries.filter((e) => e.date !== date);
    await persistType('dailyEntries', state.dailyEntries);
  },

  async getDaily(from: string, to: string): Promise<DailyEntry[]> {
    const state = await ensureCache();
    return state.dailyEntries.filter((e) => e.date >= from && e.date <= to);
  },

  async getMeasurements(): Promise<MeasurementEntry[]> {
    return (await ensureCache()).measurements;
  },

  async addMeasurement(entry: Omit<MeasurementEntry, 'id'>): Promise<MeasurementEntry> {
    const state = await ensureCache();
    const saved: MeasurementEntry = { ...entry, id: generateId() };
    state.measurements = [...state.measurements, saved].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    await persistType('measurements', state.measurements);
    return saved;
  },

  async deleteMeasurement(id: string): Promise<void> {
    const state = await ensureCache();
    state.measurements = state.measurements.filter((m) => m.id !== id);
    await persistType('measurements', state.measurements);
  },

  async getRewards(): Promise<Reward[]> {
    return (await ensureCache()).rewards;
  },

  async addReward(reward: Omit<Reward, 'id' | 'purchasedAt'>): Promise<Reward> {
    const state = await ensureCache();
    const saved: Reward = { ...reward, id: generateId(), purchasedAt: null };
    state.rewards = [...state.rewards, saved];
    await persistType('rewards', state.rewards);
    return saved;
  },

  async updateReward(
    id: string,
    patch: Partial<Pick<Reward, 'title' | 'description' | 'cost' | 'category' | 'moneyGoal'>>,
  ): Promise<Reward> {
    const state = await ensureCache();
    const idx = state.rewards.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error('Reward not found');
    const saved = { ...state.rewards[idx], ...patch };
    state.rewards = state.rewards.map((r) => (r.id === id ? saved : r));
    await persistType('rewards', state.rewards);
    return saved;
  },

  async deleteReward(id: string): Promise<void> {
    const state = await ensureCache();
    state.rewards = state.rewards.filter((r) => r.id !== id);
    await persistType('rewards', state.rewards);
  },

  async purchaseReward(id: string): Promise<Reward> {
    const state = await ensureCache();
    const idx = state.rewards.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error('Reward not found');
    const saved = {
      ...state.rewards[idx],
      purchasedAt: new Date().toISOString(),
    };
    state.rewards = state.rewards.map((r) => (r.id === id ? saved : r));
    await persistType('rewards', state.rewards);
    return saved;
  },

  async getBankDeposits(): Promise<BankDeposit[]> {
    return (await ensureCache()).bankDeposits;
  },

  async addBankDeposit(entry: Omit<BankDeposit, 'id'>): Promise<BankDeposit> {
    const state = await ensureCache();
    const saved: BankDeposit = { ...entry, id: generateId() };
    state.bankDeposits = [saved, ...state.bankDeposits].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    await persistType('bankDeposits', state.bankDeposits);
    return saved;
  },

  async deleteBankDeposit(id: string): Promise<void> {
    const state = await ensureCache();
    state.bankDeposits = state.bankDeposits.filter((d) => d.id !== id);
    await persistType('bankDeposits', state.bankDeposits);
  },

  async getSettings(): Promise<AppSettings> {
    return (await ensureCache()).settings;
  },

  async saveSettings(settings: AppSettings): Promise<AppSettings> {
    const state = await ensureCache();
    const saved = normalizeAppSettings(settings);
    state.settings = saved;
    await persistType('customSettingsBackup', saved, false);
    await dataApi.patchSettings({
      themeId: saved.themeId,
      dailyCalorieLimit: saved.defaultCaloriesLimit,
      nutritionTrackingMode:
        saved.nutritionTrackingMode === 'precise' ? 'detailed' : 'simple',
      activeCompanionId: getActiveCompanionId(),
    });
    return saved;
  },
};
