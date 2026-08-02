import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { AvatarStageSnapshot } from '../../types/avatarStages';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useHeroStageAssets } from '../../hooks/useHeroStageAssets';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { resolveGameProfile } from '../../game/gameProfile';
import { useAppStore } from '../../store/appStore';
import { Card } from '../ui/Card';
import { GameAssetImage } from '../game/GameAssetImage';

type AvatarStageDriversCardProps = {
  snapshot: AvatarStageSnapshot;
};

export function AvatarStageDriversCard({ snapshot }: AvatarStageDriversCardProps) {
  const { themeId, isCozy } = useAppTheme();
  const { settings } = useAppStore();
  const profile = resolveGameProfile(settings);
  const stageMeta = getHeroStageMeta(profile.heroGender, snapshot.stage);
  const heroAssets = useHeroStageAssets(profile.heroGender, snapshot.stage);

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
                {isCozy ? 'Стадия героя пути' : 'Стадия героя кампании'}
              </h2>
              <p className="text-xs text-[var(--app-text-muted)]">
                Визуальный прогресс — не медицинская оценка
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-[var(--app-text)]">
            Стадия {snapshot.stage}:{' '}
            <span className="font-semibold">{stageMeta.title}</span>
            {' · '}
            <span className="tabular-nums text-[var(--app-primary)]">
              {snapshot.avatarProgress}%
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
        <div
          className="h-full rounded-full bg-[var(--app-primary)] transition-all"
          style={{ width: `${snapshot.avatarProgress}%` }}
        />
      </div>

      {snapshot.advancedBeyondWeight ? (
        <p className="mt-3 text-sm text-[var(--app-text)]">
          Вес может стоять — стадия всё равно сдвинулась за счёт талии, способностей или
          стабильности.
        </p>
      ) : snapshot.avatarProgress === 0 ? (
        <p className="mt-3 text-sm text-[var(--app-text-muted)]">
          Пока мало опор для стадии. Отмечай шаги, питание, обхваты или способности — образ
          начнёт меняться.
        </p>
      ) : (
        <p className="mt-3 text-sm text-[var(--app-text-muted)]">
          Стадия собирается из нескольких опор пути, не только из веса.
        </p>
      )}

      {snapshot.drivers.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {snapshot.drivers.map((driver) => (
            <li
              key={driver.id}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-bg-soft)]/50 px-3 py-2"
            >
              <p className="text-sm font-medium text-[var(--app-text)]">{driver.label}</p>
              <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{driver.why}</p>
              <p className="mt-0.5 text-[11px] text-[var(--app-text-muted)]">{driver.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-[11px] leading-relaxed text-[var(--app-text-muted)]">
        {snapshot.disclaimer}
      </p>

      <p className="mt-3 text-sm">
        <Link
          to={themeId === 'cozy' ? '/home' : '/dashboard'}
          className="font-medium text-[var(--app-primary)] hover:underline"
        >
          Смотреть героя на главной →
        </Link>
      </p>
    </Card>
  );
}
