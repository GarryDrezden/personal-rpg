import type { MobId } from '../../types/gameAssets';
import { getThemeTerm } from '../../constants/themeTerms';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobWeaknessText } from '../../game/dailyMobEngine';
import { getMobPresentation } from '../../game/themeEntityPresentation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { GameAssetImage } from './GameAssetImage';

type DailyMobBadgeProps = {
  mobId: MobId;
  compact?: boolean;
  large?: boolean;
  /** Dashboard: art-first vertical card with large image slot */
  prominent?: boolean;
};

export function DailyMobBadge({ mobId, compact, large, prominent }: DailyMobBadgeProps) {
  const meta = getMobMeta(mobId);
  const settings = useAppStore((s) => s.settings);
  const { themeId, isCozy } = useAppTheme();
  const presentation = getMobPresentation(themeId, mobId, meta);
  const weaknessText = isCozy
    ? presentation.description
    : getMobWeaknessText(meta.weakness, { settings, mobId });
  const term = getThemeTerm(themeId, 'mob');
  const shellClass = isCozy
    ? 'border-[var(--app-garden)]/35 bg-[color-mix(in_srgb,var(--app-card)_88%,#e4efe0)]'
    : 'border-rose-500/30 bg-[color-mix(in_srgb,#000_40%,var(--app-card))]';
  const labelClass = isCozy
    ? 'text-[var(--app-garden)]'
    : 'text-rose-200/85';

  if (prominent && !compact) {
    return (
      <div
        data-testid="daily-mob-badge"
        className={`flex flex-col overflow-hidden rounded-xl border ${shellClass}`}
      >
        <div
          className={`flex h-[5.25rem] items-center justify-center p-2 sm:h-[5.75rem] ${
            isCozy ? 'bg-[color-mix(in_srgb,var(--app-garden)_8%,transparent)]' : 'bg-black/20'
          }`}
        >
          <GameAssetImage
            variant="mob"
            src={presentation.imagePath}
            alt={presentation.title}
            fallbackCandidates={presentation.imageCandidates.slice(1)}
            fit="mob"
            className="h-full w-full"
            imageClassName="scale-[1.25] sm:scale-[1.3]"
          />
        </div>
        <div className={`border-t px-2.5 py-2 ${isCozy ? 'border-[var(--app-garden)]/20' : 'border-rose-500/20'}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>
            {term}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--app-text)]">
            {presentation.title}
          </p>
          <p className="mt-0.5 text-xs text-[var(--app-primary)]">{weaknessText}</p>
        </div>
      </div>
    );
  }

  const isLarge = large && !compact;

  return (
    <div
      data-testid="daily-mob-badge"
      className={`flex items-center rounded-lg border backdrop-blur-sm ${shellClass} ${
        isLarge ? 'gap-3 rounded-xl p-2.5' : compact ? 'gap-2 p-1.5' : 'gap-3 rounded-xl p-3'
      } ${isCozy ? '' : 'bg-black/45'}`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-lg ${
          isCozy ? 'bg-[color-mix(in_srgb,var(--app-garden)_10%,transparent)]' : 'bg-black/25'
        } ${isLarge ? 'h-16 w-16' : compact ? 'h-9 w-9 rounded-md' : 'h-12 w-12'}`}
      >
        <GameAssetImage
          variant="mob"
          src={presentation.imagePath}
          alt={presentation.title}
          fallbackCandidates={presentation.imageCandidates.slice(1)}
          fit="mob"
          className="h-full w-full"
          imageClassName={isLarge ? 'scale-[1.3]' : 'scale-110'}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold uppercase tracking-wide ${labelClass} ${
            isLarge ? 'text-xs' : 'text-[11px] sm:text-xs'
          }`}
        >
          {term}
        </p>
        <p className={`font-semibold text-[var(--app-text)] ${isLarge ? 'text-sm' : compact ? 'text-xs' : 'text-sm'}`}>
          {presentation.title}
        </p>
        <p className={`text-[var(--app-primary)] ${isLarge ? 'text-xs' : compact ? 'text-[11px]' : 'text-xs'}`}>
          {weaknessText}
        </p>
      </div>
    </div>
  );
}
