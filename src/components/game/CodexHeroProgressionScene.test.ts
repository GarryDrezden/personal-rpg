import { describe, expect, it } from 'vitest';
import { resolveCodexFlankStages } from './CodexHeroProgressionScene';

describe('resolveCodexFlankStages', () => {
  it('shows death on left and stage 2 on right at stage 1', () => {
    expect(resolveCodexFlankStages(1)).toEqual({
      showDeathLeft: true,
      leftStage: null,
      rightStage: 2,
    });
  });

  it('at stage 18 shows 19 left and 17 right', () => {
    expect(resolveCodexFlankStages(18)).toEqual({
      showDeathLeft: false,
      leftStage: 19,
      rightStage: 17,
    });
  });

  it('at stage 20 shows only 19 on the right', () => {
    expect(resolveCodexFlankStages(20)).toEqual({
      showDeathLeft: false,
      leftStage: null,
      rightStage: 19,
    });
  });

  it('at stage 2 shows 3 left and 1 right', () => {
    expect(resolveCodexFlankStages(2)).toEqual({
      showDeathLeft: false,
      leftStage: 3,
      rightStage: 1,
    });
  });
});
