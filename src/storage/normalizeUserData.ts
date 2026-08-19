import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type {
  AppSettings,
  BankDeposit,
  DailyEntry,
  MeasurementEntry,
  Reward,
} from '../types';
import type { NormalizationIssue, UserDataEnvelope } from '../types/userData';
import { normalizeAppSettings } from '../utils/settingsNormalize';
import {
  CORE_DATA_TYPES,
  CURRENT_DATA_SCHEMA_VERSION,
  USER_DATA_TYPES,
} from './userDataConstants';

function issue(path: string, code: string, message: string): NormalizationIssue {
  return { path, code, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function numOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

export function normalizeDailyEntry(
  raw: unknown,
  index: number,
  issues: NormalizationIssue[],
): DailyEntry | null {
  if (!isRecord(raw)) {
    issues.push(issue(`dailyEntries[${index}]`, 'invalid_entry', 'Skipped malformed day'));
    return null;
  }
  if (typeof raw.date !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(raw.date)) {
    issues.push(issue(`dailyEntries[${index}]`, 'invalid_date', 'Skipped day without a valid date'));
    return null;
  }
  return {
    ...raw,
    id: typeof raw.id === 'string' ? raw.id : '',
    date: raw.date.slice(0, 10),
    calories: numOrNull(raw.calories),
    steps: numOrNull(raw.steps),
    alcohol: (raw.alcohol as DailyEntry['alcohol']) ?? null,
    morningExercise: asBoolean(raw.morningExercise),
    gym: asBoolean(raw.gym),
    journal: asBoolean(raw.journal),
    cooking: asBoolean(raw.cooking),
    repair: asBoolean(raw.repair),
    plants: asBoolean(raw.plants),
    hobby: asBoolean(raw.hobby),
    comment: typeof raw.comment === 'string' ? raw.comment : '',
    customCompletions:
      isRecord(raw.customCompletions) ? (raw.customCompletions as DailyEntry['customCompletions']) : {},
  } as DailyEntry;
}

export function normalizeMeasurementEntry(
  raw: unknown,
  index: number,
  issues: NormalizationIssue[],
): MeasurementEntry | null {
  if (!isRecord(raw)) {
    issues.push(issue(`measurements[${index}]`, 'invalid_entry', 'Skipped malformed measurement'));
    return null;
  }
  if (typeof raw.date !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(raw.date)) {
    issues.push(issue(`measurements[${index}]`, 'invalid_date', 'Skipped measurement without a date'));
    return null;
  }
  return {
    ...raw,
    id: typeof raw.id === 'string' ? raw.id : '',
    date: raw.date.slice(0, 10),
    weight: numOrNull(raw.weight),
    chest: numOrNull(raw.chest),
    waist: numOrNull(raw.waist),
    belly: numOrNull(raw.belly),
    hips: numOrNull(raw.hips),
    thigh: numOrNull(raw.thigh),
    biceps: numOrNull(raw.biceps),
    comment: typeof raw.comment === 'string' ? raw.comment : '',
  } as MeasurementEntry;
}

function normalizeReward(raw: unknown, index: number, issues: NormalizationIssue[]): Reward | null {
  if (!isRecord(raw) || typeof raw.title !== 'string') {
    issues.push(issue(`rewards[${index}]`, 'invalid_entry', 'Skipped malformed reward'));
    return null;
  }
  return {
    ...raw,
    id: typeof raw.id === 'string' ? raw.id : '',
    title: raw.title,
    description: typeof raw.description === 'string' ? raw.description : '',
    cost: numOrNull(raw.cost) ?? 0,
    category: typeof raw.category === 'string' ? raw.category : '',
    purchasedAt: typeof raw.purchasedAt === 'string' ? raw.purchasedAt : null,
    hidden: asBoolean(raw.hidden),
    moneyGoal: numOrNull(raw.moneyGoal),
  } as Reward;
}

function normalizeBankDeposit(
  raw: unknown,
  index: number,
  issues: NormalizationIssue[],
): BankDeposit | null {
  if (!isRecord(raw) || typeof raw.date !== 'string') {
    issues.push(issue(`bankDeposits[${index}]`, 'invalid_entry', 'Skipped malformed deposit'));
    return null;
  }
  return {
    ...raw,
    id: typeof raw.id === 'string' ? raw.id : '',
    amount: numOrNull(raw.amount) ?? 0,
    date: raw.date.slice(0, 10),
    comment: typeof raw.comment === 'string' ? raw.comment : '',
  };
}

function normalizeList<T>(
  raw: unknown,
  path: string,
  issues: NormalizationIssue[],
  mapItem: (item: unknown, index: number, issues: NormalizationIssue[]) => T | null,
): T[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    issues.push(issue(path, 'invalid_type', `${path} was not a list and was reset`));
    return [];
  }
  const out: T[] = [];
  raw.forEach((item, index) => {
    const next = mapItem(item, index, issues);
    if (next) out.push(next);
  });
  return out;
}

function pickExtras(source: Record<string, unknown>): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  for (const type of USER_DATA_TYPES) {
    if ((CORE_DATA_TYPES as readonly string[]).includes(type)) continue;
    if (type in source && source[type] !== undefined) {
      extras[type] = source[type];
    }
  }
  for (const [key, value] of Object.entries(source)) {
    if (
      key === 'settings' ||
      key === 'profile' ||
      key === 'dataSchemaVersion' ||
      (USER_DATA_TYPES as readonly string[]).includes(key)
    ) {
      continue;
    }
    extras[key] = value;
  }
  return extras;
}

