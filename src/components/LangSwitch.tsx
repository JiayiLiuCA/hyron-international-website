'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { htmlLang, routing } from '@/i18n/routing';
import { cn } from '@/lib/cn';

const labels = { en: 'EN', zh: '中文' } as const;

/** `EN / 中文` — switching keeps the visitor on the same page. */
export function LangSwitch({ className }: { className?: string }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t('language')} className={cn('flex items-center gap-2 text-sm whitespace-nowrap', className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 ? (
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
          ) : null}
          {l === locale ? (
            <span aria-current="true" lang={htmlLang[l]} className="font-semibold">
              {labels[l]}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={l}
              lang={htmlLang[l]}
              hrefLang={htmlLang[l]}
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              {labels[l]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
