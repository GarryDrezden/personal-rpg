import { useMemo } from 'react';
import { Archive, Shield, Skull, Swords } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getBossCatalog } from '../utils/bossCatalog';
import { countDefeatedBosses, getBossHistory } from '../utils/bossEngine';
import {
  ArchiveBossCodexCard,
  FeaturedWeeklyBossCard,
} from '../components/boss/BossCatalogCard';
import { TRIALS_ARCHIVE_HELPER, TRIALS_PANEL } from '../components/boss/trialsUi';
import {
  WEEKLY_TRIAL_LABEL,
  WEEKLY_TRIALS_ARCHIVE_LABEL,
} from '../constants/weeklyTrial';

export function BossesPage({ embedded = false }: { embedded?: boolean }) {
  const { dailyEntries, measurements, settings } = useAppStore();
  const today = todayISO();

  const catalog = useMemo(
    () => getBossCatalog({ dailyEntries, measurements, settings, today }),
    [dailyEntries, measurements, settings, today],
  );

  const history = useMemo(
    () => getBossHistory(dailyEntries, settings, measurements),
    [dailyEntries, settings, measurements],
  );

  const defeatedTypes = catalog.filter(
    (c) => c.status === 'defeated' || c.status === 'perfect',
  ).length;
  const pending = catalog.filter((c) => c.status === 'pending');
  const active = catalog.find((c) => c.status === 'active');

  const archiveEntries = useMemo(() => {
    const order = { failed: 0, pending: 1, defeated: 2, perfect: 3, active: 99 };
    return catalog
      .filter((c) => c.status !== 'active')
      .sort((a, b) => order[a.status] - order[b.status]);
  }, [catalog]);

  return (
    <div className="space-y-6 pb-8" data-testid="growth-trials-page">
      <header className={embedded ? `${TRIALS_PANEL} px-4 py-5 sm:px-6` : undefined}>
        {embedded ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(239,68,68,0.08),transparent_55%)]"
              aria-hidden
            />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300/55">
                {WEEKLY_TRIAL_LABEL}
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl">
                Испытания недели
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
                Еженедельные угрозы, которые проверяют маршрут на прочность.
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/25 bg-[#1a1018]/80 text-red-300/75 shadow-[0_0_20px_rgba(239,68,68,0.08)]">
              <Skull size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-text)]">Испытания недели</h1>
              <p className="text-sm text-[var(--app-text-muted)]">
                Еженедельные угрозы, которые проверяют маршрут на прочность.
              </p>
            </div>
          </div>
        )}
      </header>

      <section className={`${TRIALS_PANEL} px-4 py-4 sm:px-5 sm:py-5`}>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(88,28,135,0.1),transparent_50%)]"
          aria-hidden
        />
        <dl className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              <Shield className="h-3.5 w-3.5 text-emerald-300/65" strokeWidth={1.5} />
              Открыто угроз
            </dt>
            <dd className="mt-1.5 text-2xl font-bold text-[var(--app-text)]">
              {defeatedTypes}
              <span className="text-base font-medium text-[var(--app-text-muted)]/50">
                {' '}
                / {catalog.length}
              </span>
            </dd>
          </div>
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              <Swords className="h-3.5 w-3.5 text-red-300/60" strokeWidth={1.5} />
              Недель в бою
            </dt>
            <dd className="mt-1.5 text-2xl font-bold text-[var(--app-text)]">{history.length}</dd>
          </div>
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              <Archive className="h-3.5 w-3.5 text-[var(--app-gold)]/70" strokeWidth={1.5} />
              Побед за кампанию
            </dt>
            <dd className="mt-1.5 text-2xl font-bold text-[var(--app-gold)]/90">
              {countDefeatedBosses(history)}
            </dd>
          </div>
        </dl>
        {pending.length > 0 ? (
          <p className="relative mt-4 text-xs text-[var(--app-text-muted)]/60">
            В тумане ещё {pending.length} угроз{pending.length === 1 ? 'а' : ''} — готовься заранее.
          </p>
        ) : null}
      </section>

      {active ? <FeaturedWeeklyBossCard entry={active} /> : null}

      {archiveEntries.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-200/55">
              <Archive className="h-4 w-4" strokeWidth={1.5} />
              {WEEKLY_TRIALS_ARCHIVE_LABEL}
            </h2>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">
              {TRIALS_ARCHIVE_HELPER}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {archiveEntries.map((entry) => (
              <ArchiveBossCodexCard key={entry.templateId} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
