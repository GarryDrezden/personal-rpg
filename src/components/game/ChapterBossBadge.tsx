import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getThemeTerm } from '../../constants/themeTerms';
import { getArtifactMeta, getBossMeta } from '../../game/assetRegistry';
import { getBossPresentation } from '../../game/themeEntityPresentation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { GameAssetImage } from './GameAssetImage';

type ChapterBossBadgeProps = {
  bossId: BossId;
  chapter: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
  compact?: boolean;
  large?: boolean;
  /** Dashboard: art-first vertical card, larger than mob */
  prominent?: boolean;
};

const statusLabel = {
  locked: 'Закрыта',
  active: 'Текущая',
  defeated: 'Пройдена',
} as const;

export function ChapterBossBadge({
  bossId,
  chapter,
  status = 'active',
  compact,
  large,
  prominent,
}: ChapterBossBadgeProps) {
  const meta = getBossMeta(bossId);
  const { themeId, isCozy } = useAppTheme();
  const presentation = getBossPresentation(themeId, bossId, meta);
  const isLarge = large && !compact;
  const imageStatus = status === 'locked' ? 'locked' : status === 'active' ? 'current' : 'unlocked';
  const reward = meta.rewardArtifactId ? getArtifactMeta(meta.rewardArtifactId).title : null;
  const term = getThemeTerm(themeId, 'boss');
  const shellClass = isCozy
    ? 'border-[var(--app-wood)]/40 bg-[color-mix(in_srgb,var(--app-card)_90%,#efe4d2)]'
    : 'border-violet-500/35 bg-[color-mix(in_srgb,#000_42%,var(--app-card))] shadow-[0_0_20px_color-mix(in_srgb,#7c3aed_12%,transparent)]';
  const labelClass = isCozy ? 'text-[var(--app-wood)]' : 'text-violet-200/85';

  if (prominent && !compact) {
    return (
      <div
        data-testid="chapter-boss-badge"
        className={`flex flex-col overflow-hidden rounded-xl border ${shellClass}`}
      >
        <div
          className={`flex h-[6rem] items-center justify-center p-2 sm:h-[6.5rem] ${
            isCozy ? 'bg-[color-mix(in_srgb,var(--app-wood)_10%,transparent)]' : 'bg-black/25'
          }`}
        >
          <GameAssetImage
            variant="boss"
            src={presentation.imagePath}
            alt={presentation.title}
            fallbackCandidates={presentation.imageCandidates.slice(1)}
            status="unlocked"
            fit="boss"
            className="h-full w-full"
            imageClassName="scale-[1.28] sm:scale-[1.35]"
          />
        </div>
        <div className={`border-t px-2.5 py-2 ${isCozy ? 'border-[var(--app-wood)]/25' : 'border-violet-500/25'}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wide ${labelClass}`}>
            {term} · {statusLabel[status]}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-tight text-[var(--app-text)]">
            {presentation.title}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--app-text-muted)]">
            Гл. {chapter}
            {reward ? ` · ${reward}` : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="chapter-boss-badge"
      className={`flex items-center rounded-lg border backdrop-blur-sm ${
        isCozy
          ? 'border-[var(--app-wood)]/35 bg-[color-mix(in_srgb,var(--app-card)_92%,#efe4d2)]'
          : 'border-violet-500/30 bg-black/45'
      } ${isLarge ? 'gap-3 rounded-xl p-2.5' : compact ? 'gap-2 p-1.5' : 'gap-3 rounded-xl p-3'}`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-lg ${
          isCozy ? 'bg-[color-mix(in_srgb,var(--app-wood)_10%,transparent)]' : 'bg-black/30'
        } ${isLarge ? 'h-[4.5rem] w-[4.5rem]' : compact ? 'h-9 w-9 rounded-md' : 'h-12 w-12'}`}
      >
        <GameAssetImage
          variant="boss"
          src={presentation.imagePath}
          alt={presentation.title}
          fallbackCandidates={presentation.imageCandidates.slice(1)}
          status={compact || isLarge ? 'unlocked' : imageStatus}
          fit="boss"
          className="h-full w-full"
          imageClassName={isLarge ? 'scale-[1.35]' : 'scale-110'}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold uppercase tracking-wide ${labelClass} ${
            isLarge ? 'text-xs' : 'text-[11px] sm:text-xs'
          }`}
        >
          {term} · {statusLabel[status]}
        </p>
        <p className={`font-semibold text-[var(--app-text)] ${isLarge ? 'text-sm' : compact ? 'text-xs' : 'text-sm'}`}>
          {presentation.title}
        </p>
        <p className={`truncate text-[var(--app-text-muted)] ${isLarge ? 'text-xs' : compact ? 'text-[11px]' : 'text-xs'}`}>
          Гл. {chapter}
          {reward ? ` · ${reward}` : ''}
        </p>
      </div>
    </div>
  );
}
