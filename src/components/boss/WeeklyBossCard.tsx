import { Link } from 'react-router-dom';
import type { WeeklyBoss } from '../../types/boss';
import { BOSS_STATUS_LABELS } from '../../types/boss';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Check, Skull, Swords } from 'lucide-react';

type WeeklyBossCardProps = {
  boss: WeeklyBoss;
  variant?: 'compact' | 'full';
};

function statusBadgeVariant(
  status: WeeklyBoss['status'],
): 'default' | 'success' | 'gold' | 'danger' {
  switch (status) {
    case 'defeated':
      return 'success';
    case 'perfect':
      return 'gold';
    case 'wounded':
      return 'danger';
    default:
      return 'default';
  }
}

function hpBarColor(status: WeeklyBoss['status']): 'danger' | 'success' | 'gold' {
  if (status === 'perfect') return 'gold';
  if (status === 'defeated') return 'success';
  return 'danger';
}

function cardGlow(status: WeeklyBoss['status']): string {
  if (status === 'perfect') {
    return 'ring-2 ring-yellow-400/60 shadow-[0_0_24px_rgba(234,179,8,0.35)] bg-gradient-to-br from-amber-50 via-white to-yellow-50/80';
  }
  if (status === 'defeated') {
    return 'ring-2 ring-emerald-400/50 bg-gradient-to-br from-emerald-50/80 via-white to-stone-50';
  }
  return 'bg-gradient-to-br from-red-50/60 via-white to-stone-50';
}

function ConditionRow({ condition }: { condition: WeeklyBoss['conditions'][number] }) {
  const pct =
    condition.target > 0
      ? Math.min(100, Math.round((condition.current / condition.target) * 100))
      : condition.completed
        ? 100
        : 0;

  return (
    <div className="rounded-xl border border-rpg-border bg-white/80 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-lg leading-none">{condition.icon}</span>
          <div className="min-w-0">
            <p className="font-medium text-sm">{condition.title}</p>
            <p className="text-xs text-rpg-muted truncate">{condition.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {condition.completed ? (
            <Check className="text-success" size={16} />
          ) : (
            <span className="text-xs font-semibold text-stone-600">
              {condition.current}/{condition.target}
            </span>
          )}
        </div>
      </div>
      {!condition.completed && (
        <ProgressBar value={pct} color="gold" className="mt-2 h-1.5" />
      )}
    </div>
  );
}

export function WeeklyBossCard({ boss, variant = 'compact' }: WeeklyBossCardProps) {
  const completedCount = boss.conditions.filter((c) => c.completed).length;
  const won = boss.status === 'defeated' || boss.status === 'perfect';
  const isFull = variant === 'full';

  return (
    <Card className={cardGlow(boss.status)}>
      <div className={`flex gap-4 ${isFull ? 'flex-col sm:flex-row sm:items-start' : ''}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl bg-stone-900/5 ${
            isFull ? 'h-28 w-28 text-6xl' : 'h-16 w-16 text-4xl'
          }`}
        >
          {boss.avatarEmoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {isFull ? (
                  <Skull className="text-danger" size={22} />
                ) : (
                  <Swords className="text-danger" size={20} />
                )}
                <h2 className={`font-bold ${isFull ? 'text-2xl' : 'text-lg'}`}>{boss.title}</h2>
              </div>
              <p className="text-sm text-rpg-muted">{boss.subtitle}</p>
            </div>
            {!isFull && (
              <Link to="/week" className="text-sm font-medium text-gold hover:underline shrink-0">
                Открыть неделю →
              </Link>
            )}
          </div>

          {isFull && <p className="mb-4 text-sm text-stone-700">{boss.description}</p>}

          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
              HP босса
            </span>
            <Badge variant={statusBadgeVariant(boss.status)}>
              {BOSS_STATUS_LABELS[boss.status]}
            </Badge>
          </div>

          <ProgressBar value={boss.hpPercent} color={hpBarColor(boss.status)} />
          <p className="mt-1 text-xs text-rpg-muted">
            {boss.hpPercent}% здоровья · {completedCount}/{boss.conditions.length} условий
          </p>
        </div>
      </div>

      <div className={`space-y-2 ${isFull ? 'mt-5' : 'mt-4'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
          Условия победы
        </p>
        {(isFull ? boss.conditions : boss.conditions.slice(0, 3)).map((c) => (
          <ConditionRow key={c.id} condition={c} />
        ))}
        {!isFull && boss.conditions.length > 3 && (
          <p className="text-center text-xs text-rpg-muted">
            +{boss.conditions.length - 3} условий на странице недели
          </p>
        )}
      </div>

      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rpg-border px-4 py-3 ${
          won ? 'bg-emerald-50/60' : 'bg-stone-50/80'
        }`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rpg-muted">
            {won ? 'Награда' : 'Награда за победу'}
          </p>
          <p className="text-sm font-semibold">
            +{boss.rewardXp} XP · +{boss.rewardCoins} 🪙
          </p>
          {boss.status === 'perfect' && (
            <p className="text-xs text-gold font-medium">Идеальная победа — бонусная награда</p>
          )}
        </div>
        {won && (
          <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
            {boss.status === 'perfect' ? 'Идеально!' : 'Победа!'}
          </span>
        )}
      </div>
    </Card>
  );
}
