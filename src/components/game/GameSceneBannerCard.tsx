import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { GameAssetVariant } from './GameAssetPlaceholder';
import { GameAssetImage } from './GameAssetImage';

type GameSceneBannerCardProps = {
  testId?: string;
  variant: GameAssetVariant;
  imageSrc: string;
  imageAlt: string;
  badge: ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
  href?: string;
  borderClassName?: string;
  backdropClassName?: string;
  imagePositionClassName?: string;
  imageScaleClassName?: string;
};

function CardInner({
  variant,
  imageSrc,
  imageAlt,
  badge,
  title,
  subtitle,
  accent,
  backdropClassName = 'from-[#12101c] via-[#0e0c16] to-[#08070f]',
  imagePositionClassName = 'right-0 w-[58%] sm:w-[52%]',
  imageScaleClassName = 'scale-[1.18] sm:scale-[1.22]',
}: GameSceneBannerCardProps) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${backdropClassName}`} />

      <div className={`absolute inset-y-0 ${imagePositionClassName}`}>
        <GameAssetImage
          variant={variant}
          src={imageSrc}
          alt={imageAlt}
          fit={variant === 'boss' ? 'boss' : variant === 'mob' ? 'mob' : 'default'}
          className="h-full w-full bg-transparent"
          imageClassName={`object-contain object-right ${imageScaleClassName}`}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

      <div className="absolute left-3 top-3 z-10">{badge}</div>

      <div className="absolute bottom-0 left-0 z-10 max-w-[78%] p-3 sm:max-w-[72%]">
        <h3 className="text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-white/75 sm:text-sm">{subtitle}</p>
        ) : null}
        {accent ? (
          <p className="mt-1 line-clamp-2 text-xs font-medium text-amber-300/95">{accent}</p>
        ) : null}
      </div>
    </>
  );
}

export function GameSceneBannerCard(props: GameSceneBannerCardProps) {
  const {
    href,
    borderClassName = 'border-[var(--app-border)]',
    backdropClassName = 'from-[#12101c] via-[#0e0c16] to-[#08070f]',
    imagePositionClassName = 'right-0 w-[58%] sm:w-[52%]',
    imageScaleClassName = 'scale-[1.18] sm:scale-[1.22]',
    testId,
  } = props;

  const className = `relative aspect-[2.35/1] min-h-[7.25rem] w-full overflow-hidden rounded-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.35)] ${borderClassName} ${
    href ? 'transition hover:brightness-105' : ''
  }`;

  if (href) {
    return (
      <Link to={href} data-testid={testId} className={className}>
        <CardInner
          {...props}
          backdropClassName={backdropClassName}
          imagePositionClassName={imagePositionClassName}
          imageScaleClassName={imageScaleClassName}
          borderClassName={borderClassName}
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
      />
    </div>
  );
}
