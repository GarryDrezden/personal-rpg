import { Link } from 'react-router-dom';
import type { FaqItem } from '../../constants/faqContent';

type FaqAccordionItemProps = {
  item: FaqItem;
  defaultOpen?: boolean;
};

export function FaqAccordionItem({ item, defaultOpen = false }: FaqAccordionItemProps) {
  return (
    <details
      id={item.id}
      className="group rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] open:bg-[var(--app-bg-soft)]"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-medium text-[var(--app-text)] marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          <span>{item.question}</span>
          <span
            aria-hidden
            className="mt-0.5 shrink-0 text-[var(--app-text-muted)] transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </span>
      </summary>
      <div className="border-t border-[var(--app-border)] px-4 py-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
        <p>{item.answer}</p>
        {item.links && item.links.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-xs font-medium text-[var(--app-primary)] hover:brightness-[1.03]"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}