/**
 * Runtime safety net: missing/malformed fragments become defaults.
 * Unknown keys on objects are preserved (future fields).
 */
export function normalizeUserDataWithReport(raw: UserDataEnvelope): {
  data: UserDataEnvelope;
  issues: NormalizationIssue[];
} {
  const issues: NormalizationIssue[] = [];
  const source = raw as unknown as Record<string, unknown>;

  if (raw.settings == null || typeof raw.settings !== 'object') {
    issues.push(issue('settings', 'invalid_type', 'Settings missing; defaults applied'));
  } else if (raw.settings.cozyHome != null && typeof raw.settings.cozyHome !== 'object') {
    issues.push(issue('settings.cozyHome', 'invalid_type', 'Cozy Home reset to defaults'));
  }

  const settings: AppSettings = normalizeAppSettings(
    (isRecord(raw.settings) ? raw.settings : DEFAULT_APP_SETTINGS) as AppSettings,
  );

  const version =
    typeof raw.dataSchemaVersion === 'number' && Number.isFinite(raw.dataSchemaVersion)
      ? Math.max(Math.floor(raw.dataSchemaVersion), CURRENT_DATA_SCHEMA_VERSION)
      : CURRENT_DATA_SCHEMA_VERSION;

  const data: UserDataEnvelope = {
    dataSchemaVersion: version,
    dailyEntries: normalizeList(raw.dailyEntries, 'dailyEntries', issues, normalizeDailyEntry),
    measurements: normalizeList(raw.measurements, 'measurements', issues, normalizeMeasurementEntry),
    rewards: normalizeList(raw.rewards, 'rewards', issues, normalizeReward),
    bankDeposits: normalizeList(raw.bankDeposits, 'bankDeposits', issues, normalizeBankDeposit),
    settings: {
      ...settings,
      dataSchemaVersion: version,
    },
    extras: pickExtras({ ...source, ...raw.extras }),
    profile: raw.profile,
  };

  if (import.meta.env.DEV && issues.length > 0) {
    console.info('[normalizeUserData]', issues);
  }

  return { data, issues };
}

export function normalizeUserData(raw: UserDataEnvelope): UserDataEnvelope {
  return normalizeUserDataWithReport(raw).data;
}
