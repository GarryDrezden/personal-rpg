import { useMemo, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { BODY_ABILITIES_V1 } from '../../game/bodyAbilities/bodyAbilityConfig';
import {
  getBodyAbilityV1Items,
  getBodyAbilityV1Summary,
} from '../../game/bodyAbilities/bodyAbilityV1Engine';
import { BODY_ABILITY_FEATURED_IDS } from '../../game/bodyAbilityAssetUi';
import { useBodyAbilityV1Actions } from '../../hooks/useBodyAbilityV1Actions';
import { BodyAbilitySkillCard } from './BodyAbilitySkillCard';

type BodyAbilitySkillBoardProps = {
  showPageHero?: boolean;
};

export function BodyAbilitySkillBoard({ showPageHero = true }: BodyAbilitySkillBoardProps) {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { unlockAbility } = useBodyAbilityV1Actions();
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);

  const params = useMemo(
    () => ({ settings, dailyEntries, measurements }),
    [settings, dailyEntries, measurements],
  );

  const items = useMemo(() => getBodyAbilityV1Items(params), [params]);
  const summary = useMemo(() => getBodyAbilityV1Summary(params), [params]);

  const onRouteCount = useMemo(
    () => items.filter((i) => !i.unlocked && i.hintActive).length,
    [items],
  );
  const remainingCount = useMemo(
    () => items.filter((i) => !i.unlocked && !i.hintActive).length,
    [items],
  );

  const featuredItems = useMemo(
    () =>
      BODY_ABILITY_FEATURED_IDS.map((id) => items.find((i) => i.ability.id === id)).filter(
        (item): item is (typeof items)[number] => item != null,
      ),
    [items],
  );

  const otherItems = useMemo(
    () => items.filter((i) => !(BODY_ABILITY_FEATURED_IDS as readonly string[]).includes(i.ability.id)),
    [items],
  );

  const lastUnlocked = useMemo(() => {
    const unlocked = items.filter((i) => i.unlocked && i.unlockedAt);
    if (unlocked.length === 0) return null;
    return unlocked.sort((a, b) => (b.unlockedAt ?? '').localeCompare(a.unlockedAt ?? ''))[0];
  }, [items]);

  const handleUnlock = async (abilityId: string) => {
    const ability = BODY_ABILITIES_V1.find((a) => a.id === abilityId);
    if (!ability) return;
    setUnlockingId(abilityId);
    try {
      const result = await unlockAbility(ability, 'manual');
      if (result.unlocked) setReaction(result.reaction);
    } finally {
      setUnlockingId(null);
    }
  };

  return (
    <div data-testid="body-abilities-skill-board" className="space-y-8">
      {showPageHero ? (
        <header className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-[#14101f] via-[#0e0c18] to-[#08070f] px-5 py-6 sm:px-8 sm:py-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,165,55,0.08),transparent_55%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(88,28,135,0.12),transparent_50%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/90">
              Кодекс тела
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--app-text)] sm:text-3xl">
              Способности тела
            </h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-[var(--app-text)]">
              Вес стоит, но персонаж не стоит.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
              Способности показывают прогресс, который не всегда виден на весах. Каждая — знак,
              что тело возвращает свободу в обычных действиях.
            </p>
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

      <section>
        <div className="mb-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--app-text)]">
              Способности тела
            </h2>
            {!showPageHero ? (
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
                {summary.unlockedCount} из {summary.totalCount}
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-[var(--app-text-muted)]">На маршруте:</dt>
              <dd className="font-semibold text-[var(--app-gold)]">{onRouteCount}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-[var(--app-text-muted)]">Осталось проявиться:</dt>
              <dd className="font-semibold text-violet-200/80">{remainingCount}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div>
            <p className="body-ability-group-label mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--app-gold)]/88">
              Первые сигналы тела
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featuredItems.map((item) => (
                <BodyAbilitySkillCard
                  key={item.ability.id}
                  item={item}
                  featured
                  unlocking={unlockingId === item.ability.id}
                  onUnlock={() => void handleUnlock(item.ability.id)}
                />
              ))}
            </div>
          </div>

          {otherItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {otherItems.map((item) => (
                <BodyAbilitySkillCard
                  key={item.ability.id}
                  item={item}
                  unlocking={unlockingId === item.ability.id}
                  onUnlock={() => void handleUnlock(item.ability.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

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
                {summary.unlockedCount} из {summary.totalCount}
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
