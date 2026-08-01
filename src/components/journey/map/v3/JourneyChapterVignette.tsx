import { useEffect, useState } from 'react';
import {
  getChapterArtCandidates,
  getJourneyChapterVisual,
} from '../../../../constants/journeyChapterVisuals';
import { useAppTheme } from '../../../../hooks/useAppTheme';

export type JourneyVignetteStatus = 'completed' | 'current' | 'locked';

type JourneyChapterVignetteProps = {
  chapterNumber: number;
  status: JourneyVignetteStatus;
};

function tryLoadImage(urls: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    let index = 0;

    const attempt = () => {
      if (index >= urls.length) {
        resolve(null);
        return;
      }

      const url = urls[index]!;
      index += 1;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => attempt();
      img.src = url;
    };

    attempt();
  });
}

export function JourneyChapterVignette({ chapterNumber, status }: JourneyChapterVignetteProps) {
  const { themeId, isCozy } = useAppTheme();
  const visual = getJourneyChapterVisual(chapterNumber);
  const [resolvedArtUrl, setResolvedArtUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedArtUrl(null);

    void tryLoadImage(getChapterArtCandidates(chapterNumber, themeId)).then((url) => {
      if (!cancelled) setResolvedArtUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [chapterNumber, themeId]);

  const gradientFallback = isCozy
    ? 'linear-gradient(180deg, #dceef7 0%, #f7f0e4 52%, #c8d9b8 100%)'
    : visual.gradient;

  return (
    <div
      className={`journey-v3-vignette journey-v3-vignette--${status}${isCozy ? ' journey-v3-vignette--cozy' : ''}`}
      data-chapter={chapterNumber}
      style={{ ['--chapter-gradient-fallback' as string]: gradientFallback }}
      aria-hidden
    >
      <div
        className={`journey-v3-vignette__fallback${resolvedArtUrl ? ' journey-v3-vignette__fallback--hidden' : ''}`}
      />

      {resolvedArtUrl ? (
        <div
          className="journey-v3-vignette__art"
          style={{ backgroundImage: `url("${resolvedArtUrl}")` }}
        />
      ) : null}

      <div className="journey-v3-vignette__blend" />
      <div className="journey-v3-vignette__shade" />

      {status === 'current' ? (
        <span className="journey-v3-vignette__status">Сейчас</span>
      ) : null}

      <div className="journey-v3-vignette__meta">
        <span className="journey-v3-vignette__biome">{visual.label}</span>
        <span className="journey-v3-vignette__symbol">{visual.symbol}</span>
      </div>
    </div>
  );
}
