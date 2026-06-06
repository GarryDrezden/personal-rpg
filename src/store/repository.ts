import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
} from '../types';

export interface DataRepository {
  loadAll(): Promise<AppData>;
  upsertDaily(entry: DailyEntry): Promise<DailyEntry>;
  getDaily(from: string, to: string): Promise<DailyEntry[]>;
  getMeasurements(): Promise<MeasurementEntry[]>;
  addMeasurement(entry: Omit<MeasurementEntry, 'id'>): Promise<MeasurementEntry>;
  deleteMeasurement(id: string): Promise<void>;
  getRewards(): Promise<Reward[]>;
  addReward(reward: Omit<Reward, 'id' | 'purchasedAt'>): Promise<Reward>;
  purchaseReward(id: string): Promise<Reward>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<AppSettings>;
}
