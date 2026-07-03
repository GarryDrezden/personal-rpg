import { useMemo, useRef, useState } from 'react';

import { Sparkles, Trophy } from 'lucide-react';

import { useAppStore } from '../store/appStore';

import { useAchievementStore } from '../store/achievementStore';

import { ACHIEVEMENTS, ACHIEVEMENT_BY_ID } from '../constants/achievements';

import { AchievementCard } from '../components/achievements/AchievementCard';

import { AchievementCategoryGrid } from '../components/achievements/AchievementCategoryGrid';

import {

  AchievementFilters,

  type StatusFilter,

} from '../components/achievements/AchievementFilters';

import { AchievementIcon } from '../components/achievements/AchievementIcon';

import { ProgressBar } from '../components/ui/ProgressBar';

import { calcTotalEarnedXP } from '../utils/points';

import { getAchievementProgress } from '../utils/achievementEngine';

import type { Achievement, AchievementCategory } from '../types/achievements';

import { formatDateRu } from '../utils/dates';

import {

  CLOSE_UNLOCK_MIN_PERCENT,

  COLLECTION_CATEGORIES,

  DISPLAY_CATEGORY_LABELS,
  HERO_SUPPORTING,

  HERO_TITLE,

  TROPHY_PANEL,

  TROPHY_SECTION,

} from '../components/achievements/achievementsUi';



function sortAchievements(

  list: Achievement[],

  unlockedMap: Map<string, { unlockedAt: string }>,

  progressMap: Map<string, { percent: number }>,

): Achievement[] {

  return [...list].sort((a, b) => {

    const aUnlocked = unlockedMap.has(a.id);

    const bUnlocked = unlockedMap.has(b.id);

    if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;

    if (aUnlocked && bUnlocked) {

      return (

        unlockedMap.get(b.id)!.unlockedAt.localeCompare(unlockedMap.get(a.id)!.unlockedAt)

      );

    }

    const aPct = progressMap.get(a.id)?.percent ?? 0;

    const bPct = progressMap.get(b.id)?.percent ?? 0;

    if (aPct !== bPct) return bPct - aPct;

    return a.title.localeCompare(b.title, 'ru');

  });

}



