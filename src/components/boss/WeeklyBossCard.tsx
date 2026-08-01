import { Link } from 'react-router-dom';
import { Check, Leaf, Skull, Sprout, Swords } from 'lucide-react';
import type { WeeklyBoss } from '../../types/boss';
import {
  getThemedWeeklyThreatChrome,
  getThemedWeeklyThreatCopy,
  getThemedWeeklyThreatStatusLabel,
} from '../../game/themeWeeklyThreatPresentation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { BossPortrait } from './BossPortrait';
import { CozyArtPlaceholder } from '../game/CozyArtPlaceholder';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';

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

function hpBarColor(
  status: WeeklyBoss['status'],
  isCozy: boolean,
): 'danger' | 'success' | 'gold' {
  if (status === 'perfect') return 'gold';
  if (status === 'defeated') return 'success';
  return isCozy ? 'gold' : 'danger';
}

function cardGlow(status: WeeklyBoss['status'], isCozy: boolean): string {
  if (isCozy) {
    if (status === 'perfect') {
      return 'ring-2 ring-[color-mix(in_srgb,var(--app-sun)_45%,transparent)] bg-[color-mix(in_srgb,var(--app-sun)_12%,var(--app-card))]';
    }
    if (status === 'defeated') {
      return 'ring-2 ring-[color-mix(in_srgb,var(--app-garden)_40%,transparent)] bg-[color-mix(in_srgb,var(--app-garden)_10%,var(--app-card))]';
    }
    return 'bg-[color-mix(in_srgb,var(--app-oat)_55%,var(--app-card))]';
  }
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
  const { themeId, isCozy } = useAppTheme();
  const chrome = getThemedWeeklyThreatChrome(themeId);
  const copy = getThemedWeeklyThreatCopy(themeId, boss.templateId, {
    title: boss.title,
    subtitle: boss.subtitle,
    description: boss.description,
    accent: boss.accent,
  });
  const statusLabel = getThemedWeeklyThreatStatusLabel(themeId, boss.status);
  const completedCount = boss.conditions.filter((c) => c.completed).length;
  const won = boss.status === 'defeated' || boss.status === 'perfect';
  const isFull = variant === 'full';
  const TitleIcon = isCozy ? (isFull ? Leaf : Sprout) : isFull ? Skull : Swords;

  return (
    <Card className={cardGlow(boss.status, isCozy)} data-testid="weekly-boss-card">
      <div className={`flex gap-4 ${isFull ? 'flex-col sm:flex-row sm:items-start' : ''}`}>
        {isCozy ? (
          <CozyArtPlaceholder
            label={copy.title}
            layout={isFull ? 'portrait-lg' : 'portrait'}
            testId="weekly-threat-art"
            className={isFull ? 'mx-auto sm:mx-0' : ''}
          />
        ) : (
          <BossPortrait
            imagePath={boss.imagePath}
            emoji={boss.avatarEmoji}
            title={copy.title}
            accent={copy.accent}
            size={isFull ? 'xl' : 'md'}
            catalogStatus={
              boss.status === 'perfect'
                ? 'perfect'
                : boss.status === 'defeated'
                  ? 'defeated'
                  : undefined
            }
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TitleIcon
                  className={isCozy ? 'text-[var(--app-garden)]' : 'text-[var(--app-danger)]'}
                  size={isFull ? 22 : 20}
                />
                <h2 className={`font-bold text-[var(--app-text)] ${isFull ? 'text-2xl' : 'text-lg'}`}>
                  {copy.title}
                </h2>
              </div>
              <p className="text-sm text-[var(--app-text-muted)]">{copy.subtitle}</p>
            </div>
            {!isFull && (
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Link
                  to="/week"
                  className="text-sm font-medium text-[var(--app-primary)] hover:underline"
                >
                  {chrome.weekLink}
                </Link>
                <Link
                  to="/growth/trials"
                  className="text-xs text-[var(--app-text-muted)] hover:text-[var(--app-primary)] hover:underline"
                >
                  {chrome.allTrialsLink}
                </Link>
              </div>
            )}
          </div>

          {isFull && (
            <p className="mb-4 text-sm text-[var(--app-text-muted)]">{copy.description}</p>
          )}

          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
              {chrome.powerLabel}
            </span>
            <Badge variant={statusBadgeVariant(boss.status)}>{statusLabel}</Badge>
          </div>

          <ProgressBar value={boss.hpPercent} color={hpBarColor(boss.status, isCozy)} />
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            {chrome.powerStats(boss.hpPercent, completedCount, boss.conditions.length)}
          </p>
        </div>
      </div>

      <div className={`space-y-2 ${isFull ? 'mt-5' : 'mt-4'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          {chrome.conditionsLabel}
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
            {won ? chrome.rewardWon : chrome.rewardPending}
          </p>
          <p className="text-sm font-semibold text-[var(--app-text)]">
            +{boss.rewardXp} XP · +{boss.rewardCoins} 🪙
          </p>
          {boss.status === 'perfect' && (
            <p className="text-xs font-medium text-[var(--app-primary)]">{chrome.perfectBonus}</p>
          )}
        </div>
        {won && (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--app-success)_18%,var(--app-card-strong))] px-3 py-1 text-sm font-semibold text-[var(--app-success)]">
            {chrome.wonBadge(boss.status === 'perfect')}
          </span>
        )}
      </div>
    </Card>
  );
}
