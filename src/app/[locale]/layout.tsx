import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { site } from '@/config/site';
import { htmlLang, routing } from '@/i18n/routing';
import { openSans, trirong } from '@/lib/fonts';
import { notoSerifSC } from '@/lib/fonts-zh';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');
  return {
    metadataBase: new URL(site.url),
    title: { default: t('home.title'), template: `%s | ${site.name}` },
    description: t('home.description'),
    applicationName: site.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#05368a',
};

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const t = await getTranslations('Nav');
  const tm = await getTranslations('Meta');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    alternateName: site.nameZh,
    url: `${site.url}/${locale}`,
    logo: `${site.url}/logo/hyron-icon-512.png`,
    image: `${site.url}/og-image.jpg`,
    description: tm('home.description'),
    telephone: site.phone.e164,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHours: site.hours.schema,
    areaServed: [
      { '@type': 'Place', name: 'Greater Toronto Area' },
      { '@type': 'Country', name: 'Canada' },
    ],
    knowsLanguage: ['en', 'zh-Hans'],
  };

  return (
    <html
      lang={htmlLang[locale]}
      // Next 16: make route transitions jump instantly (incl. to /services#…)
      // while in-page anchor links keep the CSS smooth scroll.
      data-scroll-behavior="smooth"
      className={`${openSans.variable} ${trirong.variable} ${notoSerifSC.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only fixed top-3 left-3 z-[60] bg-royal px-4 py-3 text-sm font-semibold text-ivory focus:not-sr-only"
        >
          {t('skip')}
        </a>
        <NextIntlClientProvider
          messages={{ Nav: messages.Nav, Contact: { form: messages.Contact.form } }}
        >
          <Header
            contact={{ phone: site.phone.display, phoneHref: site.phone.href, email: site.email }}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
