import type { ArtifactId, AssetUnlockStatus } from '../../types/gameAssets';
import { GAME_ASSET_REGISTRY } from '../../game/assetRegistry';
import { ArtifactCard } from './ArtifactCard';

type ArtifactGridProps = {
  statuses: Record<ArtifactId, AssetUnlockStatus>;
  compact?: boolean;
};

export function ArtifactGrid({ statuses, compact = false }: ArtifactGridProps) {
  const ids = Object.keys(GAME_ASSET_REGISTRY.artifacts) as ArtifactId[];

  return (
    <div
      data-testid="artifact-grid"
      className={compact ? 'grid gap-2' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}
    >
      {ids.map((id) => (
        <ArtifactCard key={id} artifactId={id} status={statuses[id] ?? 'locked'} compact={compact} />
      ))}
    </div>
  );
}
