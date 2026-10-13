import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { routing } from '@/i18n/routing';
import { languageAlternates, localizedPath, routes } from '@/lib/paths';

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${site.url}${p}`;
  return Object.values(routes).flatMap((path) =>
    routing.locales.map((locale) => ({
      url: abs(localizedPath(locale, path)),
      changeFrequency: 'monthly' as const,
      priority: path === routes.home ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languageAlternates(path)).map(([lang, p]) => [lang, abs(p)]),
        ),
      },
    })),
  );
}
