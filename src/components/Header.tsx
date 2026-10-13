'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { routes } from '@/lib/paths';
import { LangSwitch } from './LangSwitch';
import { ArrowIcon, LinePattern } from './ui';

const NAV = [
  { href: routes.about, key: 'about' },
  { href: routes.services, key: 'services' },
  { href: routes.howWeWork, key: 'howWeWork' },
  { href: routes.contact, key: 'contact' },
] as const;

/** Pages that open on a full-bleed photo (PageHero with `image`, or the home hero). */
const PHOTO_HERO_ROUTES: ReadonlySet<string> = new Set([
  routes.home,
  routes.about,
  routes.services,
  routes.howWeWork,
  routes.contact,
]);

const LOGOS = {
  en: { color: '/logo/hyron-logo-horizontal-color.svg', gold: '/logo/hyron-logo-horizontal-gold.svg', ratio: 187.72 / 54.13 },
  zh: { color: '/logo/hyron-logo-horizontal-zh-color.svg', gold: '/logo/hyron-logo-horizontal-zh-gold.svg', ratio: 214.1 / 54.13 },
} as const;

function subscribeScroll(cb: () => void) {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
}

export function Header({ contact }: { contact: { phone: string; phoneHref: string; email: string } }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );

  // Transparent over photo heroes until the visitor scrolls; the open mobile
  // menu also uses the dark treatment.
  const dark = open || (PHOTO_HERO_ROUTES.has(pathname) && !scrolled);
  const logo = LOGOS[locale];

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500',
        dark
          ? 'on-dark bg-transparent text-ivory'
          : 'bg-ivory/92 text-royal shadow-[0_1px_0_rgb(5_54_138/0.08)] backdrop-blur-md',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href={routes.home}
          aria-label={t('homeLink')}
          onClick={close}
          className="relative block h-8 shrink-0 lg:h-10"
          style={{ aspectRatio: logo.ratio }}
        >
          <Image
            src={logo.color}
            alt=""
            fill
            unoptimized
            loading="eager"
            className={cn('transition-opacity duration-500', dark ? 'opacity-0' : 'opacity-100')}
          />
          <Image
            src={logo.gold}
            alt=""
            fill
            unoptimized
            loading="eager"
            className={cn('transition-opacity duration-500', dark ? 'opacity-100' : 'opacity-0')}
          />
        </Link>

        <nav aria-label={t('primary')} className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-10">
            {NAV.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="group relative block py-2 text-[0.9375rem] font-semibold whitespace-nowrap"
                >
                  {t(key)}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5 lg:gap-7 xl:gap-8">
          <LangSwitch />
          <Link
            href={routes.contact}
            className={cn(
              'group hidden items-center gap-3 px-5 py-3 text-[0.8125rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-300 xl:inline-flex lang-zh:text-[0.9375rem] lang-zh:tracking-[0.06em]',
              dark ? 'bg-gold text-royal-900 hover:bg-gold-300' : 'bg-royal text-ivory hover:bg-royal-700',
            )}
          >
            {t('cta')}
            <ArrowIcon className="w-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
            className="relative -mr-2 flex size-11 items-center justify-center lg:hidden"
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute h-px w-6 bg-current transition-transform duration-500 ease-out-expo',
                open ? 'rotate-45' : '-translate-y-[4px]',
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                'absolute h-px w-6 bg-current transition-transform duration-500 ease-out-expo',
                open ? '-rotate-45' : 'translate-y-[4px]',
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id={menuId}
        inert={!open}
        className={cn(
          'on-dark fixed inset-0 -z-10 isolate overflow-y-auto bg-royal-900 text-ivory transition-[opacity,visibility] duration-500 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <LinePattern className="opacity-[0.1]" />
        <div className="container-page flex min-h-full flex-col pt-28 pb-10">
          <nav aria-label={t('primary')}>
            <ul className="border-t border-ivory/15">
              {NAV.map(({ href, key }, i) => (
                <li
                  key={key}
                  className={cn(
                    'border-b border-ivory/15 transition-[opacity,transform] duration-700 ease-out-expo',
                    open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}
                >
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className="flex items-baseline gap-5 py-5 font-serif text-[1.75rem] leading-tight aria-[current=page]:text-gold"
                  >
                    <span className="font-sans text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-6 pt-12">
            <Link
              href={routes.contact}
              onClick={close}
              className="group flex min-h-13 items-center justify-between gap-4 bg-gold px-6 py-4 text-[0.8125rem] font-semibold tracking-[0.12em] text-royal-900 uppercase lang-zh:text-base lang-zh:tracking-[0.06em]"
            >
              {t('cta')}
              <ArrowIcon />
            </Link>
            <div className="flex flex-col gap-1 text-sm text-ivory/75">
              <a href={contact.phoneHref} className="hover:text-ivory">
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="hover:text-ivory">
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
