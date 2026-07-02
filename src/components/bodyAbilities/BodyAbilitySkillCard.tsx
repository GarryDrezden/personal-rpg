import type { BodyAbilityV1Item } from '../../types/bodyAbilityV1';
import {
  BODY_ABILITY_V1_CATEGORIES,
  BODY_ABILITY_V1_TIER_LABELS,
} from '../../game/bodyAbilities/bodyAbilityConfig';
import {
  BODY_ABILITY_FEATURED_IDS,
  getBodyAbilityCategoryRoad,
} from '../../game/bodyAbilityAssetUi';
import {
  BodyAbilityArtMedallion,
  resolveBodyAbilityVisualState,
  type BodyAbilityVisualState,
} from './BodyAbilityArtMedallion';

type BodyAbilitySkillCardProps = {
  item: BodyAbilityV1Item;
  onUnlock: () => void;
  unlocking?: boolean;
};

const STATUS_LABEL: Record<BodyAbilityVisualState, string | null> = {
  locked: 'На маршруте',
  discovered: 'Сигнал маршрута',
  unlocked: 'Открыта',
  recentlyUnlocked: 'Недавно открыто',
};

const CARD_SHELL: Record<BodyAbilityVisualState, string> = {
  locked:
    'border-violet-500/15 bg-gradient-to-br from-[#0e0c16]/90 via-[#12101c]/80 to-[#08070f]/95 opacity-90',
  discovered:
    'border-[var(--app-gold)]/35 bg-gradient-to-br from-violet-950/40 via-[#14101f]/90 to-[#0a0812]/95',
  unlocked:
    'border-emerald-400/30 bg-gradient-to-br from-emerald-950/25 via-[#101822]/90 to-[#080a0f]/95',
  recentlyUnlocked:
    'border-[var(--app-gold)]/45 bg-gradient-to-br from-[#18120a]/40 via-[#14101f]/95 to-[#0a0810]/95 shadow-[0_0_28px_rgba(212,165,55,0.12)]',
};

function progressPercent(state: BodyAbilityVisualState): number {
  switch (state) {
    case 'locked':
      return 12;
    case 'discovered':
      return 48;
    case 'unlocked':
    case 'recentlyUnlocked':
      return 100;
  }
}

export function BodyAbilitySkillCard({ item, onUnlock, unlocking = false }: BodyAbilitySkillCardProps) {
  const { ability, unlocked, hintActive, unlockedAt } = item;
  const visualState = resolveBodyAbilityVisualState(unlocked, hintActive, unlockedAt);
  const categoryMeta = BODY_ABILITY_V1_CATEGORIES[ability.category];
  const featured = (BODY_ABILITY_FEATURED_IDS as readonly string[]).includes(ability.id);
  const statusLabel = STATUS_LABEL[visualState];
  const progress = progressPercent(visualState);

  return (
    <article
      data-testid={`body-ability-v1-${ability.id}`}
      className={`relative flex flex-col overflow-hidden rounded-2xl border p-5 sm:p-6 ${CARD_SHELL[visualState]} ${
        featured ? 'ring-1 ring-[var(--app-gold)]/15' : ''
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-gold)]/25 to-transparent" />

      <div className="mb-5 flex flex-col items-center text-center">
        <BodyAbilityArtMedallion
          abilityId={ability.id}
          title={ability.title}
          emoji={ability.icon}
          category={ability.category}
          visualState={visualState}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-violet-500/25 bg-violet-950/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">
          {getBodyAbilityCategoryRoad(ability.category)}
        </span>
        {statusLabel ? (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              visualState === 'unlocked' || visualState === 'recentlyUnlocked'
                ? visualState === 'recentlyUnlocked'
                  ? 'bg-[var(--app-primary-soft)] text-[var(--app-gold)]'
                  : 'bg-emerald-500/15 text-emerald-400'
                : visualState === 'discovered'
                  ? 'bg-[var(--app-primary-soft)] text-[var(--app-gold)]'
                  : 'bg-[var(--app-bg-soft)] text-[var(--app-text-muted)]'
            }`}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-center text-lg font-semibold leading-snug text-[var(--app-text)] sm:text-xl">
        {ability.title}
      </h3>
      <p className="mt-1 text-center text-xs text-violet-300/60">{categoryMeta.label}</p>
      <p className="mt-3 text-center text-sm leading-relaxed text-[var(--app-text-muted)]">
        {ability.description}
      </p>
      <p className="mt-2 text-center text-[11px] text-[var(--app-text-muted)]/80">
        {BODY_ABILITY_V1_TIER_LABELS[ability.tier]} · наблюдение в жизни
      </p>

      <div className="mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]/80">
          <div
            className={`h-full rounded-full transition-all ${
              visualState === 'locked'
                ? 'bg-violet-500/35'
                : visualState === 'discovered'
                  ? 'bg-[var(--app-gold)]/55'
                  : 'bg-gradient-to-r from-emerald-500/70 to-[var(--app-gold)]/60'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {hintActive && !unlocked ? (
        <p className="mt-3 rounded-xl border border-[var(--app-gold)]/20 bg-[var(--app-primary-soft)]/30 px-3 py-2 text-center text-xs leading-relaxed text-[var(--app-gold)]">
          {ability.hint}
        </p>
      ) : null}

      {!unlocked ? (
        <button
          type="button"
          disabled={unlocking}
          onClick={onUnlock}
          className="mt-4 w-full rounded-xl border border-[var(--app-primary)]/40 bg-[var(--app-primary-soft)]/40 px-4 py-3 text-sm font-semibold text-[var(--app-text)] hover:brightness-105 disabled:opacity-50"
        >
          Я заметил улучшение
        </button>
      ) : (
        <p className="mt-4 text-center text-xs font-medium text-emerald-400/90">
          Способность на маршруте — персонаж продолжает путь.
        </p>
      )}
    </article>
  );
}
