import { describe, expect, it } from 'vitest';
import type { AppSettings, DailyEntry } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import {
  applyCozyRewardsOnSave,
  canUpgradeCozyZone,
  DEFAULT_COZY_HOME_STATE,
  findAffordableUpgrade,
  getCozyUpgradeHintLine,
  getNextCozyHomeUpgrade,
  normalizeCozyHomeState,
  upgradeCozyZone,
} from './cozyHomeEngine';
import {
  COZY_HOME_ZONES,
  getCozyEconomyTotals,
} from '../constants/cozyHomeConfig';
import {
  getCozyRewardsForEntry,
  pickCozyRewardReasons,
  sumCozyGrantedResources,
} from './cozyHomeRewardsEngine';
import { normalizeAppSettings } from './settingsNormalize';

function baseEntry(partial: Partial<DailyEntry> = {}): DailyEntry {
  return {
    id: 'd1',
    date: '2026-08-01',
    calories: null,
    steps: null,
    alcohol: null,
    morningExercise: false,
    gym: false,
    journal: false,
    cooking: false,
    repair: false,
    plants: false,
    hobby: false,
    comment: '',
    dayMode: 'normal',
    energyLevel: null,
    nutritionLevel: null,
    ...partial,
  };
}

describe('normalizeCozyHomeState', () => {
  it('returns safe defaults for null/undefined/partial', () => {
    expect(normalizeCozyHomeState(null)).toEqual(DEFAULT_COZY_HOME_STATE);
    expect(normalizeCozyHomeState(undefined)).toEqual(DEFAULT_COZY_HOME_STATE);
    const partial = normalizeCozyHomeState({
      resources: { comfort: 3 } as never,
      zones: { porch: { zoneId: 'porch', level: 2 } } as never,
      totalUpgrades: 99,
    });
    expect(partial.resources.materials).toBe(0);
    expect(partial.resources.comfort).toBe(3);
    expect(partial.zones.porch.level).toBe(2);
    expect(partial.zones.kitchen.level).toBe(0);
    expect(partial.totalUpgrades).toBe(2);
  });

  it('normalizeAppSettings fills cozyHome for old accounts', () => {
    const { cozyHome: _drop, ...without } = DEFAULT_APP_SETTINGS;
    const normalized = normalizeAppSettings(without as AppSettings);
    expect(normalized.cozyHome?.zones.porch.level).toBe(0);
    expect(normalized.cozyHome?.resources.clarity).toBe(0);
  });
});

