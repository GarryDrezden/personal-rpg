import { Link } from 'react-router-dom';
import type { FreedomScoreResult } from '../../types/freedomScore';
import type { MomentumSummary } from '../../types/momentum';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getMomentumLevelThemeText } from '../../utils/momentumEngine';
import { getWeekStatus } from '../../utils/points';
import { Card } from '../ui/Card';

type CompactStatusGridProps = {
  momentum: MomentumSummary;
  momentumHasData: boolean;
  freedom: FreedomScoreResult;
  freedomHasData: boolean;
  weekTotal: number;
  weekPercent: number;
  weekGoal: number;
  latestUnlock?: {
    title: string;
    subtitle: string;
    href: string;
    linkLabel: string;
  } | null;
};

function formatMomentumValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function CompactStatusGrid({
  momentum,
  momentumHasData,
  freedom,
  freedomHasData,
  weekTotal,
  weekPercent,
  weekGoal,
  latestUnlock,
}: CompactStatusGridProps) {
  const { themeId, isDarkFantasy } = useAppTheme();
  const momentumText = getMomentumLevelThemeText({
    levelId: momentum.currentLevel.id,
    themeId,
  });

  const cardClass = isDarkFantasy
    ? 'border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-glow)_6%,var(--app-card))]'
    : 'border-[var(--app-border)] bg-[var(--app-card)]';

  return (
    <section data-testid="dashboard-compact-status-grid" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Инерция
        </p>
        {momentumHasData ? (
          <>
            <p className="mt-2 text-xl font-bold text-[var(--app-primary)]">
              {formatMomentumValue(momentum.currentValue)} · {momentumText.title}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]">
              {momentumText.description}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Внеси первый день — система начнёт набирать ход.
          </p>
        )}
        <Link to="/momentum" className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline">
          Открыть историю →
        </Link>
      </Card>

      <Card className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Свобода тела
        </p>
        {freedomHasData ? (
          <>
            <p className="mt-2 text-xl font-bold text-[var(--app-primary)]">
              {freedom.score}% · {freedom.title}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]">
              {freedom.description}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--app-text-muted)]">
            Добавь вес, калории или шаги — индекс начнёт собираться.
          </p>
        )}
        <Link to="/freedom" className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline">
          Подробнее →
        </Link>
      </Card>

      <Card className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Неделя
        </p>
        <p className="mt-2 text-xl font-bold text-[var(--app-text)]">
          {weekTotal} / {weekGoal} XP
        </p>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          {Math.min(100, weekPercent)}% · {getWeekStatus(weekPercent)}
        </p>
        <Link to="/week" className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline">
          Открыть неделю →
        </Link>
      </Card>

      <Card className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          {latestUnlock ? 'Последнее открытие' : 'Коллекции'}
        </p>
        {latestUnlock ? (
          <>
            <p className="mt-2 font-semibold text-[var(--app-text)]">{latestUnlock.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]">
              {latestUnlock.subtitle}
            </p>
            <Link
              to={latestUnlock.href}
              className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
            >
              {latestUnlock.linkLabel}
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Стадии, спутники, мобы, боссы и артефакты — в кодексе пути.
            </p>
            <Link to="/codex" className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline">
              Открыть кодекс →
            </Link>
          </>
        )}
      </Card>
    </section>
  );
}
