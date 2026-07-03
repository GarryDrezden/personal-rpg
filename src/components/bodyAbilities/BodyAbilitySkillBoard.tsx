import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import {
  getBodyAbilitiesByRing,
  getBodyAbilityV1ById,
} from '../../game/bodyAbilities/bodyAbilityConfig';
import {
  getBodyAbilityV1Items,
  getBodyAbilityV1Summary,
} from '../../game/bodyAbilities/bodyAbilityV1Engine';
import {
  BODY_ABILITY_SKILL_BOARD_SECTIONS,
  isBodyAbilityFeaturedOnSkillBoard,
  sortBodyAbilitySkillBoardItems,
} from '../../game/bodyAbilityAssetUi';
import { useBodyAbilityV1Actions } from '../../hooks/useBodyAbilityV1Actions';
import { BodyAbilityFutureSkillCard } from './BodyAbilityFutureSkillCard';
import { BodyAbilitySkillCard } from './BodyAbilitySkillCard';
import {
  GROWTH_HUB_EYEBROW,
  GROWTH_HUB_PANEL,
  GROWTH_HUB_RADIAL_GOLD,
  GROWTH_HUB_RADIAL_VIOLET,
} from '../growth/growthHubUi';

type BodyAbilitySkillBoardProps = {
  showPageHero?: boolean;
  embedded?: boolean;
};

function orderAbilitiesByDisplayOrder(
  abilities: ReturnType<typeof getBodyAbilitiesByRing>,
  displayOrder: readonly string[],
) {
  const byId = new Map(abilities.map((a) => [a.id, a]));
  return displayOrder
    .map((id) => byId.get(id))
    .filter((a): a is NonNullable<typeof a> => a != null);
}

