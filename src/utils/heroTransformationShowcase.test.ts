import { describe, expect, it } from 'vitest';
import { resolveMilestoneFlankStages } from './heroTransformationShowcase';

describe('resolveMilestoneFlankStages', () => {
  it('stage 1: death left pole, right milestone 5', () => {
    expect(resolveMilestoneFlankStages(1)).toEqual({
      left: null,
      right: 5,
      deathState: true,
    });
  });

  it('stage 2–4: no left ghost, right milestone 5', () => {
    expect(resolveMilestoneFlankStages(4)).toEqual({
      left: null,
      right: 5,
      deathState: false,
    });
  });

  it('stage 5: left 1, right 10', () => {
    expect(resolveMilestoneFlankStages(5)).toEqual({
      left: 1,
      right: 10,
      deathState: false,
    });
  });

  it('stage 6–9: left 5, right 10', () => {
    expect(resolveMilestoneFlankStages(7)).toEqual({ left: 5, right: 10, deathState: false });
  });

  it('stage 11–14: left 10, right 15', () => {
    expect(resolveMilestoneFlankStages(12)).toEqual({ left: 10, right: 15, deathState: false });
  });

  it('stage 16–19: left 15, right 20', () => {
    expect(resolveMilestoneFlankStages(18)).toEqual({ left: 15, right: 20, deathState: false });
  });

  it('stage 20: left 15, no right ghost', () => {
    expect(resolveMilestoneFlankStages(20)).toEqual({
      left: 15,
      right: null,
      deathState: false,
    });
  });
});
