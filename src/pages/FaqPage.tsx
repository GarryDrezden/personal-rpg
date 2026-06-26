import { Link } from 'react-router-dom';
import { HelpCircle, Compass, Settings } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { FaqAccordionItem } from '../components/faq/FaqAccordionItem';
import { FAQ_QUICK_START, FAQ_SECTIONS } from '../constants/faqContent';

export function FaqPage() {
  return (
    <div className="space-y-8 pb-6">
      <header>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--app-primary)_14%,var(--app-card))] text-[var(--app-primary)]">
            <HelpCircle size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">FAQ и гайд</h1>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">
              Как пользоваться «Личной RPG» с нуля
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--app-text-muted)]">
          Это не дневник вины и не медицинский сервис. Ты отмечаешь реальные действия, получаешь
          игровую обратную связь и постепенно возвращаешь телу контроль, выносливость и устойчивость.
          Начни с пяти шагов ниже — остальное откроется по ходу пути.
        </p>
      </header>

      <Card className="border-[color-mix(in_srgb,var(--app-primary)_30%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_6%,var(--app-card))]">
        <div className="mb-4 flex items-center gap-2">
          <Compass className="text-[var(--app-primary)]" size={20} />
          <h2 className="font-semibold text-[var(--app-text)]">Быстрый старт</h2>
        </div>
        <ol className="space-y-4">
          {FAQ_QUICK_START.map((step) => (
            <li key={step.step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-primary)] text-sm font-bold text-slate-950">
                {step.step}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-medium text-[var(--app-text)]">{step.title}</h3>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">{step.text}</p>
                <Link
                  to={step.to}
                  className="mt-2 inline-block text-sm font-medium text-[var(--app-primary)] hover:underline"
                >
                  Перейти →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-[var(--app-text)]">Ежедневная привычка</h2>
        <p className="mb-4 max-w-3xl text-sm text-[var(--app-text-muted)]">
          Минимальный цикл, который держит систему в движении:{' '}
          <strong className="font-medium text-[var(--app-text)]">Сегодня</strong> → сохранить день →
          заглянуть на <strong className="font-medium text-[var(--app-text)]">Главную</strong> → раз
          в неделю — <strong className="font-medium text-[var(--app-text)]">Замеры</strong> и{' '}
          <strong className="font-medium text-[var(--app-text)]">Отчёты</strong>. Всё остальное —
          бонусы, а не обязанность.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/today"
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 text-sm transition-colors hover:border-[var(--app-primary)]/40"
          >
            <span className="font-medium text-[var(--app-text)]">Сегодня</span>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">Квесты и сохранение дня</p>
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 text-sm transition-colors hover:border-[var(--app-primary)]/40"
          >
            <span className="font-medium text-[var(--app-text)]">Главная</span>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">Сводка и следующий шаг</p>
          </Link>
          <Link
            to="/settings"
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 text-sm transition-colors hover:border-[var(--app-primary)]/40"
          >
            <span className="font-medium text-[var(--app-text)]">Настройки</span>
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">Цели и привычки</p>
          </Link>
        </div>
      </section>

      {FAQ_SECTIONS.map((section, sectionIndex) => (
        <section key={section.id} id={`faq-${section.id}`} className="scroll-mt-24">
          <h2 className="text-lg font-semibold text-[var(--app-text)]">{section.title}</h2>
          {section.description ? (
            <p className="mt-1 mb-4 text-sm text-[var(--app-text-muted)]">{section.description}</p>
          ) : (
            <div className="mb-4" />
          )}
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                defaultOpen={sectionIndex === 0 && itemIndex === 0}
              />
            ))}
          </div>
        </section>
      ))}

      <Card className="bg-[var(--app-bg-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-[var(--app-text)]">Готов настроить цели?</h2>
            <p className="mt-2 text-sm text-[var(--app-text-muted)]">
              Начни с лимита калорий, шагов и недельной цели по очкам — остальное можно добавить
              позже.
            </p>
          </div>
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-2.5 text-sm font-semibold text-slate-950 hover:brightness-105"
          >
            <Settings size={16} />
            Открыть настройки
          </Link>
        </div>
      </Card>
    </div>
  );
}
