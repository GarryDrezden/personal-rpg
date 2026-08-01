import type { ReactNode } from 'react';

type TodaySectionProps = {
  title: string;
  lead?: string;
  children: ReactNode;
  testId?: string;
  accent?: 'default' | 'body' | 'path' | 'trace';
};

export function TodaySection({
  title,
  lead,
  children,
  testId,
  accent = 'default',
}: TodaySectionProps) {
  return (
    <section
      data-testid={testId}
      className={`today-section today-section--${accent} space-y-3`}
    >
      <header className="today-section__header">
        <h2 className="today-section__title">{title}</h2>
        {lead ? <p className="today-section__lead">{lead}</p> : null}
      </header>
      {children}
    </section>
  );
}
