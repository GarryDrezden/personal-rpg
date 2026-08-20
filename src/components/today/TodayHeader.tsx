import { formatDateFull } from '../../utils/dates';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayHeaderProps = {
  model: TodayPageModel;
};

export function TodayHeader({ model }: TodayHeaderProps) {
  const {
    selectedDate,
    isEditingToday,
    isCurrentWeek,
    derived,
    dirty,
    saving,
    existing,
    routeWelcome,
    setRouteWelcome,
    saveDay,
    resetDay,
  } = model;

  return (
    <>
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
          <h1 className="text-2xl font-bold text-[var(--app-text)]">{derived.title}</h1>
          <p className="text-sm text-[var(--app-text-muted)]">{formatDateFull(selectedDate)}</p>
          {!isEditingToday && (
            <p className="mt-1 text-xs font-medium text-[var(--app-warning)]">
              {isCurrentWeek
                ? 'Редактирование прошлого дня недели'
                : 'Заполнение прошлой недели — данные сохранятся и пересчитают прогресс'}
            </p>
          )}
          <p className="mt-1 text-sm font-medium text-[var(--app-primary)]">{derived.dayStatus}</p>
          {derived.modeCaption ? (
            <p className="mt-1 text-xs text-[var(--app-gold)]">{derived.modeCaption}</p>
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
            {derived.saveButtonLabel}
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
    </>
  );
}

export function TodayMobileSaveBar({ model }: TodayHeaderProps) {
  const { dirty, saving, saveReaction, derived, saveDay } = model;
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 border-t border-[var(--app-border)] bg-[var(--app-bg)]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
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
          {derived.saveButtonLabel}
        </button>
      </div>
    </div>
  );
}
