import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../../constants/defaults';
import type { DailyEntry, MeasurementEntry } from '../../types';
import { emptyDaily } from '../../store/appStore';
import {
  dismissPlateauSoftHint,
  getDaysSinceBestWeight,
  getPlateauRouteHoldingSnapshot,
  getPlateauSnapshot,
  PLATEAU_SOFT_DAYS,
  PLATEAU_STRONG_DAYS,
  setManualPlateauActive,
} from './plateauEngine';

function entry(date: string, partial: Partial<DailyEntry> = {}): DailyEntry {
  return { ...emptyDaily(date), id: `id-${date}`, ...partial };
}

function weight(date: string, w: number): MeasurementEntry {
  return {
    id: `m-${date}`,
    date,
    weight: w,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  };
}

describe('getDaysSinceBestWeight', () => {
  it('returns no data when no weights', () => {
    const r = getDaysSinceBestWeight([], '2026-06-20');
    expect(r.hasWeightData).toBe(false);
    expect(r.daysSinceBest).toBe(0);
  });

  it('returns 0 when best weight is today', () => {
    const r = getDaysSinceBestWeight([weight('2026-06-20', 90)], '2026-06-20');
    expect(r.daysSinceBest).toBe(0);
  });

  it('counts days since last improvement', () => {
    const measurements = [
      weight('2026-06-01', 95),
      weight('2026-06-05', 94),
      weight('2026-06-10', 94.2),
    ];
    const r = getDaysSinceBestWeight(measurements, '2026-06-20');
    expect(r.daysSinceBest).toBe(15);
  });
});

describe('getPlateauSnapshot modes', () => {
  const baseMeasurements = [weight('2026-06-01', 100), weight('2026-06-02', 99)];

  it('no weights → none', () => {
    expect(getPlateauSnapshot({ dailyEntries: [], measurements: [], settings: DEFAULT_APP_SETTINGS, today: '2026-06-20' }).mode).toBe('none');
  });

  it('recent best → none', () => {
    const m = [weight('2026-06-18', 98), weight('2026-06-19', 97)];
    expect(
      getPlateauSnapshot({
        dailyEntries: [],
        measurements: m,
        settings: DEFAULT_APP_SETTINGS,
        today: '2026-06-20',
      }).mode,
    ).toBe('none');
  });

  it('10 days without best → soft hint', () => {
    const snapshot = getPlateauSnapshot({
      dailyEntries: [],
      measurements: baseMeasurements,
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-12',
    });
    expect(snapshot.daysSinceBestWeight).toBeGreaterThanOrEqual(PLATEAU_SOFT_DAYS);
    expect(snapshot.mode).toBe('soft_hint');
  });

  it('21 days without best → active', () => {
    const snapshot = getPlateauSnapshot({
      dailyEntries: [],
      measurements: baseMeasurements,
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-23',
    });
    expect(snapshot.daysSinceBestWeight).toBeGreaterThanOrEqual(PLATEAU_STRONG_DAYS);
    expect(snapshot.mode).toBe('active');
  });

  it('manual flag → active', () => {
    const settings = setManualPlateauActive(DEFAULT_APP_SETTINGS, true);
    const snapshot = getPlateauSnapshot({
      dailyEntries: [],
      measurements: [],
      settings,
      today: '2026-06-20',
    });
    expect(snapshot.mode).toBe('active');
    expect(snapshot.manualActive).toBe(true);
  });

  it('dismiss soft hint hides hint until strong plateau', () => {
    const dismissed = dismissPlateauSoftHint(DEFAULT_APP_SETTINGS);
    const snapshot = getPlateauSnapshot({
      dailyEntries: [],
      measurements: baseMeasurements,
      settings: dismissed,
      today: '2026-06-12',
    });
    expect(snapshot.mode).toBe('none');
    expect(snapshot.hintDismissed).toBe(true);
  });
});

describe('route holding snapshot', () => {
  it('counts existing daily signals', () => {
    const entries = [
      entry('2026-06-18', { steps: 6000, journal: true }),
      entry('2026-06-19', { dayMode: 'minimal' }),
      entry('2026-06-20', { alcohol: 'none', energyLevel: 3 }),
    ];
    const snap = getPlateauRouteHoldingSnapshot({
      dailyEntries: entries,
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, nutritionTrackingMode: 'disabled' },
      today: '2026-06-20',
    });
    expect(snap.routeHeldDays).toBeGreaterThanOrEqual(3);
    expect(snap.movementDays).toBe(1);
    expect(snap.minimalOrRecoveryDays).toBe(1);
  });

  it('safe defaults with empty entries', () => {
    const snap = getPlateauRouteHoldingSnapshot({
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      today: '2026-06-20',
    });
    expect(snap.routeHeldDays).toBe(0);
    expect(snap.supportiveMessage).toBeTruthy();
  });
});

describe('route guardian eligibility', () => {
  it('eligible on active plateau with enough route days', () => {
    const entries = Array.from({ length: 7 }, (_, i) =>
      entry(`2026-06-${String(14 + i).padStart(2, '0')}`, { steps: 5000 }),
    );
    const settings = setManualPlateauActive(DEFAULT_APP_SETTINGS, true);
    const snapshot = getPlateauSnapshot({
      dailyEntries: entries,
      measurements: [weight('2026-05-01', 100)],
      settings,
      today: '2026-06-20',
    });
    expect(snapshot.mode).toBe('active');
    expect(snapshot.routeGuardianEligible).toBe(true);
  });
});
