import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { AppThemeId } from '../../types/theme';
import {
  countSimEventsByKind,
  simEventsPerWeek,
  simulateUserJourney,
} from '../../utils/gameDesignSimulation';
import {
  JOURNEY_PERSONA_IDS,
  JOURNEY_PERSONAS,
  type JourneyPersonaId,
} from '../../utils/realUserJourneyPersonas';

const DAY_OPTIONS = [7, 28, 90, 180, 365] as const;

export function UserJourneyLabPage() {
  const [personaId, setPersonaId] = useState<JourneyPersonaId>('A');
  const [days, setDays] = useState<(typeof DAY_OPTIONS)[number]>(28);
  const [themeId, setThemeId] = useState<AppThemeId>('cozy');
  const spec = JOURNEY_PERSONAS[personaId];

  const snap = useMemo(
    () => simulateUserJourney({ ...spec, days }),
    [spec, days],
  );
  const counts = useMemo(() => countSimEventsByKind(snap.events), [snap.events]);

  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="mx-auto max-w-3xl space-y-4 p-4 text-[var(--app-text)]"
      data-testid="user-journey-lab"
    >
      <h1 className="text-xl font-semibold">User journey lab</h1>
      <p className="text-sm text-[var(--app-text-muted)]">
        DEV only. Synthetic timeline, not a medical model. Theme does not change math.
      </p>
      <div className="flex flex-wrap gap-2">
        <select
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value as JourneyPersonaId)}
          data-testid="journey-lab-persona"
        >
          {JOURNEY_PERSONA_IDS.map((id) => (
            <option key={id} value={id}>
              {id} — {JOURNEY_PERSONAS[id].label}
            </option>
          ))}
        </select>
        <select
          value={days}
          onChange={(e) =>
            setDays(Number(e.target.value) as (typeof DAY_OPTIONS)[number])
          }
          data-testid="journey-lab-days"
        >
          {DAY_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} days
            </option>
          ))}
        </select>
        <select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value as AppThemeId)}
        >
          <option value="cozy">cozy</option>
          <option value="darkFantasy">darkFantasy</option>
        </select>
      </div>
      <p className="text-sm">{spec.summary}</p>
      <section className="rounded-xl border border-[var(--app-border)] p-3 text-sm">
        <p>
          {themeId} · level {snap.level} · XP {snap.xp} · coins {snap.coins}
        </p>
        <p>
          Home {snap.homeUpgrades}/24 ({snap.homePercent}%) · Journey{' '}
          {snap.journeyCompleted}/{snap.journeyTotal} · Body {snap.bodyStage} · Season{' '}
          {snap.seasonIndex} · Hero {snap.heroState}
        </p>
        <p>
          Logged {snap.loggedDays}/{snap.days} · events/week {simEventsPerWeek(snap.events, snap.days)}{' '}
          · home {counts.home_upgrade} · level-up {counts.level_up} · season{' '}
          {counts.season_complete} · journey {counts.journey_chapter} · body{' '}
          {counts.body_stage_change} · abilities {counts.ability_unlock}
        </p>
      </section>
      <ol className="space-y-1 text-sm">
        {snap.events.slice(0, 24).map((event, i) => (
          <li key={`${event.kind}-${event.day}-${i}`}>
            Day {event.day}: {event.kind} — {event.detail}
          </li>
        ))}
      </ol>
      {snap.events.length > 24 ? (
        <p className="text-xs text-[var(--app-text-muted)]">
          +{snap.events.length - 24} more events
        </p>
      ) : null}
    </div>
  );
}
