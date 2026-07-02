import type { BodyAbilityV1Item } from '../../types/bodyAbilityV1';
import { BODY_ABILITY_V1_TIER_LABELS } from '../../game/bodyAbilities/bodyAbilityConfig';
import { Card } from '../ui/Card';

type BodyAbilityV1CardProps = {
  item: BodyAbilityV1Item;
  onUnlock: () => void;
  unlocking?: boolean;
};

export function BodyAbilityV1Card({ item, onUnlock, unlocking = false }: BodyAbilityV1CardProps) {
  const { ability, unlocked, hintActive } = item;

  return (
    <Card
      data-testid={`body-ability-v1-${ability.id}`}
      className={`${unlocked ? 'border-emerald-400/35 bg-emerald-500/5' : 'opacity-90'} ${
        hintActive && !unlocked ? 'border-[var(--app-gold)]/30' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${unlocked ? '' : 'grayscale opacity-60'}`} aria-hidden>
          {ability.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--app-text)]">{ability.title}</h3>
            {unlocked ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
                Открыта
              </span>
            ) : hintActive ? (
              <span className="rounded-full bg-[var(--app-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--app-gold)]">
                Возможный сигнал
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{ability.description}</p>
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            {BODY_ABILITY_V1_TIER_LABELS[ability.tier]} · наблюдение, не диагноз
          </p>
          {hintActive && !unlocked ? (
            <p className="mt-2 text-xs text-[var(--app-gold)]">{ability.hint}</p>
          ) : null}
          {!unlocked ? (
            <button
              type="button"
              disabled={unlocking}
              onClick={onUnlock}
              className="mt-3 w-full rounded-xl border border-[var(--app-primary)]/40 bg-[var(--app-primary-soft)]/50 px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50 sm:w-auto"
            >
              Я заметил улучшение
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
