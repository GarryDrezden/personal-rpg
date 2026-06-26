import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore, emptyDaily } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { todayISO } from '../utils/dates';
import { hasAnyDailyData } from '../utils/achievementHelpers';
import {
  getMomentumSummary,
  getMomentumTrendSummary,
  getMomentumTopFactors,
  getMomentumLevelThemeText,
  getMomentumPageSubtitle,
} from '../utils/momentumEngine';
import { getOrRebuildMomentumHistory } from '../utils/momentumStorage';
import {
  getStoredMomentumRange,
  setStoredMomentumRange,
} from '../utils/momentumRangeStorage';
import type { MomentumHistoryRange } from '../types/momentum';
import { MomentumFactorsCard } from '../components/momentum/MomentumFactorsCard';
import { MomentumHelpCard } from '../components/momentum/MomentumHelpCard';
import { MomentumTrendChart } from '../components/momentum/MomentumTrendChart';
import { MomentumHistoryList } from '../components/momentum/MomentumHistoryList';
import { MomentumTopFactorsCard } from '../components/momentum/MomentumTopFactorsCard';
import { MomentumSystemInfoCard } from '../components/momentum/MomentumSystemInfoCard';
import { Card } from '../components/ui/Card';
import { getDayMode } from '../utils/stepsEngine';
import {
  dismissMomentumHelp,
  isMomentumHelpDismissed,
} from '../utils/momentumSuggestionStorage';

const RANGE_OPTIONS: MomentumHistoryRange[] = [7, 14, 30, 90];

function formatValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function MomentumPage() {
  const { dailyEntries, settings, updateDaily } = useAppStore();
  const { themeId, isDarkFantasy } = useAppTheme();
  const today = todayISO();
  const [range, setRange] = useState<MomentumHistoryRange>(() => getStoredMomentumRange());
  const [helpDismissed, setHelpDismissed] = useState(() => isMomentumHelpDismissed(today));

  const hasData = dailyEntries.some((e) => hasAnyDailyData(e));

  const history = useMemo(
    () => getOrRebuildMomentumHistory({ dailyEntries, settings }),
    [dailyEntries, settings],
  );

  const summary = useMemo(
    () => getMomentumSummary({ today, dailyEntries, settings }),
    [today, dailyEntries, settings],
  );

  const trendSummary = useMemo(
    () => getMomentumTrendSummary({ history, range }),
    [history, range],
  );

  const topFactors = useMemo(
    () => getMomentumTopFactors({ history, range }),
    [history, range],
  );

  const todayResult = useMemo(
    () => history.find((r) => r.date === today) ?? null,
    [history, today],
  );

  const handleRangeChange = (r: MomentumHistoryRange) => {
    setRange(r);
    setStoredMomentumRange(r);
  };

  const levelText = getMomentumLevelThemeText({
    levelId: summary.currentLevel.id,
    themeId,
  });

  const showHelp =
    !helpDismissed &&
    getDayMode(dailyEntries.find((e) => e.date === today)?.dayMode) === 'normal' &&
    (summary.recoverySuggested || summary.minimalModeSuggested);

  const acceptRecovery = useCallback(async () => {
    const entry = dailyEntries.find((e) => e.date === today) ?? emptyDaily(today);
    await updateDaily({
      ...entry,
      date: today,
      dayMode: 'recovery',
      energyLevel: entry.energyLevel ?? 2,
    });
  }, [dailyEntries, today, updateDaily]);

  const acceptMinimal = useCallback(async () => {
    const entry = dailyEntries.find((e) => e.date === today) ?? emptyDaily(today);
    await updateDaily({
      ...entry,
      date: today,
      dayMode: 'minimal',
      energyLevel: entry.energyLevel ?? 2,
    });
  }, [dailyEntries, today, updateDaily]);

  const handleDismissHelp = useCallback(() => {
    dismissMomentumHelp(today);
    setHelpDismissed(true);
  }, [today]);

  const bonusText =
    levelText.bonusDescription ??
    levelText.helpDescription ??
    (summary.bonusMultiplier > 1
      ? `+${Math.round((summary.bonusMultiplier - 1) * 100)}% XP за дневные квесты`
      : undefined);

  const cardGlow = isDarkFantasy
    ? 'border-violet-500/30 bg-[color-mix(in_srgb,var(--app-glow)_8%,var(--app-card))] shadow-[0_0_20px_rgba(167,139,250,0.1)]'
    : 'bg-[color-mix(in_srgb,var(--app-primary)_5%,var(--app-card))]';

  if (!hasData) {
    return (
      <div className="space-y-6 pb-8">
        <header>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Инерция режима</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
            {getMomentumPageSubtitle(themeId)}
          </p>
        </header>
        <Card>
          <p className="text-sm text-[var(--app-text-muted)]">
            Инерция пока нейтральна. Внеси первый день — и система начнет набирать ход.
          </p>
          <Link
            to="/today"
            className="mt-4 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
          >
            Открыть квесты дня →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Инерция режима</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
          {getMomentumPageSubtitle(themeId)}
        </p>
      </header>

      <Card className={cardGlow}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-4xl" aria-hidden>
              {summary.currentLevel.icon}
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
                Сейчас
              </p>
              <p className="text-4xl font-bold text-[var(--app-primary)]">
                {formatValue(summary.currentValue)}
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--app-text)]">{levelText.title}</p>
              <p className="mt-1 max-w-xl text-sm text-[var(--app-text-muted)]">
                {levelText.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2">
              <p className="text-xs text-[var(--app-text-muted)]">Сегодня</p>
              <p className="font-bold text-[var(--app-text)]">
                {formatValue(summary.todayDelta)}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2">
              <p className="text-xs text-[var(--app-text-muted)]">Неделя</p>
              <p className="font-bold text-[var(--app-text)]">
                {formatValue(summary.weekDelta)}
              </p>
            </div>
          </div>
        </div>
        {bonusText && (
          <div className="mt-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
              {levelText.bonusDescription ? 'Бонус' : 'Поддержка'}
            </p>
            <p className="mt-1 text-sm text-[var(--app-text)]">{bonusText}</p>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRangeChange(r)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              range === r
                ? 'bg-[var(--app-primary)] text-slate-950'
                : 'border border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
            }`}
          >
            {r} дней
          </button>
        ))}
      </div>

      <MomentumTrendChart summary={trendSummary} historyLength={history.length} />
      <MomentumTopFactorsCard positive={topFactors.positive} negative={topFactors.negative} />
      <MomentumSystemInfoCard />
      <MomentumFactorsCard result={todayResult} />

      {showHelp && (
        <MomentumHelpCard
          summary={summary}
          onSetRecoveryMode={() => void acceptRecovery()}
          onSetMinimalMode={() => void acceptMinimal()}
          onDismiss={handleDismissHelp}
        />
      )}

      <MomentumHistoryList history={history} limit={14} />
    </div>
  );
}
