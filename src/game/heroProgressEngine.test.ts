import { describe, expect, it } from 'vitest';
import type { MeasurementEntry } from '../types';
import {
  getBestWeightForWeightLoss,
  getChapterFromStage,
  getHeroStageFromWeightLoss,
  getNextStageProgress,
  getWeightLossProgressPercent,
  resolveHeroProgressFromMeasurements,
} from './heroProgressEngine';

const measurements: MeasurementEntry[] = [
  {
    id: '1',
    date: '2026-01-01',
    weight: 100,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  },
  {
    id: '2',
    date: '2026-01-15',
    weight: 95,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  },
  {
    id: '3',
    date: '2026-02-01',
    weight: 97,
    chest: null,
    waist: null,
    belly: null,
    hips: null,
    thigh: null,
    biceps: null,
    comment: '',
  },
];

describe('heroProgressEngine', () => {
  it('uses best weight for progress, not latest spike', () => {
    expect(getBestWeightForWeightLoss(measurements)).toBe(95);
    expect(
      getWeightLossProgressPercent({
        startWeight: 100,
        currentWeight: 95,
        targetWeight: 80,
      }),
    ).toBe(25);
    expect(
      getWeightLossProgressPercent({
        startWeight: 100,
        currentWeight: 97,
        targetWeight: 80,
      }),
    ).toBe(15);
  });

  it('returns stage 1 when target is missing or invalid', () => {
    expect(
      getHeroStageFromWeightLoss({
        startWeight: 100,
        currentWeight: 90,
        targetWeight: null,
      }),
    ).toBe(1);
    expect(
      getHeroStageFromWeightLoss({
        startWeight: 100,
        currentWeight: 90,
        targetWeight: 110,
      }),
    ).toBe(1);
  });

  it('maps progress to stage and chapter', () => {
    const result = resolveHeroProgressFromMeasurements(measurements, 80);
    expect(result.stage).toBeGreaterThan(1);
    expect(getChapterFromStage(result.stage)).toBeGreaterThanOrEqual(1);
  });

  it('reaches stage 20 at 100% progress without overflow', () => {
    expect(
      getHeroStageFromWeightLoss({
        startWeight: 100,
        currentWeight: 80,
        targetWeight: 80,
      }),
    ).toBe(20);
  });

  it('calculates intra-stage progress from total path percent', () => {
    const next = getNextStageProgress({ progressPercent: 2, currentStage: 1 });
    expect(next.progressToNextStage).toBe(40);
  });

  it('returns 100% to next stage on final stage', () => {
    const next = getNextStageProgress({ progressPercent: 100, currentStage: 20 });
    expect(next.nextStage).toBeNull();
    expect(next.progressToNextStage).toBe(100);
  });
});
