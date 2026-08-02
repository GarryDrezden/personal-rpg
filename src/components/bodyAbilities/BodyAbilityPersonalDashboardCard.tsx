import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getThemedBodyAbilityPresentation } from '../../game/bodyAbilityThemePresentation';
import { getPersonalBodyAbilitySummary } from '../../utils/bodyAbilityPersonalEngine';

export function BodyAbilityPersonalDashboardCard() {
  const settings = useAppStore((s) => s.settings);
  const { themeId } = useAppTheme();
  const summary = getPersonalBodyAbilitySummary(settings);

  if (!summary.configured) {
    return (
      <section
        data-testid="body-ability-personal-dashboard"
        className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
          Свобода тела
        </p>
        <p className="mt-1 text-sm text-[var(--app-text)]">Настрой карту тела</p>
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          Игра выберет 20–30 релевантных изменений из большого банка.
        </p>
        <Link
          to="/freedom"
          className="mt-2 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          Настроить карту →
        </Link>
      </section>
    );
  }

  const next = summary.nextSuggested ?? summary.nextAuto;
  const presentation = next
    ? getThemedBodyAbilityPresentation(themeId, next.id, next)
    : null;

  return (
    <section
      data-testid="body-ability-personal-dashboard"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            Свобода тела
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--app-text)]">
            Открыто {summary.unlockedCount} / {summary.selectedCount}
          </p>
        </div>
        <Link
          to="/freedom"
          className="shrink-0 text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          Открыть карту
        </Link>
      </div>
      {presentation ? (
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          {summary.nextSuggested ? 'Проверь: ' : 'Ближайшее по данным: '}
          {presentation.title}
        </p>
      ) : (
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">{summary.progressLine}</p>
      )}
    </section>
  );
}
