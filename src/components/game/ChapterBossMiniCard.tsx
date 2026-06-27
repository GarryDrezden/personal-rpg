import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getArtifactMeta, getBossMeta } from '../../game/assetRegistry';
import { GameSceneBannerCard } from './GameSceneBannerCard';

type ChapterBossMiniCardProps = {
  bossId: BossId;
  chapter: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
};

const statusBadgeLabel = {
  locked: 'Босс главы',
  active: 'Текущий босс',
  defeated: 'Босс главы',
} as const;

const statusBadgeClass = {
  locked: 'bg-stone-700/90 text-stone-200',
  active: 'bg-violet-600/95 text-white',
  defeated: 'bg-emerald-700/90 text-white',
} as const;

export function ChapterBossMiniCard({
  bossId,
  chapter,
  status = 'active',
}: ChapterBossMiniCardProps) {
  const meta = getBossMeta(bossId);
  const reward = meta.rewardArtifactId ? getArtifactMeta(meta.rewardArtifactId).title : null;

  return (
    <GameSceneBannerCard
      testId="chapter-boss-mini-card"
      variant="boss"
      imageSrc={meta.image}
      imageAlt={meta.title}
      href="/today"
      borderClassName="border-violet-500/40"
      backdropClassName="from-violet-950/95 via-[#14101f] to-[#090812]"
      badge={
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${statusBadgeClass[status]}`}
        >
          {statusBadgeLabel[status]}
        </span>
      }
      title={meta.title}
      subtitle={`Гл. ${chapter}${reward ? ` · ${reward}` : ''}`}
      accent="Квесты дня приближают победу над боссом главы →"
    />
  );
}
