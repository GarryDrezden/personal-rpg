import { useEffect, useMemo, useState } from 'react';
import type { DailyEntry } from '../types';
import { useAppStore, emptyDaily } from '../store/appStore';
import { todayISO, formatDateFull } from '../utils/dates';
import { calcDailyPoints, getWeeklySettingsForDate, getDayStatus } from '../utils/points';
import { previewDailyCoins } from '../utils/coinEngine';
import { getDailyQuests, getQuestCompletionStats, isDayEmpty } from '../utils/questEngine';
import { getRecoveryState, shouldShowRecoveryCard } from '../utils/recoveryEngine';
import { RecoveryCard } from '../components/recovery/RecoveryCard';
import { QuestCard } from '../components/quests/QuestCard';
import { CARD_ACCENT } from '../constants/cardTheme';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

export function TodayPage() {
  const { dailyEntries, settings, updateDaily, deleteDaily } = useAppStore();
  const today = todayISO();
  const existing = dailyEntries.find((e) => e.date === today);
  const [entry, setEntry] = useState<DailyEntry>(existing ?? emptyDaily(today));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (existing) {
      setEntry(existing);
      setDirty(false);
    }
  }, [existing]);

  const entriesForQuests = useMemo(() => {
    const others = dailyEntries.filter((e) => e.date !== today);
    return [...others, entry];
  }, [dailyEntries, entry, today]);

  const weekly = getWeeklySettingsForDate(today, settings);
  const quests = useMemo(
    () =>
      getDailyQuests({
        date: today,
        dailyEntries: entriesForQuests,
        settings,
      }),
    [today, entriesForQuests, settings],
  );

  const stats = getQuestCompletionStats(quests);
  const points = calcDailyPoints(entry, settings);
  const coins = previewDailyCoins(entry, settings);
  const dayStatus = getDayStatus(points);
  const dayEmpty = isDayEmpty(existing) && isDayEmpty(entry);
  const showRecovery = shouldShowRecoveryCard({
    today,
    dailyEntries: entriesForQuests,
    settings,
    todayEntry: entry,
  });
  const recoveryState = getRecoveryState({
    today,
    dailyEntries: entriesForQuests,
    settings,
    todayEntry: entry,
  });
  const mainQuestsLabel =
    recoveryState === 'after_bad_day' ? 'Минимальный набор' : 'Основные квесты';

  const mainQuests = quests.filter((q) => q.category === 'main');
  const mediumQuests = quests.filter((q) => q.category === 'medium');
  const bonusQuests = quests.filter((q) => q.category === 'bonus');

  const patch = (partial: Partial<DailyEntry>) => {
    setEntry((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  };

  const saveDay = async () => {
    setSaving(true);
    try {
      await updateDaily(entry);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const resetToday = async () => {
    if (!existing) return;
    if (!confirm('Сбросить все данные за сегодня?')) return;
    setSaving(true);
    try {
      await deleteDaily(today);
      setEntry(emptyDaily(today));
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Квесты дня</h1>
          <p className="text-sm text-[var(--app-text-muted)]">{formatDateFull(today)}</p>
          <p className="mt-1 text-sm font-medium text-[var(--app-primary)]">{dayStatus}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {dirty && (
            <span className="text-xs text-amber-700">Есть несохранённые изменения</span>
          )}
          <button
            type="button"
            onClick={() => void saveDay()}
            disabled={saving || !dirty}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-amber-600"
          >
            {saving ? 'Сохранение…' : 'Сохранить день'}
          </button>
          {existing && (
            <button
              type="button"
              onClick={() => void resetToday()}
              disabled={saving}
              className="text-sm text-danger hover:underline disabled:opacity-50"
            >
              Сбросить день
            </button>
          )}
        </div>
      </header>

      {showRecovery && (
        <RecoveryCard
          today={today}
          dailyEntries={entriesForQuests}
          settings={settings}
          todayEntry={entry}
          showLink={false}
        />
      )}

      <Card className={CARD_ACCENT.primary}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Очки дня (XP)</p>
            <p className="text-3xl font-bold text-[var(--app-primary)]">+{Math.max(0, points)}</p>
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

      {dayEmpty && recoveryState === 'normal' && (
        <p className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
          День ещё пустой. Начни с одного квеста — калории, шаги или день без алкоголя.
        </p>
      )}

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
    </div>
  );
}
