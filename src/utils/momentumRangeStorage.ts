import type { MomentumHistoryRange } from '../types/momentum';

const STORAGE_KEY = 'personal-rpg-momentum-range';

const VALID_RANGES: MomentumHistoryRange[] = [7, 14, 30, 90];

export function getStoredMomentumRange(): MomentumHistoryRange {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 14;
    const n = Number(raw);
    if (VALID_RANGES.includes(n as MomentumHistoryRange)) {
      return n as MomentumHistoryRange;
    }
  } catch {
    /* ignore */
  }
  return 14;
}

export function setStoredMomentumRange(range: MomentumHistoryRange): void {
  localStorage.setItem(STORAGE_KEY, String(range));
}
