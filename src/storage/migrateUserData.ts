import type { AppSettings } from '../types';
import type { UserDataEnvelope } from '../types/userData';
import { migrateNutritionSettings } from '../utils/nutritionEngine';
import { CURRENT_DATA_SCHEMA_VERSION, USER_DATA_TYPES } from './userDataConstants';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function detectDataSchemaVersion(raw: {
  dataSchemaVersion?: unknown;
  settings?: { dataSchemaVersion?: unknown };
}): number {
  const fromRoot = raw.dataSchemaVersion;
  const fromSettings = raw.settings?.dataSchemaVersion;
  const n = Number(fromSettings ?? fromRoot ?? 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function asLooseList(value: unknown): UserDataEnvelope['dailyEntries'] {
  return (Array.isArray(value) ? value : value) as UserDataEnvelope['dailyEntries'];
}

/**
 * Coerce API `data` map or a backup `data` object into a loose envelope.
 * Does not normalize — call migrate then normalize.
 */
export function envelopeFromRawData(
  data: Record<string, unknown>,
  settingsOverride?: AppSettings | null,
): UserDataEnvelope {
  const settingsSource =
    settingsOverride ??
    (isRecord(data.customSettingsBackup) ? data.customSettingsBackup : null) ??
    (isRecord(data.settings) ? data.settings : null);

  const extras: Record<string, unknown> = {};
  for (const type of USER_DATA_TYPES) {
    if (
      type === 'dailyEntries' ||
      type === 'measurements' ||
      type === 'rewards' ||
      type === 'bankDeposits' ||
      type === 'customSettingsBackup'
    ) {
      continue;
    }
    if (type in data) extras[type] = data[type];
  }

  const settings = (settingsSource ?? {}) as AppSettings;

  return {
    dataSchemaVersion: detectDataSchemaVersion({
      dataSchemaVersion: data.dataSchemaVersion,
      settings,
    }),
    dailyEntries: asLooseList(data.dailyEntries),
    measurements: data.measurements as UserDataEnvelope['measurements'],
    rewards: data.rewards as UserDataEnvelope['rewards'],
    bankDeposits: data.bankDeposits as UserDataEnvelope['bankDeposits'],
    settings,
    extras,
    profile: isRecord(data.profile)
      ? (data.profile as UserDataEnvelope['profile'])
      : undefined,
  };
}

function migrateV0ToV1(data: UserDataEnvelope): UserDataEnvelope {
  const entries = Array.isArray(data.dailyEntries) ? data.dailyEntries : [];
  const settings = migrateNutritionSettings(data.settings, entries);
  return {
    ...data,
    dataSchemaVersion: 1,
    settings: {
      ...settings,
      dataSchemaVersion: 1,
    },
  };
}

/**
 * Historical schema transforms. Pure and idempotent: v1+ input is unchanged
 * except keeping schemaVersion >= detected.
 */
export function migrateUserData(raw: UserDataEnvelope): UserDataEnvelope {
  let data = raw;
  let version = detectDataSchemaVersion(data);

  if (version < 1) {
    data = migrateV0ToV1(data);
    version = 1;
  }

  const stamped = Math.max(version, CURRENT_DATA_SCHEMA_VERSION);
  return {
    ...data,
    dataSchemaVersion: stamped,
    settings: {
      ...data.settings,
      dataSchemaVersion: Math.max(data.settings.dataSchemaVersion ?? 0, stamped),
    },
  };
}

export function prepareUserData(raw: UserDataEnvelope): {
  data: UserDataEnvelope;
  migratedFrom: number;
} {
  const from = detectDataSchemaVersion(raw);
  return { data: migrateUserData(raw), migratedFrom: from };
}
