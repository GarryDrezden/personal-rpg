import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getArtifactMeta, getBossMeta } from '../../game/assetRegistry';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getThemeTerm } from '../../constants/themeTerms';
import { getBossPresentation } from '../../game/themeEntityPresentation';
import { GameSceneBannerCard } from './GameSceneBannerCard';

type ChapterBossMiniCardProps = {
  bossId: BossId;
  chapter: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
  layout?: 'banner' | 'portrait';
};

export function ChapterBossMiniCard({
  bossId,
  chapter,
  status = 'active',
  layout = 'banner',
}: ChapterBossMiniCardProps) {
  const meta = getBossMeta(bossId);
  const reward = meta.rewardArtifactId ? getArtifactMeta(meta.rewardArtifactId).title : null;
  const { themeId, isCozy } = useAppTheme();
  const presentation = getBossPresentation(themeId, bossId, meta);

  const statusBadgeLabel = {
    locked: getThemeTerm(themeId, 'bossChapter'),
    active: getThemeTerm(themeId, 'bossActive'),
    defeated: getThemeTerm(themeId, 'bossChapter'),
  } as const;

  const statusBadgeClass = isCozy
    ? {
        locked: 'bg-[var(--app-wood)]/85 text-[#fff8ee]',
        active: 'bg-[var(--app-garden)] text-[#fff8ee]',
        defeated: 'bg-[var(--app-success)] text-[#fff8ee]',
      }
    : {
        locked: 'bg-stone-700/90 text-stone-200',
        active: 'bg-violet-600/95 text-white',
        defeated: 'bg-emerald-700/90 text-white',
      };

  return (
    <GameSceneBannerCard
      testId="chapter-boss-mini-card"
      variant="boss"
      layout={layout}
      imageSrc={presentation.imagePath}
      imageAlt={presentation.title}
      fallbackCandidates={presentation.imageCandidates.slice(1)}
      href={isCozy ? '/home' : '/today'}
      borderClassName={isCozy ? 'border-[var(--app-wood)]/40' : 'border-violet-500/40'}
      backdropClassName={
        isCozy
          ? 'from-[#fff8ee] via-[#efe4d2] to-[#e8efe4]'
          : 'from-violet-950/95 via-[#14101f] to-[#090812]'
      }
      badge={
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${statusBadgeClass[status]}`}
        >
          {statusBadgeLabel[status]}
        </span>
      }
      title={presentation.title}
      subtitle={`Гл. ${chapter}${reward ? ` · ${reward}` : ''}`}
      surfaceTone={isCozy ? 'warm' : 'dark'}
      accent={getThemeTerm(themeId, 'bossAccent')}
    />
  );
}
