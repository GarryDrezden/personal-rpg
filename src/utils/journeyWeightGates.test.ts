import { describe, expect, it } from 'vitest';
import { scaleJourneyWeightTarget } from './journeyWeightGates';

describe('scaleJourneyWeightTarget', () => {
  it('maps 1/5/10/20/50 onto a 10 kg goal', () => {
    expect([1, 5, 10, 20, 50].map((n) => scaleJourneyWeightTarget(n, 10))).toEqual([
      1, 2.5, 5, 8, 10,
    ]);
  });

  it('keeps large-goal gates at campaign absolutes', () => {
    expect([1, 5, 10, 20, 50].map((n) => scaleJourneyWeightTarget(n, 80))).toEqual([
      1, 5, 10, 20, 50,
    ]);
  });

  it('returns absolute gates when personal goal is unknown', () => {
    expect(scaleJourneyWeightTarget(50, null)).toBe(50);
    expect(scaleJourneyWeightTarget(50, 0)).toBe(50);
  });
});
