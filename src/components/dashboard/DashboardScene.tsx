import type { BossId, CompanionId, HeroGender, HeroStageNumber, MobId, ChapterNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getCompanionMeta, getHeroStageMeta } from '../../game/assetRegistry';
import { GameAssetImage } from '../game/GameAssetImage';
import { HeroCompanionOverlay } from '../game/HeroCompanionOverlay';
import { DailyMobBadge } from '../game/DailyMobBadge';
import { ChapterBossBadge } from '../game/ChapterBossBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';

type DashboardSceneProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  companionId: CompanionId;
  level: number;
  mobId: MobId;
  bossId: BossId;
  chapter: ChapterNumber;
  bossStatus: 'locked' | 'active' | 'defeated';
};

export function DashboardScene({
  gender,
  stage,
  companionId,
  level,
  mobId,
  bossId,
  chapter,
  bossStatus,
}: DashboardSceneProps) {
  const { isDarkFantasy } = useAppTheme();
  const stageMeta = getHeroStageMeta(gender, stage);
  const heroAssets = useHeroStageAssets(gender, stage);
  const companionMeta = getCompanionMeta(companionId);

  const avatarBg = isDarkFantasy
    ? 'bg-gradient-to-b from-[#1a1730] via-[#16122a] to-[#1c1810]'
    : 'bg-gradient-to-b from-[color-mix(in_srgb,var(--app-primary)_8%,#1a1520)] via-[#1e1a28] to-[#14121c]';

  const threats = (
    <>
      <DailyMobBadge mobId={mobId} prominent />
      <ChapterBossBadge bossId={bossId} chapter={chapter} status={bossStatus} prominent />
    </>
  );

  return (
    <div
      data-testid="hero-visual-area"
      className="px-2 pb-3 pt-2 sm:px-3 lg:rounded-l-2xl lg:border-r lg:border-[var(--app-border)]"
    >
      <div className="flex min-h-[18rem] items-stretch gap-2 sm:min-h-[19.5rem] sm:gap-2.5 lg:min-h-[20.5rem]">
        {/* Block 1 — hero only, maximum visual area */}
        <div
          className={`relative flex min-w-0 flex-[1.35] flex-col overflow-hidden rounded-xl border border-[var(--app-border)] ${avatarBg}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(245,180,70,0.26),transparent_44%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,color-mix(in_srgb,var(--app-primary)_30%,transparent),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[color-mix(in_srgb,#2a2418_50%,transparent)] via-transparent to-transparent" />
          <div className="absolute left-2 top-2 z-10 rounded-full border border-[var(--app-border)] bg-black/45 px-2 py-0.5 text-xs font-bold text-[var(--app-primary)] backdrop-blur-sm">
            Ур. {level}
          </div>
          <div className="absolute right-2 top-2 z-10 rounded-full border border-[var(--app-border)] bg-black/45 px-2 py-0.5 text-xs font-semibold text-[var(--app-text)] backdrop-blur-sm">
            {stage}/{HERO_STAGE_COUNT}
          </div>
          <div className="relative flex min-h-[16.5rem] flex-1 items-end justify-center overflow-visible px-0.5 pb-1 pt-8 sm:min-h-[17.5rem] lg:min-h-[18.5rem]">
            <div className="pointer-events-none absolute inset-x-[8%] bottom-1 h-7 rounded-[100%] bg-[color-mix(in_srgb,var(--app-primary)_40%,#000)] opacity-45 blur-2xl" />
            <div className="pointer-events-none absolute inset-x-[6%] bottom-0.5 h-3.5 rounded-[100%] bg-black/30 blur-md" />
            <div className="relative h-full w-full min-h-[15rem] max-h-[19rem] overflow-visible sm:min-h-[16rem] lg:min-h-[17.5rem] lg:max-h-[20rem]">
              <GameAssetImage
                variant="hero"
                src={heroAssets.src}
                alt={stageMeta.title}
                fallbackCandidates={heroAssets.fallbackCandidates}
                status="unlocked"
                fit="hero"
                className="relative z-10 h-full w-full"
                imageClassName="scale-[1.18] sm:scale-[1.22] lg:scale-[1.28] drop-shadow-[0_0_16px_rgba(245,180,70,0.2)] drop-shadow-[0_10px_22px_rgba(0,0,0,0.6)]"
              />
              <HeroCompanionOverlay companionId={companionId} side="left" />
            </div>
            <div
              data-testid="active-companion-label"
              className="absolute bottom-2 right-2 z-30 rounded-md border border-amber-400/35 bg-black/55 px-1.5 py-1 text-center backdrop-blur-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">
                Спутник
              </p>
              <p className="max-w-[5.5rem] truncate text-[11px] font-semibold leading-snug text-[var(--app-text)]">
                {companionMeta.title}
              </p>
            </div>
          </div>
        </div>

        {/* Block 2 — mob + boss */}
        <div className="hidden w-[10.5rem] shrink-0 flex-col justify-stretch gap-2 sm:flex lg:w-[11.25rem]">
          {threats}
        </div>
      </div>

      {/* Mobile: full-width prominent cards */}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:hidden">{threats}</div>
    </div>
  );
}
