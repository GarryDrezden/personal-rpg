import type { DailyEntry, MeasurementEntry } from '../types';

/** Пустой старт — данные только в api/seed.json */
export const SEED_MEASUREMENTS: Omit<MeasurementEntry, 'id'>[] = [];
export const SEED_DAILY_ENTRIES: Omit<DailyEntry, 'id'>[] = [];
