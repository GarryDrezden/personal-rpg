import type { MeasurementEntry } from '../types';

export type MeasurementMetricKey = keyof Pick<
  MeasurementEntry,
  'weight' | 'chest' | 'waist' | 'belly' | 'hips' | 'thigh' | 'biceps'
>;

export type MeasurementMetricGroup = 'weight' | 'body';

export type MeasurementMetricConfig = {
  key: MeasurementMetricKey;
  label: string;
  shortLabel: string;
  unit: 'кг' | 'см';
  icon: string;
  group: MeasurementMetricGroup;
  defaultVisibleInOverlay?: boolean;
};

export const MEASUREMENT_METRICS: MeasurementMetricConfig[] = [
  {
    key: 'weight',
    label: 'Вес',
    shortLabel: 'Вес',
    unit: 'кг',
    icon: '⚖️',
    group: 'weight',
  },
  {
    key: 'chest',
    label: 'Грудь',
    shortLabel: 'Грудь',
    unit: 'см',
    icon: '📏',
    group: 'body',
    defaultVisibleInOverlay: true,
  },
  {
    key: 'waist',
    label: 'Талия',
    shortLabel: 'Талия',
    unit: 'см',
    icon: '📏',
    group: 'body',
    defaultVisibleInOverlay: true,
  },
  {
    key: 'belly',
    label: 'Живот',
    shortLabel: 'Живот',
    unit: 'см',
    icon: '📏',
    group: 'body',
  },
  {
    key: 'hips',
    label: 'Ягодицы',
    shortLabel: 'Ягодицы',
    unit: 'см',
    icon: '📏',
    group: 'body',
    defaultVisibleInOverlay: true,
  },
  {
    key: 'thigh',
    label: 'Бедро',
    shortLabel: 'Бедро',
    unit: 'см',
    icon: '🦵',
    group: 'body',
  },
  {
    key: 'biceps',
    label: 'Бицепс',
    shortLabel: 'Бицепс',
    unit: 'см',
    icon: '💪',
    group: 'body',
  },
];

export const BODY_MEASUREMENT_METRICS = MEASUREMENT_METRICS.filter((m) => m.group === 'body');

export const DEFAULT_OVERLAY_METRICS: MeasurementMetricKey[] = BODY_MEASUREMENT_METRICS.filter(
  (m) => m.defaultVisibleInOverlay,
).map((m) => m.key);

export function getMeasurementMetricConfig(
  key: MeasurementMetricKey,
): MeasurementMetricConfig {
  return MEASUREMENT_METRICS.find((m) => m.key === key) ?? MEASUREMENT_METRICS[0]!;
}

export function getMetricsByGroup(group: MeasurementMetricGroup): MeasurementMetricConfig[] {
  return MEASUREMENT_METRICS.filter((m) => m.group === group);
}
