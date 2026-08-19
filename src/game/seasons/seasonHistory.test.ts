import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { getSeasonRewardStatus } from './seasonRecap';
import {
  getSeasonHistoryArchive,
  getVisibleSeasonHistory,
  partitionSeasonHistory,
} from './seasonHistory';
import {
  evaluateSeasonProgress,
  getCalendarSeasonIndex,
  resolveActiveSeasonIndex,
} from './seasonEngine';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

/** Sparse days that yield ~2 completed season-1 quests, not 4. */
function partialSeason1Entries(): DailyEntry[] {
  return [
    entry('2026-06-02', { alcohol: 'none', nutritionLevel: 'light', energyLevel: 3 }),
    entry('2026-06-03', { alcohol: 'none', nutritionLevel: 'light', energyLevel: 3 }),
    entry('2026-06-04', { alcohol: 'none', nutritionLevel: 'light', energyLevel: 3 }),
    entry('2026-06-05', { alcohol: 'none', nutritionLevel: 'light', energyLevel: 3 }),
    entry('2026-06-06', { alcohol: 'none', nutritionLevel: 'light', energyLevel: 3 }),
    entry('2026-06-07', { steps: 6000 }),
    entry('2026-06-08', { steps: 6000 }),
  ];
}

function clearedSeason1Entries(): DailyEntry[] {
  return Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    return entry(`2026-06-${String(day).padStart(2, '0')}`, {
      steps: 9000,
      alcohol: 'none',
      nutritionLevel: 'light',
      energyLevel: 3,
      dayMode: day <= 3 ? 'minimal' : 'normal',
    });
  });
}

describe('getSeasonRewardStatus', () => {
  it('maps partial status to soft reward states', () => {
    expect(getSeasonRewardStatus('started', true)).toBe('fog');
    expect(getSeasonRewardStatus('marked', false)).toBe('preview');
    expect(getSeasonRewardStatus('held', false)).toBe('awaiting');
    expect(getSeasonRewardStatus('cleared', false)).toBe('earned');
    expect(getSeasonRewardStatus('empowered', false)).toBe('earned');
  });
});

