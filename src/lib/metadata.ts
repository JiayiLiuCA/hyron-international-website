import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import type { Locale } from '@/i18n/routing';
import { languageAlternates, localizedPath, routes, type RouteKey } from '@/lib/paths';

/** Per-page, per-locale title/description + canonical and hreflang links. */
export async function pageMetadata(page: RouteKey): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const path = routes[page];
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const url = localizedPath(locale, path);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title,
      description,
      url,
      locale: locale === 'zh' ? 'zh_CN' : 'en_CA',
      alternateLocale: locale === 'zh' ? ['en_CA'] : ['zh_CN'],
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: t('ogAlt') }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}
