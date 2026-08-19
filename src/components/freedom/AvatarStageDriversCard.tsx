import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { AvatarStageDriver, AvatarStageSnapshot } from '../../types/avatarStages';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import {
  getHeroStateLabel,
} from '../../game/avatar/avatarStageEngine';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { resolveGameProfile } from '../../game/gameProfile';
import { useAppStore } from '../../store/appStore';
import { Card } from '../ui/Card';
import { GameAssetImage } from '../game/GameAssetImage';

type AvatarStageDriversCardProps = {
  snapshot: AvatarStageSnapshot;
};

function DriverList({
  title,
  intro,
  drivers,
  empty,
}: {
  title: string;
  intro: string;
  drivers: AvatarStageDriver[];
  empty: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--app-text)]">{title}</h3>
      <p className="text-xs text-[var(--app-text-muted)]">{intro}</p>
      {drivers.length > 0 ? (
        <ul className="space-y-2">
          {drivers.map((driver) => (
            <li
              key={`${driver.layer}-${driver.id}`}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-bg-soft)]/50 px-3 py-2"
            >
              <p className="text-sm font-medium text-[var(--app-text)]">{driver.label}</p>
              <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{driver.why}</p>
              <p className="mt-0.5 text-[11px] text-[var(--app-text-muted)]">{driver.detail}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-[var(--app-text-muted)]">{empty}</p>
      )}
    </div>
  );
}

export function AvatarStageDriversCard({ snapshot }: AvatarStageDriversCardProps) {
  const { isCozy } = useAppTheme();
  const { settings } = useAppStore();
  const profile = resolveGameProfile(settings);
  const stageMeta = getHeroStageMeta(profile.heroGender, snapshot.bodyStage);
  const heroAssets = useHeroStageAssets(profile.heroGender, snapshot.bodyStage, {
    heroState: snapshot.heroState,
  });
  const heroStateLabel = getHeroStateLabel(snapshot.heroState);

  return (
    <Card data-testid="avatar-stage-drivers-card">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--app-bg-soft)]">
          <GameAssetImage
            variant="hero"
            src={heroAssets.src}
            alt={stageMeta.title}
            fallbackCandidates={heroAssets.fallbackCandidates}
            status="unlocked"
            fit="hero"
            className="h-full w-full items-end bg-transparent"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 shrink-0 text-[var(--app-primary)]" size={18} />
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text)]">
                {isCozy ? 'Тело и состояние на пути' : 'Тело и состояние героя'}
              </h2>
              <p className="text-xs text-[var(--app-text-muted)]">
                Два слоя: силуэт тела и энергия стойки — не медицинская оценка
              </p>
            </div>
          </div>
          <div className="mt-2 space-y-1 text-sm text-[var(--app-text)]">
            <p data-testid="freedom-body-stage">
              Стадия тела:{' '}
              <span className="font-semibold">
                {snapshot.bodyStage} из 20
              </span>
              <span className="text-[var(--app-text-muted)]">
                {' '}
                · {stageMeta.title}
              </span>
            </p>
            <p data-testid="freedom-hero-state">
              Состояние героя:{' '}
              <span className="font-semibold">{heroStateLabel}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            Прогресс тела
          </p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
            <div
              className="h-full rounded-full bg-[var(--app-primary)]"
              style={{ width: `${snapshot.bodyProgress}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            Состояние
          </p>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
            <div
              className="h-full rounded-full bg-[color-mix(in_srgb,var(--app-gold)_80%,var(--app-primary))]"
              style={{ width: `${snapshot.heroStateProgress}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-[var(--app-text-muted)]">
        Привычки и способности меняют собранность, но сами по себе не делают силуэт
        заметно худее. Картинка тела берётся из стадии тела.
      </p>

      <div className="mt-5 space-y-5 border-t border-[var(--app-border)] pt-4">
        <DriverList
          title="Что изменило тело"
          intro="Вес (лучший подтверждённый) и замеры — объём, талия, посадка одежды."
          drivers={snapshot.bodyDrivers}
          empty="Пока нет сдвига веса или обхватов — стадия тела остаётся на месте."
        />
        <DriverList
          title="Что изменило состояние героя"
          intro="Способности, шаги, питание, сон/ресурс, инерция, главы и сезоны."
          drivers={snapshot.heroDrivers}
          empty="Отмечай привычки и способности — состояние станет собраннее."
        />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--app-text-muted)]">
        {snapshot.disclaimer}
      </p>

      <p className="mt-3 text-sm">
        <Link
          to="/"
          className="font-medium text-[var(--app-primary)] hover:underline"
        >
          Смотреть героя на главной →
        </Link>
      </p>
    </Card>
  );
}