describe('applyCozyRewardsOnSave (idempotent)', () => {
  const settings = DEFAULT_APP_SETTINGS;

  it('grants once for a day with marked care', () => {
    const entry = baseEntry({
      nutritionLevel: 'light',
      alcohol: 'none',
      sleepQuality: 'good',
    });
    const first = applyCozyRewardsOnSave({ entry, settings, previousEntry: null });
    expect(first.granted).not.toBeNull();
    expect(first.entry.cozyRewardsGranted).toBeTruthy();
    expect(first.settings.cozyHome!.resources.comfort).toBeGreaterThan(0);

    const second = applyCozyRewardsOnSave({
      entry: { ...first.entry, steps: 12000 },
      settings: first.settings,
      previousEntry: first.entry,
    });
    expect(second.granted).toBeNull();
    expect(second.settings.cozyHome!.resources).toEqual(
      first.settings.cozyHome!.resources,
    );
  });

  it('does not grant when previousEntry already claimed (reload / re-save)', () => {
    const claimed = baseEntry({
      nutritionLevel: 'medium',
      cozyRewardsGranted: {
        resources: { comfort: 1 },
        grantedAt: '2026-08-01T10:00:00.000Z',
      },
    });
    const again = applyCozyRewardsOnSave({
      entry: { ...claimed, cozyRewardsGranted: null },
      settings,
      previousEntry: claimed,
    });
    expect(again.granted).toBeNull();
    expect(again.entry.cozyRewardsGranted?.resources.comfort).toBe(1);
    expect(again.settings).toBe(settings);
  });

  it('supports old DailyEntry without cozyRewardsGranted', () => {
    const legacy = baseEntry({ nutritionLevel: 'light' });
    delete (legacy as { cozyRewardsGranted?: unknown }).cozyRewardsGranted;
    const result = applyCozyRewardsOnSave({
      entry: legacy,
      settings,
      previousEntry: null,
    });
    expect(result.granted).not.toBeNull();
    expect(result.entry.cozyRewardsGranted).toBeTruthy();
  });

  it('minimal and recovery days grant small comfort', () => {
    const minimal = getCozyRewardsForEntry(
      baseEntry({ dayMode: 'minimal' }),
      settings,
    );
    expect(minimal.resources.comfort).toBeGreaterThanOrEqual(1);
    expect(minimal.reasons.some((r) => r.toLowerCase().includes('минималь'))).toBe(
      true,
    );

    const recovery = getCozyRewardsForEntry(
      baseEntry({ dayMode: 'recovery' }),
      settings,
    );
    expect(recovery.resources.comfort).toBeGreaterThanOrEqual(2);
  });

  it('does not grant nutrition comfort when tracking is disabled', () => {
    const off = {
      ...DEFAULT_APP_SETTINGS,
      nutritionTrackingMode: 'disabled' as const,
    };
    const reward = getCozyRewardsForEntry(
      baseEntry({ nutritionLevel: 'light', calories: 1800 }),
      off,
    );
    expect(reward.reasons.some((r) => r.includes('Питание'))).toBe(false);
  });

  it('blocks a second grant via lastDailyGrantDate even without entry stamp', () => {
    const settings = {
      ...DEFAULT_APP_SETTINGS,
      cozyHome: {
        ...DEFAULT_COZY_HOME_STATE,
        lastDailyGrantDate: '2026-08-01',
      },
    };
    const result = applyCozyRewardsOnSave({
      entry: baseEntry({ nutritionLevel: 'light', alcohol: 'none' }),
      settings,
      previousEntry: null,
    });
    expect(result.granted).toBeNull();
  });
});

describe('upgradeCozyZone', () => {
  it('spends resources, raises level, updates totals and lastUpgrade', () => {
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      resources: { comfort: 0, materials: 5, garden: 0, clarity: 0 },
    });
    const at = '2026-08-01T12:00:00.000Z';
    const check = canUpgradeCozyZone(home, 'porch');
    expect(check.canUpgrade).toBe(true);

    const next = upgradeCozyZone(home, 'porch', at);
    expect(next.zones.porch.level).toBe(1);
    expect(next.resources.materials).toBe(3);
    expect(next.totalUpgrades).toBe(1);
    expect(next.lastUpdatedAt).toBe(at);
    expect(next.lastUpgrade).toEqual({
      zoneId: 'porch',
      level: 1,
      title: 'Чисто',
      at,
    });
  });

  it('does not upgrade when resources are missing', () => {
    const home = DEFAULT_COZY_HOME_STATE;
    const next = upgradeCozyZone(home, 'porch');
    expect(next.zones.porch.level).toBe(0);
    expect(canUpgradeCozyZone(home, 'porch').missingResources?.materials).toBe(2);
  });
});

