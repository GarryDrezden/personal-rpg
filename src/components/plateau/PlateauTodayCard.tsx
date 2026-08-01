import type { PlateauSnapshot } from '../../types/plateauV1';
import { getThemeTerm } from '../../constants/themeTerms';
import { PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID } from '../../game/manifestAssetUi';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { CozyArtPlaceholder } from '../game/CozyArtPlaceholder';
import { Card } from '../ui/Card';

type PlateauTodayCardProps = {
  snapshot: PlateauSnapshot;
  saving?: boolean;
  onEnableMinimal: () => void;
  onMarkPlateau: () => void;
  onClearPlateau: () => void;
  onDismissHint: () => void;
};

export function PlateauTodayCard({
  snapshot,
  saving = false,
  onEnableMinimal,
  onMarkPlateau,
  onClearPlateau,
  onDismissHint,
}: PlateauTodayCardProps) {
  const { themeId, isCozy } = useAppTheme();
  if (snapshot.mode === 'none') return null;

  const isActive = snapshot.mode === 'active';
  const isSoftHint = snapshot.mode === 'soft_hint';
  const plateauArt = isCozy ? (
    <CozyArtPlaceholder
      label={getThemeTerm(themeId, 'plateauPossible')}
      layout="icon"
      testId="plateau-artifact-art"
    />
  ) : (
    <ManifestArtScene
      assetId={PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID}
      alt="Камень перевала"
      layout="artifact-icon"
      testId="plateau-artifact-art"
    />
  );

  if (isSoftHint) {
    return (
      <Card
        data-testid="plateau-today-card"
        className="border-[var(--app-gold)]/20 bg-[var(--app-primary-soft)]/25 px-4 py-3"
      >
        <div className="flex items-start gap-3">
          {plateauArt}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
              {getThemeTerm(themeId, 'plateauPossible')}
            </p>
            <p className="mt-1 text-sm text-[var(--app-text)]">{snapshot.title}</p>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">{snapshot.supportiveLine}</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 pl-[3.75rem]">
          <button
            type="button"
            disabled={saving}
            onClick={onMarkPlateau}
            className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
          >
            {getThemeTerm(themeId, 'plateauMark')}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onDismissHint}
            className="text-xs text-[var(--app-text-muted)] hover:underline disabled:opacity-50"
          >
            Скрыть подсказку
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      data-testid="plateau-today-card"
      className="border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/35"
    >
      <div className="flex items-start gap-3">
        {plateauArt}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
            {isActive
              ? getThemeTerm(themeId, 'plateauActive')
              : getThemeTerm(themeId, 'plateauPossible')}
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--app-text)]">{snapshot.title}</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{snapshot.description}</p>
          <p className="mt-2 text-sm text-[var(--app-text)]">{snapshot.supportiveLine}</p>
        </div>
      </div>

      {snapshot.routeHolding.signalLines.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-[var(--app-text-muted)]">
          {snapshot.routeHolding.signalLines.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-xs text-[var(--app-text-muted)]">
        {snapshot.hasWeightData
          ? `Дней без нового лучшего веса: ${snapshot.daysSinceBestWeight}`
          : isCozy
            ? 'Отметь паузу роста вручную, если сейчас так и есть.'
            : 'Отметь перевал вручную, если это про твой маршрут сейчас.'}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {isActive ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onEnableMinimal}
              className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
            >
              Удержать сегодня минимально
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onClearPlateau}
              className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-medium text-[var(--app-text-muted)]"
            >
              {isCozy ? 'Пауза пройдена' : 'Перевал пройден'}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onMarkPlateau}
              className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
            >
              {getThemeTerm(themeId, 'plateauMark')}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onDismissHint}
              className="text-xs text-[var(--app-text-muted)] hover:underline disabled:opacity-50"
            >
              Скрыть подсказку
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
