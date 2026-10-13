import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ClosingCta } from '@/components/ClosingCta';
import { Reveal } from '@/components/Reveal';
import {
  ArrowIcon,
  ButtonLink,
  delay,
  GoldRule,
  headingText,
  LinePattern,
  MarkWatermark,
  riseDelay,
  SectionHeading,
  SerifFramedImage,
  TextLink,
} from '@/components/ui';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/metadata';
import { routes, serviceAnchors } from '@/lib/paths';

export function generateMetadata() {
  return pageMetadata('home');
}

/** Home capability panels (content-en §1, in order) → /services anchor + photo. */
const CAPABILITY_PANELS = [
  { anchor: serviceAnchors.strategicAdvisory, src: '/images/mountain-mist-summit.jpg', position: '62% 50%' },
  { anchor: serviceAnchors.financingReadiness, src: '/images/golden-gate-fog.jpg', position: '18% 50%' },
  { anchor: serviceAnchors.transactions, src: '/images/bridge-cable-stayed-aerial.jpg', position: '68% 50%' },
  { anchor: serviceAnchors.operations, src: '/images/speedboat-deep-blue.jpg', position: '74% 50%' },
  { anchor: serviceAnchors.professionalCoordination, src: '/images/tree-golden-sky.jpg', position: '72% 50%' },
];

type Item = { title: string; body: string };

