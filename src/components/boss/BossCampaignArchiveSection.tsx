import { useMemo, useState } from 'react';
import { BookOpen, Landmark, Scroll } from 'lucide-react';
import type { BossCampaignArchive } from '../../game/bosses/bossTypes';
import {
  countSealedCampaignBosses,
  getCurrentActBoss,
} from '../../game/bosses/bossCampaignArchive';
import { ActBossCard, CampaignBossCard } from './BossCampaignArchiveCards';
import { TRIALS_PANEL } from './trialsUi';

type LayerTab = 'acts' | 'seasons' | 'chapters';

const LAYER_TABS: { id: LayerTab; label: string; icon: typeof Landmark }[] = [
  { id: 'acts', label: 'Акты', icon: Landmark },
  { id: 'seasons', label: 'Сезоны', icon: Scroll },
  { id: 'chapters', label: 'Главы', icon: BookOpen },
];

export function BossCampaignArchiveSection({ archive }: { archive: BossCampaignArchive }) {
  const [layer, setLayer] = useState<LayerTab>('acts');
  const sealed = countSealedCampaignBosses(archive);
  const currentAct = getCurrentActBoss(archive);
  const total =
    archive.seasonBosses.length + archive.chapterBosses.length + archive.actBosses.length;

  const seasonVisible = useMemo(() => {
    const current = archive.seasonBosses.find((e) => e.isCurrent);
    const open = archive.seasonBosses.filter((e) => !e.isLocked && !e.isCurrent);
    const fog = archive.seasonBosses.filter((e) => e.isLocked).slice(0, 3);
    return { current, open, fog };
  }, [archive.seasonBosses]);

  return (
    <section className="space-y-4" data-testid="boss-campaign-archive">
      <div className={`${TRIALS_PANEL} px-4 py-5 sm:px-5`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-300/55">
          Boss Campaign
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-[var(--app-text)] sm:text-xl">
          Архив кампании
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]/80">
          Сезонные мини-боссы, боссы глав и акты. Босс слабеет от удержанного маршрута — без боя
          и без новых обязанностей.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-3">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Печатей
            </dt>
            <dd className="mt-1 text-xl font-bold text-[var(--app-text)]">
              {sealed}
              <span className="text-sm font-medium text-[var(--app-text-muted)]/45"> / {total}</span>
            </dd>
          </div>
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-3">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Текущий сезон
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-gold)]">
              {archive.current.currentBoss.shortTitle} · {archive.current.bossProgressPercent}%
            </dd>
          </div>
          <div className="col-span-2 rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-3 sm:col-span-1">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Акт сейчас
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-text)]">
              {currentAct.boss.title}
            </dd>
          </div>
        </dl>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Слои архива кампании"
      >
        {LAYER_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={layer === id}
            onClick={() => setLayer(id)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              layer === id
                ? 'border-[var(--app-gold)]/40 bg-[var(--app-primary-soft)]/40 text-[var(--app-gold)]'
                : 'border-violet-500/20 bg-[#0e0c14]/50 text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {layer === 'acts' ? (
        <div className="grid grid-cols-1 gap-3">
          {archive.actBosses.map((entry) => (
            <ActBossCard key={entry.boss.id} entry={entry} />
          ))}
        </div>
      ) : null}

      {layer === 'seasons' ? (
        <div className="space-y-4">
          {seasonVisible.current ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-gold)]/70">
                Сезонный босс сейчас
              </h3>
              <CampaignBossCard entry={seasonVisible.current} />
            </div>
          ) : null}
          {seasonVisible.open.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-200/50">
                Пройденные и открытые
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {seasonVisible.open.map((entry) => (
                  <CampaignBossCard key={entry.boss.id} entry={entry} />
                ))}
              </div>
            </div>
          ) : null}
          {seasonVisible.fog.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]/45">
                В тумане впереди
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {seasonVisible.fog.map((entry) => (
                  <CampaignBossCard key={entry.boss.id} entry={entry} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {layer === 'chapters' ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {archive.chapterBosses.map((entry) => (
            <CampaignBossCard key={entry.boss.id} entry={entry} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
