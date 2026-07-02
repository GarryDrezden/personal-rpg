import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { unlockBodyAbilityV1, getBodyAbilityState } from '../bodyAbilities/bodyAbilityV1Engine';
import { getChapterBossByChapterId, getSeasonMiniBossByIndex } from './bossConfig';
import {
  BOSS_STATUS_THRESHOLDS,
  computeBossProgressPercent,
  getBossCampaignSnapshot,
  isBossFirstCrackEligible,
} from './bossCampaignEngine';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

describe('boss catalog mapping', () => {
  it('season index maps to correct boss', () => {
    expect(getSeasonMiniBossByIndex(1).title).toBe('Владыка Пустого Дня');
    expect(getSeasonMiniBossByIndex(6).title).toBe('Страж Перевала');
    expect(getSeasonMiniBossByIndex(13).title).toBe('Тень Старого Года');
  });

  it('after season 13 clamps to last boss', () => {
    expect(getSeasonMiniBossByIndex(20).seasonId).toBe(13);
  });

  it('chapter boss mapping returns correct boss', () => {
    expect(getChapterBossByChapterId(1)?.title).toBe('Страж Руин');
    expect(getChapterBossByChapterId(9)?.title).toBe('Последняя Тень Старой Формы');
  });
});

describe('getBossCampaignSnapshot', () => {
  it('safe defaults with empty data', () => {
    const snap = getBossCampaignSnapshot({
      dailyEntries: [],
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      today: '2026-06-10',
    });
    expect(snap.bossProgressPercent).toBe(0);
    expect(snap.bossStatus).toBe('untouched');
    expect(snap.currentBoss.layer).toBe('seasonMiniBoss');
  });

  it('season quest progress contributes', () => {
    const entries = Array.from({ length: 20 }, (_, i) =>
      entry(`2026-06-${String(i + 1).padStart(2, '0')}`, {
        steps: 6000,
        alcohol: 'none',
      }),
    );
    const snap = getBossCampaignSnapshot({
      dailyEntries: entries,
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      today: '2026-06-20',
    });
    expect(snap.bossProgressPercent).toBeGreaterThan(BOSS_STATUS_THRESHOLDS.noticed);
  });

  it('minimal days contribute', () => {
    const progress = computeBossProgressPercent({
      completedQuestCount: 0,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 2,
        minimal: 3,
        recovery: 0,
        movement: 0,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: 0,
      },
      plateauActive: false,
    });
    expect(progress).toBeGreaterThan(0);
  });

  it('Body Abilities bonus contributes', () => {
    const progress = computeBossProgressPercent({
      completedQuestCount: 1,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 1,
        minimal: 0,
        recovery: 0,
        movement: 0,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: 2,
      },
      plateauActive: false,
    });
    const without = computeBossProgressPercent({
      completedQuestCount: 1,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 1,
        minimal: 0,
        recovery: 0,
        movement: 0,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: 0,
      },
      plateauActive: false,
    });
    expect(progress).toBeGreaterThan(without);
  });

  it('plateau route holding bonus contributes', () => {
    const withPlateau = computeBossProgressPercent({
      completedQuestCount: 2,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 4,
        minimal: 1,
        recovery: 0,
        movement: 2,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: 0,
      },
      plateauActive: true,
    });
    const without = computeBossProgressPercent({
      completedQuestCount: 2,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 4,
        minimal: 1,
        recovery: 0,
        movement: 2,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: 0,
      },
      plateauActive: false,
    });
    expect(withPlateau).toBeGreaterThan(without);
  });

  it('status thresholds work', () => {
    expect(
      computeBossProgressPercent({
        completedQuestCount: 0,
        questTotal: 5,
        seasonLength: 28,
        signals: {
          routeHeld: 0,
          minimal: 0,
          recovery: 0,
          movement: 0,
          nutrition: 0,
          resource: 0,
          alcoholFree: 0,
          bodyAbilitiesInSeason: 0,
        },
        plateauActive: false,
      }),
    ).toBe(0);

    const snap = getBossCampaignSnapshot({
      dailyEntries: Array.from({ length: 15 }, (_, i) =>
        entry(`2026-06-${String(i + 1).padStart(2, '0')}`, { steps: 7000 }),
      ),
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-06-01' },
      today: '2026-06-15',
    });
    expect(['noticed', 'weakened', 'broken', 'sealed']).toContain(snap.bossStatus);
  });

  it('first crack achievement eligibility at 50%', () => {
    const snap = {
      bossProgressPercent: 50,
    } as ReturnType<typeof getBossCampaignSnapshot>;
    expect(isBossFirstCrackEligible(snap)).toBe(true);
  });
});

describe('body ability unlock in season', () => {
  it('counts unlocked abilities in season window', () => {
    let settings = unlockBodyAbilityV1(DEFAULT_APP_SETTINGS, 'tie_shoes_easier');
    const entries = [entry('2026-06-05', { steps: 5000 })];
    const progress = computeBossProgressPercent({
      completedQuestCount: 0,
      questTotal: 5,
      seasonLength: 28,
      signals: {
        routeHeld: 1,
        minimal: 0,
        recovery: 0,
        movement: 1,
        nutrition: 0,
        resource: 0,
        alcoholFree: 0,
        bodyAbilitiesInSeason: getBodyAbilityState(settings).unlockedAbilityIds.length,
      },
      plateauActive: false,
    });
    expect(progress).toBeGreaterThan(3);
  });
});
