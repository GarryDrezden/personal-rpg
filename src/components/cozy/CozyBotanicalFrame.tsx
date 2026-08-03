import type { ReactNode } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';

export type CozyBotanicalIntensity = 'subtle' | 'medium' | 'hero';

type CozyBotanicalFrameProps = {
  children: ReactNode;
  intensity?: CozyBotanicalIntensity;
  /** Cream paper base + light print texture */
  paper?: boolean;
  /** Short decorative handwritten note (not for metrics/buttons) */
  note?: string;
  className?: string;
  contentClassName?: string;
  testId?: string;
};

function FoliageCorner({
  corner,
}: {
  corner: 'tl' | 'tr' | 'bl' | 'br';
}) {
  const flipX = corner === 'tr' || corner === 'br';
  const flipY = corner === 'bl' || corner === 'br';
  return (
    <svg
      className={`cozy-botanical-frame__foliage cozy-botanical-frame__foliage--${corner}`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
    >
      <path
        d="M18 28c28 6 48 28 54 56"
        stroke="var(--cozy-forest)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M34 42c14-18 36-24 54-12"
        stroke="var(--cozy-leaf)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M44 62c-6 18 4 40 22 52"
        stroke="var(--cozy-herb)"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.45"
      />
      <ellipse
        cx="78"
        cy="34"
        rx="11"
        ry="18"
        transform="rotate(-32 78 34)"
        fill="var(--cozy-leaf)"
        opacity="0.28"
      />
      <ellipse
        cx="52"
        cy="78"
        rx="13"
        ry="20"
        transform="rotate(16 52 78)"
        fill="var(--cozy-herb)"
        opacity="0.24"
      />
      <ellipse
        cx="38"
        cy="52"
        rx="9"
        ry="15"
        transform="rotate(-40 38 52)"
        fill="var(--cozy-leaf-light)"
        opacity="0.22"
      />
      <ellipse
        cx="68"
        cy="58"
        rx="7"
        ry="12"
        transform="rotate(8 68 58)"
        fill="var(--cozy-forest)"
        opacity="0.18"
      />
    </svg>
  );
}

/**
 * Cozy Botanical Print frame — paper + foliage accents.
 * Renders as a plain wrapper under Dark Fantasy (no botanical chrome).
 */
export function CozyBotanicalFrame({
  children,
  intensity = 'medium',
  paper = true,
  note,
  className = '',
  contentClassName = '',
  testId = 'cozy-botanical-frame',
}: CozyBotanicalFrameProps) {
  const { isCozy } = useAppTheme();

  if (!isCozy) {
    return (
      <div className={className} data-testid={testId}>
        {children}
      </div>
    );
  }

  return (
    <div
      data-testid={testId}
      className={[
        'cozy-botanical-frame',
        `cozy-botanical-frame--${intensity}`,
        paper ? 'cozy-botanical-frame--paper' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cozy-botanical-frame__texture" aria-hidden />
      <FoliageCorner corner="tl" />
      <FoliageCorner corner="tr" />
      {intensity !== 'subtle' ? <FoliageCorner corner="br" /> : null}
      {intensity === 'hero' ? <FoliageCorner corner="bl" /> : null}
      <div className={`cozy-botanical-frame__content ${contentClassName}`}>{children}</div>
      {note ? (
        <p className="cozy-hand-accent cozy-botanical-frame__note">{note}</p>
      ) : null}
    </div>
  );
}
