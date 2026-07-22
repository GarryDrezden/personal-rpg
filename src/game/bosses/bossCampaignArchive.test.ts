import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import {
  ACT_CHAPTER_RANGES,
  ACT_SEASON_RANGES,
  countSealedCampaignBosses,
  getBossCampaignArchive,
  getCurrentActBoss,
} from './bossCampaignArchive';
import { hasSeasonCampaignBossArt } from './bossArt';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

describe('bossCampaignArchive', () => {
  it('builds season/chapter/act layers with safe empty defaults', () => {
    const archive = getBossCampaignArchive({
      dailyEntries: [],
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      today: '2026-06-10',
    });

    expect(archive.seasonBosses).toHaveLength(13);
    expect(archive.chapterBosses).toHaveLength(9);
    expect(archive.actBosses).toHaveLength(3);
    expect(archive.seasonBosses[0]?.isCurrent).toBe(true);
    expect(archive.seasonBosses[1]?.isLocked).toBe(true);
    expect(getCurrentActBoss(archive).boss.actId).toBe('I');
    expect(countSealedCampaignBosses(archive)).toBe(0);
  });

  it('marks future seasons locked and past seasons open', () => {
    const entries = Array.from({ length: 40 }, (_, i) => {
      const day = i + 1;
      const date =
        day <= 30
          ? `2026-06-${String(day).padStart(2, '0')}`
          : `2026-07-${String(day - 30).padStart(2, '0')}`;
      return entry(date, { steps: 8000, alcohol: 'none' });
    });

    const archive = getBossCampaignArchive({
      dailyEntries: entries,
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      today: '2026-07-10',
    });

    // Day 40 of campaign ≈ season 2
    expect(archive.current.seasonIndex).toBe(2);
    expect(archive.seasonBosses[0]?.isLocked).toBe(false);
    expect(archive.seasonBosses[1]?.isCurrent).toBe(true);
    expect(archive.seasonBosses[2]?.isLocked).toBe(true);
    expect(archive.seasonBosses[0]?.progressPercent).toBeGreaterThan(0);
  });

  it('derives act progress ranges', () => {
    expect(ACT_SEASON_RANGES.I).toEqual([1, 4]);
    expect(ACT_SEASON_RANGES.III).toEqual([10, 13]);
    expect(ACT_CHAPTER_RANGES.II).toEqual([4, 6]);
  });

  it('wires art for known season bosses', () => {
    expect(hasSeasonCampaignBossArt(1)).toBe(true);
    expect(hasSeasonCampaignBossArt(6)).toBe(true);
    expect(hasSeasonCampaignBossArt(13)).toBe(true);
  });
});
