import type { MobId } from '../../types/gameAssets';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobWeaknessText } from '../../game/dailyMobEngine';
import { GameAssetImage } from './GameAssetImage';

type DailyMobBadgeProps = {
  mobId: MobId;
};

export function DailyMobBadge({ mobId }: DailyMobBadgeProps) {
  const meta = getMobMeta(mobId);

  return (
    <div
      data-testid="daily-mob-badge"
      className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-[color-mix(in_srgb,#f43f5e_6%,var(--app-card))] p-3"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/20">
        <GameAssetImage
          variant="mob"
          src={meta.image}
          alt={meta.title}
          className="h-full w-full"
          imageClassName="object-contain"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Моб дня
        </p>
        <p className="truncate text-sm font-semibold text-[var(--app-text)]">{meta.title}</p>
        <p className="text-xs text-[var(--app-primary)]">{getMobWeaknessText(meta.weakness)}</p>
      </div>
    </div>
  );
}
