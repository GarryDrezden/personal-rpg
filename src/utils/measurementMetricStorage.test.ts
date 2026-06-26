import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_OVERLAY_METRICS } from '../constants/measurementMetrics';
import {
  DEFAULT_DUAL_AXIS_METRICS,
  getStoredChartMode,
  getStoredDualAxisMetrics,
  getStoredMeasurementMetric,
  getStoredOverlayMetrics,
  MAX_DUAL_AXIS_BODY_METRICS,
  MAX_OVERLAY_METRICS,
  resolveInitialChartMode,
  resolveInitialDualAxisMetrics,
  resolveInitialMeasurementMetric,
  resolveInitialOverlayMetrics,
  setStoredChartMode,
  setStoredDualAxisMetrics,
  setStoredMeasurementMetric,
  setStoredOverlayMetrics,
} from './measurementMetricStorage';

const store: Record<string, string> = {};

const localStorageMock: Storage = {
  get length() {
    return Object.keys(store).length;
  },
  clear() {
    for (const key of Object.keys(store)) delete store[key];
  },
  getItem(key: string) {
    return store[key] ?? null;
  },
  key(index: number) {
    return Object.keys(store)[index] ?? null;
  },
  removeItem(key: string) {
    delete store[key];
  },
  setItem(key: string, value: string) {
    store[key] = value;
  },
};

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
});

describe('measurementMetricStorage defaults', () => {
  it('returns defaults when localStorage is empty', () => {
    expect(resolveInitialChartMode()).toBe('single');
    expect(resolveInitialMeasurementMetric()).toBe('weight');
    expect(resolveInitialOverlayMetrics()).toEqual(DEFAULT_OVERLAY_METRICS);
    expect(resolveInitialDualAxisMetrics()).toEqual(DEFAULT_DUAL_AXIS_METRICS);
  });
});

describe('measurementMetricStorage chartMode validation', () => {
  it('falls back to single for unknown chart mode', () => {
    localStorage.setItem('personal-rpg-measurements-chart-mode', 'banana');
    expect(getStoredChartMode()).toBeNull();
    expect(resolveInitialChartMode()).toBe('single');
  });

  it('reads valid chart modes', () => {
    setStoredChartMode('dualAxis');
    expect(getStoredChartMode()).toBe('dualAxis');
    expect(resolveInitialChartMode()).toBe('dualAxis');
  });
});

describe('measurementMetricStorage selectedMetric validation', () => {
  it('falls back to weight for unknown metric', () => {
    setStoredMeasurementMetric('weight');
    localStorage.setItem('personal-rpg-measurements-selected-metric', 'neck');
    expect(getStoredMeasurementMetric()).toBeNull();
    expect(resolveInitialMeasurementMetric()).toBe('weight');
  });

  it('migrates legacy metric keys', () => {
    localStorage.setItem('personal-rpg-measurements-selected-metric', 'butt');
    expect(getStoredMeasurementMetric()).toBe('hips');
  });

  it('reads legacy storage key', () => {
    localStorage.setItem('personal-rpg-measurement-selected-metric', 'arm');
    expect(getStoredMeasurementMetric()).toBe('biceps');
  });
});

describe('measurementMetricStorage overlayMetrics validation', () => {
  it('removes invalid keys and weight from overlay', () => {
    localStorage.setItem(
      'personal-rpg-measurements-overlay-metrics',
      JSON.stringify(['waist', 'weight', 'neck', 'hips']),
    );
    expect(getStoredOverlayMetrics()).toEqual(['waist', 'hips']);
  });

  it('migrates old metric names in overlay', () => {
    localStorage.setItem(
      'personal-rpg-measurements-overlay-metrics',
      JSON.stringify(['butt', 'leg']),
    );
    expect(getStoredOverlayMetrics()).toEqual(['hips', 'thigh']);
  });

  it('falls back to defaults when overlay becomes empty', () => {
    localStorage.setItem(
      'personal-rpg-measurements-overlay-metrics',
      JSON.stringify(['weight', 'invalid']),
    );
    expect(getStoredOverlayMetrics()).toBeNull();
    expect(resolveInitialOverlayMetrics()).toEqual(DEFAULT_OVERLAY_METRICS);
  });

  it('caps overlay metrics at max count', () => {
    setStoredOverlayMetrics(['waist', 'hips', 'chest', 'belly', 'thigh', 'biceps']);
    expect(getStoredOverlayMetrics()).toHaveLength(MAX_OVERLAY_METRICS);
  });
});

describe('measurementMetricStorage dualAxisMetrics validation', () => {
  it('removes invalid keys and weight from dual-axis metrics', () => {
    localStorage.setItem(
      'personal-rpg-measurements-dual-axis-metrics',
      JSON.stringify(['waist', 'weight', 'invalid', 'hips']),
    );
    expect(getStoredDualAxisMetrics()).toEqual(['waist', 'hips']);
  });

  it('migrates old metric names in dual-axis', () => {
    localStorage.setItem(
      'personal-rpg-measurements-dual-axis-metrics',
      JSON.stringify(['arm', 'hip']),
    );
    expect(getStoredDualAxisMetrics()).toEqual(['biceps', 'hips']);
  });

  it('falls back to default when dual-axis becomes empty', () => {
    localStorage.setItem(
      'personal-rpg-measurements-dual-axis-metrics',
      JSON.stringify(['weight']),
    );
    expect(getStoredDualAxisMetrics()).toBeNull();
    expect(resolveInitialDualAxisMetrics()).toEqual(DEFAULT_DUAL_AXIS_METRICS);
  });

  it('caps dual-axis metrics at max count', () => {
    setStoredDualAxisMetrics(['waist', 'hips', 'chest', 'belly', 'thigh', 'biceps']);
    expect(getStoredDualAxisMetrics()).toHaveLength(MAX_DUAL_AXIS_BODY_METRICS);
  });
});
