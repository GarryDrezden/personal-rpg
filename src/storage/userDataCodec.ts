import type { AppData, AppSettings } from '../types';
import type {
  BackupProfileSnapshot,
  UserBackupFileV1,
  UserDataEnvelope,
  UserDataSummary,
} from '../types/userData';
import { resolveThemeId } from '../constants/themes';
import {
  BACKUP_FORMAT,
  BACKUP_FORMAT_VERSION,
  CURRENT_DATA_SCHEMA_VERSION,
  MAX_BACKUP_BYTES,
  SIDECAR_BACKUP_TYPES,
  USER_DATA_TYPES,
} from './userDataConstants';
import { envelopeFromRawData, migrateUserData } from './migrateUserData';
import { normalizeUserDataWithReport } from './normalizeUserData';

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export class BackupValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupValidationError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function assertPlainKeys(value: unknown, path: string): void {
  if (!isRecord(value)) return;
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      throw new BackupValidationError(`Некорректный ключ в файле (${path}.${key})`);
    }
  }
}

export function summarizeUserData(
  data: Pick<UserDataEnvelope, 'dataSchemaVersion' | 'dailyEntries' | 'measurements' | 'rewards' | 'settings' | 'profile'>,
  exportedAt?: string,
): UserDataSummary {
  return {
    exportedAt,
    dataSchemaVersion: data.dataSchemaVersion,
    themeId: resolveThemeId(data.settings.themeId),
    dailyCount: data.dailyEntries.length,
    measurementCount: data.measurements.length,
    rewardCount: data.rewards.length,
    profileName: data.profile?.displayName ?? null,
  };
}

export function exportUserBackup(params: {
  appData: AppData;
  extras?: Record<string, unknown>;
  profile?: BackupProfileSnapshot;
  exportedAt?: string;
}): UserBackupFileV1 {
  const version =
    params.appData.settings.dataSchemaVersion ?? CURRENT_DATA_SCHEMA_VERSION;
  const extras = params.extras ?? {};
  const data: UserBackupFileV1['data'] = {
    dailyEntries: params.appData.dailyEntries,
    measurements: params.appData.measurements,
    rewards: params.appData.rewards,
    bankDeposits: params.appData.bankDeposits,
    settings: {
      ...params.appData.settings,
      dataSchemaVersion: version,
    },
    ...extras,
  };
  if (params.profile) {
    data.profile = params.profile;
  }
  return {
    format: BACKUP_FORMAT,
    backupFormatVersion: BACKUP_FORMAT_VERSION,
    dataSchemaVersion: version,
    exportedAt: params.exportedAt ?? new Date().toISOString(),
    data,
  };
}

export function stringifyUserBackup(backup: UserBackupFileV1): string {
  return JSON.stringify(backup, null, 2);
}

export function parseUserBackup(raw: string): unknown {
  if (raw.length > MAX_BACKUP_BYTES) {
    throw new BackupValidationError('Файл слишком большой (лимит 2 МБ)');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new BackupValidationError('Файл не является корректным JSON');
  }
  return parsed;
}

export function validateUserBackup(raw: unknown): UserBackupFileV1 {
  if (typeof raw === 'string') {
    throw new BackupValidationError('Ожидался объект, не строка');
  }
  if (!isRecord(raw)) {
    throw new BackupValidationError('Некорректный формат резервной копии');
  }
  assertPlainKeys(raw, 'root');
  if (raw.format !== BACKUP_FORMAT) {
    throw new BackupValidationError('Это не файл резервной копии Personal RPG');
  }
  if (raw.backupFormatVersion !== BACKUP_FORMAT_VERSION) {
    throw new BackupValidationError('Неподдерживаемая версия файла резервной копии');
  }
  if (!isRecord(raw.data)) {
    throw new BackupValidationError('В файле нет блока data');
  }
  assertPlainKeys(raw.data, 'data');
  const schemaVersion = Number(raw.dataSchemaVersion ?? raw.data.dataSchemaVersion ?? 0);
  if (!Number.isFinite(schemaVersion) || schemaVersion < 0) {
    throw new BackupValidationError('Некорректная версия данных');
  }
  if (typeof raw.exportedAt !== 'string' || raw.exportedAt.length < 4) {
    throw new BackupValidationError('В файле нет даты экспорта');
  }
  return raw as UserBackupFileV1;
}

export function backupToRestorePayload(backup: UserBackupFileV1): Record<string, unknown> {
  const migrated = migrateUserData(envelopeFromRawData(backup.data as Record<string, unknown>));
  const { data } = normalizeUserDataWithReport(migrated);
  const payload: Record<string, unknown> = {
    dailyEntries: data.dailyEntries,
    measurements: data.measurements,
    rewards: data.rewards,
    bankDeposits: data.bankDeposits,
    customSettingsBackup: data.settings,
    ...data.extras,
  };
  for (const type of USER_DATA_TYPES) {
    if (!(type in payload)) continue;
    if (!(USER_DATA_TYPES as readonly string[]).includes(type)) {
      delete payload[type];
    }
  }
  return payload;
}

export function prepareBackupForImport(rawText: string): {
  backup: UserBackupFileV1;
  envelope: UserDataEnvelope;
  summary: UserDataSummary;
} {
  const parsed = parseUserBackup(rawText);
  const backup = validateUserBackup(parsed);
  const migrated = migrateUserData(envelopeFromRawData(backup.data as Record<string, unknown>));
  const { data } = normalizeUserDataWithReport(migrated);
  return {
    backup,
    envelope: data,
    summary: summarizeUserData(data, backup.exportedAt),
  };
}

export function collectSidecarExtrasFromLocal(read: (key: string) => string | null): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  // Keys resolved by caller via collectLocalSidecarsForSave — this helper is for tests.
  for (const type of SIDECAR_BACKUP_TYPES) {
    const raw = read(type);
    if (!raw) continue;
    try {
      extras[type] = JSON.parse(raw) as unknown;
    } catch {
      // skip corrupt sidecar
    }
  }
  return extras;
}

export function settingsFromEnvelope(settings: AppSettings): AppSettings {
  return {
    ...settings,
    dataSchemaVersion: Math.max(
      settings.dataSchemaVersion ?? 0,
      CURRENT_DATA_SCHEMA_VERSION,
    ),
  };
}
