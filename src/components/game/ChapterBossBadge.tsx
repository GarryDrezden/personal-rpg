import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getArtifactMeta, getBossMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

type ChapterBossBadgeProps = {
  bossId: BossId;
  chapter: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
};

const statusLabel = {
  locked: 'Закрыта',
  active: 'Текущая',
  defeated: 'Пройдена',
} as const;

export function ChapterBossBadge({
  bossId,
  chapter,
  status = 'active',
}: ChapterBossBadgeProps) {
  const meta = getBossMeta(bossId);
  const imageStatus = status === 'locked' ? 'locked' : status === 'active' ? 'current' : 'unlocked';
  const reward = meta.rewardArtifactId ? getArtifactMeta(meta.rewardArtifactId).title : null;

  return (
    <div
      data-testid="chapter-boss-badge"
      className="flex items-center gap-3 rounded-xl border border-violet-500/25 bg-[color-mix(in_srgb,#7c3aed_8%,var(--app-card))] p-3"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/25">
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
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Босс главы · {statusLabel[status]}
        </p>
        <p className="truncate text-sm font-semibold text-[var(--app-text)]">{meta.title}</p>
        <p className="truncate text-xs text-[var(--app-text-muted)]">
          Глава {chapter}
          {reward ? ` · Награда: ${reward}` : ''}
        </p>
      </div>
    </div>
  );
}
