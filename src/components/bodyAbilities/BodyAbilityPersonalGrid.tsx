import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  BODY_ABILITY_BANK_VERSION,
  BODY_BASELINE_LABELS,
  BODY_HIDDEN_TOPIC_LABELS,
  BODY_INTEREST_LABELS,
  BODY_PATH_TYPE_LABELS,
} from '../../constants/bodyAbilityBank';
import { getThemedBodyAbilityPresentation } from '../../game/bodyAbilityThemePresentation';
import {
  BODY_ABILITY_MAP_FILTERS,
  filterPersonalAbilityItems,
  getBodyAbilityMapFilterLabel,
  getBodyAbilityStatusLabel,
  getFreedomMapPageCopy,
  sortPersonalAbilityItems,
  type BodyAbilityMapFilter,
} from '../../game/bodyAbilityFreedomUi';
import {
  applyBodyAbilityProfile,
  getArchivedUnlockedAbilityItems,
  getPersonalAbilityItems,
  getPersonalBodyAbilitiesState,
  getPersonalBodyAbilitySummary,
  hasLegacyBodyAbilityUnlocks,
  isBodyAbilityProfileConfigured,
  manuallyUnlockPersonalAbility,
  needsBodyAbilityMapUpgrade,
  regenerateBodyAbilityMap,
  respondToSuggestedAbility,
  syncPersonalBodyAbilityProgress,
} from '../../utils/bodyAbilityPersonalEngine';
import { resolveTargetWeight } from '../../game/gameProfile';
import { getStartWeight } from '../../game/heroProgressEngine';
import { BodyAbilityProfileSetup } from './BodyAbilityProfileSetup';
import type {
  BodyAbilityPersonalItem,
  BodyAbilityProfile,
  BodyAbilityProfileSetupMode,
  BodyAbilityStatus,
} from '../../types/bodyAbilityPersonal';

type BodyAbilityPersonalGridProps = {
  embedded?: boolean;
  /** When true, page header is rendered by parent (FreedomPage). */
  hidePageHeader?: boolean;
};

function cardModifier(status: BodyAbilityStatus): string {
  if (status === 'unlocked') return 'body-map-card--unlocked';
  if (status === 'suggested') return 'body-map-card--suggested';
  return 'body-map-card--locked';
}

