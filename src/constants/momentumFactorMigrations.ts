/** Legacy sleep factor IDs → current IDs */
export const MOMENTUM_FACTOR_ID_MIGRATIONS: Record<string, string> = {
  good_sleep: 'sleep_good',
  poor_sleep: 'sleep_low',
  low_sleep: 'sleep_low',
  poor_sleep_streak: 'sleep_low_streak',
  bad_sleep_streak: 'sleep_low_streak',
};

export const LEGACY_SLEEP_FACTOR_IDS = new Set(
  Object.keys(MOMENTUM_FACTOR_ID_MIGRATIONS),
);
