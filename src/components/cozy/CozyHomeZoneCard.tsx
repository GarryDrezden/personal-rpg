import type { CozyHomeState, CozyHomeZoneId, CozyResourceId } from '../../types/cozyHome';
import {
  COZY_RESOURCE_LABELS,
  formatCozyCost,
} from '../../constants/cozyHomeConfig';
import {
  formatMissingResources,
  getCozyZoneDisplay,
} from '../../utils/cozyHomeEngine';
import { getCozyHomeZoneArtPath } from '../../game/cozyHomeArt';
import { GameAssetImage } from '../game/GameAssetImage';

type CozyHomeZoneCardProps = {
  home: CozyHomeState;
  zoneId: CozyHomeZoneId;
  onUpgrade: (zoneId: CozyHomeZoneId) => void;
  busy?: boolean;
};

const ZONE_TONE: Record<CozyHomeZoneId, string> = {
  porch: 'cozy-zone-card--porch',
  hallway: 'cozy-zone-card--cream',
  kitchen: 'cozy-zone-card--cream',
  bedroom: 'cozy-zone-card--cream',
  yard: 'cozy-zone-card--garden',
  garden: 'cozy-zone-card--garden',
  workshop: 'cozy-zone-card--wood',
  pet_corner: 'cozy-zone-card--companion',
};

export function CozyHomeZoneCard({
  home,
  zoneId,
  onUpgrade,
  busy = false,
}: CozyHomeZoneCardProps) {
  const { config, level, current, next, check } = getCozyZoneDisplay(home, zoneId);
  const isMax = check.isMax;
  const canUpgrade = check.canUpgrade;
  const tone = ZONE_TONE[zoneId] ?? '';
  const zoneArt = getCozyHomeZoneArtPath(zoneId);

  return (
    <article
      data-testid={`cozy-zone-${zoneId}`}
      className={[
        'cozy-zone-card',
        tone,
        isMax ? 'cozy-zone-card--max' : '',
        canUpgrade ? 'cozy-zone-card--ready' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cozy-zone-card__ornament" aria-hidden />

      {zoneArt ? (
        <div
          className="relative mb-3 h-28 w-full overflow-hidden rounded-xl border border-[var(--app-border)]"
          data-testid={`cozy-zone-art-${zoneId}`}
        >
          <GameAssetImage
            src={zoneArt}
            alt={config.title}
            variant="artifact"
            status="unlocked"
            className="absolute inset-0"
            imageClassName="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="flex items-start gap-3">
        <span className="cozy-zone-card__icon" aria-hidden>
          {config.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[var(--app-text)]">{config.title}</h3>
            <span className="cozy-zone-level">Уровень {level} / 3</span>
          </div>
          {canUpgrade ? (
            <span className="cozy-zone-ready-badge mt-1.5 inline-flex">Можно улучшить</span>
          ) : null}
          {isMax ? (
            <span className="cozy-zone-max-badge mt-1.5 inline-flex">Восстановлено</span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <div>
          <p className="cozy-zone-card__label">Сейчас</p>
          <p className="text-sm leading-relaxed text-[var(--app-text)]">{current.description}</p>
        </div>

        {isMax ? (
          <p className="text-sm font-medium text-[var(--app-garden)]">
            Зона восстановлена — здесь уже тепло и порядок.
          </p>
        ) : next ? (
          <div className="cozy-zone-card__next">
            <p className="cozy-zone-card__label">Следующее улучшение</p>
            <p className="text-sm font-medium text-[var(--app-text)]">{next.description}</p>
            {next.cost ? (
              <p className="mt-1.5 text-xs text-[var(--app-wood)]">
                Стоимость: {formatCozyCost(next.cost)}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-auto pt-4">
        {isMax ? (
          <button
            type="button"
            disabled
            className="cozy-zone-btn cozy-zone-btn--done w-full"
          >
            Зона восстановлена
          </button>
        ) : canUpgrade ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onUpgrade(zoneId)}
            data-testid={`cozy-zone-upgrade-${zoneId}`}
          >
            Улучшить
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs leading-relaxed text-[var(--app-text-muted)]">
              Не хватает: {formatMissingResources(check.missingResources)}.
              Сегодняшние действия могут принести материалы и уют.
            </p>
            <button type="button" disabled className="cozy-zone-btn cozy-zone-btn--wait w-full">
              Улучшить
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function formatResourceBadges(
  resources: CozyHomeState['resources'],
): { id: CozyResourceId; label: string; value: number }[] {
  return (Object.keys(COZY_RESOURCE_LABELS) as CozyResourceId[]).map((id) => ({
    id,
    label: COZY_RESOURCE_LABELS[id],
    value: resources[id] ?? 0,
  }));
}
