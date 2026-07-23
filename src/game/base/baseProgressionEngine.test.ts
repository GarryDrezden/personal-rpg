import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import { unlockBodyAbilityV1 } from '../bodyAbilities/bodyAbilityV1Engine';
import { BASE_STAGES } from './baseProgressionConfig';
import {
  BASE_MAX_POINTS_PER_DAY,
  BASE_SCORE_WEIGHTS,
  calculateBaseRouteScore,
  calculateBaseScoreBreakdown,
  dayRouteSignalPoints,
  getBaseProgressionSnapshot,
  getBaseSaveSparkLine,
  scoreFromBreakdown,
} from './baseProgressionEngine';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

describe('calculateBaseScoreBreakdown', () => {
  it('empty data → zero counts', () => {
    const b = calculateBaseScoreBreakdown({
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(b.savedDays).toBe(0);
    expect(b.minimalDays).toBe(0);
    expect(scoreFromBreakdown(b)).toBe(0);
  });

  it('saved days increase score', () => {
    const entries = [
      entry('2026-06-18', { steps: 5000 }),
      entry('2026-06-19', { journal: true }),
    ];
    const b = calculateBaseScoreBreakdown({
      dailyEntries: entries,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(b.savedDays).toBe(2);
    expect(scoreFromBreakdown(b)).toBeGreaterThanOrEqual(2 * BASE_SCORE_WEIGHTS.savedDay);
  });

  it('minimal and recovery days contribute', () => {
    const entries = [
      entry('2026-06-18', { dayMode: 'minimal' }),
      entry('2026-06-19', { dayMode: 'recovery' }),
    ];
    const b = calculateBaseScoreBreakdown({
      dailyEntries: entries,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(b.minimalDays).toBe(1);
    expect(b.recoveryDays).toBe(1);
    expect(b.savedDays).toBe(2);
  });

  it('Body Abilities contribute', () => {
    let settings = unlockBodyAbilityV1(DEFAULT_APP_SETTINGS, 'tie_shoes_easier');
    settings = unlockBodyAbilityV1(settings, 'stairs_breath');
    const b = calculateBaseScoreBreakdown({
      dailyEntries: [],
      measurements: [],
      settings,
      today: '2026-06-20',
    });
    expect(b.bodyAbilities).toBe(2);
    expect(scoreFromBreakdown(b)).toBe(2 * BASE_SCORE_WEIGHTS.bodyAbility);
  });

  it('plateau guardian achievement contributes', () => {
    const b = calculateBaseScoreBreakdown({
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
      unlockedAchievementIds: ['plateau_route_guardian'],
    });
    expect(b.plateauGuardian).toBe(1);
    expect(scoreFromBreakdown(b)).toBe(BASE_SCORE_WEIGHTS.plateauGuardian);
  });
});

describe('getBaseProgressionSnapshot stages', () => {
  it('empty user → stage 1', () => {
    const snap = getBaseProgressionSnapshot({
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(snap.currentStage.id).toBe('ember');
    expect(snap.currentStage.level).toBe(1);
    expect(snap.nextStage?.id).toBe('shelter');
    expect(snap.progressPercent).toBe(0);
  });

  it('progressed user changes stage', () => {
    const fixed = Array.from({ length: 40 }, (_, i) => {
      const d = new Date(Date.UTC(2026, 4, 1 + i));
      const iso = d.toISOString().slice(0, 10);
      return entry(iso, { steps: 6000, alcohol: 'none' });
    });
    const snap = getBaseProgressionSnapshot({
      dailyEntries: fixed,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(snap.baseScore).toBeGreaterThan(BASE_STAGES[1]!.unlockScore);
    expect(snap.currentStage.level).toBeGreaterThan(1);
    expect(snap.recentContributors.length).toBeGreaterThan(0);
  });

  it('caps points per day so a full day is not worth 5+', () => {
    const rich = entry('2026-06-20', {
      steps: 8000,
      alcohol: 'none',
      energyLevel: 4,
      morningExercise: true,
    });
    expect(dayRouteSignalPoints(rich, DEFAULT_APP_SETTINGS)).toBeGreaterThan(BASE_MAX_POINTS_PER_DAY);
    const { baseScore } = calculateBaseRouteScore({
      dailyEntries: [rich],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(baseScore).toBe(BASE_MAX_POINTS_PER_DAY);
  });

  it('progress to next stage is calculated', () => {
    const entries = [entry('2026-06-20', { steps: 5000 })];
    const snap = getBaseProgressionSnapshot({
      dailyEntries: entries,
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(snap.progressToNext).toBeGreaterThan(0);
    expect(snap.progressPercent).toBeGreaterThanOrEqual(0);
    expect(snap.progressPercent).toBeLessThanOrEqual(100);
  });

  it('max stage behavior', () => {
    const entries = Array.from({ length: 280 }, (_, i) => {
      const d = new Date(Date.UTC(2026, 0, 1 + i));
      const iso = d.toISOString().slice(0, 10);
      return entry(iso, {
        steps: 8000,
        alcohol: 'none',
        energyLevel: 4,
        dayMode: i % 5 === 0 ? 'minimal' : 'normal',
      });
    });
    const snap = getBaseProgressionSnapshot({
      dailyEntries: entries,
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, startDate: '2026-01-01' },
      today: '2026-10-15',
      unlockedAchievementIds: ['plateau_route_guardian'],
    });
    expect(snap.isMaxStage).toBe(true);
    expect(snap.nextStage).toBeNull();
    expect(snap.progressPercent).toBe(100);
    expect(snap.currentStage.id).toBe('citadel');
  });
});

describe('getBaseSaveSparkLine', () => {
  it('returns spark for saved minimal day', () => {
    const line = getBaseSaveSparkLine(entry('2026-06-20', { dayMode: 'minimal' }), DEFAULT_APP_SETTINGS);
    expect(line).toContain('Лагерь');
  });

  it('returns null for unsaved entry', () => {
    expect(getBaseSaveSparkLine(emptyDaily('2026-06-20'), DEFAULT_APP_SETTINGS)).toBeNull();
  });
});
