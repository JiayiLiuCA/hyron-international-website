import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/** BCP 47 tag used for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-Hans',
};
