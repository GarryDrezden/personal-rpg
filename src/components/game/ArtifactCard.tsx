import type { ArtifactId, AssetUnlockStatus } from '../../types/gameAssets';
import { getArtifactMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

type ArtifactCardProps = {
  artifactId: ArtifactId;
  status: AssetUnlockStatus;
  compact?: boolean;
};

const rarityClass = {
  common: 'border-[var(--app-border)]',
  rare: 'border-sky-400/40',
  epic: 'border-violet-400/40',
  legendary: 'border-amber-400/50',
} as const;

export function ArtifactCard({ artifactId, status, compact = false }: ArtifactCardProps) {
  const meta = getArtifactMeta(artifactId);

  return (
    <div
      data-testid={`artifact-${artifactId}`}
      className={`rounded-xl border bg-[var(--app-card)] p-3 ${rarityClass[meta.rarity]} ${
        compact ? 'flex items-center gap-3' : ''
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] ${
          compact ? 'h-16 w-16' : 'mx-auto h-24 w-24'
        }`}
      >
        <GameAssetImage
          variant="artifact"
          src={meta.image}
          alt={meta.title}
          status={status === 'locked' ? 'locked' : 'unlocked'}
          className="h-full w-full"
          imageClassName="object-contain"
        />
      </div>
      <div className={compact ? 'min-w-0' : 'mt-2'}>
        <p className="font-medium text-[var(--app-text)]">{meta.title}</p>
        {!compact && (
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">{meta.description}</p>
        )}
        {status === 'locked' && (
          <p className="mt-1 text-[10px] text-[var(--app-text-muted)]">{meta.unlockHint}</p>
        )}
      </div>
    </div>
  );
}
