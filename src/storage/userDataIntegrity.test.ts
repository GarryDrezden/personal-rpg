import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CURRENT_DATA_SCHEMA_VERSION, DATA_CONFLICT_MESSAGE, SAVE_BEFORE_HYDRATION_MESSAGE } from './userDataConstants';
import { envelopeFromRawData, migrateUserData, detectDataSchemaVersion } from './migrateUserData';
import { normalizeUserDataWithReport } from './normalizeUserData';
import {
  exportUserBackup,
  parseUserBackup,
  prepareBackupForImport,
  stringifyUserBackup,
  validateUserBackup,
  BackupValidationError,
} from './userDataCodec';
import { assertHydrationReady } from './hydrationGuard';
import { isRevisionMismatch, remapPersistenceError } from './persistenceErrors';
import { ApiError } from '../api/httpClient';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

function loadFixture(name: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(fixtureDir, name), 'utf8')) as Record<string, unknown>;
}

function runPipeline(raw: Record<string, unknown>) {
  const loose = envelopeFromRawData(raw);
  const migrated = migrateUserData(loose);
  return normalizeUserDataWithReport(migrated);
}

describe('hydration guard', () => {
  it('blocks writes before load', () => {
    expect(() => assertHydrationReady('pending')).toThrow(SAVE_BEFORE_HYDRATION_MESSAGE);
    expect(() => assertHydrationReady('failed')).toThrow(SAVE_BEFORE_HYDRATION_MESSAGE);
    expect(() => assertHydrationReady('ready')).not.toThrow();
  });
});

describe('revision conflict (KI-01)', () => {
  it('detects stale PUT against a newer server revision', () => {
    expect(isRevisionMismatch(5, 5)).toBe(false);
    expect(isRevisionMismatch(5, 6)).toBe(true);
    expect(isRevisionMismatch(undefined, 6)).toBe(false);
  });

  it('maps 409 to a reload message without exposing SQL', () => {
    const err = new ApiError('Data conflict', 409, { currentRevision: 6 });
    expect(() => remapPersistenceError(err)).toThrow(DATA_CONFLICT_MESSAGE);
    try {
      remapPersistenceError(err);
    } catch (mapped) {
      expect(mapped).toBeInstanceOf(ApiError);
      expect((mapped as ApiError).status).toBe(409);
      expect((mapped as ApiError).body).toEqual({ currentRevision: 6 });
    }
  });
});

describe('user data migration', () => {
  it('migrates unversioned legacy-v1 (calories present → precise nutrition)', () => {
    const { data } = runPipeline(loadFixture('legacy-v1.json'));
    expect(detectDataSchemaVersion(envelopeFromRawData(loadFixture('legacy-v1.json')))).toBe(0);
    expect(data.dataSchemaVersion).toBe(CURRENT_DATA_SCHEMA_VERSION);
    expect(data.settings.nutritionTrackingMode).toBe('precise');
    expect(data.dailyEntries).toHaveLength(1);
  });

  it('migrates legacy-v2 nutrition settings and stamps schema 1', () => {
    const { data } = runPipeline(loadFixture('legacy-v2.json'));
    expect(data.settings.nutritionTrackingMode).toBe('simple');
    expect(data.settings.dataSchemaVersion).toBe(1);
    expect(data.settings.weightGoal).toBe(90);
  });

  it('keeps current schema 1 data', () => {
    const { data, issues } = runPipeline(loadFixture('current.json'));
    expect(data.dataSchemaVersion).toBe(1);
    expect(data.settings.themeId).toBe('darkFantasy');
    expect(data.measurements).toHaveLength(1);
    expect(issues).toEqual([]);
  });

  it('is idempotent', () => {
    const once = runPipeline(loadFixture('legacy-v1.json')).data;
    const twice = migrateUserData(once);
    expect(twice.dataSchemaVersion).toBe(once.dataSchemaVersion);
    expect(twice.settings.nutritionTrackingMode).toBe(once.settings.nutritionTrackingMode);
  });
});

describe('normalize corrupt fragments', () => {
  it('keeps valid daily entries when cozyHome and measurements are broken', () => {
    const { data, issues } = runPipeline(loadFixture('corrupt-partial.json'));
    expect(data.dailyEntries.some((e) => e.id === 'keep-me')).toBe(true);
    expect(data.measurements).toEqual([]);
    expect(issues.some((i) => i.path === 'measurements')).toBe(true);
    expect(issues.some((i) => i.path === 'settings.cozyHome' || i.code === 'invalid_type')).toBe(true);
    expect(data.settings.cozyHome?.resources).toBeTruthy();
    expect(data.settings.themeId).toBe('cozy');
  });
});

describe('future fields policy: preserve', () => {
  it('keeps unknown keys on settings and daily entries', () => {
    const { data } = runPipeline(loadFixture('future-fields.json'));
    expect(data.dataSchemaVersion).toBe(9);
    expect((data.settings as AppSettingsWithFuture).futureSettingsKey).toBe('keep-me');
    expect((data.dailyEntries[0] as { futureDailyFlag?: boolean }).futureDailyFlag).toBe(true);
  });
});

type AppSettingsWithFuture = { futureSettingsKey?: string };

describe('backup codec', () => {
  it('round-trips current data', () => {
    const { data } = runPipeline(loadFixture('current.json'));
    const backup = exportUserBackup({
      appData: {
        dailyEntries: data.dailyEntries,
        measurements: data.measurements,
        rewards: data.rewards,
        bankDeposits: data.bankDeposits,
        settings: data.settings,
      },
    });
    const text = stringifyUserBackup(backup);
    const prepared = prepareBackupForImport(text);
    expect(prepared.envelope.dailyEntries).toHaveLength(1);
    expect(prepared.envelope.settings.weightGoal).toBe(80);
    expect(prepared.envelope.settings.themeId).toBe('darkFantasy');
    expect(prepared.summary.dailyCount).toBe(1);
  });

  it('rejects invalid JSON and wrong format', () => {
    expect(() => parseUserBackup('{')).toThrow(BackupValidationError);
    expect(() => validateUserBackup({ format: 'nope' })).toThrow(BackupValidationError);
    expect(() =>
      validateUserBackup(JSON.parse('{"format":"personal-rpg-backup","__proto__":{"x":1}}')),
    ).toThrow(BackupValidationError);
  });

  it('does not import auth identity', () => {
    const backup = exportUserBackup({
      appData: {
        dailyEntries: [],
        measurements: [],
        rewards: [],
        bankDeposits: [],
        settings: DEFAULT_APP_SETTINGS,
      },
      profile: {
        displayName: 'Герой',
        heroGender: 'male',
        startWeight: 90,
        targetWeight: 80,
        height: 175,
      },
    });
    expect(JSON.stringify(backup)).not.toMatch(/password/i);
    expect(JSON.stringify(backup)).not.toMatch(/authToken/);
    expect((backup.data as { userId?: string }).userId).toBeUndefined();
  });
});
