import type { MobId } from '../../types/gameAssets';
import { getMobMeta } from '../../game/assetRegistry';
import { getMobWeaknessText } from '../../game/dailyMobEngine';
import { Card } from '../ui/Card';
import { GameAssetImage } from './GameAssetImage';

type DailyMobCardProps = {
  mobId: MobId;
  compact?: boolean;
};

export function DailyMobCard({ mobId, compact = false }: DailyMobCardProps) {
  const meta = getMobMeta(mobId);

  return (
    <Card data-testid="daily-mob-card" className={compact ? 'p-4' : ''}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
        Моб дня
      </p>
      <div className={`mt-3 flex gap-4 ${compact ? 'items-center' : 'flex-col sm:flex-row'}`}>
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] ${
            compact ? 'h-28 w-28' : 'h-40 w-40'
          }`}
        >
          <GameAssetImage
            variant="mob"
            src={meta.image}
            alt={meta.title}
            className="h-full w-full"
            imageClassName="object-contain"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--app-text)]">{meta.title}</h3>
          <p className="text-xs text-[var(--app-primary)]">{meta.subtitle}</p>
          {!compact && (
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{meta.description}</p>
          )}
          <p className="mt-2 text-xs font-medium text-[var(--app-text)]">
            {getMobWeaknessText(meta.weakness)}
          </p>
        </div>
      </div>
    </Card>
  );
}
