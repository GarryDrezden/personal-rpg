import type { BodyAbilityV1Category } from '../../types/bodyAbilityV1';
import { getManifestAssetUrl } from '../../game/assetManifest';
import {
  getBodyAbilityCategoryGlyph,
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
  emoji: string;
  category: BodyAbilityV1Category;
  visualState: BodyAbilityVisualState;
};

const RING_CLASS: Record<BodyAbilityVisualState, string> = {
  locked:
    'ring-2 ring-violet-500/20 shadow-[0_0_24px_rgba(88,28,135,0.15)]',
  discovered:
    'ring-2 ring-[var(--app-gold)]/45 shadow-[0_0_32px_rgba(212,165,55,0.22)]',
  unlocked:
    'ring-2 ring-emerald-400/40 shadow-[0_0_36px_rgba(52,211,153,0.25)]',
  recentlyUnlocked:
    'ring-[3px] ring-[var(--app-gold)]/55 shadow-[0_0_44px_rgba(212,165,55,0.35)]',
};

const PANEL_CLASS: Record<BodyAbilityVisualState, string> = {
  locked: 'from-[#14101f]/95 via-[#0e0c18] to-[#08070f]',
  discovered: 'from-violet-950/90 via-[#12101c] to-[#0a0812]',
  unlocked: 'from-[#101822]/95 via-[#0f1419] to-[#080a0f]',
  recentlyUnlocked: 'from-[#18120a]/95 via-[#12101c] to-[#0a0810]',
};

export function BodyAbilityArtMedallion({
  abilityId,
  title,
  emoji,
  category,
  visualState,
}: BodyAbilityArtMedallionProps) {
  const assetId = getBodyAbilityManifestAssetId(abilityId);
  const manifestUrl = getManifestAssetUrl(assetId);
  const ring = RING_CLASS[visualState];
  const dimmed = visualState === 'locked';

  return (
    <div
      className={`relative mx-auto flex shrink-0 items-center justify-center rounded-full ${ring}`}
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
          <span
            className="pointer-events-none absolute right-2 top-0 h-1.5 w-1.5 rounded-full bg-[var(--app-gold)]/70"
            aria-hidden
          />
        </>
      ) : null}

      {manifestUrl ? (
        <ManifestArtScene
          assetId={assetId}
          alt={title}
          layout="body-ability-medallion"
          dimmed={dimmed}
          className="border-violet-500/25 shadow-none"
          testId={`body-ability-art-${abilityId}`}
        />
      ) : (
        <div
          className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-violet-500/25 bg-gradient-to-br sm:h-40 sm:w-40 ${PANEL_CLASS[visualState]}`}
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(212,165,55,0.12),transparent_62%)]" />
          <span className={`text-5xl sm:text-6xl ${dimmed ? 'opacity-45 grayscale' : 'opacity-90'}`}>
            {emoji}
          </span>
          <span className="pointer-events-none absolute bottom-3 text-[10px] font-semibold uppercase tracking-widest text-violet-300/50">
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
