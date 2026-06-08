import { Link } from 'react-router-dom';
import type { NearestRewardInfo } from '../../types/currency';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';

type RewardsBankCardProps = {
  availableCoins: number;
  weekEarned: number;
  totalSpent: number;
  nearestAffordable: NearestRewardInfo;
  nearestUnaffordable: NearestRewardInfo;
};

export function RewardsBankCard({
  availableCoins,
  weekEarned,
  totalSpent,
  nearestAffordable,
  nearestUnaffordable,
}: RewardsBankCardProps) {
  const { isDarkFantasy } = useAppTheme();

  return (
    <Card
      className={`relative overflow-hidden border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))] ${
        isDarkFantasy ? 'hero-glow' : 'shadow-md'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--app-glow)] blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-xl shadow-inner ring-2 ring-[color-mix(in_srgb,var(--app-primary)_20%,transparent)]">
              🪙
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--app-text)]">Банк наград</p>
              <p className="text-xs text-[var(--app-text-muted)]">Монеты · можно потратить</p>
            </div>
          </div>
          <Link
            to="/rewards"
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-sm font-medium text-[var(--app-primary)] hover:brightness-[1.03]"
          >
            Магазин →
          </Link>
        </div>

        <p className="text-3xl font-bold text-[var(--app-primary)] drop-shadow-sm">
          {availableCoins.toLocaleString('ru')}
          <span className="ml-1 text-lg font-semibold">🪙</span>
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-[var(--app-card-strong)] px-3 py-2">
            <p className="text-[var(--app-text-muted)]">Заработано за неделю</p>
            <p className="font-bold text-[var(--app-success)]">+{weekEarned} 🪙</p>
          </div>
          <div className="rounded-xl bg-[var(--app-card-strong)] px-3 py-2">
            <p className="text-[var(--app-text-muted)]">Потрачено</p>
            <p className="font-bold text-[var(--app-text)]">{totalSpent.toLocaleString('ru')} 🪙</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-[var(--app-text)]">
          {nearestAffordable && (
            <p>
              Ближайшая доступная:{' '}
              <span className="font-semibold text-[var(--app-primary)]">{nearestAffordable.title}</span>{' '}
              ({nearestAffordable.cost} 🪙)
            </p>
          )}
          {nearestUnaffordable && (
            <p className="text-[var(--app-text-muted)]">
              Следующая цель: {nearestUnaffordable.title} — не хватает{' '}
              <span className="font-semibold text-[var(--app-primary)]">
                {nearestUnaffordable.missing} 🪙
              </span>
            </p>
          )}
          {!nearestAffordable && !nearestUnaffordable && (
            <p className="text-[var(--app-text-muted)]">Добавьте награды в магазине</p>
          )}
        </div>
      </div>
    </Card>
  );
}
