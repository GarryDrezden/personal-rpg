import type { CompanionId } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta } from '../../game/assetRegistry';
import { GameAssetImage } from './GameAssetImage';

type CompanionCardProps = {
  companionId: CompanionId;
  selected?: boolean;
  compact?: boolean;
  onSelect?: (id: CompanionId) => void;
};

export function CompanionCard({
  companionId,
  selected = false,
  compact = false,
  onSelect,
}: CompanionCardProps) {
  const meta = getCompanionMeta(companionId);
  const Wrapper = onSelect ? 'button' : 'div';

  return (
    <Wrapper
      type={onSelect ? 'button' : undefined}
      data-testid={`companion-${companionId}`}
      onClick={onSelect ? () => onSelect(companionId) : undefined}
      className={`rounded-xl border p-3 text-left transition-colors ${
        selected
          ? 'border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))]'
          : 'border-[var(--app-border)] bg-[var(--app-card)] hover:border-[var(--app-primary)]/40'
      } ${compact ? 'flex items-center gap-4' : ''}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-[var(--app-border)] bg-gradient-to-b from-[#1a1626] to-[#0e0c14] ${
          compact ? 'h-24 w-24' : 'mx-auto h-44 w-44'
        }`}
      >
        <GameAssetImage
          variant="companion"
          src={meta.image}
          alt={meta.title}
          fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
          status={selected ? 'current' : 'unlocked'}
          className="h-full w-full"
          imageClassName="object-contain"
        />
      </div>
      <div className={compact ? 'min-w-0 flex-1' : 'mt-3'}>
        <p className="font-semibold text-[var(--app-text)]">{meta.title}</p>
        <p className="text-xs text-[var(--app-primary)]">{meta.subtitle}</p>
        {!compact && (
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">{meta.description}</p>
        )}
      </div>
    </Wrapper>
  );
}
