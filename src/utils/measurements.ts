import type { MeasurementEntry } from '../types';

export interface MeasurementDelta {
  from: number;
  to: number;
  diff: number;
}

export function sortMeasurementsByDate(
  measurements: MeasurementEntry[],
): MeasurementEntry[] {
  return [...measurements].sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestMeasurement(
  measurements: MeasurementEntry[],
): MeasurementEntry | null {
  const sorted = sortMeasurementsByDate(measurements);
  return sorted[sorted.length - 1] ?? null;
}

export function getDelta(
  measurements: MeasurementEntry[],
  field: 'weight' | 'waist',
): { fromStart: MeasurementDelta | null; fromPrevious: MeasurementDelta | null } {
  const sorted = sortMeasurementsByDate(measurements).filter(
    (m) => m[field] !== null,
  );
  if (sorted.length === 0) {
    return { fromStart: null, fromPrevious: null };
  }

  const latest = sorted[sorted.length - 1][field]!;
  const first = sorted[0][field]!;
  const prev = sorted.length > 1 ? sorted[sorted.length - 2][field]! : first;

  return {
    fromStart: { from: first, to: latest, diff: latest - first },
    fromPrevious: { from: prev, to: latest, diff: latest - prev },
  };
}
