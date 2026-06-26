import type { MeasurementMetricKey } from '../constants/measurementMetrics';
import {
  DEFAULT_OVERLAY_METRICS,
  MEASUREMENT_METRICS,
} from '../constants/measurementMetrics';
import { migrateMeasurementMetricKey } from '../constants/measurementMetricMigrations';
import type { MeasurementsChartMode } from '../types/measurementsChart';

const METRIC_KEY = 'personal-rpg-measurements-selected-metric';
const LEGACY_METRIC_KEY = 'personal-rpg-measurement-selected-metric';
const CHART_MODE_KEY = 'personal-rpg-measurements-chart-mode';
const OVERLAY_KEY = 'personal-rpg-measurements-overlay-metrics';
const DUAL_AXIS_KEY = 'personal-rpg-measurements-dual-axis-metrics';

const VALID_KEYS = new Set(MEASUREMENT_METRICS.map((m) => m.key));
const BODY_KEYS = new Set(
  MEASUREMENT_METRICS.filter((m) => m.group === 'body').map((m) => m.key),
);

export const MAX_OVERLAY_METRICS = 5;
export const MAX_DUAL_AXIS_BODY_METRICS = 4;
export const DEFAULT_DUAL_AXIS_METRICS: MeasurementMetricKey[] = ['waist'];

export type { MeasurementsChartMode };

function filterBodyMetrics(keys: MeasurementMetricKey[]): MeasurementMetricKey[] {
  return keys.filter((k) => BODY_KEYS.has(k));
}

function uniqueBodyMetrics(keys: MeasurementMetricKey[]): MeasurementMetricKey[] {
  const seen = new Set<MeasurementMetricKey>();
  const result: MeasurementMetricKey[] = [];
  for (const key of filterBodyMetrics(keys)) {
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(key);
  }
  return result;
}

function parseStoredMetricKeys(raw: unknown, maxCount?: number): MeasurementMetricKey[] {
  if (!Array.isArray(raw)) return [];

  const result: MeasurementMetricKey[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const migrated = migrateMeasurementMetricKey(item);
    if (!migrated || !BODY_KEYS.has(migrated)) continue;
    if (!result.includes(migrated)) {
      result.push(migrated);
    }
    if (maxCount !== undefined && result.length >= maxCount) break;
  }

  return result;
}

function parseStoredMetricKey(raw: string | null): MeasurementMetricKey | null {
  if (!raw) return null;
  const migrated = migrateMeasurementMetricKey(raw);
  if (!migrated || !VALID_KEYS.has(migrated)) return null;
  return migrated;
}

export function getStoredMeasurementMetric(): MeasurementMetricKey | null {
  try {
    const raw = localStorage.getItem(METRIC_KEY) ?? localStorage.getItem(LEGACY_METRIC_KEY);
    return parseStoredMetricKey(raw);
  } catch {
    return null;
  }
}

export function setStoredMeasurementMetric(metric: MeasurementMetricKey): void {
  try {
    localStorage.setItem(METRIC_KEY, metric);
    localStorage.removeItem(LEGACY_METRIC_KEY);
  } catch {
    // ignore
  }
}

export function getStoredChartMode(): MeasurementsChartMode | null {
  try {
    const raw = localStorage.getItem(CHART_MODE_KEY);
    if (raw === 'single' || raw === 'overlay' || raw === 'dualAxis') return raw;
    return null;
  } catch {
    return null;
  }
}

export function setStoredChartMode(mode: MeasurementsChartMode): void {
  try {
    localStorage.setItem(CHART_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

export function getStoredOverlayMetrics(): MeasurementMetricKey[] | null {
  try {
    const raw = localStorage.getItem(OVERLAY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const filtered = parseStoredMetricKeys(parsed, MAX_OVERLAY_METRICS);
    return filtered.length > 0 ? filtered : null;
  } catch {
    return null;
  }
}

export function setStoredOverlayMetrics(metrics: MeasurementMetricKey[]): void {
  try {
    const normalized = uniqueBodyMetrics(metrics).slice(0, MAX_OVERLAY_METRICS);
    localStorage.setItem(OVERLAY_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

export function getStoredDualAxisMetrics(): MeasurementMetricKey[] | null {
  try {
    const raw = localStorage.getItem(DUAL_AXIS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const filtered = parseStoredMetricKeys(parsed, MAX_DUAL_AXIS_BODY_METRICS);
    return filtered.length > 0 ? filtered : null;
  } catch {
    return null;
  }
}

export function setStoredDualAxisMetrics(metrics: MeasurementMetricKey[]): void {
  try {
    const normalized = uniqueBodyMetrics(metrics).slice(0, MAX_DUAL_AXIS_BODY_METRICS);
    localStorage.setItem(DUAL_AXIS_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

export function resolveInitialMeasurementMetric(): MeasurementMetricKey {
  return getStoredMeasurementMetric() ?? 'weight';
}

export function resolveInitialChartMode(): MeasurementsChartMode {
  return getStoredChartMode() ?? 'single';
}

export function resolveInitialOverlayMetrics(): MeasurementMetricKey[] {
  return getStoredOverlayMetrics() ?? [...DEFAULT_OVERLAY_METRICS];
}

export function resolveInitialDualAxisMetrics(): MeasurementMetricKey[] {
  return getStoredDualAxisMetrics() ?? [...DEFAULT_DUAL_AXIS_METRICS];
}
