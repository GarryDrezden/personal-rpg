import { describe, expect, it } from 'vitest';
import { TODAY_REACTION_CONTEXTS, getTodayReactionPool } from './todayReactions';
import { MOB_IDS } from '../types/gameAssets';
import { getObstacleFlavorPool } from './obstacles';
import { COMPANION_PACKS, COMPANION_REACTION_CONTEXTS } from './companions';
import type { CompanionId } from '../types/gameAssets';

const SHAME = /смерть|game over|босс побеждён|самоуниж|ты слаб|ты ленив/i;
const COZY_MARKERS = /сонный плед|банка варенья|крыльцо|варенье/;
const DF_COMBAT = /\bмоб\b|game over|кровь|смерть/;

function allToday(theme: 'cozy' | 'darkFantasy'): string[] {
  return TODAY_REACTION_CONTEXTS.flatMap((ctx) =>
    getTodayReactionPool(theme, ctx).flatMap((v) => [v.headline, v.detail]),
  );
}

describe('content theme isolation', () => {
  it('keeps shame/death wording out of both themes', () => {
    for (const theme of ['cozy', 'darkFantasy'] as const) {
      for (const line of allToday(theme)) {
        expect(line).not.toMatch(SHAME);
      }
      for (const mob of MOB_IDS) {
        for (const v of getObstacleFlavorPool(theme, mob)) {
          expect(v.text).not.toMatch(SHAME);
        }
      }
    }
  });

  it('does not leak Cozy house markers into Dark Fantasy obstacles', () => {
    for (const mob of MOB_IDS) {
      for (const v of getObstacleFlavorPool('darkFantasy', mob)) {
        expect(v.text.toLowerCase()).not.toMatch(COZY_MARKERS);
      }
    }
  });

  it('does not leak DF combat wording into Cozy today reactions', () => {
    for (const line of allToday('cozy')) {
      expect(line).not.toMatch(DF_COMBAT);
    }
  });

  it('marks every variant with the owning theme', () => {
    for (const v of getTodayReactionPool('cozy', 'minimal')) {
      expect(v.theme).toBe('cozy');
    }
    for (const v of getTodayReactionPool('darkFantasy', 'minimal')) {
      expect(v.theme).toBe('darkFantasy');
    }
  });

  it('keeps companion voices distinct', () => {
    const ids = Object.keys(COMPANION_PACKS) as CompanionId[];
    const cat = COMPANION_PACKS[ids[0]!].cozy.presence[0]!.text;
    const fox = COMPANION_PACKS.fox_cub.cozy.presence[0]!.text;
    expect(cat).not.toBe(fox);
    for (const id of ids) {
      for (const ctx of COMPANION_REACTION_CONTEXTS) {
        for (const line of COMPANION_PACKS[id].cozy[ctx]) {
          expect(line.text.length).toBeLessThanOrEqual(120);
        }
      }
    }
  });
});
