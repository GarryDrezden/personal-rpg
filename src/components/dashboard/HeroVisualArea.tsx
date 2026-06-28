import type { ReactNode } from 'react';
import type { CompanionId, HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getCompanionImageCandidates } from '../../game/assetPaths';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { GameAssetImage } from '../game/GameAssetImage';
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
    ? 'bg-gradient-to-b from-[#12101c] via-[#161422] to-[color-mix(in_srgb,var(--app-primary)_14%,#0c0b12)]'
    : 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_8%,#1a1520)] via-[#1e1a28] to-[#14121c]';

  const shellClass = isFocus
    ? `relative overflow-hidden ${sceneClass} lg:rounded-l-2xl lg:border-r lg:border-[var(--app-border)]`
    : `relative overflow-hidden rounded-t-2xl border-b border-[var(--app-border)] ${sceneClass}`;

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

        <div className="grid min-h-[15rem] grid-cols-[minmax(0,1fr)_6.25rem] items-end gap-1.5 px-2 pb-2.5 pt-10 sm:min-h-[16rem] sm:grid-cols-[minmax(0,1fr)_7rem] sm:gap-2 sm:px-3 lg:min-h-[17rem]">
          <div className="relative flex min-h-[12rem] items-end justify-center sm:min-h-[13rem]">
            <div className="pointer-events-none absolute inset-x-[8%] bottom-0 h-3 rounded-[100%] bg-black/30 blur-md" />
            <GameAssetImage
              variant="hero"
              src={heroAssets.src}
              alt={stageMeta.title}
              fallbackCandidates={heroAssets.fallbackCandidates}
              status="unlocked"
              fit="hero"
              className="h-[11.5rem] w-full sm:h-[12.5rem] lg:h-[13.5rem]"
              imageClassName="scale-[1.1] sm:scale-[1.14] lg:scale-[1.16]"
            />
          </div>

          <div
            data-testid="active-companion-label"
            className="z-20 flex flex-col items-center justify-end pb-0.5"
          >
            <div className="flex h-[4.5rem] w-full items-center justify-center overflow-hidden rounded-xl border border-amber-400/35 bg-[color-mix(in_srgb,#000_45%,transparent)] sm:h-[5rem]">
              <GameAssetImage
                variant="companion"
                src={companionMeta.image}
                alt={companionMeta.title}
                fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
                status="unlocked"
                fit="companion"
                className="h-full w-full p-1"
              />
            </div>
            <div className="mt-1.5 w-full rounded-lg border border-amber-400/30 bg-black/50 px-1.5 py-1 text-center backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">
                Спутник
              </p>
              <p className="text-xs font-semibold leading-snug text-[var(--app-text)]">
                {companionMeta.title}
              </p>
            </div>
          </div>
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

      <div className="grid min-h-[18rem] grid-cols-[6.25rem_1fr] items-end gap-2 px-3 pb-3 pt-11 sm:min-h-[19.5rem] sm:grid-cols-[7rem_1fr_12rem] sm:gap-3 sm:px-4">
        <div className="z-20 flex flex-col items-stretch">
          <div className="flex h-[6.75rem] items-center justify-center overflow-hidden rounded-xl border border-amber-400/35 bg-[color-mix(in_srgb,#000_40%,transparent)] sm:h-[7.5rem]">
            <GameAssetImage
              variant="companion"
              src={companionMeta.image}
              alt={companionMeta.title}
              fallbackCandidates={getCompanionImageCandidates(companionId).slice(1)}
              status="unlocked"
              fit="companion"
              className="h-full w-full p-1.5"
            />
          </div>
          <div
            data-testid="active-companion-label"
            className="mt-1.5 rounded-lg border border-amber-400/30 bg-black/50 px-1.5 py-1 text-center backdrop-blur-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">
              Спутник
            </p>
            <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--app-text)]">
              {companionMeta.title}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex min-h-[14.5rem] items-end justify-center self-stretch sm:min-h-[15.5rem]">
          <div className="pointer-events-none absolute inset-x-[10%] bottom-0 h-3 rounded-[100%] bg-black/30 blur-md" />
          <GameAssetImage
            variant="hero"
            src={heroAssets.src}
            alt={stageMeta.title}
            fallbackCandidates={heroAssets.fallbackCandidates}
            status="unlocked"
            fit="hero"
            className="h-[14.5rem] w-full max-w-[11.5rem] sm:h-[15.5rem] sm:max-w-[13rem]"
          />
        </div>

        {aside ? (
          <div className="z-20 hidden flex-col gap-1.5 sm:flex">{aside}</div>
        ) : (
          <div className="hidden sm:block" aria-hidden />
        )}
      </div>

      {aside ? (
        <div className="absolute right-3 top-11 z-20 flex w-[min(calc(100%-7rem),11rem)] flex-col gap-1.5 sm:hidden">
          {aside}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-4 bottom-2.5 h-px bg-[color-mix(in_srgb,var(--app-primary)_40%,transparent)]" />
    </div>
  );
}
