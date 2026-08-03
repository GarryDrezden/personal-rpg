import type { CompanionId } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta } from '../../game/assetRegistry';
import { getCompanionPresentation } from '../../game/themeEntityPresentation';
import { useAppTheme } from '../../hooks/useAppTheme';
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
  const { themeId, isCozy } = useAppTheme();
  const meta = getCompanionMeta(companionId);
  const presentation = getCompanionPresentation(themeId, companionId, meta);
  const candidates = getCompanionImageCandidates(companionId, themeId);
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
      } ${!compact && isCozy ? 'companion-card--botanical' : ''} ${compact ? 'flex items-center gap-4' : ''}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-[var(--app-border)] ${
          isCozy
            ? 'bg-gradient-to-b from-[#fff8ee] to-[#e4efe0]'
            : 'bg-gradient-to-b from-[#1a1626] to-[#0e0c14]'
        } ${compact ? 'h-24 w-24' : 'mx-auto h-44 w-44'}`}
      >
        <GameAssetImage
          variant="companion"
          src={presentation.imagePath}
          alt={presentation.title}
          fallbackCandidates={candidates.slice(1)}
          status={selected ? 'current' : 'unlocked'}
          className="h-full w-full"
          imageClassName="object-contain"
        />
      </div>
      <div className={compact ? 'min-w-0 flex-1' : 'mt-3'}>
        <p className="font-semibold text-[var(--app-text)]">{presentation.title}</p>
        <p className="text-xs text-[var(--app-primary)]">{presentation.subtitle}</p>
        {!compact && (
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">{presentation.description}</p>
        )}
      </div>
    </Wrapper>
  );
}
