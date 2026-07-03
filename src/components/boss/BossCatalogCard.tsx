import { Link } from 'react-router-dom';
import { CloudFog, ScrollText, Skull, Swords } from 'lucide-react';
import { getBossTemplateById } from '../../constants/bosses';
import type { BossCatalogEntry } from '../../utils/bossCatalog';
import { BossPortrait } from './BossPortrait';
import {
  DEFEAT_HINT_LABEL,
  FOG_CALLOUT,
  FOG_PENDING_TEXT,
  TRIALS_CARD,
  TRIALS_FEATURED,
  TRIALS_STATUS_LABELS,
} from './trialsUi';

function ThreatProgressBar({
  value,
  className = 'h-2',
  tone = 'danger',
}: {
  value: number;
  className?: string;
  tone?: 'danger' | 'gold' | 'success';
}) {
  const barClass =
    tone === 'gold'
      ? 'bg-gradient-to-r from-[var(--app-gold)]/55 to-amber-400/45'
      : tone === 'success'
        ? 'bg-gradient-to-r from-emerald-500/50 to-[var(--app-gold)]/35'
        : 'bg-gradient-to-r from-red-500/50 to-[var(--app-gold)]/30';

  return (
    <div
      className={`overflow-hidden rounded-full bg-[var(--app-bg-soft)]/50 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function statusPill(status: BossCatalogEntry['status']) {
  const styles: Record<BossCatalogEntry['status'], string> = {
    pending: 'border-violet-500/25 bg-violet-950/30 text-violet-200/60',
    active: 'border-red-400/35 bg-red-950/35 text-red-200/85',
    failed: 'border-violet-500/20 bg-[#14101c]/80 text-[var(--app-text-muted)]/70',
    defeated: 'border-emerald-400/30 bg-emerald-950/25 text-emerald-200/80',
    perfect: 'border-[var(--app-gold)]/35 bg-[#18120a]/50 text-[var(--app-gold)]/90',
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {TRIALS_STATUS_LABELS[status]}
    </span>
  );
}

type FeaturedWeeklyBossCardProps = {
  entry: BossCatalogEntry;
};

export function FeaturedWeeklyBossCard({ entry }: FeaturedWeeklyBossCardProps) {
  const template = getBossTemplateById(entry.templateId);
  const boss = entry.activeBoss;
  if (!boss) return null;

  const damageDealt = 100 - boss.hpPercent;

  return (
    <article className={`${TRIALS_FEATURED} p-4 sm:p-6`} data-testid="featured-weekly-boss">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(239,68,68,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/25 to-transparent"
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start">
        <BossPortrait
          imagePath={template.imagePath}
          emoji={template.avatarEmoji}
          title={template.title}
          accent={template.accent}
          size="xl"
          catalogStatus="active"
          className="mx-auto shrink-0 lg:mx-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300/55">
                Угроза недели
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Skull className="h-5 w-5 shrink-0 text-red-300/75" strokeWidth={1.5} />
                <h2 className="text-xl font-bold text-[var(--app-text)] sm:text-2xl">
                  {template.title}
                </h2>
              </div>
              <p className="mt-1 text-sm font-medium text-red-200/55">{template.subtitle}</p>
            </div>
            {statusPill('active')}
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]/80">
            {template.description}
          </p>

          <div className="mt-5 rounded-xl border border-red-400/15 bg-[#0e0c14]/50 px-4 py-3.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/70">
                Сила угрозы
              </span>
              <span className="text-sm font-bold text-[var(--app-text)]">{boss.hpPercent}%</span>
            </div>
            <ThreatProgressBar value={boss.hpPercent} tone="danger" className="h-2.5" />
            <p className="mt-2 text-xs text-[var(--app-text-muted)]/65">
              Маршрут ослабил угрозу на {damageDealt}% · условий закрыто{' '}
              {boss.conditions.filter((c) => c.completed).length}/{boss.conditions.length}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/week"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/35 px-5 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105"
            >
              <Swords className="h-4 w-4 text-[var(--app-gold)]/85" strokeWidth={1.5} />
              Перейти к испытанию недели
            </Link>
            <span className="self-center text-xs text-[var(--app-text-muted)]/55">
              +{boss.rewardXp} XP · +{boss.rewardCoins} монет за удержание маршрута
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

type ArchiveBossCodexCardProps = {
  entry: BossCatalogEntry;
};

export function ArchiveBossCodexCard({ entry }: ArchiveBossCodexCardProps) {
  const template = getBossTemplateById(entry.templateId);
  const isPending = entry.status === 'pending';

  return (
    <article className={`${TRIALS_CARD} flex h-full flex-col p-4`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/10 to-transparent" />

      <div className="flex items-start gap-3">
        <BossPortrait
          imagePath={template.imagePath}
          emoji={template.avatarEmoji}
          title={template.title}
          accent={template.accent}
          size="md"
          catalogStatus={entry.status}
          className="shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-[var(--app-text)]">{template.title}</h3>
              <p className="mt-0.5 text-xs font-medium text-violet-200/45">{template.subtitle}</p>
            </div>
            {statusPill(entry.status)}
          </div>

          {isPending ? (
            <div className={`${FOG_CALLOUT} mt-3 flex items-start gap-2`}>
              <CloudFog className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300/40" strokeWidth={1.5} />
              <span>{FOG_PENDING_TEXT}</span>
            </div>
          ) : entry.status !== 'active' ? (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--app-text-muted)]/60">
              <span>Недель в бою: {entry.encounters}</span>
              <span>Побед: {entry.defeats}</span>
              {entry.perfects > 0 ? <span>Идеальных: {entry.perfects}</span> : null}
            </div>
          ) : null}

          {(entry.status === 'failed' || entry.status === 'pending') && (
            <div className="mt-3 border-t border-violet-500/10 pt-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/50">
                <ScrollText className="h-3 w-3" strokeWidth={1.5} />
                {DEFEAT_HINT_LABEL}
              </p>
              <p className="mt-1 text-xs leading-snug text-[var(--app-text-muted)]/70">
                {template.defeatHint}
              </p>
            </div>
          )}

          {entry.status === 'defeated' || entry.status === 'perfect' ? (
            <p className="mt-3 text-xs leading-snug text-[var(--app-text-muted)]/55">
              {entry.status === 'perfect'
                ? 'Маршрут удержан с идеальной чистотой.'
                : 'Угроза отступила — маршрут выдержал испытание.'}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** @deprecated Use FeaturedWeeklyBossCard or ArchiveBossCodexCard */
export function BossCatalogCard({ entry }: { entry: BossCatalogEntry }) {
  if (entry.status === 'active') {
    return <FeaturedWeeklyBossCard entry={entry} />;
  }
  return <ArchiveBossCodexCard entry={entry} />;
}
