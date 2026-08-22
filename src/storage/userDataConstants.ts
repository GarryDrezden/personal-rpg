/** Current in-app user-data schema. Unversioned production blobs are v0. */
export const CURRENT_DATA_SCHEMA_VERSION = 1;

export const BACKUP_FORMAT = 'personal-rpg-backup';
export const BACKUP_FORMAT_VERSION = 1;
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

export const USER_DATA_TYPES = [
  'dailyEntries',
  'measurements',
  'achievements',
  'coinTransactions',
  'rewards',
  'momentumHistory',
  'freedomHistory',
  'bodyAbilities',
  'journeyState',
  'artifactUnlocks',
  'defeatedBosses',
  'dailyMobs',
  'customSettingsBackup',
  'legacyImport',
  'bankDeposits',
] as const;

export type UserDataType = (typeof USER_DATA_TYPES)[number];

export const CORE_DATA_TYPES = [
  'dailyEntries',
  'measurements',
  'rewards',
  'bankDeposits',
  'customSettingsBackup',
] as const;

export const SIDECAR_BACKUP_TYPES = [
  'achievements',
  'coinTransactions',
  'momentumHistory',
] as const;

export const DATA_CONFLICT_MESSAGE =
  'Сохранение не записалось: данные уже обновились в другой вкладке. Обновите страницу.';

export const SAVE_FAILED_MESSAGE =
  'Не удалось сохранить данные. Обновите страницу и попробуйте снова.';

export const SAVE_BEFORE_HYDRATION_MESSAGE = 'Данные ещё не загружены';