describe('getNextCozyHomeUpgrade', () => {
  it('returns affordable upgrade when resources are enough', () => {
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      resources: { comfort: 0, materials: 2, garden: 0, clarity: 0 },
    });
    const next = getNextCozyHomeUpgrade(home);
    expect(next?.canUpgrade).toBe(true);
    expect(next?.zoneId).toBe('porch');
    expect(getCozyUpgradeHintLine(home)).toMatch(/Можно улучшить: Крыльцо/i);
  });

  it('returns closest unfinished zone when nothing is affordable', () => {
    const home = DEFAULT_COZY_HOME_STATE;
    const next = getNextCozyHomeUpgrade(home);
    expect(next?.canUpgrade).toBe(false);
    expect(next?.zoneTitle).toBeTruthy();
    expect(getCozyUpgradeHintLine(home)).toMatch(/не хватает/i);
  });

  it('prefers an unfinished L1 over a more expensive L2', () => {
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      resources: { comfort: 40, materials: 20, garden: 0, clarity: 0 },
      zones: {
        porch: { zoneId: 'porch', level: 1 },
      },
    });
    const affordable = findAffordableUpgrade(home);
    expect(affordable?.nextLevel.level).toBe(1);
    expect(affordable?.zoneId).not.toBe('porch');
  });

  it('keeps already purchased levels when later costs change', () => {
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      resources: { comfort: 10, materials: 10, garden: 10, clarity: 10 },
      zones: {
        porch: { zoneId: 'porch', level: 3 },
      },
    });
    expect(home.zones.porch.level).toBe(3);
    expect(home.totalUpgrades).toBe(3);
    const next = getNextCozyHomeUpgrade(home);
    expect(next?.zoneId).not.toBe('porch');
    expect(next?.nextLevel).toBe(1);
    const upgraded = upgradeCozyZone(home, next!.zoneId);
    expect(upgraded.zones.porch.level).toBe(3);
    expect(Object.values(upgraded.resources).every((n) => n >= 0)).toBe(true);
  });

  it('clamps negative resource leftovers instead of carrying them forward', () => {
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      resources: { comfort: -4, materials: 2, garden: 0, clarity: 0 },
    });
    expect(home.resources.comfort).toBe(0);
    expect(home.resources.materials).toBe(2);
  });

  it('says the house is restored at max, not that a next upgrade waits', () => {
    const zones = Object.fromEntries(
      ['porch', 'hallway', 'kitchen', 'bedroom', 'yard', 'garden', 'workshop', 'pet_corner'].map(
        (id) => [id, { zoneId: id, level: 3 }],
      ),
    );
    const home = normalizeCozyHomeState({
      ...DEFAULT_COZY_HOME_STATE,
      zones: zones as never,
    });
    expect(getCozyUpgradeHintLine(home)).toBe('Дом восстановлен.');
    expect(getNextCozyHomeUpgrade(home)).toBeNull();
  });
});

describe('cozy home economy v2 costs', () => {
  it('uses all four resources and never asks for four at once', () => {
    const totals = getCozyEconomyTotals();
    expect(totals.comfort).toBeGreaterThan(0);
    expect(totals.materials).toBeGreaterThan(0);
    expect(totals.garden).toBeGreaterThan(0);
    expect(totals.clarity).toBeGreaterThan(0);

    const clarityZones = COZY_HOME_ZONES.filter((zone) =>
      zone.levels.some((level) => (level.cost?.clarity ?? 0) > 0),
    );
    expect(clarityZones.map((z) => z.id)).toEqual(
      expect.arrayContaining(['hallway', 'kitchen', 'bedroom', 'workshop']),
    );

    for (const zone of COZY_HOME_ZONES) {
      for (const level of zone.levels) {
        if (!level.cost) continue;
        const used = Object.values(level.cost).filter((n) => (n ?? 0) > 0).length;
        expect(used).toBeGreaterThanOrEqual(1);
        expect(used).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe('cozy reward helpers', () => {
  it('sums granted resources and picks unique reasons', () => {
    expect(sumCozyGrantedResources({ comfort: 2, materials: 1 })).toBe(3);
    expect(
      pickCozyRewardReasons(
        [
          'Питание отмечено — в доме стало чуть больше порядка.',
          'Питание отмечено — в доме стало чуть больше порядка.',
          'Сон восстановил уют.',
          'Дневник добавил ясности.',
          'Ещё одна причина',
        ],
        3,
      ),
    ).toHaveLength(3);
  });
});
