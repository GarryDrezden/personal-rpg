import type {
  AppData,
  AppSettings,
  DailyEntry,
  MeasurementEntry,
  Reward,
  BankDeposit,
} from '../types';

export interface DataRepository {
  loadAll(): Promise<AppData>;
  upsertDaily(entry: DailyEntry): Promise<DailyEntry>;
  deleteDaily(date: string): Promise<void>;
  getDaily(from: string, to: string): Promise<DailyEntry[]>;
  getMeasurements(): Promise<MeasurementEntry[]>;
  addMeasurement(entry: Omit<MeasurementEntry, 'id'>): Promise<MeasurementEntry>;
  deleteMeasurement(id: string): Promise<void>;
  getRewards(): Promise<Reward[]>;
  addReward(reward: Omit<Reward, 'id' | 'purchasedAt'>): Promise<Reward>;
  updateReward(id: string, patch: Partial<Pick<Reward, 'title' | 'description' | 'cost' | 'category' | 'moneyGoal'>>): Promise<Reward>;
  deleteReward(id: string): Promise<void>;
  purchaseReward(id: string): Promise<Reward>;
  getBankDeposits(): Promise<BankDeposit[]>;
  addBankDeposit(entry: Omit<BankDeposit, 'id'>): Promise<BankDeposit>;
  deleteBankDeposit(id: string): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<AppSettings>;
}
