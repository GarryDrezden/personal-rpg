import { describe, expect, it } from 'vitest';
import {
  AVATAR_VISUAL_STAGES,
  getAvatarVisualStage,
  getAvatarVisualStageBodyRange,
  isAvatarVisualStage,
} from './avatarVisualStage';

describe('getAvatarVisualStage', () => {
  it('maps body bands to visual anchors', () => {
    expect(getAvatarVisualStage(1)).toBe(1);
    expect(getAvatarVisualStage(4)).toBe(1);
    expect(getAvatarVisualStage(5)).toBe(5);
    expect(getAvatarVisualStage(8)).toBe(5);
    expect(getAvatarVisualStage(9)).toBe(10);
    expect(getAvatarVisualStage(12)).toBe(10);
    expect(getAvatarVisualStage(13)).toBe(15);
    expect(getAvatarVisualStage(16)).toBe(15);
    expect(getAvatarVisualStage(17)).toBe(20);
    expect(getAvatarVisualStage(20)).toBe(20);
  });

  it('exposes configurable anchor list', () => {
    expect([...AVATAR_VISUAL_STAGES]).toEqual([1, 5, 10, 15, 20]);
    expect(isAvatarVisualStage(7)).toBe(false);
    expect(isAvatarVisualStage(10)).toBe(true);
  });

  it('documents body ranges per visual anchor', () => {
    expect(getAvatarVisualStageBodyRange(1)).toEqual({ from: 1, to: 4 });
    expect(getAvatarVisualStageBodyRange(10)).toEqual({ from: 9, to: 12 });
    expect(getAvatarVisualStageBodyRange(20)).toEqual({ from: 17, to: 20 });
  });
});
