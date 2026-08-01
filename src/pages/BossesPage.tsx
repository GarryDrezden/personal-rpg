import { useMemo } from 'react';
import { Archive, Leaf, Shield, Skull, Sprout, Swords } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { todayISO } from '../utils/dates';
import { getBossCatalog } from '../utils/bossCatalog';
import { countDefeatedBosses, getBossHistory } from '../utils/bossEngine';
import { getBossCampaignArchive } from '../game/bosses/bossCampaignArchive';
import {
  ArchiveBossCodexCard,
  FeaturedWeeklyBossCard,
} from '../components/boss/BossCatalogCard';
import { BossCampaignArchiveSection } from '../components/boss/BossCampaignArchiveSection';
import { TRIALS_ARCHIVE_HELPER, TRIALS_PANEL } from '../components/boss/trialsUi';
import {
  WEEKLY_TRIAL_LABEL,
  WEEKLY_TRIALS_ARCHIVE_LABEL,
} from '../constants/weeklyTrial';
import { getThemedWeeklyThreatChrome } from '../game/themeWeeklyThreatPresentation';

export function BossesPage({ embedded = false }: { embedded?: boolean }) {
  const { themeId, isCozy } = useAppTheme();
  const chrome = getThemedWeeklyThreatChrome(themeId);
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

  const campaignArchive = useMemo(
    () => getBossCampaignArchive({ dailyEntries, measurements, settings, today }),
    [dailyEntries, measurements, settings, today],
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

  const panelClass = isCozy
    ? 'relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--app-wood)_28%,var(--app-border))] bg-[linear-gradient(155deg,#fffaf2,#f0e6d4_52%,#e8efe4)]'
    : TRIALS_PANEL;
  const statCardClass = isCozy
    ? 'rounded-xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-card-strong)_90%,var(--app-sage-mist))] px-4 py-3'
    : 'rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-4 py-3';
  const pageTitle = isCozy ? 'Помехи недели и путь дома' : 'Испытания и кампания';
  const pageLead = isCozy
    ? 'Недельные помехи и архив сезонных помех пути — без боя, только удержание ритма.'
    : 'Еженедельные угрозы и архив сезонных боссов кампании — без боя, только удержание маршрута.';
  const HeaderIcon = isCozy ? Leaf : Skull;

  return (
    <div className="space-y-6 pb-8" data-testid="growth-trials-page">
      <header className={embedded ? `${panelClass} px-4 py-5 sm:px-6` : undefined}>
        {embedded ? (
          <>
            {!isCozy ? (
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(239,68,68,0.08),transparent_55%)]"
                aria-hidden
              />
            ) : (
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(244,220,150,0.22),transparent_45%)]"
                aria-hidden
              />
            )}
            <div className="relative">
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  isCozy ? 'text-[var(--app-garden)]' : 'text-red-300/55'
                }`}
              >
                {isCozy ? chrome.featuredEyebrow : WEEKLY_TRIAL_LABEL}
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-[var(--app-text)] sm:text-2xl">
                {pageTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
                {pageLead}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isCozy
                  ? 'border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-garden)_12%,var(--app-card))] text-[var(--app-garden)]'
                  : 'border-red-400/25 bg-[#1a1018]/80 text-red-300/75 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
              }`}
            >
              <HeaderIcon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--app-text)]">{pageTitle}</h1>
              <p className="text-sm text-[var(--app-text-muted)]">
                {isCozy
                  ? 'Недельные помехи и архив сезонного пути дома.'
                  : 'Еженедельные угрозы и архив сезонных боссов кампании.'}
              </p>
            </div>
          </div>
        )}
      </header>

      <section className={`${panelClass} px-4 py-4 sm:px-5 sm:py-5`}>
        {!isCozy ? (
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(88,28,135,0.1),transparent_50%)]"
            aria-hidden
          />
        ) : null}
        <dl className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={statCardClass}>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              <Shield
                className={`h-3.5 w-3.5 ${isCozy ? 'text-[var(--app-garden)]' : 'text-emerald-300/65'}`}
                strokeWidth={1.5}
              />
              {isCozy ? 'Открыто помех' : 'Открыто угроз'}
            </dt>
            <dd className="mt-1.5 text-2xl font-bold text-[var(--app-text)]">
              {defeatedTypes}
              <span className="text-base font-medium text-[var(--app-text-muted)]/50">
                {' '}
                / {catalog.length}
              </span>
            </dd>
          </div>
          <div className={statCardClass}>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              {isCozy ? (
                <Sprout className="h-3.5 w-3.5 text-[var(--app-wood)]" strokeWidth={1.5} />
              ) : (
                <Swords className="h-3.5 w-3.5 text-red-300/60" strokeWidth={1.5} />
              )}
              {isCozy ? 'Недель с помехой' : 'Недель с испытанием'}
            </dt>
            <dd className="mt-1.5 text-2xl font-bold text-[var(--app-text)]">{history.length}</dd>
          </div>
          <div className={statCardClass}>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]/65">
              <Archive
                className={`h-3.5 w-3.5 ${isCozy ? 'text-[var(--app-sun)]' : 'text-[var(--app-gold)]/70'}`}
                strokeWidth={1.5}
              />
              Недель удержано
            </dt>
            <dd
              className={`mt-1.5 text-2xl font-bold ${
                isCozy ? 'text-[var(--app-wood)]' : 'text-[var(--app-gold)]/90'
              }`}
            >
              {countDefeatedBosses(history)}
            </dd>
          </div>
        </dl>
        {pending.length > 0 ? (
          <p className="relative mt-4 text-xs text-[var(--app-text-muted)]/60">
            {isCozy
              ? `Впереди ещё ${pending.length} помех${pending.length === 1 ? 'а' : ''} — можно готовиться мягко.`
              : `В тумане ещё ${pending.length} угроз${pending.length === 1 ? 'а' : ''} — готовься заранее.`}
          </p>
        ) : null}
      </section>

      {active ? <FeaturedWeeklyBossCard entry={active} /> : null}

      {archiveEntries.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2
              className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-widest ${
                isCozy ? 'text-[var(--app-garden)]' : 'text-violet-200/55'
              }`}
            >
              <Archive className="h-4 w-4" strokeWidth={1.5} />
              {isCozy ? 'Альбом помех недели' : WEEKLY_TRIALS_ARCHIVE_LABEL}
            </h2>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]/55">
              {isCozy ? chrome.archiveHelper : TRIALS_ARCHIVE_HELPER}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {archiveEntries.map((entry) => (
              <ArchiveBossCodexCard key={entry.templateId} entry={entry} />
            ))}
          </div>
        </section>
      ) : null}

      <BossCampaignArchiveSection archive={campaignArchive} />
    </div>
  );
}
