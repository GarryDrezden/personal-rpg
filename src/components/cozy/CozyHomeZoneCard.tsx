import type { CozyHomeState, CozyHomeZoneId, CozyResourceId } from '../../types/cozyHome';
import {
  COZY_RESOURCE_LABELS,
  formatCozyCost,
} from '../../constants/cozyHomeConfig';
import {
  formatMissingResources,
  getCozyZoneDisplay,
} from '../../utils/cozyHomeEngine';

type CozyHomeZoneCardProps = {
  home: CozyHomeState;
  zoneId: CozyHomeZoneId;
  onUpgrade: (zoneId: CozyHomeZoneId) => void;
  busy?: boolean;
};

export function CozyHomeZoneCard({
  home,
  zoneId,
  onUpgrade,
  busy = false,
}: CozyHomeZoneCardProps) {
  const { config, level, current, next, check } = getCozyZoneDisplay(home, zoneId);
  const isMax = check.isMax;

  return (
    <article
      data-testid={`cozy-zone-${zoneId}`}
      className="flex flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]/85 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {config.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-[var(--app-text)]">{config.title}</h3>
          <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
            Уровень {level} / 3
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--app-text)]">{current.description}</p>

      {isMax ? (
        <p className="mt-3 text-sm font-medium text-[var(--app-gold)]">Зона восстановлена</p>
      ) : next ? (
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-[var(--app-text-muted)]">
            Следующее: <span className="text-[var(--app-text)]">{next.description}</span>
          </p>
          {next.cost ? (
            <p className="text-xs text-[var(--app-text-muted)]">
              Стоимость: {formatCozyCost(next.cost)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        {isMax ? null : check.canUpgrade ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onUpgrade(zoneId)}
            className="btn-primary w-full rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Улучшить
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--app-text-muted)]">
              Не хватает: {formatMissingResources(check.missingResources)}
            </p>
            <button
              type="button"
              disabled
              className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-text-muted)] opacity-70"
            >
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
