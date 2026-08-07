import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import type { AppThemeId } from '../../types/theme';
import type { HeroGender } from '../../types/gameAssets';
import type { HeroStateLevel } from '../../types/avatarStages';
import type { AvatarTrackId } from '../../types/avatarAssets';
import { getResolvedAvatarStageAsset } from '../../game/avatar/avatarAssetResolver';
import { getAvatarAssetManifestEntry } from '../../constants/avatarAssetManifest';
import { getHeroStateLabel } from '../../game/avatar/avatarStageEngine';
import {
  getAvatarVisualStage,
  getAvatarVisualStageMappingRows,
  listAvatarVisualStages,
} from '../../game/avatar/avatarVisualStage';
import { AvatarStagePortrait } from '../../components/avatar/AvatarStagePortrait';

const THEMES: AppThemeId[] = ['cozy', 'darkFantasy'];
const GENDERS: HeroGender[] = ['male', 'female'];
const TRACKS: AvatarTrackId[] = [
  'default',
  'small_goal',
  'medium_goal',
  'large_goal',
  'very_large_goal',
];
const STATES: HeroStateLevel[] = ['depleted', 'steady', 'energized', 'strong'];
const BG_MODES = ['theme', 'light', 'dark', 'checker'] as const;

type BgMode = (typeof BG_MODES)[number];

function bgClass(mode: BgMode, themeId: AppThemeId): string {
  if (mode === 'light') return 'bg-[#f5f0e8]';
  if (mode === 'dark') return 'bg-[#0b0a12]';
  if (mode === 'checker') {
    return 'bg-[length:16px_16px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[position:0_0,0_8px,8px_-8px,-8px_0]';
  }
  return themeId === 'cozy' ? 'bg-[#efe4d2]' : 'bg-[#0c0a12]';
}

/**
 * Dev-only Avatar Assets Pipeline QA.
 * Production art = 5 visual anchors; Body Stage remains 1–20.
 */
export function AvatarPipelineDevPage() {
  const [themeId, setThemeId] = useState<AppThemeId>('cozy');
  const [gender, setGender] = useState<HeroGender>('male');
  const [trackId, setTrackId] = useState<AvatarTrackId>('default');
  const [heroState, setHeroState] = useState<HeroStateLevel>('steady');
  const [bgMode, setBgMode] = useState<BgMode>('theme');
  const [sampleBody, setSampleBody] = useState(7);

  const anchors = useMemo(() => listAvatarVisualStages(), []);
  const mappingRows = useMemo(() => getAvatarVisualStageMappingRows(), []);
  const sampleVisual = getAvatarVisualStage(sampleBody);

  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-16" data-testid="avatar-pipeline-dev">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]">
          Dev · Avatar Assets Pipeline v1
        </p>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Avatar pipeline QA</h1>
        <p className="text-sm text-[var(--app-text-muted)]">
          Body Stage stays 1–20. Production art uses 5 visual anchors (01 / 05 / 10 / 15 / 20).
        </p>
        <p className="text-sm">
          <Link to="/" className="text-[var(--app-primary)] hover:underline">
            ← Dashboard
          </Link>
        </p>
      </header>

      <div className="grid gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          Theme
          <select
            className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1.5 text-sm"
            value={themeId}
            onChange={(e) => setThemeId(e.target.value as AppThemeId)}
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Gender
          <select
            className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1.5 text-sm"
            value={gender}
            onChange={(e) => setGender(e.target.value as HeroGender)}
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Track (future)
          <select
            className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1.5 text-sm"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value as AvatarTrackId)}
          >
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Hero State
          <select
            className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1.5 text-sm"
            value={heroState}
            onChange={(e) => setHeroState(e.target.value as HeroStateLevel)}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s} — {getHeroStateLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Background
          <select
            className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1.5 text-sm"
            value={bgMode}
            onChange={(e) => setBgMode(e.target.value as BgMode)}
          >
            {BG_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          Sample Body Stage
          <input
            type="range"
            min={1}
            max={20}
            value={sampleBody}
            onChange={(e) => setSampleBody(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <span className="mt-1 block text-[var(--app-text)]">
            Body {sampleBody} → Visual {String(sampleVisual).padStart(2, '0')}
          </span>
        </label>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--app-text)]">
          Visual anchors (production art)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {anchors.map((visualStage) => {
            const entry = getAvatarAssetManifestEntry({
              themeId,
              gender,
              bodyStage: visualStage,
              trackId: 'default',
            });
            const resolved = getResolvedAvatarStageAsset({
              themeId,
              gender,
              bodyStage: visualStage,
              trackId: 'default',
            });

            return (
              <div
                key={visualStage}
                className={`overflow-hidden rounded-lg border border-[var(--app-border)] ${bgClass(bgMode, themeId)}`}
                data-testid={`avatar-pipeline-anchor-${visualStage}`}
              >
                <div className="relative mx-auto h-44 w-full max-w-[8rem]">
                  <AvatarStagePortrait
                    themeId={themeId}
                    gender={gender}
                    bodyStage={visualStage}
                    heroState={heroState}
                    alt={`Visual ${visualStage}`}
                    showHeroStateLabel={false}
                  />
                </div>
                <div className="space-y-0.5 border-t border-[var(--app-border)] bg-[var(--app-card)]/90 px-2 py-1.5 text-[10px] text-[var(--app-text-muted)]">
                  <p className="font-semibold text-[var(--app-text)]">
                    Visual {String(visualStage).padStart(2, '0')}
                  </p>
                  <p>status: {entry?.status ?? 'missing'}</p>
                  <p>source: {resolved.source}</p>
                  <p>art fallback: {resolved.usedFallback ? 'yes' : 'no'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-4">
        <h2 className="mb-2 text-sm font-semibold text-[var(--app-text)]">
          Body Stage → Visual Stage mapping
        </h2>
        <ul className="grid gap-1 text-sm text-[var(--app-text-muted)] sm:grid-cols-2">
          {mappingRows.map((row) => (
            <li key={row.visualStage} data-testid={`avatar-map-row-${row.visualStage}`}>
              {row.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--app-text-muted)]">
          UI still shows «Стадия тела: N из 20». VisualStage is art-only and not shown as a
          replacement for Body Stage.
        </p>
      </section>

      <p className="text-xs text-[var(--app-text-muted)]">
        Track filter currently uses default track assets. Hero State overlay must not change body
        path. Cross-theme fallback is forbidden.
      </p>
    </div>
  );
}