function AbilityCard({
  item,
  busyId,
  onSuggest,
  onManual,
}: {
  item: BodyAbilityPersonalItem;
  busyId: string | null;
  onSuggest: (id: string, response: 'yes' | 'not_yet' | 'irrelevant') => void;
  onManual: (id: string) => void;
}) {
  const { themeId } = useAppTheme();
  const { definition, user } = item;
  const presentation = getThemedBodyAbilityPresentation(themeId, definition.id, definition);
  const canManual =
    definition.unlockMode !== 'auto' &&
    (user.status === 'locked' || user.status === 'suggested');
  const showSuggestActions = user.status === 'suggested';
  const line = presentation.flavor || presentation.description;

  return (
    <article
      data-testid={`body-ability-card-${definition.id}`}
      data-status={user.status}
      className={`body-map-card ${cardModifier(user.status)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-[var(--app-text)]">
          <span aria-hidden className="mr-1">
            {presentation.icon}
          </span>
          {presentation.title}
        </p>
        <span className="body-map-card__badge">
          {getBodyAbilityStatusLabel(user.status, themeId)}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--app-text-muted)]">
        {line}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
        {BODY_INTEREST_LABELS[definition.category]}
      </p>

      {showSuggestActions ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busyId === definition.id}
            onClick={() => onSuggest(definition.id, 'yes')}
            className="rounded-lg bg-[var(--app-primary)] px-3 py-1.5 text-xs font-semibold text-slate-950"
          >
            Да, стало легче
          </button>
          <button
            type="button"
            disabled={busyId === definition.id}
            onClick={() => onSuggest(definition.id, 'not_yet')}
            className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs text-[var(--app-text)]"
          >
            Пока нет
          </button>
          <button
            type="button"
            disabled={busyId === definition.id}
            onClick={() => onSuggest(definition.id, 'irrelevant')}
            className="rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs text-[var(--app-text-muted)]"
          >
            Неактуально
          </button>
        </div>
      ) : null}

      {!showSuggestActions && canManual ? (
        <button
          type="button"
          disabled={busyId === definition.id}
          onClick={() => onManual(definition.id)}
          className="mt-3 rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-xs font-medium text-[var(--app-primary)]"
        >
          Я заметил это изменение
        </button>
      ) : null}
    </article>
  );
}

export function BodyAbilityPersonalGrid({
  embedded = false,
  hidePageHeader = false,
}: BodyAbilityPersonalGridProps) {
  const { settings, dailyEntries, measurements, saveSettings } = useAppStore();
  const { themeId } = useAppTheme();
  const copy = getFreedomMapPageCopy(themeId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [setupOpen, setSetupOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [regenBusy, setRegenBusy] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [filter, setFilter] = useState<BodyAbilityMapFilter>('all');

  const configured = isBodyAbilityProfileConfigured(settings);
  const needsUpgrade = needsBodyAbilityMapUpgrade(settings);
  const legacyUnlocks = hasLegacyBodyAbilityUnlocks(settings);
  const personal = getPersonalBodyAbilitiesState(settings);
  const summary = useMemo(() => getPersonalBodyAbilitySummary(settings), [settings]);

  useEffect(() => {
    if (searchParams.get('setup') === '1') {
      setSetupOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!configured) return;
    const next = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries,
      measurements,
    });
    if (next !== settings) {
      void saveSettings(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional data-driven sync
  }, [configured, dailyEntries, measurements, settings.bodyAbilityState?.personal?.generatedAt]);

  const items = useMemo(
    () =>
      sortPersonalAbilityItems(
        getPersonalAbilityItems(settings).filter((i) => i.user.status !== 'hidden'),
      ),
    [settings],
  );
  const archivedItems = useMemo(
    () => getArchivedUnlockedAbilityItems(settings),
    [settings],
  );
  const visibleItems = useMemo(
    () => filterPersonalAbilityItems(items, filter),
    [items, filter],
  );
  const suggested = items.filter((i) => i.user.status === 'suggested');

  const startWeight = getStartWeight(measurements);
  const target = resolveTargetWeight(settings);
  const inferredGoalKg =
    startWeight != null && target != null && startWeight > target
      ? Math.round(startWeight - target)
      : personal.profile?.goalKg ?? null;

  const setupMode: BodyAbilityProfileSetupMode = configured ? 'regenerate' : 'initial';

  const closeSetup = () => {
    setSetupOpen(false);
    if (searchParams.get('setup') === '1') {
      const next = new URLSearchParams(searchParams);
      next.delete('setup');
      setSearchParams(next, { replace: true });
    }
  };

  const openSetup = () => setSetupOpen(true);

  const saveProfile = async (profile: BodyAbilityProfile) => {
    if (configured) {
      const ok = window.confirm(
        'Открытые достижения сохранятся. Остальная карта будет собрана заново под новые ответы.',
      );
      if (!ok) return;
    }
    const next = applyBodyAbilityProfile(settings, profile, { preserveUnlocked: true });
    await saveSettings(next);
    closeSetup();
  };

  const handleRegenerate = async () => {
    if (!personal.profile) return;
    const ok = window.confirm(
      'Открытые достижения сохранятся. Остальная карта будет собрана заново.',
    );
    if (!ok) return;
    setRegenBusy(true);
    try {
      await saveSettings(regenerateBodyAbilityMap(settings, personal.profile));
    } finally {
      setRegenBusy(false);
    }
  };

  const ensureSynced = async () => {
    const next = syncPersonalBodyAbilityProgress({
      settings,
      dailyEntries,
      measurements,
    });
    if (next !== settings) await saveSettings(next);
    return next;
  };

  const onSuggestResponse = async (
    abilityId: string,
    response: 'yes' | 'not_yet' | 'irrelevant',
  ) => {
    setBusyId(abilityId);
    try {
      const base = await ensureSynced();
      await saveSettings(respondToSuggestedAbility(base, abilityId, response));
    } finally {
      setBusyId(null);
    }
  };

  const onManualUnlock = async (abilityId: string) => {
    setBusyId(abilityId);
    try {
      const base = await ensureSynced();
      await saveSettings(manuallyUnlockPersonalAbility(base, abilityId));
    } finally {
      setBusyId(null);
    }
  };

  if (setupOpen) {
    return (
      <div className="space-y-4" data-testid="body-ability-personal-root">
        <BodyAbilityProfileSetup
          mode={setupMode}
          initial={personal.profile}
          initialGoalKg={inferredGoalKg}
          onComplete={(p) => void saveProfile(p)}
          onCancel={closeSetup}
        />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="space-y-4" data-testid="body-ability-personal-root">
        <section className="body-map-empty-cta" data-testid="body-ability-upgrade-banner">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-bold text-[var(--app-text)]">
            {legacyUnlocks ? copy.emptyTitle : copy.emptyTitle}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--app-text-muted)]">
            {legacyUnlocks
              ? `${copy.emptyBody} Система стала персональной — можно собрать карту под себя.`
              : copy.emptyBody}
          </p>
          <button
            type="button"
            onClick={openSetup}
            className="mt-5 w-full rounded-xl bg-[var(--app-primary)] px-4 py-3 text-sm font-semibold text-slate-950 sm:w-auto"
            data-testid="body-ability-setup-cta"
          >
            {copy.setupCta}
          </button>
        </section>
      </div>
    );
  }

  const profile = personal.profile!;

  return (
    <div className="space-y-6" data-testid="body-ability-personal-root">
      {!hidePageHeader && !embedded ? (
        <header className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]">
            {copy.eyebrow}
          </p>
          <h2 className="text-xl font-bold text-[var(--app-text)]">{copy.title}</h2>
          <p className="max-w-2xl text-sm text-[var(--app-text-muted)]">{copy.intro}</p>
        </header>
      ) : null}

      {needsUpgrade ? (
        <section
          data-testid="body-ability-upgrade-banner"
          className="rounded-2xl border border-[var(--app-primary)]/35 bg-[var(--app-primary-soft)]/20 p-4"
        >
          <p className="text-sm font-semibold text-[var(--app-text)]">
            Карту тела можно сделать точнее
          </p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Банк обновился — можно пересобрать сетку под твой путь. Открытое сохранится.
          </p>
          <button
            type="button"
            onClick={openSetup}
            className="mt-3 rounded-xl bg-[var(--app-primary)] px-4 py-2 text-sm font-semibold text-slate-950"
            data-testid="body-ability-upgrade-cta"
          >
            {copy.setupCta}
          </button>
        </section>
      ) : null}

      <section className="body-map-hero" data-testid="body-ability-map-summary">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-gold)]">
              {embedded ? copy.mapTitle : 'Твоя карта'}
            </p>
            <p className="text-base font-semibold text-[var(--app-text)]">
              Цель −{profile.goalKg ?? '?'} кг
            </p>
            <p className="text-xs text-[var(--app-text-muted)]">
              {profile.pathTypes.map((p) => BODY_PATH_TYPE_LABELS[p]).join(' · ') || '—'}
            </p>
            <p className="text-xs text-[var(--app-text-muted)]">
              {profile.interests
                .slice(0, 4)
                .map((i) => BODY_INTEREST_LABELS[i])
                .join(' · ')}
              {profile.interests.length > 4 ? '…' : ''}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <button
              type="button"
              onClick={openSetup}
              className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-primary)]"
              data-testid="body-ability-reconfigure"
            >
              Изменить карту
            </button>
            <button
              type="button"
              disabled={regenBusy}
              onClick={() => void handleRegenerate()}
              className="rounded-xl border border-[var(--app-border)] px-3 py-2 text-xs text-[var(--app-text-muted)]"
              data-testid="body-ability-regenerate"
            >
              Пересобрать карту
            </button>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="body-map-stat">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
              Открыто
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-text)]">
              {copy.unlockedProgress(summary.unlockedCount, summary.selectedCount)}
            </dd>
          </div>
          <div className="body-map-stat">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
              Можно проверить
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-text)]">
              {suggested.length}
            </dd>
          </div>
          <div className="body-map-stat col-span-2 sm:col-span-1">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
              Банк
            </dt>
            <dd className="mt-1 text-xs font-medium text-[var(--app-text-muted)]">
              {personal.generatedFromVersion ??
                personal.abilityBankVersion ??
                BODY_ABILITY_BANK_VERSION}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="mt-3 text-xs font-medium text-[var(--app-primary)]"
          data-testid="body-ability-profile-summary-toggle"
        >
          {summaryOpen ? 'Скрыть детали' : 'Детали профиля'}
        </button>
        {summaryOpen ? (
          <dl
            className="mt-3 space-y-1 text-xs text-[var(--app-text-muted)]"
            data-testid="body-ability-profile-summary"
          >
            <div>
              <dt className="inline font-semibold text-[var(--app-text)]">Уже нормально: </dt>
              <dd className="inline">
                {profile.baselineEasy.length
                  ? profile.baselineEasy.map((b) => BODY_BASELINE_LABELS[b]).join(', ')
                  : 'не отмечено'}
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold text-[var(--app-text)]">Не показывать: </dt>
              <dd className="inline">
                {profile.hiddenTopics.length
                  ? profile.hiddenTopics.map((t) => BODY_HIDDEN_TOPIC_LABELS[t]).join(', ')
                  : 'нет'}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>

      {suggested.length > 0 && filter === 'all' ? (
        <section className="space-y-2" data-testid="body-ability-suggested">
          <h3 className="text-sm font-semibold text-[var(--app-text)]">{copy.suggestedTitle}</h3>
          <div className="body-map-grid">
            {suggested.slice(0, 3).map((item) => (
              <AbilityCard
                key={item.definition.id}
                item={item}
                busyId={busyId}
                onSuggest={(id, r) => void onSuggestResponse(id, r)}
                onManual={(id) => void onManualUnlock(id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--app-text)]">{copy.mapTitle}</h3>
          <p className="text-[11px] text-[var(--app-text-muted)]">
            {visibleItems.length} из {items.length}
          </p>
        </div>

        <div className="body-map-filters" role="tablist" aria-label="Фильтр карты" data-testid="body-ability-filters">
          {BODY_ABILITY_MAP_FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              data-testid={`body-ability-filter-${id}`}
              onClick={() => setFilter(id)}
              className={`body-map-filter${filter === id ? ' body-map-filter--active' : ''}`}
            >
              {getBodyAbilityMapFilterLabel(id, themeId)}
            </button>
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--app-border)] px-4 py-6 text-center text-sm text-[var(--app-text-muted)]">
            В этом фильтре пока пусто.
          </p>
        ) : (
          <div className="body-map-grid">
            {visibleItems.map((item) => (
              <AbilityCard
                key={item.definition.id}
                item={item}
                busyId={busyId}
                onSuggest={(id, r) => void onSuggestResponse(id, r)}
                onManual={(id) => void onManualUnlock(id)}
              />
            ))}
          </div>
        )}
      </section>

      {archivedItems.length > 0 ? (
        <section className="body-map-archived" data-testid="body-ability-archived">
          <h3 className="text-sm font-semibold text-[var(--app-text)]">{copy.archivedTitle}</h3>
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">{copy.archivedHint}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {archivedItems.map(({ definition }) => {
              const presentation = getThemedBodyAbilityPresentation(
                themeId,
                definition.id,
                definition,
              );
              return (
                <li
                  key={definition.id}
                  className="rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs text-[var(--app-text-muted)]"
                >
                  <span aria-hidden>{presentation.icon} </span>
                  {presentation.title}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
