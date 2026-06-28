import { describe, expect, it } from 'vitest';
import { getPathSetupState } from './dashboardPathSetup';
import type { MeasurementEntry } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

describe('getPathSetupState', () => {  it('returns no_weight when there are no weight measurements', () => {
    const state = getPathSetupState([], 80);
    expect(state.kind).toBe('no_weight');
    if (state.kind === 'no_weight') {
      expect(state.ctaRoute).toBe('/measurements');
    }
  });

  it('returns no_target when weight exists but target is missing', () => {
    const measurements: MeasurementEntry[] = [
      {
        id: '1',
        date: '2026-01-01',
        weight: 95,
        chest: null,
        waist: null,
        belly: null,
        hips: null,
        thigh: null,
        biceps: null,
        comment: '',
      },
    ];
    const state = getPathSetupState(measurements, null);
    expect(state.kind).toBe('no_target');
    if (state.kind === 'no_target') {
      expect(state.ctaRoute).toBe('/settings#settings-weight');
    }
  });

  it('returns ready when weight and target exist', () => {
    const measurements: MeasurementEntry[] = [
      {
        id: '1',
        date: '2026-01-01',
        weight: 95,
        chest: null,
        waist: null,
        belly: null,
        hips: null,
        thigh: null,
        biceps: null,
        comment: '',
      },
    ];
    expect(getPathSetupState(measurements, 80).kind).toBe('ready');
  });

  it('returns ready when only weightGoal is set in settings', () => {
    const measurements: MeasurementEntry[] = [
      {
        id: '1',
        date: '2026-01-01',
        weight: 95,
        chest: null,
        waist: null,
        belly: null,
        hips: null,
        thigh: null,
        biceps: null,
        comment: '',
      },
    ];
    const state = getPathSetupState(measurements, {
      ...DEFAULT_APP_SETTINGS,
      weightGoal: 100,
      targetWeight: undefined,
    });
    expect(state.kind).toBe('ready');
  });
});