import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import type { AppSettings } from '../types';
import {
  addDirtyKeys,
  dirtyKeysFromPatch,
  mergePersistedIntoDraft,
} from './settingsDraftMerge';

function settings(partial: Partial<AppSettings> = {}): AppSettings {
  return { ...DEFAULT_APP_SETTINGS, ...partial };
}

describe('settings draft merge', () => {
  it('Case A: theme autosave does not clobber dirty draft weight', () => {
    const draft = settings({ weightGoal: 88, targetWeight: 88 });
    const persisted = settings({
      weightGoal: 100,
      targetWeight: 100,
      themeId: 'darkFantasy',
    });
    const merged = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(['weightGoal', 'targetWeight']),
    });
    expect(merged.weightGoal).toBe(88);
    expect(merged.targetWeight).toBe(88);
    expect(merged.themeId).toBe('darkFantasy');
  });

  it('Case B: sidebar autosave keeps dirty draft', () => {
    const draft = settings({ defaultStepsNormal: 9000 });
    const persisted = settings({
      defaultStepsNormal: 11500,
      sidebarVisibility: {
        cozy: { ...DEFAULT_APP_SETTINGS.sidebarVisibility!.cozy, chronicle: true },
        darkFantasy: DEFAULT_APP_SETTINGS.sidebarVisibility!.darkFantasy,
      },
    });
    const merged = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(['defaultStepsNormal']),
    });
    expect(merged.defaultStepsNormal).toBe(9000);
    expect(merged.sidebarVisibility?.cozy.chronicle).toBe(true);
  });

  it('Case C: sleep tracking autosave keeps dirty draft', () => {
    const draft = settings({ nutritionTrackingMode: 'precise' });
    const persisted = settings({
      nutritionTrackingMode: 'simple',
      enableSleepTracking: true,
    });
    const merged = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(['nutritionTrackingMode']),
    });
    expect(merged.nutritionTrackingMode).toBe('precise');
    expect(merged.enableSleepTracking).toBe(true);
  });

  it('Case D: explicit save writes dirty draft onto latest autosave base', () => {
    const draft = settings({ weightGoal: 82, themeId: 'cozy' });
    const persisted = settings({
      weightGoal: 100,
      themeId: 'darkFantasy',
      enableSleepTracking: true,
      sidebarVisibility: {
        cozy: { ...DEFAULT_APP_SETTINGS.sidebarVisibility!.cozy, momentum: true },
        darkFantasy: DEFAULT_APP_SETTINGS.sidebarVisibility!.darkFantasy,
      },
    });
    const saved = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(['weightGoal']),
    });
    expect(saved.weightGoal).toBe(82);
    expect(saved.themeId).toBe('darkFantasy');
    expect(saved.enableSleepTracking).toBe(true);
    expect(saved.sidebarVisibility?.cozy.momentum).toBe(true);
  });

  it('Case E: pristine draft-owned field follows persisted update', () => {
    const draft = settings({ weightGoal: 100 });
    const persisted = settings({ weightGoal: 77 });
    const merged = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(),
    });
    expect(merged.weightGoal).toBe(77);
  });

  it('Case F: dirty draft-owned field is retained against persisted update', () => {
    const draft = settings({ weightGoal: 91 });
    const persisted = settings({ weightGoal: 70 });
    const merged = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(['weightGoal']),
    });
    expect(merged.weightGoal).toBe(91);
  });

  it('Case G: empty dirty after save follows new baseline', () => {
    const saved = settings({ weightGoal: 82, themeId: 'darkFantasy' });
    const merged = mergePersistedIntoDraft({
      persisted: saved,
      draft: saved,
      dirtyKeys: new Set(),
    });
    expect(merged).toEqual(saved);
  });

  it('Case H: no dirty keys — save payload equals persisted', () => {
    const persisted = settings({ themeId: 'darkFantasy', enableSleepTracking: true });
    const draft = settings({ weightGoal: 100, themeId: 'cozy' });
    const saved = mergePersistedIntoDraft({
      persisted,
      draft,
      dirtyKeys: new Set(),
    });
    expect(saved).toEqual(persisted);
  });

  it('dirtyKeysFromPatch ignores autosave fields', () => {
    expect(
      dirtyKeysFromPatch({
        themeId: 'darkFantasy',
        enableSleepTracking: true,
        weightGoal: 90,
      }),
    ).toEqual(['weightGoal']);
  });

  it('addDirtyKeys accumulates without mutating the previous set', () => {
    const first = addDirtyKeys(new Set(), ['weightGoal']);
    const second = addDirtyKeys(first, ['pointSettings']);
    expect(first.has('pointSettings')).toBe(false);
    expect(second.has('weightGoal')).toBe(true);
    expect(second.has('pointSettings')).toBe(true);
  });
});
