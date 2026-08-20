import { describe, expect, it } from 'vitest';
import { scaleJourneyWeightTarget } from './journeyWeightGates';
import {
  countSimEventsByKind,
  firstSimEvent,
  simEventsPerWeek,
  simulateUserJourney,
} from './gameDesignSimulation';
import { JOURNEY_PERSONAS } from './realUserJourneyPersonas';

describe('real user journey personas', () => {
  it('Persona A (180→100) gets early Home movement without waiting −50 kg', () => {
    const month = simulateUserJourney({ ...JOURNEY_PERSONAS.A, days: 28 });
    expect(month.weightLostKg).toBeLessThan(20);
    expect(month.homeUpgrades).toBeGreaterThan(0);
    expect(firstSimEvent(month.events, 'home_upgrade')?.day).toBeLessThanOrEqual(7);
    expect(month.journeyTotal).toBe(9);
  });

  it('Persona B (65→55) still has a 9-chapter Journey with scaled weight gates', () => {
    const month = simulateUserJourney({ ...JOURNEY_PERSONAS.B, days: 28 });
    expect(month.journeyTotal).toBe(9);
    expect(scaleJourneyWeightTarget(50, 10)).toBeLessThanOrEqual(10);
    expect(month.homeUpgrades).toBeGreaterThan(0);
    expect(month.xp).toBeGreaterThan(0);
  });

  it('Persona C (low mobility) still earns XP and Home on recovery-heavy weeks', () => {
    const month = simulateUserJourney({ ...JOURNEY_PERSONAS.C, days: 28 });
    expect(month.loggedDays).toBeGreaterThan(10);
    expect(month.xp).toBeGreaterThan(0);
    expect(month.homeUpgrades).toBeGreaterThan(0);
    expect(month.heroState).not.toBe('depleted');
  });

  it('Persona D (comeback) is not an empty month', () => {
    const month = simulateUserJourney({ ...JOURNEY_PERSONAS.D, days: 28 });
    expect(month.loggedDays).toBeGreaterThan(20);
    expect(month.homeUpgrades).toBeGreaterThan(0);
    expect(month.level).toBeGreaterThanOrEqual(1);
  });

  it('Persona E (recovery-heavy) keeps moving over 90 days', () => {
    const quarter = simulateUserJourney({ ...JOURNEY_PERSONAS.E, days: 90 });
    expect(quarter.xp).toBeGreaterThan(0);
    expect(quarter.homePercent).toBeGreaterThan(20);
    expect(quarter.homePercent).toBeLessThan(100);
  });

  it('Persona F (5 on / 18 off) can return without a catch-up wall', () => {
    const month = simulateUserJourney({ ...JOURNEY_PERSONAS.F, days: 28 });
    expect(month.loggedDays).toBeLessThan(12);
    expect(month.skippedDays).toBeGreaterThan(month.loggedDays);
    expect(month.xp).toBeGreaterThan(0);
    expect(month.homeUpgrades).toBeGreaterThan(0);
  });

  it('90-day balanced path has a dominant Home/Journey loop, not a burst of week-1 unlocks', () => {
    const week = simulateUserJourney({
      profileId: 'balanced',
      days: 7,
      startWeight: 95,
      targetWeight: 75,
    });
    const quarter = simulateUserJourney({
      profileId: 'balanced',
      days: 90,
      startWeight: 95,
      targetWeight: 75,
    });
    const weekCounts = countSimEventsByKind(week.events);
    const quarterCounts = countSimEventsByKind(quarter.events);
    expect(weekCounts.home_upgrade).toBeLessThan(8);
    expect(quarter.homePercent).toBeGreaterThan(week.homePercent);
    expect(quarterCounts.home_upgrade).toBeGreaterThan(weekCounts.home_upgrade);
    expect(simEventsPerWeek(quarter.events, 90)).toBeLessThan(8);
  });

  it(
    '180-day and 365-day balanced glimpses stay finite and leave a later horizon',
    () => {
      const half = simulateUserJourney({
        profileId: 'balanced',
        days: 180,
        startWeight: 95,
        targetWeight: 75,
      });
      const year = simulateUserJourney({
        profileId: 'balanced',
        days: 365,
        startWeight: 95,
        targetWeight: 75,
      });
      expect(half.homePercent).toBeGreaterThanOrEqual(80);
      expect(year.homePercent).toBeGreaterThanOrEqual(half.homePercent);
      expect(year.coins).toBeLessThan(4000);
      expect(year.level).toBeLessThanOrEqual(40);
      expect(year.journeyCompleted).toBeLessThanOrEqual(9);
    },
    20_000,
  );
});
