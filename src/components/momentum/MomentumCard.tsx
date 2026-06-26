import { Link } from 'react-router-dom';
import { useAppTheme } from '../../hooks/useAppTheme';
import type { MomentumSummary } from '../../types/momentum';
import { getMomentumLevelThemeText } from '../../utils/momentumEngine';
import { Card } from '../ui/Card';

type MomentumCardProps = {
  summary: MomentumSummary;
  compact?: boolean;
  hasData?: boolean;
};

function formatMomentumValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function MomentumCard({
  summary,
  compact = false,
  hasData = true,
}: MomentumCardProps) {
  const { themeId, isDarkFantasy } = useAppTheme();
  const { currentValue, currentLevel, todayDelta, bonusMultiplier } = summary;

  const levelText = getMomentumLevelThemeText({
    levelId: currentLevel.id,
    themeId,
  });

  const cardGlow = isDarkFantasy
    ? 'border-violet-500/30 bg-[color-mix(in_srgb,var(--app-glow)_8%,var(--app-card))] shadow-[0_0_20px_rgba(167,139,250,0.1)]'
    : 'bg-[color-mix(in_srgb,var(--app-primary)_5%,var(--app-card))]';

  if (!hasData) {
    return (
      <Card className={cardGlow}>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Инерция режима</h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Инерция пока нейтральна. Внеси первый день — и система начнет набирать ход.
        </p>
        <Link
          to="/momentum"
          className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
        >
          Открыть историю инерции →
        </Link>
      </Card>
    );
  }

  const bonusText =
    levelText.bonusDescription ??
    levelText.helpDescription ??
    (bonusMultiplier > 1
      ? `+${Math.round((bonusMultiplier - 1) * 100)}% XP за дневные квесты`
      : undefined);

  const scalePercent = ((currentValue - -100) / 200) * 100;

  if (compact) {
    return (
      <Card className={cardGlow}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
              Инерция режима
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                {currentLevel.icon}
              </span>
              <p className="text-2xl font-bold text-[var(--app-primary)]">
                {formatMomentumValue(currentValue)}
              </p>
            </div>
            <p className="mt-1 font-medium text-[var(--app-text)]">{levelText.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]">
              {levelText.description}
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
          <div
            className="h-full rounded-full bg-[var(--app-primary)] transition-all"
            style={{ width: `${scalePercent}%` }}
          />
        </div>
        <Link
          to="/momentum"
          className="mt-3 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
        >
          Открыть историю инерции →
        </Link>
      </Card>
    );
  }

  return (
    <Card className={cardGlow}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Инерция режима</h2>
        </div>
        <span className="text-3xl" aria-hidden>
          {currentLevel.icon}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <p className="text-4xl font-bold text-[var(--app-primary)]">
          {formatMomentumValue(currentValue)}
        </p>
        <div className="mb-1">
          <p className="font-semibold text-[var(--app-text)]">{levelText.title}</p>
          {todayDelta !== 0 && (
            <p className="text-sm text-[var(--app-text-muted)]">
              Сегодня: {todayDelta > 0 ? '+' : ''}
              {todayDelta}
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
        {levelText.description}
      </p>

      <div className="relative mt-4">
        <div className="mb-1 flex justify-between text-[10px] text-[var(--app-text-muted)]">
          <span>−100</span>
          <span>0</span>
          <span>+100</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-amber-400/70 via-emerald-400/80 to-[var(--app-primary)] transition-all"
            style={{ width: `${scalePercent}%` }}
          />
        </div>
      </div>

      {bonusText && (
        <div className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            {levelText.bonusDescription ? 'Бонус' : 'Поддержка'}
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{bonusText}</p>
        </div>
      )}

      <Link
        to="/momentum"
        className="mt-4 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
      >
        Открыть историю инерции →
      </Link>
    </Card>
  );
}
