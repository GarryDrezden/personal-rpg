type CozyArtPlaceholderProps = {
  label: string;
  layout?: 'banner' | 'icon' | 'compact';
  testId?: string;
  className?: string;
};

const LAYOUT: Record<
  NonNullable<CozyArtPlaceholderProps['layout']>,
  string
> = {
  banner: 'h-[5.25rem] w-full sm:h-[7.5rem] md:h-[10rem]',
  icon: 'h-12 w-12 shrink-0',
  compact: 'h-14 w-[5.25rem] shrink-0',
};

/** Warm same-theme stand-in — never shows Dark Fantasy art. */
export function CozyArtPlaceholder({
  label,
  layout = 'banner',
  testId,
  className = '',
}: CozyArtPlaceholderProps) {
  return (
    <div
      data-testid={testId}
      role="img"
      aria-label={label}
      className={`cozy-art-placeholder relative overflow-hidden rounded-xl border border-[var(--app-border)] ${LAYOUT[layout]} ${className}`}
    >
      <span className="cozy-art-placeholder__leaf" aria-hidden />
      <span className="sr-only">{label}</span>
      {layout === 'banner' ? (
        <span className="absolute bottom-2 left-3 right-3 text-[10px] font-medium uppercase tracking-wide text-[var(--app-wood)]/80">
          Иллюстрация уютной темы готовится
        </span>
      ) : null}
    </div>
  );
}
