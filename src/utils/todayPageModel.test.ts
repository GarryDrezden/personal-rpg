import { describe, expect, it } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '../constants/defaults';
import { emptyDaily } from '../store/appStore';
import {
  buildTodayDerivedState,
  didCozyGrantOnSave,
  getTodayEmptyCopy,
  getTodayMainQuestsLabel,
  getTodayModeCaption,
  getTodayPageTitle,
  getTodaySaveButtonLabel,
  withSelectedDayMode,
} from './todayPageModel';

describe('today page model helpers', () => {
  it('withSelectedDayMode sets recovery energy default without saving', () => {
    const entry = emptyDaily('2026-08-19');
    expect(entry.energyLevel).toBeNull();
    const next = withSelectedDayMode(entry, '2026-08-19', 'recovery');
    expect(next.dayMode).toBe('recovery');
    expect(next.energyLevel).toBe(2);
    expect(withSelectedDayMode(entry, '2026-08-19', 'normal').energyLevel).toBeNull();
  });

  it('didCozyGrantOnSave is true only on first stamp', () => {
    const before = emptyDaily('2026-08-19');
    const after = {
      ...before,
      cozyRewardsGranted: {
        grantedAt: '2026-08-19T00:00:00.000Z',
        resources: { comfort: 1, materials: 0, garden: 0, clarity: 0 },
        reasons: ['nutrition'],
      },
    };
    expect(didCozyGrantOnSave(before, after)).toBe(true);
    expect(didCozyGrantOnSave(after, after)).toBe(false);
  });

  it('labels follow current copy', () => {
    expect(getTodayPageTitle(true)).toBe('Ход дня');
    expect(getTodayPageTitle(false)).toBe('Квесты дня');
    expect(getTodayModeCaption('normal')).toBeNull();
    expect(getTodayModeCaption('minimal')).toBe('Минимальный день');
    expect(getTodaySaveButtonLabel(true, true)).toBe('Сохранение…');
    expect(getTodaySaveButtonLabel(false, true)).toBe('Сохранить ход');
    expect(getTodaySaveButtonLabel(false, false)).toBe('Сохранено');
    expect(getTodayMainQuestsLabel({ isEditingToday: true, recoveryState: 'after_bad_day', isCozy: false })).toBe(
      'Минимальный набор',
    );
    expect(getTodayEmptyCopy(true)).toMatch(/Дом пока тихий/);
  });

  it('minimal mode derived flags hide recovery suggestion', () => {
    const today = '2026-08-19';
    const entry = withSelectedDayMode(emptyDaily(today), today, 'minimal');
    const derived = buildTodayDerivedState({
      today,
      selectedDate: today,
      isEditingToday: true,
      isCozy: true,
      themeId: 'cozy',
      entry,
      existing: undefined,
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      dirty: false,
      saving: false,
      saveReaction: null,
      suggestionDismissed: false,
      nutritionHelpDismissed: false,
      momentumHelpDismissed: false,
    });
    expect(derived.dayMode).toBe('minimal');
    expect(derived.showRecoverySuggestion).toBe(false);
    expect(derived.modeCaption).toBe('Минимальный день');
  });

  it('recovery mode derived flags keep recovery chrome', () => {
    const today = '2026-08-19';
    const entry = withSelectedDayMode(emptyDaily(today), today, 'recovery');
    const derived = buildTodayDerivedState({
      today,
      selectedDate: today,
      isEditingToday: true,
      isCozy: false,
      themeId: 'darkFantasy',
      entry,
      existing: undefined,
      dailyEntries: [],
      measurements: [],
      settings: DEFAULT_APP_SETTINGS,
      dirty: true,
      saving: false,
      saveReaction: null,
      suggestionDismissed: false,
      nutritionHelpDismissed: false,
      momentumHelpDismissed: false,
    });
    expect(derived.dayMode).toBe('recovery');
    expect(derived.showRecovery).toBe(true);
    expect(derived.showReactionPreview).toBe(true);
  });

  it('hides nutrition quests from the main list regardless of tracking', () => {
    const today = '2026-08-19';
    const derived = buildTodayDerivedState({
      today,
      selectedDate: today,
      isEditingToday: true,
      isCozy: false,
      themeId: 'darkFantasy',
      entry: emptyDaily(today),
      existing: undefined,
      dailyEntries: [],
      measurements: [],
      settings: { ...DEFAULT_APP_SETTINGS, nutritionTrackingMode: 'disabled' },
      dirty: false,
      saving: false,
      saveReaction: null,
      suggestionDismissed: false,
      nutritionHelpDismissed: false,
      momentumHelpDismissed: false,
    });
    expect(derived.mainQuests.some((quest) => quest.id === 'nutrition')).toBe(false);
  });
});
