export const DEFAULT_STEPS_THRESHOLDS = {
  minimum: 7000,
  normal: 11500,
  excellent: 14000,
} as const;

export const DEFAULT_STEPS_POINTS = {
  low: 0,
  minimum: 20,
  normal: 35,
  excellent: 45,
  recoveryMinimum: 15,
  recoveryNormal: 20,
  minimalMinimum: 15,
} as const;

export const RECOVERY_STEPS_THRESHOLDS = {
  minimum: 5000,
  normal: 7000,
} as const;

export const MINIMAL_DAY_STEPS_THRESHOLD = 5000;
