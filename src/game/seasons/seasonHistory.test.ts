import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { getSeasonRewardStatus } from './seasonRecap';
import { getSeasonHistoryArchive, getVisibleSeasonHistory } from './seasonHistory';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
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
    const entries = Array.from({ length: 28 }, (_, i) => {
      const day = i + 1;
      return entry(`2026-06-${String(day).padStart(2, '0')}`, {
        steps: 9000,
        alcohol: 'none',
        nutritionLevel: 'light',
        energyLevel: 3,
        dayMode: day <= 3 ? 'minimal' : 'normal',
      });
    });

    const archive = getSeasonHistoryArchive({
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      dailyEntries: entries,
      today: '2026-07-05',
    });

    expect(archive.currentSeasonIndex).toBe(2);
    const season1 = archive.entries[0]!;
    expect(season1.isLocked).toBe(false);
    expect(season1.isCurrent).toBe(false);
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
