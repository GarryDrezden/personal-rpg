import type { HeroGender, HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getChapterMeta } from '../../constants/gameChapters';
import { getHeroStageImageCandidates } from '../../game/assetPaths';
import { getHeroStageMeta } from '../../game/assetRegistry';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { GameAssetImage } from './GameAssetImage';

type HeroStageCardProps = {
  gender: HeroGender;
  stage: HeroStageNumber;
  progressPercent: number;
  progressToNextStage?: number;
  compact?: boolean;
  hasWeightPath?: boolean;
};

export function HeroStageCard({
  gender,
  stage,
  progressPercent,
  progressToNextStage = 0,
  compact = false,
  hasWeightPath = true,
}: HeroStageCardProps) {
  const meta = getHeroStageMeta(gender, stage);
  const chapter = getChapterMeta(meta.chapter);

  return (
    <Card data-testid="hero-stage-card" className={compact ? 'p-4' : ''}>
      <div className={`flex gap-4 ${compact ? 'flex-row items-stretch' : 'flex-col sm:flex-row'}`}>
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] ${
            compact ? 'h-56 w-40' : 'h-[22rem] w-48 sm:h-[26rem] sm:w-52'
          }`}
        >
          <GameAssetImage
            variant="hero"
            src={meta.image}
            alt={meta.title}
            fallbackCandidates={getHeroStageImageCandidates(gender, stage).slice(1)}
            status="current"
            className="h-full w-full"
            imageClassName="object-contain object-bottom"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
            Глава {chapter.chapter}: {chapter.title}
          </p>
          <h2 className="mt-1 text-lg font-bold text-[var(--app-text)]">{meta.title}</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{meta.description}</p>

          {!hasWeightPath ? (
            <p className="mt-3 text-sm text-[var(--app-text-muted)]">
              Задай целевой вес в настройках и добавь замеры — откроется шкала стадий.
            </p>
          ) : (
            <>
              <p className="mt-2 text-xs text-[var(--app-text-muted)]">
                Стадия {stage}/{HERO_STAGE_COUNT} · Прогресс пути: {Math.round(progressPercent)}%
              </p>
              <p className="mt-1 text-[11px] text-[var(--app-text-muted)]">
                Стадия считается по лучшему достигнутому весу, чтобы временные колебания не
                откатывали персонажа.
              </p>
              {stage < HERO_STAGE_COUNT ? (
                <div className="mt-3">
                  <ProgressBar value={progressToNextStage} max={100} />
                  <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                    До следующей стадии: {Math.round(progressToNextStage)}%
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm font-medium text-[var(--app-primary)]">
                  Финальная стадия открыта
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
