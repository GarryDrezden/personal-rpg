import type { MobId } from '../../types/gameAssets';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobDailyActionHint, getMobWeaknessText } from '../../game/dailyMobEngine';
import { useAppStore } from '../../store/appStore';
import { GameSceneBannerCard } from './GameSceneBannerCard';

type DailyMobMiniCardProps = {
  mobId: MobId;
  layout?: 'banner' | 'portrait';
};

export function DailyMobMiniCard({ mobId, layout = 'banner' }: DailyMobMiniCardProps) {
  const meta = getMobMeta(mobId);
  const settings = useAppStore((s) => s.settings);

  return (
    <GameSceneBannerCard
      testId="daily-mob-mini-card"
      variant="mob"
      layout={layout}
      imageSrc={meta.image}
      imageAlt={meta.title}
      href="/today"
      borderClassName="border-rose-500/35"
      backdropClassName="from-rose-950/90 via-[#160f14] to-[#090812]"
      imageScaleClassName={layout === 'portrait' ? 'scale-[1.05]' : 'scale-[1.14] sm:scale-[1.18]'}
      badge={
        <span className="inline-block rounded-md bg-rose-700/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Моб дня
        </span>
      }
      title={meta.title}
      accent={`${getMobWeaknessText(meta.weakness, { settings, mobId })} · ${getMobDailyActionHint(meta.weakness)}`}
    />
  );
}
