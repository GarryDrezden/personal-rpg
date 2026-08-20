import { describe, expect, it } from 'vitest';
import {
  SIM_HORIZONS,
  SIM_PROFILE_IDS,
  simulateHorizonMatrix,
  simulateUserJourney,
  type SimSnapshot,
  type SimHorizon,
  type SimProfileId,
} from './gameDesignSimulation';

describe('simulateUserJourney', () => {
  it('is deterministic for the same profile and horizon', () => {
    const a = simulateUserJourney({
      profileId: 'balanced',
      days: 28,
      startWeight: 95,
      targetWeight: 80,
    });
    const b = simulateUserJourney({
      profileId: 'balanced',
      days: 28,
      startWeight: 95,
      targetWeight: 80,
    });
    expect(a).toEqual(b);
  });

  it(
    'keeps Home pacing in months and stays inside non-runaway ranges',
    () => {
      const matrix = simulateHorizonMatrix({ startWeight: 95, targetWeight: 75 });

      for (const profileId of SIM_PROFILE_IDS) {
        for (const days of SIM_HORIZONS) {
          const snap: SimSnapshot = matrix[profileId][days];
          expect(snap.xp).toBeGreaterThanOrEqual(0);
          expect(snap.level).toBeGreaterThanOrEqual(1);
          expect(snap.level).toBeLessThanOrEqual(40);
          expect(snap.coins).toBeGreaterThanOrEqual(0);
          expect(snap.coins).toBeLessThan(4000);
          expect(snap.homePercent).toBeGreaterThanOrEqual(0);
          expect(snap.homePercent).toBeLessThanOrEqual(100);
          expect(snap.journeyCompleted).toBeGreaterThanOrEqual(0);
          expect(snap.journeyCompleted).toBeLessThanOrEqual(9);
          expect(snap.momentum).toBeGreaterThanOrEqual(-100);
          expect(snap.momentum).toBeLessThanOrEqual(100);
          expect(snap.bodyStage).toBeGreaterThanOrEqual(1);
          expect(snap.bodyStage).toBeLessThanOrEqual(20);
        }
      }

      const at = (profileId: SimProfileId, days: SimHorizon) => matrix[profileId][days];

      expect(at('active', 28).loggedDays).toBeGreaterThan(at('casual', 28).loggedDays);
      expect(at('active', 28).xp).toBeGreaterThan(at('casual', 28).xp);
      expect(at('active', 365).homePercent).toBe(100);
      expect(at('inconsistent', 365).loggedDays).toBeLessThan(at('balanced', 365).loggedDays);
      expect(at('recovery_heavy', 28).xp).toBeGreaterThan(0);
      expect(at('casual', 365).level).toBeGreaterThanOrEqual(at('casual', 28).level);

      expect(at('balanced', 28).homePercent).toBeLessThan(50);
      expect(at('balanced', 180).homePercent).toBeGreaterThanOrEqual(80);
      expect(at('active', 28).homePercent).toBeLessThan(60);
      expect(at('active', 28).homePercent).toBeGreaterThan(at('casual', 28).homePercent);
      expect(at('recovery_heavy', 90).homePercent).toBeGreaterThan(25);
      expect(at('recovery_heavy', 90).homePercent).toBeLessThan(at('balanced', 90).homePercent);
      expect(at('casual', 365).homePercent).toBeGreaterThanOrEqual(70);
      expect(at('inconsistent', 28).homeUpgrades).toBeGreaterThan(0);
      expect(at('inconsistent', 365).homePercent).toBeLessThan(100);

      const week = simulateUserJourney({
        profileId: 'balanced',
        days: 7,
        startWeight: 95,
        targetWeight: 75,
      });
      expect(week.homeUpgrades).toBeGreaterThanOrEqual(1);
      expect(week.homeUpgrades).toBeLessThan(8);
    },
    20_000,
  );
});
