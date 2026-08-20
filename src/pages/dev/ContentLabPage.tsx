import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { AppThemeId } from '../../types/theme';
import type { CompanionId } from '../../types/gameAssets';
import { TODAY_REACTION_CONTEXTS, getTodayReactionPool, pickTodayReaction } from '../../content/todayReactions';
import { MOB_IDS } from '../../types/gameAssets';
import { getObstacleFlavorPool, pickObstacleFlavor } from '../../content/obstacles';
import {
  COMPANION_REACTION_CONTEXTS,
  getCompanionReactionPool,
  pickCompanionReaction,
} from '../../content/companions';
import { RETURN_ABSENCE_BANDS, RETURN_AFTER_ABSENCE_POOLS } from '../../content/returnAfterAbsence';
import { HOME_STATUS_POOLS } from '../../content/homeStatus';
import { SEASON_COPY_PHASES, SEASON_FLAVOR_POOLS } from '../../content/seasonsFlavor';
import { NBA_COPY_FAMILIES, NBA_COPY_POOLS } from '../../content/nbaCopy';

const THEMES: AppThemeId[] = ['cozy', 'darkFantasy'];
const COMPANIONS: CompanionId[] = [
  'golden_chinchilla_cat',
  'alabai',
  'raven',
  'fox_cub',
];

type Family =
  | 'today'
  | 'obstacle'
  | 'companion'
  | 'return'
  | 'home'
  | 'season'
  | 'nba';

function audit(items: { id: string; text: string }[]) {
  const missingId = items.filter((i) => !i.id).length;
  const byText = new Map<string, string[]>();
  for (const item of items) {
    const list = byText.get(item.text) ?? [];
    list.push(item.id);
    byText.set(item.text, list);
  }
  const duplicates = [...byText.entries()].filter(([, ids]) => ids.length > 1);
  const overlong = items.filter((i) => i.text.length > 120);
  return { missingId, duplicates, overlong, count: items.length };
}

