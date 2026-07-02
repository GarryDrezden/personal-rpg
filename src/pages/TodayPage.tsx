import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { DailyEntry } from '../types';
import { useAppStore, emptyDaily } from '../store/appStore';
import { todayISO, formatDateFull, weekStart, weekDays } from '../utils/dates';
import { getSeasonSnapshotWithRecap } from '../game/seasons/seasonEngine';
import { SeasonTodayCard } from '../components/season/SeasonTodayCard';
import { getTopBodyAbilityV1Hint } from '../game/bodyAbilities/bodyAbilityV1Engine';
import { BodyAbilityTodayHint } from '../components/bodyAbilities/BodyAbilityTodayHint';
import {
  dismissPlateauSoftHint,
  getPlateauSnapshot,
  setManualPlateauActive,
} from '../game/plateau/plateauEngine';
import { PlateauTodayCard } from '../components/plateau/PlateauTodayCard';
import { getWeeklySettingsForDate, getDayStatus } from '../utils/points';
import {
  calculateMomentumHistory,
  getMomentumAdjustedDailyPoints,
  getMomentumSummary,
} from '../utils/momentumEngine';
import { MomentumFactorsCard } from '../components/momentum/MomentumFactorsCard';
import { MomentumHelpCard } from '../components/momentum/MomentumHelpCard';
import {
  dismissMomentumHelp,
  isMomentumHelpDismissed,
} from '../utils/momentumSuggestionStorage';
import { previewDailyCoins } from '../utils/coinEngine';
import { getDailyQuests, getQuestCompletionStats, isDayEmpty } from '../utils/questEngine';
import { getRecoveryState, shouldShowRecoveryCard } from '../utils/recoveryEngine';
import { RecoveryCard } from '../components/recovery/RecoveryCard';
import { RecoverySuggestionCard } from '../components/recovery/RecoverySuggestionCard';
import { RestDayCard } from '../components/rest/RestDayCard';
import { getDayMode } from '../utils/stepsEngine';
import {
  dismissRecoverySuggestion as persistRecoverySuggestionDismiss,
  isRecoverySuggestionDismissed,
} from '../utils/recoverySuggestionStorage';
import { QuestCard } from '../components/quests/QuestCard';
import { WeekDayPicker } from '../components/quests/WeekDayPicker';
import { CARD_ACCENT } from '../constants/cardTheme';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DailyMobCard } from '../components/game/DailyMobCard';
import { getOrCreateDailyMobForEntry } from '../game/dailyMobEngine';
import { getDailyMobContextLine } from '../utils/todayMobContext';
import { getTodaySaveReaction, type TodaySaveReaction } from '../utils/todayDayReaction';
import { getBaseSaveSparkLine } from '../game/base/baseProgressionEngine';
import { shouldShowBodyAbilityHintOnToday } from '../utils/campaignIntegration';
import { TodayMinimalQuickCard } from '../components/today/TodayMinimalQuickCard';
import { TodaySaveReactionCard } from '../components/today/TodaySaveReactionCard';
import { NutritionDayCard } from '../components/nutrition/NutritionDayCard';
import { NutritionRecoverySuggestionCard } from '../components/nutrition/NutritionRecoverySuggestionCard';
import { shouldSuggestNutritionRecovery, isNutritionTrackingEnabled } from '../utils/nutritionEngine';

