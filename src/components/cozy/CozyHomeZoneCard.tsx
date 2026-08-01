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
      className={`cozy-zone-card${isMax ? ' cozy-zone-card--max' : ''}`}
    >
      <div className="flex items-start gap-3 pl-1">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-panel-highlight)_80%,var(--app-garden)_20%)] text-xl"
          aria-hidden
        >
          {config.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[var(--app-text)]">{config.title}</h3>
            <span className="cozy-zone-level">Ур. {level}/3</span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{config.shortTitle} · зона дома</p>
        </div>
      </div>

      <p className="mt-3 pl-1 text-sm leading-relaxed text-[var(--app-text)]">
        {current.description}
      </p>

      {isMax ? (
        <p className="mt-3 pl-1 text-sm font-medium text-[var(--app-garden)]">
          Зона восстановлена
        </p>
      ) : next ? (
        <div className="mt-3 space-y-1.5 rounded-xl bg-[color-mix(in_srgb,var(--app-panel-highlight)_70%,transparent)] px-3 py-2.5 text-sm">
          <p className="text-[var(--app-text-muted)]">
            Дальше:{' '}
            <span className="font-medium text-[var(--app-text)]">{next.description}</span>
          </p>
          {next.cost ? (
            <p className="text-xs text-[var(--app-wood)]">Стоимость: {formatCozyCost(next.cost)}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        {isMax ? null : check.canUpgrade ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onUpgrade(zoneId)}
            className="btn-primary w-full rounded-xl px-3 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Улучшить
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--app-text-muted)]">
              Пока не хватает: {formatMissingResources(check.missingResources)}
            </p>
            <button
              type="button"
              disabled
              className="w-full rounded-xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-bg-soft)_80%,transparent)] px-3 py-2.5 text-sm font-semibold text-[var(--app-text-muted)]"
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
