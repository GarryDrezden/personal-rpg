import type { MobId } from '../../types/gameAssets';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobWeaknessText } from '../../game/dailyMobEngine';
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
  const weaknessText = getMobWeaknessText(meta.weakness, { settings, mobId });

  if (prominent && !compact) {
    return (
      <div
        data-testid="daily-mob-badge"
        className="flex flex-col overflow-hidden rounded-xl border border-rose-500/30 bg-[color-mix(in_srgb,#000_40%,var(--app-card))]"
      >
        <div className="flex h-[5.25rem] items-center justify-center bg-black/20 p-2 sm:h-[5.75rem]">
          <GameAssetImage
            variant="mob"
            src={meta.image}
            alt={meta.title}
            fit="mob"
            className="h-full w-full"
            imageClassName="scale-[1.25] sm:scale-[1.3]"
          />
        </div>
        <div className="border-t border-rose-500/20 px-2.5 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-200/85">
            Моб дня
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--app-text)]">
            {meta.title}
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
      className={`flex items-center rounded-lg border border-rose-500/25 bg-black/45 backdrop-blur-sm ${
        isLarge ? 'gap-3 rounded-xl p-2.5' : compact ? 'gap-2 p-1.5' : 'gap-3 rounded-xl p-3'
      }`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-lg bg-black/25 ${
          isLarge ? 'h-16 w-16' : compact ? 'h-9 w-9 rounded-md' : 'h-12 w-12'
        }`}
      >
        <GameAssetImage
          variant="mob"
          src={meta.image}
          alt={meta.title}
          fit="mob"
          className="h-full w-full"
          imageClassName={isLarge ? 'scale-[1.3]' : 'scale-110'}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold uppercase tracking-wide text-rose-200/80 ${
            isLarge ? 'text-xs' : 'text-[11px] sm:text-xs'
          }`}
        >
          Моб дня
        </p>
        <p className={`font-semibold text-[var(--app-text)] ${isLarge ? 'text-sm' : compact ? 'text-xs' : 'text-sm'}`}>
          {meta.title}
        </p>
        <p className={`text-[var(--app-primary)] ${isLarge ? 'text-xs' : compact ? 'text-[11px]' : 'text-xs'}`}>
          {weaknessText}
        </p>
      </div>
    </div>
  );
}
