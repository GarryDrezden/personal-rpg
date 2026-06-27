import { Link } from 'react-router-dom';
import type { WeeklyBoss } from '../../types/boss';
import { BOSS_STATUS_LABELS } from '../../types/boss';
import { BossPortrait } from './BossPortrait';
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
    return 'ring-2 ring-[color-mix(in_srgb,var(--app-primary)_50%,transparent)] hero-glow bg-[color-mix(in_srgb,var(--app-primary)_10%,var(--app-card))]';
  }
  if (status === 'defeated') {
    return 'ring-2 ring-[color-mix(in_srgb,var(--app-success)_45%,transparent)] bg-[color-mix(in_srgb,var(--app-success)_10%,var(--app-card))]';
  }
  return 'bg-[color-mix(in_srgb,var(--app-danger)_8%,var(--app-card))]';
}

function ConditionRow({ condition }: { condition: WeeklyBoss['conditions'][number] }) {
  const pct =
    condition.target > 0
      ? Math.min(100, Math.round((condition.current / condition.target) * 100))
      : condition.completed
        ? 100
        : 0;

  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="text-lg leading-none">{condition.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--app-text)]">{condition.title}</p>
            <p className="truncate text-xs text-[var(--app-text-muted)]">{condition.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {condition.completed ? (
            <Check className="text-[var(--app-success)]" size={16} />
          ) : (
            <span className="text-xs font-semibold text-[var(--app-text)]">
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
        <BossPortrait
          imagePath={boss.imagePath}
          emoji={boss.avatarEmoji}
          title={boss.title}
          accent={boss.accent}
          size={isFull ? 'xl' : 'md'}
          catalogStatus={
            boss.status === 'perfect'
              ? 'perfect'
              : boss.status === 'defeated'
                ? 'defeated'
                : undefined
          }
        />

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {isFull ? (
                  <Skull className="text-[var(--app-danger)]" size={22} />
                ) : (
                  <Swords className="text-[var(--app-danger)]" size={20} />
                )}
                <h2 className={`font-bold text-[var(--app-text)] ${isFull ? 'text-2xl' : 'text-lg'}`}>
                  {boss.title}
                </h2>
              </div>
              <p className="text-sm text-[var(--app-text-muted)]">{boss.subtitle}</p>
            </div>
            {!isFull && (
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Link
                  to="/week"
                  className="text-sm font-medium text-[var(--app-primary)] hover:underline"
                >
                  Неделя →
                </Link>
                <Link
                  to="/bosses"
                  className="text-xs text-[var(--app-text-muted)] hover:text-[var(--app-primary)] hover:underline"
                >
                  Все испытания
                </Link>
              </div>
            )}
          </div>

          {isFull && (
            <p className="mb-4 text-sm text-[var(--app-text-muted)]">{boss.description}</p>
          )}

          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              HP босса
            </span>
            <Badge variant={statusBadgeVariant(boss.status)}>
              {BOSS_STATUS_LABELS[boss.status]}
            </Badge>
          </div>

          <ProgressBar value={boss.hpPercent} color={hpBarColor(boss.status)} />
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            {boss.hpPercent}% здоровья · {completedCount}/{boss.conditions.length} условий
          </p>
        </div>
      </div>

      <div className={`space-y-2 ${isFull ? 'mt-5' : 'mt-4'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Условия победы
        </p>
        {(isFull ? boss.conditions : boss.conditions.slice(0, 3)).map((c) => (
          <ConditionRow key={c.id} condition={c} />
        ))}
        {!isFull && boss.conditions.length > 3 && (
          <p className="text-center text-xs text-[var(--app-text-muted)]">
            +{boss.conditions.length - 3} условий на странице недели
          </p>
        )}
      </div>

      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--app-border)] px-4 py-3 ${
          won
            ? 'bg-[color-mix(in_srgb,var(--app-success)_12%,var(--app-card-strong))]'
            : 'bg-[var(--app-card-strong)]'
        }`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {won ? 'Награда' : 'Награда за победу'}
          </p>
          <p className="text-sm font-semibold text-[var(--app-text)]">
            +{boss.rewardXp} XP · +{boss.rewardCoins} 🪙
          </p>
          {boss.status === 'perfect' && (
            <p className="text-xs font-medium text-[var(--app-primary)]">
              Идеальная победа — бонусная награда
            </p>
          )}
        </div>
        {won && (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] px-3 py-1 text-sm font-semibold text-[var(--app-success)]">
            {boss.status === 'perfect' ? 'Идеально!' : 'Победа!'}
          </span>
        )}
      </div>
    </Card>
  );
}
