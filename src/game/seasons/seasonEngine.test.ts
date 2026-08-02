import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { SEASON_CONFIGS, SEASON_COUNT } from './seasonConfig';
import {
  getCalendarSeasonIndex,
  getRawSeasonIndex,
  getSeasonDateRange,
  getSeasonDayNumber,
  getSeasonIndex,
  getSeasonSnapshot,
  getSeasonSnapshotWithRecap,
  resolveActiveSeasonIndex,
  resolveCampaignStartDate,
} from './seasonEngine';
import { getSeasonPartialStatus, isSeasonArcCompleted } from './seasonRecap';
import { buildQuestProgressList } from './seasonQuestProgress';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

describe('season config', () => {
  it('has 13 seasons with 3-5 quests each', () => {
    expect(SEASON_CONFIGS).toHaveLength(SEASON_COUNT);
    for (const season of SEASON_CONFIGS) {
      expect(season.quests.length).toBeGreaterThanOrEqual(3);
      expect(season.quests.length).toBeLessThanOrEqual(5);
    }
  });
});

describe('resolveCampaignStartDate', () => {
  it('uses settings.startDate when present', () => {
    expect(
      resolveCampaignStartDate({ ...DEFAULT_APP_SETTINGS, startDate: '2026-01-01' }, [], '2026-02-01'),
    ).toBe('2026-01-01');
  });

  it('falls back to earliest daily entry', () => {
    const entries = [entry('2026-03-10'), entry('2026-03-05')];
    expect(resolveCampaignStartDate(DEFAULT_APP_SETTINGS, entries, '2026-03-20')).toBe('2026-03-05');
  });

  it('falls back to today when no data', () => {
    expect(resolveCampaignStartDate(DEFAULT_APP_SETTINGS, [], '2026-04-01')).toBe('2026-04-01');
  });
});

describe('season index and day number', () => {
  const start = '2026-01-01';

  it('starts at season 1 day 1', () => {
    expect(getSeasonIndex(start, '2026-01-01')).toBe(1);
    expect(getSeasonDayNumber(start, '2026-01-01')).toBe(1);
  });

  it('calculates day 28 within first season', () => {
    expect(getSeasonDayNumber(start, '2026-01-28')).toBe(28);
    expect(getSeasonIndex(start, '2026-01-28')).toBe(1);
  });

  it('calendar window moves to season 2 on day 29, but active arc stays on incomplete season 1', () => {
    expect(getCalendarSeasonIndex(start, '2026-01-29')).toBe(2);
    expect(getSeasonIndex(start, '2026-01-29')).toBe(2);
    expect(
      resolveActiveSeasonIndex({
        settings: { ...DEFAULT_APP_SETTINGS, startDate: start },
        dailyEntries: [],
        today: '2026-01-29',
      }),
    ).toBe(1);
    expect(getSeasonDayNumber(start, '2026-01-29', 1)).toBe(29);
  });

  it('caps calendar index at season 13 after a full year', () => {
    const dayAfterYear = '2027-01-10';
    expect(getRawSeasonIndex(start, dayAfterYear)).toBeGreaterThan(SEASON_COUNT);
    expect(getCalendarSeasonIndex(start, dayAfterYear)).toBe(SEASON_COUNT);
  });
});

describe('season date range', () => {
  it('covers 28 days for season 1', () => {
    const range = getSeasonDateRange('2026-01-01', 1);
    expect(range.start).toBe('2026-01-01');
    expect(range.end).toBe('2026-01-28');
  });

  it('starts season 3 at correct offset', () => {
    const range = getSeasonDateRange('2026-01-01', 3);
    expect(range.start).toBe('2026-02-26');
    expect(range.end).toBe('2026-03-25');
  });
});

describe('quest progress from daily entries', () => {
  it('counts nutrition and steps in season window', () => {
    const season = SEASON_CONFIGS[0]!;
    const entries = [
      entry('2026-01-02', { nutritionLevel: 'light' }),
      entry('2026-01-03', { steps: 6000 }),
      entry('2026-02-01', { steps: 9000 }),
    ];
    const progress = buildQuestProgressList(season.quests, entries, {
      ...DEFAULT_APP_SETTINGS,
      nutritionTrackingMode: 'simple',
    });
    const nutrition = progress.find((q) => q.type === 'daysWithNutritionTracking');
    const steps = progress.find((q) => q.type === 'daysWithStepsAtLeast');
    expect(nutrition?.current).toBe(1);
    expect(steps?.current).toBe(2);
  });

  it('counts minimal days', () => {
    const season = SEASON_CONFIGS[0]!;
    const entries = [entry('2026-01-02', { dayMode: 'minimal' })];
    const progress = buildQuestProgressList(season.quests, entries, DEFAULT_APP_SETTINGS);
    expect(progress.find((q) => q.type === 'minimalDaysHeld')?.current).toBe(1);
  });

  it('counts recovery days for seasons that include them', () => {
    const season = SEASON_CONFIGS[5]!;
    const entries = [entry('2026-01-02', { dayMode: 'recovery' })];
    const progress = buildQuestProgressList(season.quests, entries, DEFAULT_APP_SETTINGS);
    expect(progress.find((q) => q.type === 'recoveryDays')?.current).toBe(1);
  });
});

describe('partial success status', () => {
  it('maps quest counts to statuses', () => {
    expect(getSeasonPartialStatus(0)).toBe('started');
    expect(getSeasonPartialStatus(1)).toBe('marked');
    expect(getSeasonPartialStatus(2)).toBe('marked');
    expect(getSeasonPartialStatus(3)).toBe('held');
    expect(getSeasonPartialStatus(4)).toBe('cleared');
    expect(getSeasonPartialStatus(5)).toBe('empowered');
    expect(isSeasonArcCompleted('held')).toBe(false);
    expect(isSeasonArcCompleted('cleared')).toBe(true);
  });
});

describe('getSeasonSnapshot', () => {
  it('returns safe defaults with no entries', () => {
    const snapshot = getSeasonSnapshot({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-05-01' },
      dailyEntries: [],
      today: '2026-05-01',
    });
    expect(snapshot.seasonIndex).toBe(1);
    expect(snapshot.dayNumber).toBe(1);
    expect(snapshot.completedQuestCount).toBe(0);
    expect(snapshot.partialStatus).toBe('started');
  });

  it('builds recap text', () => {
    const withRecap = getSeasonSnapshotWithRecap({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-05-01' },
      dailyEntries: [],
      today: '2026-05-01',
    });
    expect(withRecap.recapText).toContain('Сезон начат');
  });
});
