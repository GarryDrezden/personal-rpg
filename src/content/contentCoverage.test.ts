import { describe, expect, it } from 'vitest';
import { TODAY_REACTION_CONTEXTS, getTodayReactionPool } from './todayReactions';
import { MOB_IDS } from '../types/gameAssets';
import { getObstacleFlavorPool } from './obstacles';
import {
  COMPANION_REACTION_CONTEXTS,
  COMPANION_PACKS,
} from './companions';
import { RETURN_ABSENCE_BANDS, RETURN_AFTER_ABSENCE_POOLS } from './returnAfterAbsence';
import { HOME_STATUS_POOLS } from './homeStatus';
import { JOURNEY_FLAVOR, JOURNEY_FLAVOR_STATES } from './journeyFlavor';
import { SEASON_COPY_PHASES, SEASON_FLAVOR_POOLS } from './seasonsFlavor';
import { BOSS_CONTENT, BOSS_CONTENT_IDS } from './bosses';
import { EMPTY_STATE_KEYS } from './emptyStates';
import { NBA_COPY_FAMILIES, NBA_COPY_POOLS } from './nbaCopy';
import type { CompanionId } from '../types/gameAssets';
import type { AppThemeId } from '../types/theme';

const THEMES: AppThemeId[] = ['cozy', 'darkFantasy'];
const COMPANIONS = Object.keys(COMPANION_PACKS) as CompanionId[];

describe('content coverage', () => {
  it('has at least one Today reaction per context and theme', () => {
    for (const theme of THEMES) {
      for (const ctx of TODAY_REACTION_CONTEXTS) {
        expect(getTodayReactionPool(theme, ctx).length).toBeGreaterThan(0);
      }
    }
  });

  it('has obstacle flavor for every mob and theme', () => {
    for (const theme of THEMES) {
      for (const mob of MOB_IDS) {
        expect(getObstacleFlavorPool(theme, mob).length).toBeGreaterThan(0);
      }
    }
  });

  it('has companion reactions for every companion, context and theme', () => {
    for (const companion of COMPANIONS) {
      for (const theme of THEMES) {
        for (const ctx of COMPANION_REACTION_CONTEXTS) {
          expect(COMPANION_PACKS[companion][theme === 'cozy' ? 'cozy' : 'darkFantasy'][ctx].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('has return-after-absence bands', () => {
    for (const theme of THEMES) {
      for (const band of RETURN_ABSENCE_BANDS) {
        expect(RETURN_AFTER_ABSENCE_POOLS[theme][band].length).toBeGreaterThan(1);
        for (const line of RETURN_AFTER_ABSENCE_POOLS[theme][band]) {
          expect(line.text.toLowerCase()).not.toMatch(/наказан|ты виноват|стыдно/);
          if (band !== 'short') {
            expect(line.text.toLowerCase()).toContain('не нужно закрывать');
          }
        }
      }
    }
  });

  it('has home status bands including 100%', () => {
    expect(HOME_STATUS_POOLS.complete.length).toBeGreaterThan(1);
    expect(HOME_STATUS_POOLS.complete.some((l) => l.text.includes('Дом восстановлен'))).toBe(true);
  });

  it('has journey flavor states for nine chapters', () => {
    const ids = Object.keys(JOURNEY_FLAVOR.cozy);
    expect(ids).toHaveLength(9);
    for (const id of ids) {
      for (const state of JOURNEY_FLAVOR_STATES) {
        expect(JOURNEY_FLAVOR.cozy[id]?.[state].length).toBeGreaterThan(0);
        expect(JOURNEY_FLAVOR.darkFantasy[id]?.[state].length).toBeGreaterThan(0);
      }
    }
  });

  it('has season phases for both themes', () => {
    for (const theme of THEMES) {
      for (const phase of SEASON_COPY_PHASES) {
        expect(SEASON_FLAVOR_POOLS[theme][phase].length).toBeGreaterThan(0);
      }
      for (const line of SEASON_FLAVOR_POOLS[theme].extended) {
        expect(line.text.toLowerCase()).not.toMatch(/опоздал|просроч/);
      }
    }
  });

  it('has boss victory/setback lines', () => {
    for (const id of BOSS_CONTENT_IDS) {
      expect(BOSS_CONTENT.cozy[id].victory).toBeTruthy();
      expect(BOSS_CONTENT.darkFantasy[id].victory).not.toMatch(/Босс побеждён!/);
    }
  });

  it('has empty-state and NBA families', () => {
    expect(EMPTY_STATE_KEYS.length).toBe(6);
    for (const theme of THEMES) {
      for (const family of NBA_COPY_FAMILIES) {
        expect(NBA_COPY_POOLS[theme][family].length).toBeGreaterThan(0);
      }
    }
  });

  it('assigns a stable id to every listed variant', () => {
    for (const ctx of TODAY_REACTION_CONTEXTS) {
      for (const item of getTodayReactionPool('cozy', ctx)) {
        expect(item.id.length).toBeGreaterThan(2);
      }
    }
  });
});
