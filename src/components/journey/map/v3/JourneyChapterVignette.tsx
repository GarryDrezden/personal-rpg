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

const STATUS_BADGE: Record<JourneyVignetteStatus, string | null> = {
  current: 'Сейчас',
  completed: null,
  locked: null,
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

  const statusBadge = STATUS_BADGE[status];

  return (
    <div
      className={`journey-v3-vignette journey-v3-vignette--${status}`}
      data-chapter={chapterNumber}
      style={{ ['--chapter-gradient-fallback' as string]: visual.gradient }}
    >
      <div
        className={`journey-v3-vignette__fallback${resolvedArtUrl ? ' journey-v3-vignette__fallback--hidden' : ''}`}
        aria-hidden
      />

      {resolvedArtUrl ? (
        <div
          className="journey-v3-vignette__art"
          style={{ backgroundImage: `url("${resolvedArtUrl}")` }}
          aria-hidden
        />
      ) : null}

      <div className="journey-v3-vignette__overlay" aria-hidden />

      {statusBadge ? (
        <span className="journey-v3-vignette__status-badge">{statusBadge}</span>
      ) : null}

      {status === 'completed' ? (
        <span className="journey-v3-vignette__completed-mark" aria-hidden>
          ✓
        </span>
      ) : null}

      <div className="journey-v3-vignette__caption">
        <span className="journey-v3-vignette__number">{chapterNumber}</span>
        <div className="journey-v3-vignette__text">
          <span className="journey-v3-vignette__title">{visual.captionTitle}</span>
          <span className="journey-v3-vignette__subtitle">{visual.captionSubtitle}</span>
        </div>
        <span className="journey-v3-vignette__symbol" aria-hidden>
          {visual.symbol}
        </span>
      </div>
    </div>
  );
}
