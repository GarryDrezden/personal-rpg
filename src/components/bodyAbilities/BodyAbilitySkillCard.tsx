import type { BodyAbilityV1Item } from '../../types/bodyAbilityV1';
import {
  BODY_ABILITY_V1_CATEGORIES,
  BODY_ABILITY_V1_TIER_LABELS,
} from '../../game/bodyAbilities/bodyAbilityConfig';
import {
  BodyAbilityArtMedallion,
  resolveBodyAbilityVisualState,
  type BodyAbilityVisualState,
} from './BodyAbilityArtMedallion';

type BodyAbilitySkillCardProps = {
  item: BodyAbilityV1Item;
  onUnlock: () => void;
  unlocking?: boolean;
  featured?: boolean;
};

const STATUS_LABEL: Record<BodyAbilityVisualState, string> = {
  locked: 'Ещё проявится',
  discovered: 'На маршруте',
  unlocked: 'Открыто',
  recentlyUnlocked: 'Недавно открыто',
};

const CARD_SHELL: Record<BodyAbilityVisualState, string> = {
  locked:
    'border-violet-500/20 bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/90 to-[#08070f]/95',
  discovered:
    'border-[var(--app-gold)]/30 bg-gradient-to-br from-violet-950/30 via-[#14101f]/92 to-[#0a0812]/95 shadow-[0_0_20px_rgba(212,165,55,0.08)] ring-1 ring-[var(--app-gold)]/20',
  unlocked:
    'border-emerald-400/35 bg-gradient-to-br from-emerald-950/20 via-[#101822]/92 to-[#080a0f]/95 shadow-[0_0_24px_rgba(52,211,153,0.1)]',
  recentlyUnlocked:
    'border-[var(--app-gold)]/40 bg-gradient-to-br from-[#18120a]/35 via-[#14101f]/95 to-[#0a0810]/95 shadow-[0_0_28px_rgba(212,165,55,0.14)] ring-1 ring-[var(--app-gold)]/25',
};

function progressPercent(state: BodyAbilityVisualState): number {
  switch (state) {
    case 'locked':
      return 10;
    case 'discovered':
      return 52;
    case 'unlocked':
    case 'recentlyUnlocked':
      return 100;
  }
}

const CARD_FOOTER_ACTION_CLASS =
  'flex min-h-[2.75rem] w-full items-center justify-center';

function CardAction({
  visualState,
  hintActive,
  unlocked,
  unlocking,
  onUnlock,
}: {
  visualState: BodyAbilityVisualState;
  hintActive: boolean;
  unlocked: boolean;
  unlocking: boolean;
  onUnlock: () => void;
}) {
  if (visualState === 'recentlyUnlocked') {
    return (
      <div className={CARD_FOOTER_ACTION_CLASS}>
        <p className="text-center text-[11px] font-medium text-[var(--app-gold)]/90">
          Недавно открыто.
        </p>
      </div>
    );
  }

  if (visualState === 'unlocked') {
    return (
      <div className={CARD_FOOTER_ACTION_CLASS}>
        <p className="text-center text-[11px] font-medium text-emerald-400/85">
          Способность открыта.
        </p>
      </div>
    );
  }

  if (hintActive && !unlocked) {
    return (
      <div className={CARD_FOOTER_ACTION_CLASS}>
        <button
          type="button"
          disabled={unlocking}
          onClick={onUnlock}
          className="w-full rounded-xl border border-[var(--app-primary)]/35 bg-[var(--app-primary-soft)]/35 px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50"
        >
          Я заметил улучшение
        </button>
      </div>
    );
  }

  return (
    <div className={CARD_FOOTER_ACTION_CLASS}>
      <p className="text-center text-[11px] leading-snug text-[var(--app-text-muted)]/60">
        Способность ещё проявится на маршруте.
      </p>
    </div>
  );
}

export function BodyAbilitySkillCard({
  item,
  onUnlock,
  unlocking = false,
  featured = false,
}: BodyAbilitySkillCardProps) {
  const { ability, unlocked, hintActive, unlockedAt } = item;
  const visualState = resolveBodyAbilityVisualState(unlocked, hintActive, unlockedAt);
  const categoryMeta = BODY_ABILITY_V1_CATEGORIES[ability.category];
  const statusLabel = STATUS_LABEL[visualState];
  const progress = progressPercent(visualState);
  const showHint = hintActive && !unlocked;

  return (
    <article
      data-testid={`body-ability-v1-${ability.id}`}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border px-4 py-3.5 sm:px-4 sm:py-4 ${CARD_SHELL[visualState]} ${
        featured ? 'ring-1 ring-[var(--app-gold)]/12' : ''
      } ${visualState === 'recentlyUnlocked' ? 'motion-safe:animate-[body-ability-glow_3s_ease-in-out_infinite]' : ''}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-gold)]/20 to-transparent" />

      <span className="absolute right-3 top-2.5 text-[9px] font-medium tracking-wide text-violet-300/40">
        {categoryMeta.label}
      </span>

      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex flex-col items-center text-center">
          <BodyAbilityArtMedallion
            abilityId={ability.id}
            title={ability.title}
            category={ability.category}
            visualState={visualState}
          />
        </div>

        <h3 className="text-center text-lg font-semibold leading-snug text-[var(--app-text)]">
          {ability.title}
        </h3>

        <p
          className={`mt-1 text-center text-[11px] font-medium tracking-wide ${
            visualState === 'discovered'
              ? 'text-[var(--app-gold)]/85'
              : visualState === 'unlocked' || visualState === 'recentlyUnlocked'
                ? visualState === 'recentlyUnlocked'
                  ? 'text-[var(--app-gold)]'
                  : 'text-emerald-400/90'
                : 'text-[var(--app-text-muted)]/75'
          }`}
        >
          {statusLabel}
        </p>

        <p className="mt-1.5 min-h-[2.75rem] line-clamp-2 text-center text-sm leading-snug text-[var(--app-text-muted)]">
          {ability.description}
        </p>

        <div className="mt-1 min-h-[2.5rem]">
          {showHint ? (
            <p className="line-clamp-2 text-center text-[10px] leading-snug text-[var(--app-gold)]/75">
              {ability.hint}
            </p>
          ) : null}
        </div>

        <p className="mt-1 text-center text-[10px] text-[var(--app-text-muted)]/35">
          {BODY_ABILITY_V1_TIER_LABELS[ability.tier]}
        </p>
      </div>

      <div className="mt-auto shrink-0 space-y-2 pt-2">
        <div>
          <div className="h-0.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                visualState === 'locked'
                  ? 'bg-violet-500/25'
                  : visualState === 'discovered'
                    ? 'bg-[var(--app-gold)]/40'
                    : 'bg-gradient-to-r from-emerald-500/55 to-[var(--app-gold)]/45'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <CardAction
          visualState={visualState}
          hintActive={hintActive}
          unlocked={unlocked}
          unlocking={unlocking}
          onUnlock={onUnlock}
        />
      </div>
    </article>
  );
}
