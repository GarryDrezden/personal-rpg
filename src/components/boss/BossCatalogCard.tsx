import { Link } from 'react-router-dom';
import { getBossTemplateById } from '../../constants/bosses';
import type { BossCatalogEntry } from '../../utils/bossCatalog';
import { BOSS_CATALOG_STATUS_LABELS } from '../../utils/bossCatalog';
import { BossPortrait } from './BossPortrait';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

function statusBadgeVariant(
  status: BossCatalogEntry['status'],
): 'default' | 'success' | 'gold' | 'danger' {
  switch (status) {
    case 'perfect':
      return 'gold';
    case 'defeated':
      return 'success';
    case 'active':
      return 'danger';
    case 'failed':
      return 'default';
    default:
      return 'default';
  }
}

type BossCatalogCardProps = {
  entry: BossCatalogEntry;
};

export function BossCatalogCard({ entry }: BossCatalogCardProps) {
  const template = getBossTemplateById(entry.templateId);
  const boss = entry.activeBoss;

  return (
    <Card
      className="h-full overflow-hidden"
      style={{
        borderColor:
          entry.status === 'active'
            ? `color-mix(in srgb, ${template.accent} 50%, var(--app-border))`
            : undefined,
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <BossPortrait
          imagePath={template.imagePath}
          emoji={template.avatarEmoji}
          title={template.title}
          accent={template.accent}
          size="lg"
          catalogStatus={entry.status}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--app-text)]">{template.title}</h3>
              <p className="text-sm text-[var(--app-text-muted)]">{template.subtitle}</p>
            </div>
            <Badge variant={statusBadgeVariant(entry.status)}>
              {BOSS_CATALOG_STATUS_LABELS[entry.status]}
            </Badge>
          </div>

          <p className="mb-3 text-sm text-[var(--app-text-muted)]">{template.description}</p>

          {entry.status === 'pending' && (
            <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-2 text-sm text-[var(--app-text-muted)]">
              Этот босс появится в одну из ваших недель. Пока он в тумане — готовьтесь заранее.
            </p>
          )}

          {entry.status !== 'pending' && (
            <div className="flex flex-wrap gap-3 text-xs text-[var(--app-text-muted)]">
              <span>Встреч: {entry.encounters}</span>
              <span>Побед: {entry.defeats}</span>
              {entry.perfects > 0 && <span>Идеальных: {entry.perfects}</span>}
            </div>
          )}

          {entry.status === 'active' && boss && (
            <div className="mt-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] p-3">
              <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
                <span>HP босса на этой неделе</span>
                <span>{boss.hpPercent}%</span>
              </div>
              <ProgressBar value={100 - boss.hpPercent} color="gold" className="h-2" />
              <Link
                to="/week"
                className="mt-3 inline-flex text-sm font-medium text-[var(--app-primary)] hover:underline"
              >
                К сражению на неделе →
              </Link>
            </div>
          )}

          {(entry.status === 'failed' || entry.status === 'pending') && (
            <p className="mt-3 text-xs text-[var(--app-text-muted)]">
              <span className="font-medium text-[var(--app-text)]">Как победить: </span>
              {template.defeatHint}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
