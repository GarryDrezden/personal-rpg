import { Link } from 'react-router-dom';
import type { NearestRewardInfo } from '../../types/currency';
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
  return (
    <Card className="relative overflow-hidden border-amber-200/70 bg-gradient-to-br from-amber-100/80 via-yellow-50 to-white shadow-md shadow-amber-100/50">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-300/30 blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/60 text-xl shadow-inner ring-2 ring-amber-100">
              🪙
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-900">Банк наград</p>
              <p className="text-xs text-rpg-muted">Монеты · можно потратить</p>
            </div>
          </div>
          <Link
            to="/rewards"
            className="rounded-xl border border-amber-300/80 bg-white/90 px-3 py-1.5 text-sm font-medium text-amber-900 shadow-sm hover:bg-amber-50"
          >
            Магазин →
          </Link>
        </div>

        <p className="text-3xl font-bold text-amber-900 drop-shadow-sm">
          {availableCoins.toLocaleString('ru')}
          <span className="ml-1 text-lg font-semibold text-amber-700">🪙</span>
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-white/70 px-3 py-2">
            <p className="text-rpg-muted">Заработано за неделю</p>
            <p className="font-bold text-emerald-700">+{weekEarned} 🪙</p>
          </div>
          <div className="rounded-xl bg-white/70 px-3 py-2">
            <p className="text-rpg-muted">Потрачено</p>
            <p className="font-bold text-stone-700">{totalSpent.toLocaleString('ru')} 🪙</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-stone-700">
          {nearestAffordable && (
            <p>
              Ближайшая доступная:{' '}
              <span className="font-semibold text-amber-900">{nearestAffordable.title}</span>{' '}
              ({nearestAffordable.cost} 🪙)
            </p>
          )}
          {nearestUnaffordable && (
            <p className="text-rpg-muted">
              Следующая цель: {nearestUnaffordable.title} — не хватает{' '}
              <span className="font-semibold text-amber-800">
                {nearestUnaffordable.missing} 🪙
              </span>
            </p>
          )}
          {!nearestAffordable && !nearestUnaffordable && (
            <p className="text-rpg-muted">Добавьте награды в магазине</p>
          )}
        </div>
      </div>
    </Card>
  );
}
