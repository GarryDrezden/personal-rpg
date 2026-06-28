import { describe, expect, it } from 'vitest';
import { resolveGameProfile } from './gameProfile';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';

describe('resolveGameProfile', () => {
  it('uses weightGoal when targetWeight is not set', () => {
    const profile = resolveGameProfile({
      ...DEFAULT_APP_SETTINGS,
      weightGoal: 100,
      targetWeight: undefined,
    });
    expect(profile.targetWeight).toBe(100);
  });

  it('prefers targetWeight over weightGoal', () => {
    const profile = resolveGameProfile({
      ...DEFAULT_APP_SETTINGS,
      weightGoal: 100,
      targetWeight: 85,
    });
    expect(profile.targetWeight).toBe(85);
  });
});
