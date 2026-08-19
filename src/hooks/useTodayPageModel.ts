import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { DailyEntry, DayMode } from '../types';
import { useAppStore, emptyDaily } from '../store/appStore';
import { todayISO, formatDateFull, weekStart, weekDays } from '../utils/dates';
import {
  buildTodaySearchParams,
  resolveTodayPageSelection,
} from '../utils/todayWeekSelection';
import {
  dismissPlateauSoftHint,
  setManualPlateauActive,
} from '../game/plateau/plateauEngine';
import {
  dismissMomentumHelp,
  isMomentumHelpDismissed,
} from '../utils/momentumSuggestionStorage';
import {
  dismissRecoverySuggestion as persistRecoverySuggestionDismiss,
  isRecoverySuggestionDismissed,
} from '../utils/recoverySuggestionStorage';
import { useAppTheme } from './useAppTheme';
import {
  attachCozySaveFeedback,
  getTodaySaveReaction,
  type TodaySaveReaction,
} from '../utils/todayDayReaction';
import { getBaseSaveSparkLine } from '../game/base/baseProgressionEngine';
import {
  buildTodayDerivedState,
  didCozyGrantOnSave,
  withSelectedDayMode,
} from '../utils/todayPageModel';

const MODE_TOAST: Record<'minimal' | 'recovery', string> = {
  minimal: 'Минимальный день включён',
  recovery: 'День восстановления включён',
};

