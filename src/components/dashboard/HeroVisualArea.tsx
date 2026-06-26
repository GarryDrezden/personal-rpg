import type { CompanionId, HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import {
  getCompanionImageCandidates,
  getHeroStageImageCandidates,
} from '../../game/assetPaths';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { GameAssetImage } from '../game/GameAssetImage';
import { useAppTheme } from '../../hooks/useAppTheme';

type HeroVisualAreaProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  companionId: CompanionId;
  level: number;
};

export function HeroVisualArea({ gender, stage, companionId, level }: HeroVisualAreaProps) {
  const { isDarkFantasy } = useAppTheme();
  const stageMeta = getHeroStageMeta(gender, stage);
  const companionMeta = getCompanionMeta(companionId);

  const sceneClass = isDarkFantasy
    ? 'bg-gradient-to-b from-[#12101c] via-[#161422] to-[color-mix(in_srgb,var(--app-primary)_14%,#0c0b12)]'
    : 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_8%,#1a1520)] via-[#1e1a28] to-[#14121c]';

  return (
    <div
      data-testid="hero-visual-area"
      className={`relative min-h-[22rem] overflow-hidden rounded-2xl border border-[var(--app-border)] sm:min-h-[26rem] lg:min-h-[28rem] ${sceneClass}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,color-mix(in_srgb,var(--app-primary)_22%,transparent),transparent_58%)]" />
      <div className="absolute bottom-[10%] left-1/2 h-7 w-[62%] -translate-x-1/2 rounded-[100%] bg-black/25 blur-lg" />

      <div className="absolute left-3 top-3 z-20 rounded-full border border-[var(--app-border)] bg-black/35 px-2.5 py-1 text-[11px] font-bold text-[var(--app-primary)] backdrop-blur-sm">
        Ур. {level}
      </div>
      <div className="absolute right-3 top-3 z-20 rounded-full border border-[var(--app-border)] bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-[var(--app-text)] backdrop-blur-sm">
        Стадия {stage}/{HERO_STAGE_COUNT}
      </div>

      {/* Hero — dominant, fills visual area */}
      <div className="absolute inset-x-[8%] bottom-0 top-[4%] z-10 flex items-end justify-center">
        <GameAssetImage
          variant="hero"
          src={stageMeta.image}
          alt={stageMeta.title}
          fallbackCandidates={getHeroStageImageCandidates(gender, stage).slice(1)}
          status="current"
          fit="hero"
          className="h-full w-full max-w-[min(100%,22rem)]"
        />
      </div>

      {/* Companion — smaller, clearly labeled */}
      <div
        className="absolute bottom-3 left-3 z-20 w-[7rem] sm:bottom-4 sm:left-4 sm:w-[8rem]"
      >
        <div className="aspect-[4/5] w-full">
          <GameAssetImage
            variant="companion"
            src={companionMeta.image}
            alt={companionMeta.title}
            fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
            status="unlocked"
            fit="companion"
            className="h-full w-full"
          />
        </div>
        <div
          data-testid="active-companion-label"
          className="mt-1 rounded-lg border border-amber-400/35 bg-black/45 px-2 py-1 backdrop-blur-sm"
        >
          <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-200/90">
            Спутник
          </p>
          <p className="truncate text-xs font-semibold text-[var(--app-text)]">
            {companionMeta.title}
          </p>
        </div>
      </div>
    </div>
  );
}
