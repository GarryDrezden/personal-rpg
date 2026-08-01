import type { BossId, ChapterNumber } from '../../types/gameAssets';
import { getThemeTerm } from '../../constants/themeTerms';
import { getBossMeta, getArtifactMeta } from '../../game/assetRegistry';
import { getLegacyCodexBossManifestAssetId } from '../../game/manifestAssetUi';
import { getBossPresentation } from '../../game/themeEntityPresentation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import { GameAssetImage } from './GameAssetImage';
import { ManifestArtScene } from './ManifestArtScene';

type ChapterBossCardProps = {
  bossId: BossId;
  chapter?: ChapterNumber;
  status?: 'locked' | 'active' | 'defeated';
  compact?: boolean;
};

const statusLabel = {
  locked: 'Закрыта',
  active: 'Текущая глава',
  defeated: 'Пройдена',
} as const;

const bossArtGlowClass =
  'border-violet-500/30 shadow-[0_4px_24px_rgba(124,58,237,0.15)]';

function ChapterBossArt({
  bossId,
  title,
  imageSrc,
  imageStatus,
  locked,
  compact,
}: {
  bossId: BossId;
  title: string;
  imageSrc: string;
  imageStatus: 'locked' | 'current' | 'unlocked';
  locked: boolean;
  compact: boolean;
}) {
  const manifestAssetId = getLegacyCodexBossManifestAssetId(bossId);
  const layout = compact ? 'boss-codex-compact' : 'boss-codex';
  const legacyFrameClass = compact
    ? 'aspect-video w-full max-h-[11rem]'
    : 'aspect-video w-full max-h-[13.75rem] sm:max-h-[16.25rem]';

  if (manifestAssetId) {
    return (
      <ManifestArtScene
        assetId={manifestAssetId}
        alt={title}
        layout={layout}
        dimmed={locked}
        testId={`chapter-boss-art-${bossId}`}
        className={bossArtGlowClass}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-b from-violet-950/30 to-[var(--app-bg-soft)] ${bossArtGlowClass} ${legacyFrameClass}`}
      data-testid={`chapter-boss-art-${bossId}`}
    >
      <GameAssetImage
        variant="boss"
        src={imageSrc}
        alt={title}
        status={imageStatus}
        className="absolute inset-0 h-full w-full"
        imageClassName="h-full w-full object-cover object-center"
        fit="boss"
      />
    </div>
  );
}

export function ChapterBossCard({
  bossId,
  chapter,
  status = 'active',
  compact = false,
}: ChapterBossCardProps) {
  const meta = getBossMeta(bossId);
  const { themeId, isCozy } = useAppTheme();
  const presentation = getBossPresentation(themeId, bossId, meta);
  const imageStatus = status === 'locked' ? 'locked' : status === 'active' ? 'current' : 'unlocked';
  const locked = status === 'locked';

  return (
    <Card data-testid="chapter-boss-card" className={compact ? 'p-4' : ''}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          {getThemeTerm(themeId, 'bossChapter')}
        </p>
        <span className="rounded-full bg-[var(--app-bg-soft)] px-2 py-0.5 text-[10px] text-[var(--app-text-muted)]">
          {statusLabel[status]}
        </span>
      </div>

      <div className="mt-3">
        {isCozy ? (
          <div
            className={`relative overflow-hidden rounded-xl border border-[var(--app-wood)]/35 bg-gradient-to-b from-[#fff8ee] to-[#e4efe0] ${
              compact
                ? 'aspect-video w-full max-h-[11rem]'
                : 'aspect-video w-full max-h-[13.75rem] sm:max-h-[16.25rem]'
            }`}
            data-testid={`chapter-boss-art-${bossId}`}
          >
            <GameAssetImage
              variant="boss"
              src={presentation.imagePath}
              alt={presentation.title}
              fallbackCandidates={presentation.imageCandidates.slice(1)}
              status={imageStatus}
              className="absolute inset-0 h-full w-full"
              imageClassName="h-full w-full object-contain object-center"
              fit="boss"
            />
          </div>
        ) : (
          <ChapterBossArt
            bossId={bossId}
            title={presentation.title}
            imageSrc={presentation.imagePath}
            imageStatus={imageStatus}
            locked={locked}
            compact={compact}
          />
        )}
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="font-semibold text-[var(--app-text)]">{presentation.title}</h3>
        <p className="text-xs text-[var(--app-primary)]">
          {chapter ? `Глава ${chapter}` : presentation.subtitle}
        </p>
        {!compact && (
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{presentation.description}</p>
        )}
        {meta.rewardArtifactId && (
          <p className="mt-2 text-xs text-[var(--app-text-muted)]">
            Награда: {getArtifactMeta(meta.rewardArtifactId).title}
          </p>
        )}
      </div>
    </Card>
  );
}
