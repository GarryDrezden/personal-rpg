import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { GameAssetVariant } from './GameAssetPlaceholder';
import { GameAssetImage } from './GameAssetImage';

type GameSceneBannerCardProps = {
  testId?: string;
  variant: GameAssetVariant;
  imageSrc: string;
  imageAlt: string;
  fallbackCandidates?: string[];
  badge: ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
  href?: string;
  borderClassName?: string;
  backdropClassName?: string;
  imagePositionClassName?: string;
  imageScaleClassName?: string;
  /** banner = wide strip; portrait = tall threat card for command-bridge */
  layout?: 'banner' | 'portrait';
  /** warm = cozy light surfaces (readable brown text); dark = fantasy overlays */
  surfaceTone?: 'dark' | 'warm';
};

function CardInner({
  variant,
  imageSrc,
  imageAlt,
  fallbackCandidates = [],
  badge,
  title,
  subtitle,
  accent,
  backdropClassName = 'from-[#12101c] via-[#0e0c16] to-[#08070f]',
  imagePositionClassName,
  imageScaleClassName,
  layout = 'banner',
  surfaceTone = 'dark',
}: GameSceneBannerCardProps) {
  const isPortrait = layout === 'portrait';
  const warm = surfaceTone === 'warm';
  const resolvedImagePosition =
    imagePositionClassName ??
    (isPortrait ? 'inset-x-0 top-0 h-[72%]' : 'right-0 w-[58%] sm:w-[52%]');
  const resolvedImageScale =
    imageScaleClassName ?? (isPortrait ? 'scale-[1.05]' : 'scale-[1.18] sm:scale-[1.22]');

  const titleClass = warm
    ? 'text-base font-bold leading-tight text-[var(--app-text)] sm:text-lg'
    : 'text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg';
  const subClass = warm
    ? 'mt-0.5 text-xs text-[var(--app-text-muted)]'
    : 'mt-0.5 text-xs text-white/75';
  const accentClass = warm
    ? 'mt-1 line-clamp-2 text-[11px] font-medium text-[var(--app-garden)]'
    : 'mt-1 line-clamp-2 text-[11px] font-medium text-amber-300/95';

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${backdropClassName}`} />

      <div className={`absolute ${resolvedImagePosition}`}>
        <GameAssetImage
          variant={variant}
          src={imageSrc}
          alt={imageAlt}
          fallbackCandidates={fallbackCandidates}
          fit={variant === 'boss' ? 'boss' : variant === 'mob' ? 'mob' : 'default'}
          className="h-full w-full bg-transparent"
          imageClassName={`object-contain ${isPortrait ? 'object-bottom' : 'object-right'} ${resolvedImageScale}`}
        />
      </div>

      {isPortrait ? (
        <>
          <div
            className={`pointer-events-none absolute inset-0 ${
              warm
                ? 'bg-gradient-to-t from-[#f1ebe0]/95 via-[#f1ebe0]/25 to-transparent'
                : 'bg-gradient-to-t from-black/90 via-black/25 to-black/30'
            }`}
          />
          <div className="absolute left-3 top-3 z-10">{badge}</div>
          <div className="absolute bottom-0 left-0 z-10 w-full p-3">
            <h3 className={titleClass}>{title}</h3>
            {subtitle ? <p className={subClass}>{subtitle}</p> : null}
            {accent ? <p className={accentClass}>{accent}</p> : null}
          </div>
        </>
      ) : (
        <>
          <div
            className={`pointer-events-none absolute inset-0 ${
              warm
                ? 'bg-gradient-to-r from-[#f1ebe0]/95 via-[#f1ebe0]/55 to-transparent'
                : 'bg-gradient-to-r from-black/88 via-black/55 to-transparent'
            }`}
          />
          {!warm ? (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
          ) : null}
          <div className="absolute left-3 top-3 z-10">{badge}</div>
          <div className="absolute bottom-0 left-0 z-10 max-w-[78%] p-3 sm:max-w-[72%]">
            <h3 className={titleClass}>{title}</h3>
            {subtitle ? <p className={`${subClass} sm:text-sm`}>{subtitle}</p> : null}
            {accent ? (
              <p className={warm ? accentClass.replace('text-[11px]', 'text-xs') : 'mt-1 line-clamp-2 text-xs font-medium text-amber-300/95'}>
                {accent}
              </p>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

export function GameSceneBannerCard(props: GameSceneBannerCardProps) {
  const {
    href,
    borderClassName = 'border-[var(--app-border)]',
    backdropClassName = 'from-[#12101c] via-[#0e0c16] to-[#08070f]',
    imagePositionClassName,
    imageScaleClassName,
    layout = 'banner',
    surfaceTone = 'dark',
    testId,
  } = props;

  const shell =
    layout === 'portrait'
      ? `relative min-h-[14rem] w-full flex-1 overflow-hidden rounded-2xl border aspect-[3/4] max-h-[22rem] ${
          surfaceTone === 'warm'
            ? 'shadow-[0_8px_22px_rgba(74,55,32,0.1)]'
            : 'shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
        }`
      : `relative aspect-[2.35/1] min-h-[7.25rem] w-full overflow-hidden rounded-2xl border ${
          surfaceTone === 'warm'
            ? 'shadow-[0_8px_22px_rgba(74,55,32,0.1)]'
            : 'shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
        }`;

  const className = `${shell} ${borderClassName} ${href ? 'transition hover:brightness-105' : ''}`;

  if (href) {
    return (
      <Link to={href} data-testid={testId} className={className}>
        <CardInner
          {...props}
          backdropClassName={backdropClassName}
          imagePositionClassName={imagePositionClassName}
          imageScaleClassName={imageScaleClassName}
          borderClassName={borderClassName}
          layout={layout}
          surfaceTone={surfaceTone}
        />
      </Link>
    );
  }

  return (
    <div data-testid={testId} className={className}>
      <CardInner
        {...props}
        backdropClassName={backdropClassName}
        imagePositionClassName={imagePositionClassName}
        imageScaleClassName={imageScaleClassName}
        borderClassName={borderClassName}
        layout={layout}
        surfaceTone={surfaceTone}
      />
    </div>
  );
}