export function TodayPage() {
  const { dailyEntries, measurements, settings, updateDaily, deleteDaily, saveSettings } =
    useAppStore();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [routeWelcome, setRouteWelcome] = useState(
    () => (location.state as { routeOpened?: boolean } | null)?.routeOpened === true,
  );
  const today = todayISO();
  const currentWeekDays = useMemo(() => weekDays(weekStart(today)), [today]);
  const dateParam = searchParams.get('date');
  const selectedDate =
    dateParam && currentWeekDays.includes(dateParam) ? dateParam : today;
  const isEditingToday = selectedDate === today;

  const existing = dailyEntries.find((e) => e.date === selectedDate);
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
    const found = dailyEntries.find((e) => e.date === selectedDate);
    setEntry(found ?? emptyDaily(selectedDate));
    setDirty(false);
    setSaveReaction(null);
  }, [selectedDate, dailyEntries]);

  const selectDay = useCallback(
    (date: string) => {
      if (date === selectedDate) return;
      if (dirty && !confirm('Есть несохранённые изменения. Перейти к другому дню без сохранения?')) {
        return;
      }
      if (date === today) {
        setSearchParams({});
      } else {
        setSearchParams({ date });
      }
    },
    [dirty, selectedDate, today, setSearchParams],
  );

  const entriesForQuests = useMemo(() => {
    const others = dailyEntries.filter((e) => e.date !== selectedDate);
    return [...others, entry];
  }, [dailyEntries, entry, selectedDate]);

  const weekly = getWeeklySettingsForDate(selectedDate, settings);
  const quests = useMemo(
    () =>
      getDailyQuests({
        date: selectedDate,
        dailyEntries: entriesForQuests,
        settings,
      }),
    [selectedDate, entriesForQuests, settings],
  );

  const stats = getQuestCompletionStats(quests);
  const momentumSummary = useMemo(
    () => getMomentumSummary({ today, dailyEntries: entriesForQuests, settings }),
    [today, entriesForQuests, settings],
  );
  const todayMomentumResult = useMemo(() => {
    const history = calculateMomentumHistory({
      dailyEntries: entriesForQuests,
      settings,
    });
    return history.find((r) => r.date === selectedDate) ?? null;
  }, [entriesForQuests, settings, selectedDate]);
  const momentumPoints = getMomentumAdjustedDailyPoints(entry, settings, entriesForQuests);
  const points = momentumPoints.adjusted;
  const coins = previewDailyCoins(entry, settings);
  const dayStatus = getDayStatus(points);
  const dayEmpty = isDayEmpty(existing, settings) && isDayEmpty(entry, settings);
  const showRecovery =
    isEditingToday &&
    (shouldShowRecoveryCard({
      today,
      dailyEntries: entriesForQuests,
      settings,
      todayEntry: entry,
    }) ||
      (entry.dayMode && entry.dayMode !== 'normal'));
  const recoveryState = getRecoveryState({
    today,
    dailyEntries: entriesForQuests,
    settings,
    todayEntry: isEditingToday ? entry : null,
  });
  const mainQuestsLabel =
    isEditingToday && recoveryState === 'after_bad_day'
      ? 'Минимальный набор'
      : 'Основные квесты';

  const showRecoverySuggestion =
    isEditingToday &&
    recoveryState === 'after_bad_day' &&
    getDayMode(entry.dayMode) === 'normal' &&
    !suggestionDismissed;

  const showNutritionRecovery =
    isEditingToday &&
    isNutritionTrackingEnabled(settings) &&
    !nutritionHelpDismissed &&
    getDayMode(entry.dayMode) === 'normal' &&
    shouldSuggestNutritionRecovery({
      today,
      dailyEntries: entriesForQuests,
      settings,
    });

  const showMomentumHelp =
    isEditingToday &&
    !momentumHelpDismissed &&
    !showNutritionRecovery &&
    getDayMode(entry.dayMode) === 'normal' &&
    (momentumSummary.recoverySuggested || momentumSummary.minimalModeSuggested);

  const applySaveReaction = (savedEntry: DailyEntry) => {
    const reaction = getTodaySaveReaction({
      entry: savedEntry,
      settings,
      questDone: stats.done,
      questTotal: stats.total,
      points,
    });
    const baseLine = getBaseSaveSparkLine(savedEntry, settings);
    setSaveReaction(baseLine ? { ...reaction, baseLine } : reaction);
  };

  const acceptRecoverySuggestion = async () => {
    const updated: DailyEntry = {
      ...entry,
      date: selectedDate,
      dayMode: 'recovery',
      energyLevel: entry.energyLevel ?? 2,
    };
    setEntry(updated);
    setSaving(true);
    try {
      await updateDaily(updated);
      setDirty(false);
      applySaveReaction(updated);
      setRecoveryToast('День восстановления включён');
      setTimeout(() => setRecoveryToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDismissRecoverySuggestion = () => {
    persistRecoverySuggestionDismiss(today);
    setSuggestionDismissed(true);
  };

  const acceptMomentumRecovery = async () => {
    const updated: DailyEntry = {
      ...entry,
      date: selectedDate,
      dayMode: 'recovery',
      energyLevel: entry.energyLevel ?? 2,
    };
    setEntry(updated);
    setSaving(true);
    try {
      await updateDaily(updated);
      setDirty(false);
      applySaveReaction(updated);
      setRecoveryToast('День восстановления включён');
      setTimeout(() => setRecoveryToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const acceptMomentumMinimal = async () => {
    const updated: DailyEntry = {
      ...entry,
      date: selectedDate,
      dayMode: 'minimal',
      energyLevel: entry.energyLevel ?? 2,
    };
    setEntry(updated);
    setSaving(true);
    try {
      await updateDaily(updated);
      setDirty(false);
      applySaveReaction(updated);
      setRecoveryToast('Минимальный день включён');
      setTimeout(() => setRecoveryToast(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDismissMomentumHelp = () => {
    dismissMomentumHelp(today);
    setMomentumHelpDismissed(true);
  };

  const handleDismissNutritionHelp = () => {
    localStorage.setItem(`nutrition-recovery-dismiss-${today}`, '1');
    setNutritionHelpDismissed(true);
  };

  const mainQuests = quests.filter((q) => q.category === 'main' && q.id !== 'nutrition');
  const mediumQuests = quests.filter((q) => q.category === 'medium');
  const bonusQuests = quests.filter((q) => q.category === 'bonus');
  const dailyMobId = isEditingToday
    ? getOrCreateDailyMobForEntry(today, entry, settings)
    : null;
  const dailyMobContext =
    dailyMobId && isEditingToday
      ? getDailyMobContextLine(dailyMobId, entry, settings)
      : undefined;
  const dayMode = getDayMode(entry.dayMode);
  const seasonSnapshot = useMemo(
    () => getSeasonSnapshotWithRecap({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );
  const bodyAbilityHint = useMemo(
    () =>
      isEditingToday
        ? getTopBodyAbilityV1Hint({ settings, dailyEntries, measurements })
        : null,
    [isEditingToday, settings, dailyEntries, measurements],
  );
  const plateauSnapshot = useMemo(
    () =>
      getPlateauSnapshot({
        dailyEntries: entriesForQuests,
        measurements,
        settings,
        today,
      }),
    [entriesForQuests, measurements, settings, today],
  );

  const patch = (partial: Partial<DailyEntry>) => {
    setEntry((prev) => ({ ...prev, ...partial, date: selectedDate }));
    setDirty(true);
    setSaveReaction(null);
  };

  const saveDay = async () => {
    setSaving(true);
    try {
      const saved = { ...entry, date: selectedDate };
      await updateDaily(saved);
      setDirty(false);
      applySaveReaction(saved);
    } finally {
      setSaving(false);
    }
  };

  const enableMinimalDay = async () => {
    const updated: DailyEntry = {
      ...entry,
      date: selectedDate,
      dayMode: 'minimal',
      energyLevel: entry.energyLevel ?? 2,
    };
    setEntry(updated);
    setSaving(true);
    try {
      await updateDaily(updated);
      setDirty(false);
      applySaveReaction(updated);
      setRecoveryToast('Минимальный день включён');
      setTimeout(() => setRecoveryToast(null), 4000);
    } finally {
      setSaving(false);
    }
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

  const saveButtonLabel = saving
    ? 'Сохранение…'
    : dirty
      ? 'Сохранить ход'
      : 'Сохранено';

  return (
    <div className="space-y-5 overflow-x-hidden pb-24 lg:space-y-6 lg:pb-8">
      {routeWelcome ? (
        <div
          data-testid="route-opened-banner"
          className="rounded-2xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/55 px-4 py-4 text-sm text-[var(--app-text)] shadow-[0_0_24px_rgba(250,204,21,0.08)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--app-gold)]">
            Ядро пробуждено
          </p>
          <p className="mt-2 font-medium text-[var(--app-text)]">Маршрут открыт</p>
          <p className="mt-1 text-[var(--app-text-muted)]">
            Сегодня не нужно быть идеальным — достаточно удержать первый шаг.
          </p>
          <button
            type="button"
            onClick={() => setRouteWelcome(false)}
            className="mt-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1.5 text-xs font-semibold text-[var(--app-primary)]"
          >
            Продолжить путь
          </button>
        </div>
      ) : null}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Квесты дня</h1>
          <p className="text-sm text-[var(--app-text-muted)]">{formatDateFull(selectedDate)}</p>
          {!isEditingToday && (
            <p className="mt-1 text-xs font-medium text-[var(--app-warning)]">
              Редактирование прошлого дня недели
            </p>
          )}
          <p className="mt-1 text-sm font-medium text-[var(--app-primary)]">{dayStatus}</p>
          {dayMode !== 'normal' && isEditingToday ? (
            <p className="mt-1 text-xs text-[var(--app-gold)]">
              {dayMode === 'minimal' ? 'Минимальный день' : 'День восстановления'}
            </p>
          ) : null}
        </div>
        <div className="hidden flex-col items-end gap-2 lg:flex">
          {dirty ? (
            <span className="text-xs text-amber-600">Есть несохранённые изменения</span>
          ) : (
            <span className="text-xs text-[var(--app-text-muted)]">Все изменения сохранены</span>
          )}
          <button
            type="button"
            data-testid="today-save-desktop"
            onClick={() => void saveDay()}
            disabled={saving || !dirty}
            className="rounded-xl bg-[var(--app-primary)] px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-40 hover:brightness-105"
          >
            {saveButtonLabel}
          </button>
          {existing && (
            <button
              type="button"
              onClick={() => void resetDay()}
              disabled={saving}
              className="text-sm text-danger hover:underline disabled:opacity-50"
            >
              Сбросить день
            </button>
          )}
        </div>
      </header>

      {isEditingToday && dayMode !== 'recovery' ? (
        <TodayMinimalQuickCard
          entry={entry}
          onEnableMinimal={() => void enableMinimalDay()}
          saving={saving}
        />
      ) : null}

      {dailyMobId ? (
        <DailyMobCard mobId={dailyMobId} compact contextLine={dailyMobContext} />
      ) : null}

      {isEditingToday ? <SeasonTodayCard season={seasonSnapshot} /> : null}

      {bodyAbilityHint && shouldShowBodyAbilityHintOnToday(plateauSnapshot.mode) ? (
        <BodyAbilityTodayHint hint={bodyAbilityHint} />
      ) : null}

      {isEditingToday && plateauSnapshot.mode !== 'none' ? (
        <PlateauTodayCard
          snapshot={plateauSnapshot}
          saving={saving}
          onEnableMinimal={() => void enableMinimalDay()}
          onMarkPlateau={() => void handleMarkPlateau()}
          onClearPlateau={() => void handleClearPlateau()}
          onDismissHint={() => void handleDismissPlateauHint()}
        />
      ) : null}

      {saveReaction && !dirty ? (
        <TodaySaveReactionCard
          reaction={saveReaction}
          onDismiss={() => setSaveReaction(null)}
        />
      ) : null}

      <div className="hidden h-px bg-[var(--app-border)]/60 lg:block" aria-hidden />

      <Card>
        <p className="mb-3 text-sm font-medium text-[var(--app-text)]">День недели</p>
        <WeekDayPicker
          weekStartDate={weekStart(today)}
          selectedDate={selectedDate}
          today={today}
          dailyEntries={dailyEntries}
          onChange={selectDay}
        />
        <p className="mt-3 text-xs text-[var(--app-text-muted)]">
          Можно внести или исправить данные за любой день текущей недели.
        </p>
      </Card>

      {recoveryToast && (
        <p className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-[var(--app-success)]">
          {recoveryToast}
        </p>
      )}

      {showRecoverySuggestion && (
        <RecoverySuggestionCard
          onAccept={() => void acceptRecoverySuggestion()}
          onDismiss={handleDismissRecoverySuggestion}
        />
      )}

      {showNutritionRecovery ? (
        <NutritionRecoverySuggestionCard
          onAcceptRecovery={() => void acceptMomentumRecovery()}
          onAcceptMinimal={() => void acceptMomentumMinimal()}
          onDismiss={handleDismissNutritionHelp}
        />
      ) : null}

      {showMomentumHelp && (
        <MomentumHelpCard
          summary={momentumSummary}
          onSetRecoveryMode={() => void acceptMomentumRecovery()}
          onSetMinimalMode={() => void acceptMomentumMinimal()}
          onDismiss={handleDismissMomentumHelp}
        />
      )}

      {showRecovery && (
        <RecoveryCard
          today={today}
          dailyEntries={entriesForQuests}
          settings={settings}
          todayEntry={entry}
          showLink={false}
        />
      )}

      <RestDayCard entry={entry} onPatch={patch} />

      {isEditingToday && (
        <MomentumFactorsCard result={todayMomentumResult} />
      )}

      <Card className={CARD_ACCENT.primary}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Очки дня (XP)</p>
            <p className="text-3xl font-bold text-[var(--app-primary)]">+{Math.max(0, points)}</p>
            {momentumPoints.multiplier > 1 && isEditingToday && (
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                Бонус инерции: +{Math.round((momentumPoints.multiplier - 1) * 100)}% XP за дневные
                квесты
                {momentumPoints.base !== points && (
                  <span className="text-[var(--app-text-muted)]">
                    {' '}
                    (база {Math.max(0, momentumPoints.base)})
                  </span>
                )}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Монеты за день</p>
            <p className="text-3xl font-bold text-[var(--app-primary)]">+{coins} 🪙</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--app-text)]">
          <span>
            Основные:{' '}
            <strong>
              {stats.mainDone}/{stats.mainTotal}
            </strong>
          </span>
          <span>
            Всего квестов:{' '}
            <strong>
              {stats.done}/{stats.total}
            </strong>
          </span>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
            <span>Прогресс квестов</span>
            <span>{stats.percent}%</span>
          </div>
          <ProgressBar
            value={stats.percent}
            color={stats.percent >= 70 ? 'success' : 'gold'}
            className="h-2.5"
          />
        </div>
      </Card>

      {dayEmpty && isEditingToday && recoveryState === 'normal' && dayMode === 'normal' && (
        <p className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
          День ещё пустой — начни с одного квеста или включи минимальный день. Маршрут не требует
          идеала.
        </p>
      )}

      {!dayEmpty && !isEditingToday && (
        <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-center text-sm text-[var(--app-text-muted)]">
          Редактируешь записи за выбранный день. Не забудь нажать «Сохранить день».
        </p>
      )}

      <NutritionDayCard
        entry={entry}
        settings={settings}
        date={selectedDate}
        onPatch={patch}
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          {mainQuestsLabel}
        </h2>
        {mainQuests.map((q) => (
          <QuestCard
            key={q.id}
            quest={q}
            entry={entry}
            weekly={weekly}
            onPatch={patch}
          />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Средние квесты
        </h2>
        {mediumQuests.map((q) => (
          <QuestCard
            key={q.id}
            quest={q}
            entry={entry}
            weekly={weekly}
            onPatch={patch}
          />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Бонусные квесты
        </h2>
        {bonusQuests.map((q) => (
          <QuestCard
            key={q.id}
            quest={q}
            entry={entry}
            weekly={weekly}
            onPatch={patch}
          />
        ))}
      </section>

      <Card>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--app-text)]">Комментарий дня</span>
          <textarea
            value={entry.comment}
            onChange={(e) => patch({ comment: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-4 py-3 text-[var(--app-text)] focus:border-[var(--app-primary)] focus:outline-none"
            placeholder="Что получилось, что было сложно…"
          />
        </label>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--app-border)] bg-[var(--app-bg)]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1 text-xs text-[var(--app-text-muted)]">
            {dirty ? 'Есть изменения' : saveReaction ? 'Ход сохранён' : 'Готово к сохранению'}
          </div>
          <button
            type="button"
            data-testid="today-save-mobile"
            onClick={() => void saveDay()}
            disabled={saving || !dirty}
            className="btn-primary shrink-0 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-45"
          >
            {saveButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