export function BodyAbilitySkillBoard({
  showPageHero = true,
  embedded = false,
}: BodyAbilitySkillBoardProps) {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { unlockAbility } = useBodyAbilityV1Actions();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [expandedRings, setExpandedRings] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      BODY_ABILITY_SKILL_BOARD_SECTIONS.map((s) => [s.ring, s.defaultExpanded]),
    ),
  );

  const params = useMemo(
    () => ({ settings, dailyEntries, measurements }),
    [settings, dailyEntries, measurements],
  );

  const activeItems = useMemo(() => getBodyAbilityV1Items(params), [params]);
  const summary = useMemo(() => getBodyAbilityV1Summary(params), [params]);

  const onRouteCount = useMemo(
    () => activeItems.filter((i) => !i.unlocked && i.hintActive).length,
    [activeItems],
  );

  const activeItemsByRing = useMemo(() => {
    const earlySection = BODY_ABILITY_SKILL_BOARD_SECTIONS[0];
    return sortBodyAbilitySkillBoardItems(activeItems, earlySection.displayOrder);
  }, [activeItems]);

  const lastUnlocked = useMemo(() => {
    const unlocked = activeItems.filter((i) => i.unlocked && i.unlockedAt);
    if (unlocked.length === 0) return null;
    return unlocked.sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))[0];
  }, [activeItems]);

  const handleUnlock = async (abilityId: string) => {
    const ability = getBodyAbilityV1ById(abilityId);
    if (!ability || ability.availability !== 'active') return;
    setUnlockingId(abilityId);
    try {
      const result = await unlockAbility(ability, 'manual');
      if (result.unlocked) setReaction(result.reaction);
    } finally {
      setUnlockingId(null);
    }
  };

  const toggleRing = (ring: string) => {
    setExpandedRings((prev) => ({ ...prev, [ring]: !prev[ring] }));
  };

  const showHero = showPageHero || embedded;

  return (
    <div data-testid="body-abilities-skill-board" className="space-y-8">
      {showHero ? (
        <header
          className={
            embedded
              ? `${GROWTH_HUB_PANEL} px-4 py-5 sm:px-6`
              : 'relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-[#14101f] via-[#0e0c18] to-[#08070f] px-5 py-6 sm:px-8 sm:py-8'
          }
        >
          <div className={GROWTH_HUB_RADIAL_GOLD} aria-hidden />
          {!embedded ? (
            <div className={GROWTH_HUB_RADIAL_VIOLET} aria-hidden />
          ) : null}
          <div className="relative">
            <p className={embedded ? GROWTH_HUB_EYEBROW : 'text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/90'}>
              Кодекс тела
            </p>
            <h1
              className={
                embedded
                  ? 'mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl'
                  : 'mt-2 text-2xl font-bold text-[var(--app-text)] sm:text-3xl'
              }
            >
              Способности тела
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
              Способности показывают прогресс, который не всегда виден на весах. Каждая — знак,
              что тело возвращает свободу в обычных действиях.
            </p>
            {!embedded ? (
              <p className="mt-2 max-w-2xl text-base font-medium text-[var(--app-text)]">
                Вес стоит, но персонаж не стоит.
              </p>
            ) : null}
          </div>
        </header>
      ) : null}

      {reaction ? (
        <p
          role="status"
          className="rounded-xl border border-[var(--app-gold)]/35 bg-[var(--app-primary-soft)]/50 px-4 py-3 text-sm text-[var(--app-text)]"
        >
          {reaction}
        </p>
      ) : null}

      <div className="mb-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--app-text)]">
            Способности тела
          </h2>
          {!showHero ? (
            <>
              <p className="mt-1.5 text-sm font-medium text-[var(--app-text)]">
                Вес стоит, но персонаж не стоит.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
                Способности показывают прогресс, который не всегда виден на весах.
              </p>
            </>
          ) : null}
        </div>

        <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[var(--app-text-muted)]">Открыто:</dt>
            <dd className="font-semibold text-[var(--app-text)]">
              {summary.unlockedCount} из {summary.totalCount} активных
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[var(--app-text-muted)]">На маршруте:</dt>
            <dd className="font-semibold text-[var(--app-gold)]">{onRouteCount}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[var(--app-text-muted)]">В дальнем пути:</dt>
            <dd className="font-semibold text-violet-200/60">{summary.futureCount}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-6">
        {BODY_ABILITY_SKILL_BOARD_SECTIONS.map((section) => {
          const isFuture = section.ring !== 'early_signals';
          const expanded = expandedRings[section.ring] ?? section.defaultExpanded;
          const futureAbilities = isFuture
            ? orderAbilitiesByDisplayOrder(
                getBodyAbilitiesByRing(section.ring),
                section.displayOrder,
              )
            : [];

          return (
            <section
              key={section.ring}
              data-testid={`body-ability-ring-${section.ring}`}
              className={
                isFuture
                  ? 'rounded-2xl border border-violet-500/12 bg-[#0a0810]/40 px-4 py-4 sm:px-5'
                  : undefined
              }
            >
              <div className="mb-4">
                {isFuture ? (
                  <button
                    type="button"
                    onClick={() => toggleRing(section.ring)}
                    className="flex w-full items-start justify-between gap-3 text-left"
                    aria-expanded={expanded}
                  >
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-violet-200/55">
                        {section.title}
                      </h3>
                      <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--app-text-muted)]/50">
                        {section.subtitle}
                      </p>
                    </div>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 text-violet-300/35 transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--app-text)]">
                      {section.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--app-text-muted)]">
                      {section.subtitle}
                    </p>
                  </>
                )}
              </div>

              {(!isFuture || expanded) && (
                <div
                  className={
                    isFuture
                      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr'
                      : 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr'
                  }
                >
                  {isFuture
                    ? futureAbilities.map((ability) => (
                        <BodyAbilityFutureSkillCard key={ability.id} ability={ability} />
                      ))
                    : activeItemsByRing.map((item) => (
                        <BodyAbilitySkillCard
                          key={item.ability.id}
                          item={item}
                          featured={isBodyAbilityFeaturedOnSkillBoard(item.ability.id)}
                          unlocking={unlockingId === item.ability.id}
                          onUnlock={() => void handleUnlock(item.ability.id)}
                        />
                      ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <footer className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#101522]/80 via-[#0e0c16]/90 to-[#08070f] px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-[var(--app-text)]">Тело — твой фундамент</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--app-text-muted)]">
          Способности тела показывают прогресс, который не всегда виден на весах: легче
          двигаться, проще вставать, спокойнее проходить длинные маршруты.
        </p>

        {summary.unlockedCount > 0 ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/40 px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                Открыто
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-[var(--app-text)]">
                {summary.unlockedCount} из {summary.totalCount} активных
              </dd>
            </div>
            {summary.nextSuggested ? (
              <div className="rounded-xl border border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/40 px-3 py-2">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                  Ближайшая на маршруте
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-[var(--app-text)]">
                  {summary.nextSuggested.title}
                </dd>
              </div>
            ) : null}
            {lastUnlocked ? (
              <div className="rounded-xl border border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/40 px-3 py-2">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                  Последняя открытая
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-[var(--app-text)]">
                  {lastUnlocked.ability.title}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-[var(--app-text-muted)]">
            Первые способности проявятся по мере маршрута. Даже минимальный день может удержать
            движение — тело отвечает, персонаж продолжает путь.
          </p>
        )}
      </footer>
    </div>
  );
}