describe('campaign arc season gating', () => {
  it('keeps Season 1 current when progress is incomplete (2/5)', () => {
    const dailyEntries = partialSeason1Entries();
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' };
    const today = '2026-06-20';

    const progress = evaluateSeasonProgress({
      settings,
      dailyEntries,
      campaignStartDate: '2026-06-01',
      seasonIndex: 1,
      today,
      extendOpenEnd: true,
    });
    expect(progress.completedQuestCount).toBeGreaterThanOrEqual(1);
    expect(progress.completedQuestCount).toBeLessThan(4);
    expect(progress.isCompleted).toBe(false);

    expect(
      resolveActiveSeasonIndex({ settings, dailyEntries, today }),
    ).toBe(1);

    const archive = getSeasonHistoryArchive({ settings, dailyEntries, today });
    expect(archive.currentSeasonIndex).toBe(1);
    expect(archive.entries[0]?.isCurrent).toBe(true);
    expect(archive.entries[0]?.isCompleted).toBe(false);
    expect(archive.entries[1]?.isLocked).toBe(true);
  });

  it('does not advance current season by calendar alone past 28 days', () => {
    const dailyEntries = partialSeason1Entries();
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' };
    const today = '2026-07-10'; // past first 28-day window

    expect(getCalendarSeasonIndex('2026-06-01', today)).toBe(2);
    expect(
      resolveActiveSeasonIndex({ settings, dailyEntries, today }),
    ).toBe(1);

    const archive = getSeasonHistoryArchive({ settings, dailyEntries, today });
    expect(archive.currentSeasonIndex).toBe(1);
    expect(archive.entries[0]?.isCurrent).toBe(true);
    expect(archive.entries[1]?.isCurrent).toBe(false);
    expect(archive.entries[1]?.isLocked).toBe(true);
  });

  it('Season 2 cannot become current until Season 1 completed', () => {
    const dailyEntries = partialSeason1Entries();
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' };
    const archive = getSeasonHistoryArchive({
      settings,
      dailyEntries,
      today: '2026-08-01',
    });
    expect(archive.currentSeasonIndex).toBe(1);
    expect(archive.entries.filter((e) => e.isCurrent)).toHaveLength(1);
    expect(archive.entries[1]?.isLocked).toBe(true);
  });

  it('completed section contains only completed seasons', () => {
    const dailyEntries = partialSeason1Entries();
    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries,
      today: '2026-07-10',
    });
    const { current, completed, upcoming } = partitionSeasonHistory(archive);
    expect(current?.seasonIndex).toBe(1);
    expect(completed.every((e) => e.isCompleted)).toBe(true);
    expect(completed).toHaveLength(0);
    expect(upcoming.every((e) => e.isLocked)).toBe(true);
    expect(
      completed.every(
        (e) => e.rewardStatus !== 'preview' && e.partialStatus !== 'marked',
      ),
    ).toBe(true);
  });

  it('pending/waiting seasons do not appear in completed section', () => {
    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries: partialSeason1Entries(),
      today: '2026-07-10',
    });
    const { completed } = partitionSeasonHistory(archive);
    expect(completed.some((e) => e.rewardStatus === 'preview')).toBe(false);
    expect(completed.some((e) => !e.isCompleted)).toBe(false);
  });

  it('normalize fixes invalid calendar state (S2 “current” while S1 incomplete)', () => {
    const dailyEntries = partialSeason1Entries();
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' };
    const today = '2026-07-05';
    // Calendar would say 2; campaign arc normalizes to 1.
    expect(getCalendarSeasonIndex('2026-06-01', today)).toBe(2);
    const active = resolveActiveSeasonIndex({ settings, dailyEntries, today });
    expect(active).toBe(1);
    const archive = getSeasonHistoryArchive({ settings, dailyEntries, today });
    expect(archive.currentSeasonIndex).toBe(1);
    expect(archive.entries[0]?.completedQuestCount).toBeGreaterThan(0);
  });

  it('late Season 1 completion does not share days with Season 2', () => {
    const start = '2026-06-01';
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: start };
    const late = [
      ...partialSeason1Entries(),
      ...Array.from({ length: 18 }, (_, i) =>
        entry(`2026-07-${String(i + 1).padStart(2, '0')}`, {
          steps: 9000,
          alcohol: 'none',
          nutritionLevel: 'light',
          energyLevel: 3,
          dayMode: i < 3 ? 'minimal' : 'normal',
        }),
      ),
    ];
    const today = '2026-07-18';
    expect(resolveActiveSeasonIndex({ settings, dailyEntries: late, today })).toBe(2);

    const archive = getSeasonHistoryArchive({ settings, dailyEntries: late, today });
    const season1 = archive.entries[0]!;
    const season2 = archive.entries[1]!;
    expect(season1.isCompleted).toBe(true);
    expect(season2.isCurrent).toBe(true);
    expect(season2.isLocked).toBe(false);
    expect(season2.seasonStartDate > season1.seasonEndDate).toBe(true);
  });

  it('completing Season 1 allows Season 2 to become current', () => {
    const dailyEntries = clearedSeason1Entries();
    const settings = { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' };
    const today = '2026-07-05';

    const s1 = evaluateSeasonProgress({
      settings,
      dailyEntries,
      campaignStartDate: '2026-06-01',
      seasonIndex: 1,
      today,
      extendOpenEnd: true,
    });
    expect(s1.isCompleted).toBe(true);
    expect(
      resolveActiveSeasonIndex({ settings, dailyEntries, today }),
    ).toBe(2);

    const archive = getSeasonHistoryArchive({ settings, dailyEntries, today });
    expect(archive.currentSeasonIndex).toBe(2);
    const { current, completed } = partitionSeasonHistory(archive);
    expect(current?.seasonIndex).toBe(2);
    expect(completed.some((e) => e.seasonIndex === 1 && e.isCompleted)).toBe(true);
    expect(completed.every((e) => e.isCompleted)).toBe(true);
  });

  it('theme labels do not affect season state logic', () => {
    const dailyEntries = partialSeason1Entries();
    const settingsDark = {
      ...DEFAULT_APP_SETTINGS,
      startDate: '2026-06-01',
      themeId: 'darkFantasy' as const,
    };
    const settingsCozy = {
      ...DEFAULT_APP_SETTINGS,
      startDate: '2026-06-01',
      themeId: 'cozy' as const,
    };
    const today = '2026-07-10';
    const a = getSeasonHistoryArchive({
      settings: settingsDark,
      dailyEntries,
      today,
    });
    const b = getSeasonHistoryArchive({
      settings: settingsCozy,
      dailyEntries,
      today,
    });
    expect(a.currentSeasonIndex).toBe(b.currentSeasonIndex);
    expect(a.entries.map((e) => [e.seasonIndex, e.isCurrent, e.isLocked, e.isCompleted])).toEqual(
      b.entries.map((e) => [e.seasonIndex, e.isCurrent, e.isLocked, e.isCompleted]),
    );
  });
});

describe('getSeasonHistoryArchive', () => {
  it('marks future seasons as fog and current as open', () => {
    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries: [],
      today: '2026-06-10',
    });
    expect(archive.currentSeasonIndex).toBe(1);
    expect(archive.entries).toHaveLength(13);
    expect(archive.entries[0]?.isCurrent).toBe(true);
    expect(archive.entries[0]?.rewardStatus).toBe('preview');
    expect(archive.entries[1]?.isLocked).toBe(true);
    expect(archive.entries[1]?.rewardStatus).toBe('fog');
    expect(archive.earnedRewardCount).toBe(0);
  });

  it('earns reward when past season cleared', () => {
    const entries = clearedSeason1Entries();

    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries: entries,
      today: '2026-07-05',
    });

    expect(archive.currentSeasonIndex).toBe(2);
    const season1 = archive.entries[0]!;
    expect(season1.isLocked).toBe(false);
    expect(season1.isCurrent).toBe(false);
    expect(season1.isCompleted).toBe(true);
    expect(season1.completedQuestCount).toBeGreaterThanOrEqual(4);
    expect(season1.rewardStatus).toBe('earned');
    expect(season1.rewardLabel).toContain('у тебя');
    expect(archive.earnedRewardCount).toBeGreaterThanOrEqual(1);
  });

  it('limits fog seasons in visible list', () => {
    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries: [],
      today: '2026-06-10',
    });
    const visible = getVisibleSeasonHistory(archive, 2);
    expect(visible.filter((e) => e.isLocked)).toHaveLength(2);
    expect(visible.some((e) => e.isCurrent)).toBe(true);
  });
});