export function useTodayPageModel() {
  const { dailyEntries, measurements, settings, updateDaily, deleteDaily, saveSettings } =
    useAppStore();
  const { themeId, isCozy } = useAppTheme();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [routeWelcome, setRouteWelcome] = useState(
    () => (location.state as { routeOpened?: boolean } | null)?.routeOpened === true,
  );
  const today = todayISO();
  const currentWeekStart = useMemo(() => weekStart(today), [today]);
  const dateParam = searchParams.get('date');
  const weekParam = searchParams.get('week');
  const { visibleWeekStart, selectedDate } = useMemo(
    () => resolveTodayPageSelection({ today, dateParam, weekParam }),
    [today, dateParam, weekParam],
  );
  const visibleWeekDays = useMemo(() => weekDays(visibleWeekStart), [visibleWeekStart]);
  const isCurrentWeek = visibleWeekStart === currentWeekStart;
  const isEditingToday = selectedDate === today;

  const existing = dailyEntries.find((entry) => entry.date === selectedDate);
  const [entry, setEntry] = useState<DailyEntry>(existing ?? emptyDaily(selectedDate));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [recoveryToast, setRecoveryToast] = useState<string | null>(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(() =>
    isRecoverySuggestionDismissed(today),
  );
  const [nutritionHelpDismissed, setNutritionHelpDismissed] = useState(() =>
    localStorage.getItem(`nutrition-recovery-dismiss-${today}`) === '1',
  );
  const [momentumHelpDismissed, setMomentumHelpDismissed] = useState(() =>
    isMomentumHelpDismissed(today),
  );
  const [saveReaction, setSaveReaction] = useState<TodaySaveReaction | null>(null);

  useEffect(() => {
    const found = dailyEntries.find((item) => item.date === selectedDate);
    setEntry(found ?? emptyDaily(selectedDate));
    setDirty(false);
  }, [selectedDate, dailyEntries]);

  // Clear save feedback only when switching days — not when dailyEntries updates after save.
  useEffect(() => {
    setSaveReaction(null);
  }, [selectedDate]);

  const derived = useMemo(
    () =>
      buildTodayDerivedState({
        today,
        selectedDate,
        isEditingToday,
        isCozy,
        themeId,
        entry,
        existing,
        dailyEntries,
        measurements,
        settings,
        dirty,
        saving,
        saveReaction,
        suggestionDismissed,
        nutritionHelpDismissed,
        momentumHelpDismissed,
      }),
    [
      today,
      selectedDate,
      isEditingToday,
      isCozy,
      themeId,
      entry,
      existing,
      dailyEntries,
      measurements,
      settings,
      dirty,
      saving,
      saveReaction,
      suggestionDismissed,
      nutritionHelpDismissed,
      momentumHelpDismissed,
    ],
  );

  const selectDay = useCallback(
    (date: string) => {
      if (date === selectedDate) return;
      if (dirty && !confirm('Есть несохранённые изменения. Перейти к другому дню без сохранения?')) {
        return;
      }
      setSearchParams(
        buildTodaySearchParams({
          currentWeekStart,
          visibleWeekStart,
          date,
          today,
        }),
      );
    },
    [dirty, selectedDate, today, currentWeekStart, visibleWeekStart, setSearchParams],
  );

  const selectWeek = useCallback(
    (nextWeekStart: string) => {
      if (nextWeekStart === visibleWeekStart) return;
      if (dirty && !confirm('Есть несохранённые изменения. Перейти к другой неделе без сохранения?')) {
        return;
      }
      const nextWeekDays = weekDays(nextWeekStart);
      const nextDate = nextWeekDays.includes(selectedDate)
        ? selectedDate
        : nextWeekDays.includes(today)
          ? today
          : nextWeekDays[nextWeekDays.length - 1]!;
      setSearchParams(
        buildTodaySearchParams({
          currentWeekStart,
          visibleWeekStart: nextWeekStart,
          date: nextDate,
          today,
        }),
      );
    },
    [dirty, selectedDate, today, currentWeekStart, visibleWeekStart, setSearchParams],
  );

  const applySaveReaction = (savedEntry: DailyEntry, opts?: { cozyJustGranted?: boolean }) => {
    const latestSettings = useAppStore.getState().settings;
    const reaction = getTodaySaveReaction({
      entry: savedEntry,
      settings: latestSettings,
      questDone: derived.stats.done,
      questTotal: derived.stats.total,
      points: derived.points,
      themeId: latestSettings.themeId ?? themeId,
    });
    const baseLine = getBaseSaveSparkLine(savedEntry, latestSettings);
    const withBase = baseLine ? { ...reaction, baseLine } : reaction;
    setSaveReaction(
      attachCozySaveFeedback(
        withBase,
        savedEntry.cozyRewardsGranted ?? null,
        Boolean(opts?.cozyJustGranted),
      ),
    );
  };

  const persistDayMode = async (mode: 'minimal' | 'recovery') => {
    const updated = withSelectedDayMode(entry, selectedDate, mode);
    setEntry(updated);
    setSaving(true);
    try {
      const saved = await updateDaily(updated);
      setEntry(saved);
      setDirty(false);
      applySaveReaction(saved, {
        cozyJustGranted: didCozyGrantOnSave(entry, saved),
      });
      setRecoveryToast(MODE_TOAST[mode]);
      setTimeout(() => setRecoveryToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const patch = (partial: Partial<DailyEntry>) => {
    setEntry((prev) => ({ ...prev, ...partial, date: selectedDate }));
    setDirty(true);
    setSaveReaction(null);
  };

  const saveDay = async () => {
    setSaving(true);
    try {
      const saved = await updateDaily({ ...entry, date: selectedDate });
      setEntry(saved);
      setDirty(false);
      applySaveReaction(saved, {
        cozyJustGranted: didCozyGrantOnSave(entry, saved),
      });
    } catch {
      setDirty(true);
    } finally {
      setSaving(false);
    }
  };

  const selectDayMode = (mode: DayMode) => {
    const next = withSelectedDayMode(entry, selectedDate, mode);
    patch({
      dayMode: next.dayMode,
      energyLevel: next.energyLevel,
    });
  };

  const handleDismissRecoverySuggestion = () => {
    persistRecoverySuggestionDismiss(today);
    setSuggestionDismissed(true);
  };

  const handleDismissMomentumHelp = () => {
    dismissMomentumHelp(today);
    setMomentumHelpDismissed(true);
  };

  const handleDismissNutritionHelp = () => {
    localStorage.setItem(`nutrition-recovery-dismiss-${today}`, '1');
    setNutritionHelpDismissed(true);
  };

  const handleMarkPlateau = async () => {
    setSaving(true);
    try {
      await saveSettings(setManualPlateauActive(settings, true));
    } finally {
      setSaving(false);
    }
  };

  const handleClearPlateau = async () => {
    setSaving(true);
    try {
      await saveSettings(setManualPlateauActive(settings, false));
    } finally {
      setSaving(false);
    }
  };

  const handleDismissPlateauHint = async () => {
    setSaving(true);
    try {
      await saveSettings(dismissPlateauSoftHint(settings));
    } finally {
      setSaving(false);
    }
  };

  const resetDay = async () => {
    if (!existing) return;
    if (!confirm(`Сбросить все данные за ${formatDateFull(selectedDate)}?`)) return;
    setSaving(true);
    try {
      await deleteDaily(selectedDate);
      setEntry(emptyDaily(selectedDate));
      setDirty(false);
      setSaveReaction(null);
    } finally {
      setSaving(false);
    }
  };

  return {
    themeId,
    isCozy,
    today,
    selectedDate,
    visibleWeekStart,
    visibleWeekDays,
    currentWeekStart,
    isCurrentWeek,
    isEditingToday,
    existing,
    entry,
    saving,
    dirty,
    recoveryToast,
    saveReaction,
    routeWelcome,
    setRouteWelcome,
    derived,
    settings,
    dailyEntries,
    patch,
    selectDay,
    selectWeek,
    saveDay,
    resetDay,
    selectDayMode,
    persistDayMode,
    handleDismissRecoverySuggestion,
    handleDismissMomentumHelp,
    handleDismissNutritionHelp,
    handleMarkPlateau,
    handleClearPlateau,
    handleDismissPlateauHint,
    dismissSaveReaction: () => setSaveReaction(null),
  };
}

export type TodayPageModel = ReturnType<typeof useTodayPageModel>;
