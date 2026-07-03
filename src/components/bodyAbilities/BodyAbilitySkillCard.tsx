import type { BodyAbilityV1Item } from '../../types/bodyAbilityV1';
import {
  BODY_ABILITY_V1_CATEGORIES,
  BODY_ABILITY_V1_TIER_LABELS,
} from '../../game/bodyAbilities/bodyAbilityConfig';
import { getBodyAbilityCategoryRoad } from '../../game/bodyAbilityAssetUi';
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

const STATUS_CAPTION: Record<BodyAbilityVisualState, string> = {
  locked: 'Тело ещё не подало сигнал — это нормально.',
  discovered: 'Сигнал тела замечен на маршруте.',
  unlocked: 'Возвращение возможности — персонаж продолжает путь.',
  recentlyUnlocked: 'Тело отвечает — свежий знак свободы.',
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

  return (
    <article
      data-testid={`body-ability-v1-${ability.id}`}
      className={`relative flex flex-col overflow-hidden rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${CARD_SHELL[visualState]} ${
        featured ? 'ring-1 ring-[var(--app-gold)]/12' : ''
      } ${visualState === 'recentlyUnlocked' ? 'motion-safe:animate-[body-ability-glow_3s_ease-in-out_infinite]' : ''}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-gold)]/20 to-transparent" />

      <span className="sr-only">{categoryMeta.label}</span>
      <span className="absolute right-3 top-3 text-[9px] font-medium uppercase tracking-wider text-violet-300/35">
        {getBodyAbilityCategoryRoad(ability.category)}
      </span>

      <div className="mb-3 flex flex-col items-center text-center">
        <BodyAbilityArtMedallion
          abilityId={ability.id}
          title={ability.title}
          emoji={ability.icon}
          category={ability.category}
          visualState={visualState}
        />
      </div>

      <h3 className="text-center text-lg font-semibold leading-snug text-[var(--app-text)]">
        {ability.title}
      </h3>

      <p
        className={`mt-1.5 text-center text-[11px] font-medium tracking-wide ${
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

      <p className="mt-2 line-clamp-3 text-center text-sm leading-snug text-[var(--app-text-muted)]">
        {ability.description}
      </p>

      {hintActive && !unlocked ? (
        <p className="mt-2 text-center text-[11px] leading-relaxed text-[var(--app-gold)]/80">
          {ability.hint}
        </p>
      ) : (
        <p className="mt-2 text-center text-[10px] leading-relaxed text-[var(--app-text-muted)]/55">
          {STATUS_CAPTION[visualState]}
        </p>
      )}

      <p className="mt-1 text-center text-[10px] text-[var(--app-text-muted)]/40">
        {BODY_ABILITY_V1_TIER_LABELS[ability.tier]}
      </p>

      <div className="mt-3">
        <div className="h-1 overflow-hidden rounded-full bg-[var(--app-bg-soft)]/60">
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

      {!unlocked ? (
        <button
          type="button"
          disabled={unlocking}
          onClick={onUnlock}
          className="mt-3 w-full rounded-xl border border-[var(--app-primary)]/35 bg-[var(--app-primary-soft)]/35 px-4 py-2.5 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50"
        >
          Я заметил улучшение
        </button>
      ) : (
        <p className="mt-3 text-center text-[11px] font-medium text-emerald-400/80">
          Тело отвечает — персонаж продолжает путь.
        </p>
      )}
    </article>
  );
}
