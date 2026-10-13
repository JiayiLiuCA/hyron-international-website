import { htmlLang, routing, type Locale } from '@/i18n/routing';

/** App routes, without locale prefix. */
export const routes = {
  home: '/',
  about: '/about',
  services: '/services',
  howWeWork: '/how-we-work',
  contact: '/contact',
  legal: '/legal',
} as const;

export type RouteKey = keyof typeof routes;

export function localizedPath(locale: Locale, path: string) {
  return `/${locale}${path === '/' ? '' : path}`;
}

/** hreflang map (en, zh-Hans, x-default → en) for a locale-less path. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [htmlLang[l], localizedPath(l, path)])),
    'x-default': localizedPath(routing.defaultLocale, path),
  };
}

/** Service anchor ids on /services, in display order (brief §4.3). */
export const serviceAnchors = {
  strategicAdvisory: 'strategic-advisory',
  financingReadiness: 'financing-readiness',
  transactions: 'transactions',
  realEstate: 'real-estate',
  operations: 'operations',
  professionalCoordination: 'professional-coordination',
} as const;

export type ServiceKey = keyof typeof serviceAnchors;
export const serviceKeys = Object.keys(serviceAnchors) as ServiceKey[];
