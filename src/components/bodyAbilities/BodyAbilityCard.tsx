import type { AppThemeId } from '../../types/theme';
import type { BodyAbilityProgress } from '../../types/bodyAbilities';
import { resolveBodyAbilityText } from '../../types/bodyAbilities';
import { BODY_ABILITY_TIERS } from '../../constants/bodyAbilities';
import { Card } from '../ui/Card';

type BodyAbilityCardProps = {
  progress: BodyAbilityProgress;
  themeId?: AppThemeId;
};

export function BodyAbilityCard({ progress, themeId = 'cozy' }: BodyAbilityCardProps) {
  const { ability, unlocked, progressPercent, current, target } = progress;
  const text = resolveBodyAbilityText(ability, themeId);
  const tierStyle = BODY_ABILITY_TIERS[ability.tier];
  const isLegendary = ability.tier === 'legendary';
  const isEpic = ability.tier === 'epic';

  return (
    <Card
      className={`relative overflow-hidden transition-opacity ${
        unlocked ? '' : 'opacity-75'
      } ${tierStyle.borderClass} ${
        unlocked && isLegendary ? 'achievement-legendary-glow' : ''
      } ${unlocked && isEpic ? 'border-violet-400/40' : ''}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`text-3xl ${unlocked ? '' : 'grayscale opacity-50'}`}
          aria-hidden
        >
          {ability.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold ${
                unlocked ? 'text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'
              }`}
            >
              {text.title}
            </h3>
            {unlocked ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
                Открыта
              </span>
            ) : null}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${tierStyle.badgeClass}`}
            >
              {BODY_ABILITY_TIERS[ability.tier].label}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{text.description}</p>
          {ability.effectLabel && unlocked ? (
            <p className="mt-2 text-xs font-medium text-[var(--app-primary)]">
              {ability.effectLabel}
            </p>
          ) : null}
          {!unlocked ? (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
                <span>
                  {current} / {target}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--app-secondary)] transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
