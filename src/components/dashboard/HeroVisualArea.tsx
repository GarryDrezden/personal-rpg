import type { ReactNode } from 'react';
import type { CompanionId, HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { GameAssetImage } from '../game/GameAssetImage';
import { HeroCompanionOverlay } from '../game/HeroCompanionOverlay';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';

type HeroVisualAreaProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  companionId: CompanionId;
  level: number;
  aside?: ReactNode;
  /** wide = full-width 3-col scene; focus = narrow column, hero dominant */
  layout?: 'wide' | 'focus';
};

export function HeroVisualArea({
  gender,
  stage,
  companionId,
  level,
  aside,
  layout = 'wide',
}: HeroVisualAreaProps) {
  const { isDarkFantasy } = useAppTheme();
  const stageMeta = getHeroStageMeta(gender, stage);
  const heroAssets = useHeroStageAssets(gender, stage);
  const companionMeta = getCompanionMeta(companionId);
  const isFocus = layout === 'focus';

  const sceneClass = isDarkFantasy
    ? 'bg-gradient-to-b from-[#1a1730] via-[#16122a] to-[#1c1810]'
    : 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_8%,#1a1520)] via-[#1e1a28] to-[#14121c]';

  const shellClass = isFocus
    ? `relative overflow-hidden ${sceneClass} lg:rounded-l-2xl lg:border-r lg:border-[var(--app-border)]`
    : `relative overflow-hidden rounded-t-2xl border-b border-[var(--app-border)] ${sceneClass}`;

  const companionChip = (
    <div
      data-testid="active-companion-label"
      className="absolute bottom-2 right-2 z-30 rounded-lg border border-amber-400/30 bg-black/55 px-1.5 py-1 text-center backdrop-blur-sm"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">Спутник</p>
      <p className="max-w-[5.5rem] truncate text-[11px] font-semibold leading-snug text-[var(--app-text)]">
        {companionMeta.title}
      </p>
    </div>
  );

  if (isFocus) {
    return (
      <div data-testid="hero-visual-area" className={`relative ${shellClass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,color-mix(in_srgb,var(--app-primary)_24%,transparent),transparent_52%)]" />

        <div className="absolute left-2 top-2 z-30 rounded-full border border-[var(--app-border)] bg-black/45 px-2 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
          Ур. {level}
        </div>
        <div className="absolute right-2 top-2 z-30 rounded-full border border-[var(--app-border)] bg-black/45 px-2 py-0.5 text-xs font-semibold text-[var(--app-text)] backdrop-blur-sm">
          {stage}/{HERO_STAGE_COUNT}
        </div>

        <div className="relative flex min-h-[15rem] items-end justify-center overflow-visible px-2 pb-2.5 pt-10 sm:min-h-[16rem] sm:px-3 lg:min-h-[17rem]">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[color-mix(in_srgb,#2a2418_35%,transparent)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-[14%] bottom-0 h-2 rounded-[100%] bg-black/35 blur-md" />
          <div className="relative h-[11.5rem] w-full max-w-[16rem] overflow-visible sm:h-[12.5rem] lg:h-[13.5rem]">
            <div className="relative mx-auto h-full w-full max-w-[11rem] sm:max-w-[12rem]">
              <GameAssetImage
                variant="hero"
                src={heroAssets.src}
                alt={stageMeta.title}
                fallbackCandidates={heroAssets.fallbackCandidates}
                status="unlocked"
                fit="hero"
                className="relative z-10 h-full w-full"
                imageClassName="scale-[1.1] sm:scale-[1.14] lg:scale-[1.16] drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]"
              />
              <HeroCompanionOverlay companionId={companionId} side="left" />
            </div>
          </div>
          {companionChip}
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-2 h-px bg-[color-mix(in_srgb,var(--app-primary)_40%,transparent)]" />
      </div>
    );
  }

  return (
    <div data-testid="hero-visual-area" className={shellClass}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,color-mix(in_srgb,var(--app-primary)_20%,transparent),transparent_55%)]" />

      <div className="absolute left-3 top-3 z-30 rounded-full border border-[var(--app-border)] bg-black/45 px-2.5 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
        Ур. {level}
      </div>
      <div className="absolute right-3 top-3 z-30 rounded-full border border-[var(--app-border)] bg-black/45 px-2.5 py-0.5 text-xs font-semibold text-[var(--app-text)] backdrop-blur-sm">
        Стадия {stage}/{HERO_STAGE_COUNT}
      </div>

      <div className="grid min-h-[18rem] grid-cols-1 items-end gap-2 px-3 pb-3 pt-11 sm:min-h-[19.5rem] sm:grid-cols-[1fr_12rem] sm:gap-3 sm:px-4">
        <div className="relative z-10 flex min-h-[14.5rem] items-end justify-center self-stretch overflow-visible sm:min-h-[15.5rem]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(245,180,70,0.22),transparent_44%)]" />
          <div className="pointer-events-none absolute inset-x-[10%] bottom-0 h-7 rounded-[100%] bg-[color-mix(in_srgb,var(--app-primary)_38%,#000)] opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-[10%] bottom-0 h-3 rounded-[100%] bg-black/30 blur-md" />
          <div className="relative h-[14.5rem] w-full max-w-[13rem] overflow-visible sm:h-[15.5rem] sm:max-w-[14rem]">
            <GameAssetImage
              variant="hero"
              src={heroAssets.src}
              alt={stageMeta.title}
              fallbackCandidates={heroAssets.fallbackCandidates}
              status="unlocked"
              fit="hero"
              className="relative z-10 h-full w-full"
              imageClassName="drop-shadow-[0_0_16px_rgba(245,180,70,0.2)] drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
            />
            <HeroCompanionOverlay companionId={companionId} side="left" />
          </div>
          {companionChip}
        </div>

        {aside ? (
          <div className="hidden min-h-0 flex-col justify-end gap-2 sm:flex">{aside}</div>
        ) : null}
      </div>
    </div>
  );
}
