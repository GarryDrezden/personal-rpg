import { describe, expect, it } from 'vitest';
import { MAX_BACKUP_BYTES } from './userDataConstants';
import { exportUserBackup, stringifyUserBackup } from './userDataCodec';
import { envelopeFromRawData, migrateUserData } from './migrateUserData';
import { normalizeUserDataWithReport } from './normalizeUserData';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { DailyEntry, MeasurementEntry } from '../types';

function syntheticDay(index: number): DailyEntry {
  const year = 2020 + Math.floor(index / 365);
  const day = (index % 365) + 1;
  const date = new Date(Date.UTC(year, 0, day)).toISOString().slice(0, 10);
  return {
    id: `d-${index}`,
    date,
    calories: 1800 + (index % 400),
    steps: 8000 + (index % 5000),
    alcohol: 'none',
    morningExercise: index % 2 === 0,
    gym: index % 7 === 0,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    customCompletions: {},
    dayMode: 'normal',
    energyLevel: 3,
    nutritionLevel: null,
    physicalActivityLevel: null,
    physicalActivityDuration: null,
    physicalActivityNote: null,
    cozyRewardsGranted: null,
  };
}

function syntheticMeasurement(index: number): MeasurementEntry {
  const date = new Date(Date.UTC(2020, 0, 1 + index * 7)).toISOString().slice(0, 10);
  return {
    id: `m-${index}`,
    date,
    weight: 95 - index * 0.02,
    chest: 120,
    waist: 110,
    belly: null,
    hips: 120,
    thigh: 70,
    biceps: 40,
    comment: '',
  };
}

describe('large account storage headroom', () => {
  it('5 years of daily entries stays under the 2 MiB API cap', () => {
    const days = 365 * 5;
    const started = Date.now();
    const dailyEntries = Array.from({ length: days }, (_, i) => syntheticDay(i));
    const measurements = Array.from({ length: 52 * 5 }, (_, i) => syntheticMeasurement(i));
    const backup = exportUserBackup({
      appData: {
        dailyEntries,
        measurements,
        rewards: [],
        bankDeposits: [],
        settings: DEFAULT_APP_SETTINGS,
      },
    });
    const text = stringifyUserBackup(backup);
    const elapsed = Date.now() - started;
    expect(text.length).toBeLessThan(MAX_BACKUP_BYTES);
    expect(text.length).toBeLessThan(1.5 * 1024 * 1024);
    expect(elapsed).toBeLessThan(2000);

    const normalizeStarted = Date.now();
    const { data } = normalizeUserDataWithReport(
      migrateUserData(
        envelopeFromRawData({
          dailyEntries,
          measurements,
          settings: DEFAULT_APP_SETTINGS,
        }),
      ),
    );
    expect(data.dailyEntries).toHaveLength(days);
    expect(Date.now() - normalizeStarted).toBeLessThan(2000);
  });
});