function simulateUnique(pick: (date: string) => string, days: number, start = '2026-01-01') {
  const out: string[] = [];
  const d = new Date(`${start}T00:00:00`);
  for (let i = 0; i < days; i += 1) {
    const iso = d.toISOString().slice(0, 10);
    out.push(pick(iso));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  let maxConsec = 1;
  let run = 1;
  let consecDup = 0;
  for (let i = 1; i < out.length; i += 1) {
    if (out[i] === out[i - 1]) {
      run += 1;
      consecDup += 1;
      if (run > maxConsec) maxConsec = run;
    } else {
      run = 1;
    }
  }
  return {
    unique: new Set(out).size,
    consecDup,
    maxConsec,
    total: out.length,
  };
}

export function ContentLabPage() {
  const [themeId, setThemeId] = useState<AppThemeId>('cozy');
  const [family, setFamily] = useState<Family>('today');
  const [todayCtx, setTodayCtx] = useState<(typeof TODAY_REACTION_CONTEXTS)[number]>('minimal');
  const [mobId, setMobId] = useState<(typeof MOB_IDS)[number]>('sofa_magnet');
  const [companionId, setCompanionId] = useState<CompanionId>('golden_chinchilla_cat');
  const [compCtx, setCompCtx] = useState<(typeof COMPANION_REACTION_CONTEXTS)[number]>('presence');
  const date = '2026-08-20';

  const selected = useMemo(() => {
    if (family === 'today') {
      return pickTodayReaction({ themeId, context: todayCtx, date });
    }
    if (family === 'obstacle') {
      return pickObstacleFlavor({ themeId, mobId, date });
    }
    if (family === 'companion') {
      return pickCompanionReaction({ companionId, themeId, context: compCtx, date });
    }
    return null;
  }, [family, themeId, todayCtx, mobId, companionId, compCtx]);

  const candidates = useMemo(() => {
    if (family === 'today') return getTodayReactionPool(themeId, todayCtx);
    if (family === 'obstacle') return getObstacleFlavorPool(themeId, mobId);
    if (family === 'companion') return getCompanionReactionPool(companionId, themeId, compCtx);
    if (family === 'return') return RETURN_AFTER_ABSENCE_POOLS[themeId].week;
    if (family === 'home') return HOME_STATUS_POOLS.mid;
    if (family === 'season') return SEASON_FLAVOR_POOLS[themeId].midpoint;
    return NBA_COPY_POOLS[themeId].recovery;
  }, [family, themeId, todayCtx, mobId, companionId, compCtx]);

  const qa = useMemo(
    () =>
      audit(
        candidates.map((c) => ({
          id: c.id,
          text: 'text' in c ? c.text : `${c.headline} ${c.detail}`,
        })),
      ),
    [candidates],
  );

  const sim = useMemo(() => {
    if (family === 'today') {
      return simulateUnique(
        (d) => pickTodayReaction({ themeId, context: todayCtx, date: d }).id,
        90,
      );
    }
    if (family === 'obstacle') {
      return simulateUnique((d) => pickObstacleFlavor({ themeId, mobId, date: d }).id, 90);
    }
    return null;
  }, [family, themeId, todayCtx, mobId]);

  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 text-[var(--app-text)]" data-testid="content-lab-page">
      <h1 className="text-xl font-semibold">Content lab</h1>
      <p className="text-sm text-[var(--app-text-muted)]">
        DEV only. Context → pool → date seed. No CMS.
      </p>
      <div className="flex flex-wrap gap-2">
        <select value={themeId} onChange={(e) => setThemeId(e.target.value as AppThemeId)}>
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={family} onChange={(e) => setFamily(e.target.value as Family)}>
          {(['today', 'obstacle', 'companion', 'return', 'home', 'season', 'nba'] as Family[]).map(
            (f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ),
          )}
        </select>
        {family === 'today' ? (
          <select
            value={todayCtx}
            onChange={(e) => setTodayCtx(e.target.value as (typeof TODAY_REACTION_CONTEXTS)[number])}
          >
            {TODAY_REACTION_CONTEXTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : null}
        {family === 'obstacle' ? (
          <select value={mobId} onChange={(e) => setMobId(e.target.value as (typeof MOB_IDS)[number])}>
            {MOB_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        ) : null}
        {family === 'companion' ? (
          <>
            <select
              value={companionId}
              onChange={(e) => setCompanionId(e.target.value as CompanionId)}
            >
              {COMPANIONS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <select
              value={compCtx}
              onChange={(e) =>
                setCompCtx(e.target.value as (typeof COMPANION_REACTION_CONTEXTS)[number])
              }
            >
              {COMPANION_REACTION_CONTEXTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>
      {selected ? (
        <section className="rounded-xl border border-[var(--app-border)] p-3">
          <p className="text-xs uppercase text-[var(--app-text-muted)]">Selected {date}</p>
          <p className="font-mono text-xs">{selected.id}</p>
          <p className="mt-1 text-sm">
            {'headline' in selected ? `${selected.headline} ${selected.detail}` : selected.text}
          </p>
        </section>
      ) : null}
      <section className="rounded-xl border border-[var(--app-border)] p-3 text-sm">
        <p>Pool: {qa.count}</p>
        <p>Missing IDs: {qa.missingId}</p>
        <p>Exact duplicates: {qa.duplicates.length}</p>
        <p>Over 120 chars: {qa.overlong.length}</p>
        {sim ? (
          <p>
            90d unique {sim.unique}/{sim.total}, consecutive dups {sim.consecDup}, max consecutive{' '}
            {sim.maxConsec}
          </p>
        ) : null}
      </section>
      <ul className="space-y-1 text-sm">
        {candidates.map((c) => (
          <li key={c.id} className="rounded-lg bg-[var(--app-card)] px-2 py-1">
            <span className="font-mono text-[10px] text-[var(--app-text-muted)]">{c.id}</span>
            <span className="ml-2">
              {'headline' in c ? c.headline : c.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--app-text-muted)]">
        Bands: {RETURN_ABSENCE_BANDS.join(', ')} · seasons {SEASON_COPY_PHASES.join(', ')} · NBA{' '}
        {NBA_COPY_FAMILIES.join(', ')}
      </p>
    </div>
  );
}
