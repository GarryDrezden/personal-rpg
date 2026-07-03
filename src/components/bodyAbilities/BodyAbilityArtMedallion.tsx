import type { BodyAbilityV1Category } from '../../types/bodyAbilityV1';
import { getManifestAssetUrl } from '../../game/assetManifest';
import {
  getBodyAbilityCategoryGlyph,
  getBodyAbilityCategoryIcon,
  getBodyAbilityManifestAssetId,
} from '../../game/bodyAbilityAssetUi';
import { ManifestArtScene } from '../game/ManifestArtScene';

export type BodyAbilityVisualState =
  | 'locked'
  | 'discovered'
  | 'unlocked'
  | 'recentlyUnlocked';

type BodyAbilityArtMedallionProps = {
  abilityId: string;
  title: string;
  category: BodyAbilityV1Category;
  visualState: BodyAbilityVisualState;
  size?: 'default' | 'compact';
  /** Skip manifest art even if registered (future roadmap placeholders). */
  forceGlyph?: boolean;
};

const MEDALLION_SIZE_DEFAULT =
  'h-[128px] w-[128px] min-h-[112px] min-w-[112px] md:h-[148px] md:w-[148px] lg:h-[164px] lg:w-[164px]';

const MEDALLION_SIZE_COMPACT = 'h-[72px] w-[72px] min-h-[64px] min-w-[64px]';

const RING_CLASS: Record<BodyAbilityVisualState, string> = {
  locked: 'ring-2 ring-violet-400/25 shadow-[0_0_28px_rgba(139,92,246,0.12)]',
  discovered:
    'ring-2 ring-[var(--app-gold)]/40 shadow-[0_0_32px_rgba(212,165,55,0.18)]',
  unlocked:
    'ring-2 ring-emerald-400/45 shadow-[0_0_36px_rgba(52,211,153,0.2)]',
  recentlyUnlocked:
    'ring-[3px] ring-[var(--app-gold)]/50 shadow-[0_0_40px_rgba(212,165,55,0.28)] motion-safe:animate-[body-ability-glow_3s_ease-in-out_infinite]',
};

const PANEL_CLASS: Record<BodyAbilityVisualState, string> = {
  locked: 'from-[#18142a]/90 via-[#12101c] to-[#0a0812]',
  discovered: 'from-violet-950/80 via-[#14101f] to-[#0a0812]',
  unlocked: 'from-[#101822]/90 via-[#0f1419] to-[#080a0f]',
  recentlyUnlocked: 'from-[#18120a]/90 via-[#14101c] to-[#0a0810]',
};

const GLYPH_CLASS: Record<BodyAbilityVisualState, string> = {
  locked: 'text-violet-300/45 drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]',
  discovered: 'text-[var(--app-gold)]/65 drop-shadow-[0_0_14px_rgba(212,165,55,0.28)]',
  unlocked: 'text-emerald-300/60 drop-shadow-[0_0_12px_rgba(52,211,153,0.22)]',
  recentlyUnlocked: 'text-[var(--app-gold)]/75 drop-shadow-[0_0_16px_rgba(212,165,55,0.35)]',
};

export function BodyAbilityArtMedallion({
  abilityId,
  title,
  category,
  visualState,
  size = 'default',
  forceGlyph = false,
}: BodyAbilityArtMedallionProps) {
  const assetId = getBodyAbilityManifestAssetId(abilityId);
  const manifestUrl = forceGlyph ? null : getManifestAssetUrl(assetId);
  const ring = RING_CLASS[visualState];
  const CategoryIcon = getBodyAbilityCategoryIcon(category);
  const medallionSize = size === 'compact' ? MEDALLION_SIZE_COMPACT : MEDALLION_SIZE_DEFAULT;
  const iconSize =
    size === 'compact'
      ? 'h-7 w-7'
      : 'h-11 w-11 md:h-12 md:w-12 lg:h-[3.25rem] lg:w-[3.25rem]';

  return (
    <div
      className={`relative mx-auto flex shrink-0 items-center justify-center rounded-full ${medallionSize} ${ring}`}
      data-testid={`body-ability-medallion-${abilityId}`}
    >
      {visualState === 'recentlyUnlocked' ? (
        <>
          <span
            className="pointer-events-none absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--app-gold)] shadow-[0_0_8px_rgba(212,165,55,0.8)]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute -left-0.5 bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-400/90"
            aria-hidden
          />
        </>
      ) : null}

      {manifestUrl ? (
        <ManifestArtScene
          assetId={assetId}
          alt={title}
          layout="body-ability-medallion"
          dimmed={false}
          className="h-full w-full border-violet-400/20 shadow-[0_0_24px_rgba(139,92,246,0.08)]"
          testId={`body-ability-art-${abilityId}`}
        />
      ) : (
        <div
          className={`body-ability-glyph-fallback relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-violet-500/25 bg-gradient-to-br ${PANEL_CLASS[visualState]}`}
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(212,165,55,0.14),transparent_58%)]" />
          <div className="pointer-events-none absolute inset-[18%] rounded-full border border-violet-400/15" />
          <CategoryIcon
            className={`relative ${iconSize} ${GLYPH_CLASS[visualState]}`}
            strokeWidth={1.35}
          />
          <span
            className={`pointer-events-none absolute text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-300/35 ${
              size === 'compact' ? 'bottom-1.5 text-[7px]' : 'bottom-3'
            }`}
          >
            {getBodyAbilityCategoryGlyph(category)}
          </span>
        </div>
      )}
    </div>
  );
}

export function resolveBodyAbilityVisualState(
  unlocked: boolean,
  hintActive: boolean,
  unlockedAt?: string,
): BodyAbilityVisualState {
  if (unlocked) {
    if (unlockedAt) {
      const days = (Date.now() - new Date(unlockedAt).getTime()) / 86_400_000;
      if (days >= 0 && days <= 21) return 'recentlyUnlocked';
    }
    return 'unlocked';
  }
  if (hintActive) return 'discovered';
  return 'locked';
}