export function AchievementsPage({ embedded = false }: { embedded?: boolean }) {

  const { dailyEntries, measurements, settings } = useAppStore();

  const unlockedAchievements = useAchievementStore((s) => s.unlockedAchievements);

  const collectionRef = useRef<HTMLDivElement>(null);



  const [category, setCategory] = useState<AchievementCategory | 'all'>('all');

  const [tier, setTier] = useState<'all' | Achievement['tier']>('all');

  const [status, setStatus] = useState<StatusFilter>('all');



  const totalXp = calcTotalEarnedXP(dailyEntries, measurements, settings);

  const progressList = useMemo(

    () =>

      getAchievementProgress({

        dailyEntries,

        measurements,

        settings,

        totalXp,

        unlockedAchievements,

      }),

    [dailyEntries, measurements, settings, totalXp, unlockedAchievements],

  );



  const unlockedMap = useMemo(

    () => new Map(unlockedAchievements.map((u) => [u.achievementId, u])),

    [unlockedAchievements],

  );

  const progressMap = useMemo(

    () => new Map(progressList.map((p) => [p.achievementId, p])),

    [progressList],

  );



  const filtered = useMemo(() => {

    return ACHIEVEMENTS.filter((a) => {

      if (category !== 'all' && a.category !== category) return false;

      if (tier !== 'all' && a.tier !== tier) return false;

      const isUnlocked = unlockedMap.has(a.id);

      if (status === 'unlocked' && !isUnlocked) return false;

      if (status === 'locked' && isUnlocked) return false;

      return true;

    });

  }, [category, tier, status, unlockedMap]);



  const sortedFiltered = useMemo(

    () => sortAchievements(filtered, unlockedMap, progressMap),

    [filtered, unlockedMap, progressMap],

  );



  const unlockedCount = unlockedAchievements.length;

  const totalCount = ACHIEVEMENTS.length;

  const collectionPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;



  const recentHero = useMemo(

    () =>

      [...unlockedAchievements]

        .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))

        .slice(0, 3),

    [unlockedAchievements],

  );



  const recentSection = useMemo(() => {

    return [...unlockedAchievements]

      .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))

      .slice(0, 6)

      .map((u) => ACHIEVEMENT_BY_ID[u.achievementId])

      .filter(Boolean) as Achievement[];

  }, [unlockedAchievements]);



  const closeSection = useMemo(() => {

    return ACHIEVEMENTS.filter((a) => {

      if (unlockedMap.has(a.id)) return false;

      const p = progressMap.get(a.id);

      return p && p.percent >= CLOSE_UNLOCK_MIN_PERCENT && !p.completed;

    })

      .sort((a, b) => (progressMap.get(b.id)?.percent ?? 0) - (progressMap.get(a.id)?.percent ?? 0))

      .slice(0, 6);

  }, [unlockedMap, progressMap]);



  const categoryStats = useMemo(

    () =>

      COLLECTION_CATEGORIES.map((cat) => {

        const items = ACHIEVEMENTS.filter((a) => a.category === cat);

        const unlocked = items.filter((a) => unlockedMap.has(a.id)).length;

        return { category: cat, unlocked, total: items.length };

      }),

    [unlockedMap],

  );



  const closeIds = useMemo(() => new Set(closeSection.map((a) => a.id)), [closeSection]);



  const showSpotlightSections = category === 'all' && tier === 'all';



  const scrollToCollection = () => {

    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  };



  const handleCategorySelect = (cat: AchievementCategory) => {

    setCategory(cat);

    setStatus('all');

    requestAnimationFrame(scrollToCollection);

  };



  return (

    <div className="space-y-5 pb-8" data-testid="growth-achievements-page">

      {!embedded ? (

        <header>

          <h1 className="text-2xl font-bold text-[var(--app-text)]">Достижения</h1>

          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{HERO_SUPPORTING}</p>

        </header>

      ) : null}



      <header className={`${TROPHY_PANEL} px-4 py-5 sm:px-6`}>

        <div

          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(212,165,55,0.1),transparent_55%)]"

          aria-hidden

        />

        <div className="relative">

          {embedded ? (

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/55">

              Growth Hub

            </p>

          ) : null}

          <div className="mt-1 flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--app-gold)]/25 bg-[#18120a]/60 text-[var(--app-gold)]/80">

              <Trophy className="h-5 w-5" strokeWidth={1.5} />

            </div>

            <div className="min-w-0 flex-1">

              <h1 className="text-xl font-bold text-[var(--app-text)] sm:text-2xl">{HERO_TITLE}</h1>

              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]/80">

                {HERO_SUPPORTING}

              </p>

            </div>

          </div>



          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <div className="rounded-xl border border-violet-500/12 bg-[#0e0c14]/50 px-3 py-2.5">

              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">

                Получено

              </dt>

              <dd className="mt-1 text-2xl font-bold text-[var(--app-text)]">{unlockedCount}</dd>

            </div>

            <div className="rounded-xl border border-violet-500/12 bg-[#0e0c14]/50 px-3 py-2.5">

              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">

                Всего

              </dt>

              <dd className="mt-1 text-2xl font-bold text-[var(--app-text)]">{totalCount}</dd>

            </div>

            <div className="rounded-xl border border-violet-500/12 bg-[#0e0c14]/50 px-3 py-2.5 sm:col-span-2">

              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/60">

                Прогресс коллекции

              </dt>

              <dd className="mt-1 flex items-end justify-between gap-3">

                <span className="text-2xl font-bold text-[var(--app-gold)]/90">

                  {collectionPercent}%

                </span>

                <span className="pb-0.5 text-xs text-[var(--app-text-muted)]/55">

                  {unlockedCount} / {totalCount}

                </span>

              </dd>

              <ProgressBar value={collectionPercent} color="gold" className="mt-2 h-1.5" />

            </div>

          </dl>



          {recentHero.length > 0 ? (

            <div className="mt-4">

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-text-muted)]/50">

                Недавно получено

              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {recentHero.map((u) => {

                  const a = ACHIEVEMENT_BY_ID[u.achievementId];

                  if (!a) return null;

                  return (

                    <div

                      key={u.achievementId}

                      className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-[var(--app-gold)]/20 bg-[#0e0c14]/55 px-2.5 py-2 sm:max-w-[14rem]"

                    >

                      <AchievementIcon iconKey={a.iconKey} tier={a.tier} unlocked size="sm" />

                      <div className="min-w-0">

                        <div className="truncate text-xs font-semibold text-[var(--app-text)]">

                          {a.title}

                        </div>

                        <div className="text-[10px] text-[var(--app-text-muted)]/60">

                          {formatDateRu(u.unlockedAt, 'd MMM')}

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          ) : null}

        </div>

      </header>



      {showSpotlightSections && recentSection.length > 0 ? (

        <section className={`${TROPHY_SECTION} px-4 py-4 sm:px-5`}>

          <div className="relative">

            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-200/55">

              <Trophy className="h-4 w-4 text-[var(--app-gold)]/70" strokeWidth={1.5} />

              Недавно получено

            </h2>

            <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">

              Свежие трофеи — следы маршрута, которые уже в коллекции.

            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

              {recentSection.map((a) => (

                <AchievementCard

                  key={a.id}

                  achievement={a}

                  unlocked={unlockedMap.get(a.id)}

                  progress={progressMap.get(a.id)}

                  highlight="recent"

                />

              ))}

            </div>

          </div>

        </section>

      ) : null}



      {showSpotlightSections && closeSection.length > 0 && status !== 'unlocked' ? (

        <section className={`${TROPHY_SECTION} px-4 py-4 sm:px-5`}>

          <div className="relative">

            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-200/55">

              <Sparkles className="h-4 w-4 text-violet-300/65" strokeWidth={1.5} />

              Близко к открытию

            </h2>

            <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">

              Трофеи, где маршрут уже продвинулся — персонаж продолжает путь.

            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">

              {closeSection.map((a) => (

                <AchievementCard

                  key={a.id}

                  achievement={a}

                  unlocked={unlockedMap.get(a.id)}

                  progress={progressMap.get(a.id)}

                  highlight="close"

                />

              ))}

            </div>

          </div>

        </section>

      ) : null}



      {showSpotlightSections ? (

        <AchievementCategoryGrid

          stats={categoryStats}

          activeCategory={category}

          onSelect={handleCategorySelect}

        />

      ) : null}



      <AchievementFilters

        category={category}

        tier={tier}

        status={status}

        onCategoryChange={setCategory}

        onTierChange={setTier}

        onStatusChange={setStatus}

      />



      <div ref={collectionRef} className="space-y-3 scroll-mt-4">

        <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">

          <div>

            <h2 className="text-sm font-semibold uppercase tracking-widest text-violet-200/55">
              {category === 'all' ? 'Коллекция' : `Раздел · ${DISPLAY_CATEGORY_LABELS[category]}`}
            </h2>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">
              Показано: {sortedFiltered.length}
              {status === 'locked' ? ' · в пути' : status === 'unlocked' ? ' · получено' : ''}
            </p>

          </div>

          {category !== 'all' ? (

            <button

              type="button"

              onClick={() => setCategory('all')}

              className="text-xs font-medium text-[var(--app-primary)] hover:underline"

            >

              Вся коллекция

            </button>

          ) : null}

        </div>



        <div className="grid gap-2 sm:grid-cols-2">

          {sortedFiltered.map((a) => (

            <AchievementCard

              key={a.id}

              achievement={a}

              unlocked={unlockedMap.get(a.id)}

              progress={progressMap.get(a.id)}

              highlight={closeIds.has(a.id) ? 'close' : unlockedMap.has(a.id) ? 'recent' : 'none'}

            />

          ))}

        </div>



        {sortedFiltered.length === 0 ? (

          <p className="rounded-xl border border-dashed border-violet-500/15 bg-[#0e0c14]/40 px-4 py-8 text-center text-sm text-[var(--app-text-muted)]/70">

            По этим фильтрам трофеев пока нет — попробуйте другой раздел или статус «В пути».

          </p>

        ) : null}

      </div>

    </div>

  );

}

