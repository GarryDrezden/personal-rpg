import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { BODY_ABILITIES_V1 } from './bodyAbilityConfig';
import {
  dismissBodyAbilityHint,
  getBodyAbilityV1Hints,
  getBodyAbilityV1Items,
  getBodyAbilityV1Summary,
  getTopBodyAbilityV1Hint,
  isBodyAbilityV1Unlocked,
  unlockBodyAbilityV1,
} from './bodyAbilityV1Engine';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

describe('body ability v1 catalog', () => {
  it('has valid abilities with categories and tiers', () => {
    expect(BODY_ABILITIES_V1.length).toBeGreaterThanOrEqual(10);
    for (const ability of BODY_ABILITIES_V1) {
      expect(ability.id).toBeTruthy();
      expect(ability.title).toBeTruthy();
      expect(ability.hintSignals.length).toBeGreaterThan(0);
      expect(ability.unlockMode).toBe('manual');
    }
  });
});

describe('unlockBodyAbilityV1', () => {
  it('adds unlocked id', () => {
    const next = unlockBodyAbilityV1(DEFAULT_APP_SETTINGS, 'tie_shoes_easier');
    expect(isBodyAbilityV1Unlocked(next, 'tie_shoes_easier')).toBe(true);
    expect(next.bodyAbilityState?.abilityUnlocks?.[0]?.source).toBe('manual');
  });

  it('does not duplicate unlock', () => {
    const once = unlockBodyAbilityV1(DEFAULT_APP_SETTINGS, 'tie_shoes_easier');
    const twice = unlockBodyAbilityV1(once, 'tie_shoes_easier');
    expect(twice.bodyAbilityState?.unlockedAbilityIds).toHaveLength(1);
    expect(twice.bodyAbilityState?.abilityUnlocks).toHaveLength(1);
  });
});

describe('hints', () => {
  it('suggests hint when steps signal matches', () => {
    const entries = Array.from({ length: 6 }, (_, i) =>
      entry(`2026-06-${String(i + 1).padStart(2, '0')}`, { steps: 6000 }),
    );
    const hints = getBodyAbilityV1Hints({
      dailyEntries: entries,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
    });
    expect(hints.length).toBeGreaterThan(0);
  });

  it('hides dismissed hint', () => {
    const entries = Array.from({ length: 6 }, (_, i) =>
      entry(`2026-06-${String(i + 1).padStart(2, '0')}`, { steps: 6000 }),
    );
    const hintsBefore = getBodyAbilityV1Hints({
      dailyEntries: entries,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
    });
    const firstId = hintsBefore[0]?.ability.id;
    expect(firstId).toBeTruthy();
    const settings = dismissBodyAbilityHint(DEFAULT_APP_SETTINGS, firstId!);
    const hintsAfter = getBodyAbilityV1Hints({
      dailyEntries: entries,
      measurements: [],
      settings,
    });
    expect(hintsAfter.find((h) => h.ability.id === firstId)).toBeUndefined();
  });

  it('returns null top hint when nothing matches', () => {
    expect(
      getTopBodyAbilityV1Hint({
        dailyEntries: [],
        measurements: [],
        settings: DEFAULT_APP_SETTINGS,
      }),
    ).toBeNull();
  });
});

describe('summary', () => {
  it('counts unlocked and locked', () => {
    const settings = unlockBodyAbilityV1(DEFAULT_APP_SETTINGS, 'tie_shoes_easier');
    const summary = getBodyAbilityV1Summary({
      settings,
      dailyEntries: [],
      measurements: [],
    });
    expect(summary.unlockedCount).toBe(1);
    expect(summary.totalCount).toBe(BODY_ABILITIES_V1.length);
  });

  it('safe defaults with no data', () => {
    const items = getBodyAbilityV1Items({
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
    });
    expect(items.every((i) => !i.unlocked)).toBe(true);
    const summary = getBodyAbilityV1Summary({
      settings: DEFAULT_APP_SETTINGS,
      dailyEntries: [],
      measurements: [],
    });
    expect(summary.unlockedCount).toBe(0);
    expect(summary.nextSuggested).not.toBeNull();
  });
});
