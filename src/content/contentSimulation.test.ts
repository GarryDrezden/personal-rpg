import { describe, expect, it } from 'vitest';
import { addDays, format, parseISO } from 'date-fns';
import { SIM_PROFILE_IDS } from '../utils/gameDesignSimulation';
import { pickTodayReaction, type TodayReactionContext } from './todayReactions';
import { pickObstacleFlavor } from './obstacles';
import { pickCompanionReaction } from './companions';
import type { MobId, CompanionId } from '../types/gameAssets';

const CONTEXTS: TodayReactionContext[] = [
  'minimal',
  'recovery',
  'good_day',
  'steps',
  'mixed',
  'return',
];
const MOBS: MobId[] = ['sofa_magnet', 'fog_of_fatigue', 'empty_day', 'gray_heaviness'];
const COMPANIONS: CompanionId[] = [
  'golden_chinchilla_cat',
  'alabai',
  'raven',
  'fox_cub',
];

function profileContext(profile: string, dayIndex: number): TodayReactionContext {
  if (profile === 'recovery_heavy') return dayIndex % 3 === 0 ? 'recovery' : 'minimal';
  if (profile === 'casual') return dayIndex % 4 === 0 ? 'minimal' : 'points_saved';
  if (profile === 'active') return dayIndex % 2 === 0 ? 'heavy_physical' : 'steps';
  if (profile === 'inconsistent') return dayIndex % 5 === 0 ? 'return' : 'mixed';
  return CONTEXTS[dayIndex % CONTEXTS.length]!;
}

describe('content selection simulation', () => {
  it('runs 365 days for five audit profiles without mechanical consecutive repeats', () => {
    const start = parseISO('2026-01-01');
    const report: Array<{
      profile: string;
      uniqueReactions: number;
      reactionConsec: number;
      uniqueObstacles: number;
      obstacleConsec: number;
      uniqueCompanions: number;
      companionConsec: number;
    }> = [];

    for (const profile of SIM_PROFILE_IDS) {
      const reactions: string[] = [];
      const obstacles: string[] = [];
      const companions: string[] = [];
      for (let i = 0; i < 365; i += 1) {
        const date = format(addDays(start, i), 'yyyy-MM-dd');
        const ctx = profileContext(profile, i);
        reactions.push(pickTodayReaction({ themeId: 'cozy', context: ctx, date }).id);
        obstacles.push(
          pickObstacleFlavor({
            themeId: 'darkFantasy',
            mobId: MOBS[i % MOBS.length]!,
            date,
          }).id,
        );
        companions.push(
          pickCompanionReaction({
            companionId: COMPANIONS[i % COMPANIONS.length]!,
            themeId: 'cozy',
            context: i % 7 === 0 ? 'return' : 'presence',
            date,
          }).id,
        );
      }
      const consec = (ids: string[]) =>
        ids.reduce((n, id, i) => (i > 0 && id === ids[i - 1] ? n + 1 : n), 0);
      report.push({
        profile,
        uniqueReactions: new Set(reactions).size,
        reactionConsec: consec(reactions),
        uniqueObstacles: new Set(obstacles).size,
        obstacleConsec: consec(obstacles),
        uniqueCompanions: new Set(companions).size,
        companionConsec: consec(companions),
      });
    }

    for (const row of report) {
      expect(row.uniqueReactions).toBeGreaterThan(8);
      expect(row.reactionConsec).toBe(0);
      expect(row.obstacleConsec).toBe(0);
      expect(row.companionConsec).toBe(0);
    }
  });
});
