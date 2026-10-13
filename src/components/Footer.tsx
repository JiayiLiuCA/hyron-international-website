import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { routes } from '@/lib/paths';
import { MarkWatermark } from './ui';

const NAV = [
  { href: routes.about, key: 'about' },
  { href: routes.services, key: 'services' },
  { href: routes.howWeWork, key: 'howWeWork' },
  { href: routes.contact, key: 'contact' },
] as const;

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('Footer');
  const tn = await getTranslations('Nav');
  const tc = await getTranslations('Contact.details');

  const logo =
    locale === 'zh'
      ? { src: '/logo/hyron-logo-stacked-zh-gold.svg', w: 130.88, h: 125.12 }
      : { src: '/logo/hyron-logo-stacked-gold.svg', w: 129.92, h: 99.7 };

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-royal-950 text-ivory/80">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold/50" />
      {/* Eager: on short pages (404) the footer is in the first viewport. */}
      <MarkWatermark eager className="-right-40 -bottom-48 w-[42rem] max-w-none opacity-[0.06]" />

      <div className="container-page pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href={routes.home} aria-label={tn('homeLink')} className="inline-block">
              <Image
                src={logo.src}
                alt=""
                width={logo.w}
                height={logo.h}
                unoptimized
                loading="eager"
                className="h-24 w-auto"
              />
            </Link>
            <p className="mt-8 max-w-xs text-[0.8125rem] leading-relaxed tracking-[0.08em] text-ivory/70 uppercase lang-zh:text-sm lang-zh:tracking-[0.1em] lang-zh:normal-case">
              {t('tagline')}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-gold">{t('navHeading')}</h2>
            <ul className="mt-6 space-y-3">
              {NAV.map(({ href, key }) => (
                <li key={key}>
                  <Link href={href} className="transition-colors duration-300 hover:text-ivory">
                    {tn(key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.legal} className="transition-colors duration-300 hover:text-ivory">
                  {t('legal')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-gold">{t('contactHeading')}</h2>
            <address className="mt-6 space-y-4 not-italic">
              <p>
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p>
                <a href={site.phone.href} className="transition-colors duration-300 hover:text-ivory">
                  {site.phone.display}
                </a>
                <br />
                <a href={`mailto:${site.email}`} className="transition-colors duration-300 hover:text-ivory">
                  {site.email}
                </a>
              </p>
              <p className="text-ivory/70">
                {site.hours[locale === 'zh' ? 'zh' : 'en']}
                {locale === 'zh' ? '，' : ', '}
                {tc('byAppointment')}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-20 border-t border-ivory/15 pt-8">
          <p className="max-w-4xl text-[0.8125rem] leading-relaxed text-ivory/65">
            {t('disclaimer')}{' '}
            <Link
              href={routes.legal}
              className="whitespace-nowrap text-ivory underline decoration-gold/70 underline-offset-4 transition-colors hover:decoration-gold"
            >
              {t('readDisclaimer')}
            </Link>
          </p>
          <p className="mt-6 text-[0.8125rem] text-ivory/65">
            {t('copyright', { year: site.copyrightYear, name: site.legalName })}
          </p>
        </div>
      </div>
    </footer>
  );
}
