import { useEffect, useState } from 'react';
import {
  getChapterArtCandidates,
  getJourneyChapterVisual,
} from '../../../../constants/journeyChapterVisuals';

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
  const visual = getJourneyChapterVisual(chapterNumber);
  const [resolvedArtUrl, setResolvedArtUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedArtUrl(null);

    void tryLoadImage(getChapterArtCandidates(chapterNumber)).then((url) => {
      if (!cancelled) setResolvedArtUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [chapterNumber]);

  return (
    <div
      className={`journey-v3-vignette journey-v3-vignette--${status}`}
      data-chapter={chapterNumber}
      style={{ ['--chapter-gradient-fallback' as string]: visual.gradient }}
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
