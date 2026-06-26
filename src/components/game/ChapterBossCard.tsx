import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getBossMeta, getArtifactMeta } from '../../game/assetRegistry';
import { Card } from '../ui/Card';
import { GameAssetImage } from './GameAssetImage';

type ChapterBossCardProps = {
  bossId: BossId;
  chapter?: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
  compact?: boolean;
};

const statusLabel = {
  locked: 'Закрыта',
  active: 'Текущая глава',
  defeated: 'Пройдена',
} as const;

export function ChapterBossCard({
  bossId,
  chapter,
  status = 'active',
  compact = false,
}: ChapterBossCardProps) {
  const meta = getBossMeta(bossId);
  const imageStatus = status === 'locked' ? 'locked' : status === 'active' ? 'current' : 'unlocked';

  return (
    <Card data-testid="chapter-boss-card" className={compact ? 'p-4' : ''}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Босс главы
        </p>
        <span className="rounded-full bg-[var(--app-bg-soft)] px-2 py-0.5 text-[10px] text-[var(--app-text-muted)]">
          {statusLabel[status]}
        </span>
      </div>
      <div className={`mt-3 flex gap-4 ${compact ? 'items-center' : 'flex-col sm:flex-row'}`}>
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-b from-violet-950/20 to-[var(--app-bg-soft)] ${
            compact ? 'h-36 w-36' : 'h-44 w-44'
          }`}
        >
          <GameAssetImage
            variant="boss"
            src={meta.image}
            alt={meta.title}
            status={imageStatus}
            className="h-full w-full"
            imageClassName="object-contain"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--app-text)]">{meta.title}</h3>
          <p className="text-xs text-[var(--app-primary)]">
            {chapter ? `Глава ${chapter}` : meta.subtitle}
          </p>
          {!compact && (
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{meta.description}</p>
          )}
          {meta.rewardArtifactId && (
            <p className="mt-2 text-xs text-[var(--app-text-muted)]">
              Награда: {getArtifactMeta(meta.rewardArtifactId).title}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
