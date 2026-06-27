import { Link } from 'react-router-dom';
import type { AppThemeId } from '../../types/theme';
import type { BodyAbilityProgress } from '../../types/bodyAbilities';
import { resolveBodyAbilityText } from '../../types/bodyAbilities';
import {
  formatBodyAbilityProgressValue,
  getBodyAbilityRemainingHint,
} from '../../utils/bodyAbilityEngine';
import { Card } from '../ui/Card';
import { Sparkles } from 'lucide-react';

type NextBodyAbilityCardProps = {
  abilities: BodyAbilityProgress[];
  themeId?: AppThemeId;
  unlockedCount?: number;
  totalCount?: number;
};

export function NextBodyAbilityCard({
  abilities,
  themeId = 'cozy',
  unlockedCount,
  totalCount,
}: NextBodyAbilityCardProps) {
  const allUnlocked = abilities.length === 0;

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 shrink-0 text-[var(--app-primary)]" size={22} />
          <div>
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Следующая способность
            </h2>
            {unlockedCount !== undefined && totalCount !== undefined ? (
              <p className="text-sm text-[var(--app-text-muted)]">
                Открыто способностей: {unlockedCount} / {totalCount}
              </p>
            ) : null}
          </div>
        </div>
        <Link
          to="/growth/abilities"
          className="shrink-0 text-sm font-medium text-[var(--app-primary)] hover:underline"
        >
          Все способности →
        </Link>
      </div>

      {allUnlocked ? (
        <p className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-center text-sm text-[var(--app-text-muted)]">
          Все текущие способности открыты. Можно добавить новые этапы пути.
        </p>
      ) : (
        <div className="space-y-3">
          {abilities.map((progress) => {
            const text = resolveBodyAbilityText(progress.ability, themeId);
            const hint = getBodyAbilityRemainingHint(progress);

            return (
              <div
                key={progress.ability.id}
                className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl opacity-80" aria-hidden>
                    {progress.ability.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--app-text)]">{text.title}</p>
                    <p className="text-sm text-[var(--app-text-muted)]">
                      {formatBodyAbilityProgressValue(progress)}
                    </p>
                    {hint ? (
                      <p className="mt-1 text-xs text-[var(--app-primary)]">{hint}</p>
                    ) : null}
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--app-card)]">
                      <div
                        className="h-full rounded-full bg-[var(--app-primary)]"
                        style={{ width: `${progress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
