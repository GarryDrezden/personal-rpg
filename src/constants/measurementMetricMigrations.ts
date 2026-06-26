import type { MeasurementMetricKey } from './measurementMetrics';
import { MEASUREMENT_METRICS } from './measurementMetrics';

const VALID_KEYS = new Set(MEASUREMENT_METRICS.map((m) => m.key));

export const MEASUREMENT_METRIC_KEY_MIGRATIONS: Record<string, MeasurementMetricKey> = {
  butt: 'hips',
  hip: 'hips',
  arm: 'biceps',
  leg: 'thigh',
};

export function migrateMeasurementMetricKey(key: string): MeasurementMetricKey | null {
  if (VALID_KEYS.has(key as MeasurementMetricKey)) {
    return key as MeasurementMetricKey;
  }
  const migrated = MEASUREMENT_METRIC_KEY_MIGRATIONS[key];
  return migrated ?? null;
}
