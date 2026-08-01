import type { MobId } from '../../types/gameAssets';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobDailyActionHint, getMobWeaknessText } from '../../game/dailyMobEngine';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getThemeTerm } from '../../constants/themeTerms';
import { getMobPresentation } from '../../game/themeEntityPresentation';
import { GameSceneBannerCard } from './GameSceneBannerCard';

type DailyMobMiniCardProps = {
  mobId: MobId;
  layout?: 'banner' | 'portrait';
};

export function DailyMobMiniCard({ mobId, layout = 'banner' }: DailyMobMiniCardProps) {
  const meta = getMobMeta(mobId);
  const settings = useAppStore((s) => s.settings);
  const { themeId, isCozy } = useAppTheme();
  const presentation = getMobPresentation(themeId, mobId, meta);

  return (
    <GameSceneBannerCard
      testId="daily-mob-mini-card"
      variant="mob"
      layout={layout}
      imageSrc={presentation.imagePath}
      imageAlt={presentation.title}
      fallbackCandidates={presentation.imageCandidates.slice(1)}
      href="/today"
      borderClassName={isCozy ? 'border-[var(--app-garden)]/40' : 'border-rose-500/35'}
      backdropClassName={
        isCozy
          ? 'from-[#efe4d2] via-[#f7f0e4] to-[#e4efe0]'
          : 'from-rose-950/90 via-[#160f14] to-[#090812]'
      }
      imageScaleClassName={layout === 'portrait' ? 'scale-[1.05]' : 'scale-[1.14] sm:scale-[1.18]'}
      badge={
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
            isCozy
              ? 'bg-[var(--app-garden)] text-[#fff8ee]'
              : 'bg-rose-700/95 text-white'
          }`}
        >
          {getThemeTerm(themeId, 'mob')}
        </span>
      }
      title={presentation.title}
      surfaceTone={isCozy ? 'warm' : 'dark'}
      accent={
        isCozy
          ? presentation.description
          : `${getMobWeaknessText(meta.weakness, { settings, mobId })} · ${getMobDailyActionHint(meta.weakness)}`
      }
    />
  );
}
