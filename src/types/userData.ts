import type {
  AppSettings,
  BankDeposit,
  DailyEntry,
  MeasurementEntry,
  Reward,
} from './index';

export type DataSchemaVersion = number;

export type NormalizationIssue = {
  path: string;
  code: string;
  message: string;
};

export type BackupProfileSnapshot = {
  displayName: string | null;
  heroGender: 'male' | 'female' | 'neutral' | null;
  startWeight: number | null;
  targetWeight: number | null;
  height: number | null;
};

export type UserDataEnvelope = {
  dataSchemaVersion: DataSchemaVersion;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  rewards: Reward[];
  bankDeposits: BankDeposit[];
  settings: AppSettings;
  /** Other allowed `user_data` types preserved for round-trip. */
  extras: Record<string, unknown>;
  profile?: BackupProfileSnapshot;
};

export type UserBackupFileV1 = {
  format: 'personal-rpg-backup';
  backupFormatVersion: 1;
  dataSchemaVersion: DataSchemaVersion;
  exportedAt: string;
  data: {
    dailyEntries: DailyEntry[];
    measurements: MeasurementEntry[];
    rewards: Reward[];
    bankDeposits: BankDeposit[];
    settings: AppSettings;
    profile?: BackupProfileSnapshot;
    [extra: string]: unknown;
  };
};

export type UserDataSummary = {
  exportedAt?: string;
  dataSchemaVersion: number;
  themeId: string;
  dailyCount: number;
  measurementCount: number;
  rewardCount: number;
  profileName: string | null;
};