export default async function HomePage() {
  const t = await getTranslations('Home');
  const tc = await getTranslations('Cta');
  const ti = await getTranslations('Images');
  const tw = await getTranslations('HowWeWork');

  const titleLines = t.raw('hero.titleLines') as string[];
  const introParagraphs = t.raw('intro.paragraphs') as string[];
  const helpList = t.raw('intro.list') as string[];
  const capabilities = t.raw('capabilities.items') as Item[];
  const why = t.raw('why.items') as Item[];
  const steps = tw.raw('steps') as Item[];

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      {/* Phones: a photo band melts into the dark copy block. Desktop:
          full-bleed photo behind the copy; height follows the copy. */}
      <section className="on-dark relative isolate overflow-hidden bg-royal-950 text-ivory">
        <div className="relative h-[36svh] min-h-60 overflow-hidden lg:absolute lg:inset-0 lg:-z-10 lg:h-auto">
          <div className="hero-parallax absolute inset-0">
            <Image
              src="/images/bridge-cable-stayed-aerial.jpg"
              alt={ti('bridge')}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
              className="hero-zoom object-cover object-[74%_50%] lg:object-[66%_50%]"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-royal-950/80 to-transparent" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-royal-950 via-royal-950/50 to-transparent lg:h-3/4 lg:via-royal-950/45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-linear-to-r from-royal-950/85 via-royal-950/35 to-transparent lg:block"
          />
        </div>

        <div className="container-page relative -mt-16 pb-16 lg:mt-0 lg:pt-40 lg:pb-20">
          <span aria-hidden="true" className="block h-px w-16 bg-gold draw-in" style={riseDelay(250)} />
          <p className="eyebrow mt-7 text-ivory/80 rise-in" style={riseDelay(300)}>
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-6 text-[2.625rem] leading-[1.04] sm:text-[4rem] lg:text-[4.5rem] lg:leading-[1.02] xl:text-[5rem] 2xl:text-[5.5rem]">
            {titleLines.map((line, i) => (
              <span key={line} className="block rise-in" style={riseDelay(380 + i * 120)}>
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-x-16">
            <div className="rise-in lg:col-span-6" style={riseDelay(780)}>
              <p className="font-serif text-[1.375rem] leading-snug text-ivory sm:text-[1.625rem]">{t('hero.subhead')}</p>
              <p className="mt-5 text-base leading-relaxed text-ivory/80 sm:text-lg">{t('hero.body')}</p>
            </div>
            <div className="flex flex-col gap-4 rise-in sm:flex-row sm:flex-wrap lg:col-span-6 lg:justify-end" style={riseDelay(900)}>
              <ButtonLink href={routes.contact} variant="gold">
                {tc('bookConfidential')}
              </ButtonLink>
              <ButtonLink href={routes.services} variant="outline-light">
                {tc('explore')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Built for High-Stakes Decisions ---------------------------------- */}
      <section aria-labelledby="intro-title" className="py-28 lg:py-44">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <SectionHeading id="intro-title" title={t('intro.title')} className="lg:col-span-5" />
          <div className="lg:col-span-7 lg:pt-16">
            <p className="font-serif text-[1.5rem] leading-[1.42] font-normal text-royal sm:text-[1.75rem] lg:text-[2.125rem] lg:leading-[1.38]">
              {introParagraphs[0]}
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">{introParagraphs[1]}</p>
          </div>
        </div>

        <div className="container-page mt-24 grid items-center gap-14 lg:mt-36 lg:grid-cols-12 lg:gap-x-16">
          <div className="hidden lg:col-span-4 lg:block">
            <SerifFramedImage
              src="/images/man-on-rock-sea.jpg"
              alt=""
              sizes="22rem"
              objectPosition="50% 62%"
              className="w-full max-w-[22rem]"
            />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h3 className="text-[1.75rem] leading-tight text-royal lg:text-[2.25rem]">{headingText(t('intro.listTitle'))}</h3>
            <ul className="mt-10 border-t border-royal/15">
              {helpList.map((item) => (
                <li key={item} className="flex gap-6 border-b border-royal/15 py-7 lg:gap-8">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-8 shrink-0 bg-gold" />
                  <span className="font-serif text-[1.3125rem] leading-snug text-royal sm:text-2xl lg:text-[1.625rem]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our Core Capabilities -------------------------------------------- */}
      <section
        aria-labelledby="capabilities-title"
        className="on-dark relative isolate overflow-hidden bg-royal-950 py-28 text-ivory lg:py-36"
      >
        <LinePattern className="opacity-[0.06]" />
        <div className="container-page flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="capabilities-title" title={t('capabilities.title')} tone="dark" />
          <TextLink href={routes.services} className="self-start text-ivory lg:self-auto">
            {tc('explore')}
          </TextLink>
        </div>
        <ul className="cap-strip container-page mt-14 lg:mt-20">
          {capabilities.map((item, i) => {
            const panel = CAPABILITY_PANELS[i];
            return (
              <li key={item.title}>
                <Link href={`${routes.services}#${panel.anchor}`} className="cap-link group">
                  <div className="cap-photo">
                    <Image
                      src={panel.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                      className="cap-img object-cover"
                      style={{ objectPosition: panel.position }}
                    />
                  </div>
                  <span aria-hidden="true" className="cap-scrim" />
                  <span aria-hidden="true" className="cap-label text-ivory">
                    {item.title}
                  </span>
                  <div className="cap-detail">
                    <span aria-hidden="true" className="block h-px w-12 bg-gold" />
                    <h3 className="mt-6 text-[1.625rem] leading-[1.15] text-ivory lg:text-[2rem]">{headingText(item.title)}</h3>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-ivory/80 lg:text-base">{item.body}</p>
                    <span className="mt-auto pt-8 text-gold lg:mt-0">
                      <ArrowIcon className="h-4 w-9 transition-transform duration-500 ease-out-expo group-hover:translate-x-2" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Why HYRON -------------------------------------------------------- */}
      <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-paper py-28 lg:py-40">
        <MarkWatermark className="-top-40 -right-56 w-[52rem] max-w-none opacity-[0.05]" />
        <div className="container-page">
          <SectionHeading id="why-title" title={t('why.title')} />
          <ul className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10 lg:mt-24 lg:gap-16">
            {why.map((item, i) => (
              <li key={item.title}>
                <GoldRule className="w-full bg-gold/70" style={delay(i * 140)} />
                <h3 className="mt-8 text-[1.75rem] leading-[1.15] text-royal lg:text-[2.25rem]">{headingText(item.title)}</h3>
                <p className="mt-5 text-lg leading-relaxed text-ink/80">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process teaser --------------------------------------------------- */}
      <section
        aria-labelledby="process-title"
        className="on-dark relative isolate overflow-hidden bg-royal py-28 text-ivory lg:py-40"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-br from-royal-900 via-royal to-royal-900" />
        <LinePattern className="opacity-[0.1]" />
        <div className="container-page">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="process-title"
              title={t('process.title')}
              tone="dark"
              className="max-w-4xl"
            />
            <TextLink href={routes.howWeWork} className="self-start text-ivory lg:self-auto">
              {t('process.link')}
            </TextLink>
          </div>
          <ol className="relative mt-16 grid gap-0 md:grid-cols-5 md:gap-8 lg:mt-24 lg:gap-10">
            <span aria-hidden="true" className="absolute top-0 right-0 left-0 hidden h-px bg-ivory/20 md:block" />
            <Reveal
              as="span"
              kind="line"
              style={delay(200)}
              className="absolute top-0 right-0 left-0 hidden h-px bg-gold md:block"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative border-b border-ivory/15 py-8 md:border-0 md:pt-12 md:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 hidden size-2.5 -translate-y-1/2 rounded-full bg-gold ring-4 ring-royal md:block"
                />
                <span className="font-serif text-[3rem] leading-none text-gold md:text-[4rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-[1.375rem] leading-snug text-ivory md:mt-8 lg:text-[1.625rem]">{headingText(step.title)}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
