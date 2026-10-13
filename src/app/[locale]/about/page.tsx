import { getTranslations } from 'next-intl/server';
import { ClosingCta } from '@/components/ClosingCta';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import {
  delay,
  GoldRule,
  headingText,
  LinePattern,
  MarkWatermark,
  PhotoSplit,
  SectionHeading,
  SerifFramedImage,
} from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata('about');
}

type Item = { title: string; body: string };

export default async function AboutPage() {
  const t = await getTranslations('About');
  const ti = await getTranslations('Images');

  const paragraphs = t.raw('paragraphs') as string[];
  const steps = t.raw('approach.steps') as Item[];
  const serve = t.raw('serve.list') as string[];
  const principles = t.raw('principles.items') as Item[];

  return (
    <>
      <PageHero
        image={{ src: '/images/mountain-mist-summit.jpg', alt: ti('mountain'), position: '62% 50%' }}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      {/* Who we are ------------------------------------------------------- */}
      <section className="py-24 lg:py-36">
        <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="hidden lg:col-span-4 lg:block">
            <SerifFramedImage
              src="/images/bridge-cable-stayed-aerial.jpg"
              alt=""
              sizes="22rem"
              objectPosition="66% 50%"
              className="w-full max-w-[22rem]"
            />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <GoldRule />
            <p className="mt-8 font-serif text-[1.5rem] leading-[1.42] font-normal text-royal sm:text-[1.75rem] lg:text-[2.125rem] lg:leading-[1.38]">
              {paragraphs[0]}
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">{paragraphs[1]}</p>
          </div>
        </div>
      </section>

      {/* Our Approach (same treatment as the home process strip) ---------- */}
      <section
        aria-labelledby="approach-title"
        className="on-dark relative isolate overflow-hidden bg-royal py-24 text-ivory lg:py-36"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-br from-royal-900 via-royal to-royal-900" />
        <LinePattern className="opacity-[0.1]" />
        <div className="container-page">
          <SectionHeading id="approach-title" title={t('approach.title')} tone="dark" />
          <ol className="relative mt-16 grid gap-0 sm:grid-cols-2 sm:gap-x-10 lg:mt-24 lg:grid-cols-4 lg:gap-10">
            <span aria-hidden="true" className="absolute top-0 right-0 left-0 hidden h-px bg-ivory/20 lg:block" />
            <Reveal
              as="span"
              kind="line"
              style={delay(200)}
              className="absolute top-0 right-0 left-0 hidden h-px bg-gold lg:block"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative border-b border-ivory/15 py-8 lg:border-0 lg:pt-12 lg:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 hidden size-2.5 -translate-y-1/2 rounded-full bg-gold ring-4 ring-royal lg:block"
                />
                <span className="font-serif text-[3rem] leading-none text-gold lg:text-[4rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-[1.375rem] leading-snug text-ivory lg:mt-8 lg:text-[1.625rem]">{headingText(step.title)}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/75 lg:text-base">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who We Serve: photo bleeding to the left edge | list ------------- */}
      <PhotoSplit aria-labelledby="serve-title" src="/images/man-on-rock-sea.jpg" objectPosition="50% 62%">
        <SectionHeading id="serve-title" title={t('serve.title')} />
        <ul className="mt-12 max-w-2xl border-t border-royal/15">
          {serve.map((item) => (
            <li key={item} className="flex gap-6 border-b border-royal/15 py-6">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-8 shrink-0 bg-gold" />
              <span className="font-serif text-xl leading-snug text-royal sm:text-[1.375rem]">{item}</span>
            </li>
          ))}
        </ul>
      </PhotoSplit>

      {/* Our Principles --------------------------------------------------- */}
      <section
        aria-labelledby="principles-title"
        className="relative isolate overflow-hidden bg-paper py-24 lg:py-36"
      >
        <MarkWatermark className="-top-40 -right-56 w-[52rem] max-w-none opacity-[0.05]" />
        <div className="container-page">
          <SectionHeading id="principles-title" title={t('principles.title')} />
          <ul className="mt-16 grid gap-12 sm:grid-cols-2 sm:gap-x-12 lg:mt-20 lg:gap-x-20 lg:gap-y-16">
            {principles.map((item, i) => (
              <li key={item.title}>
                <GoldRule className="w-full bg-gold/70" style={delay((i % 2) * 140)} />
                <h3 className="mt-8 text-[1.75rem] leading-[1.15] text-royal lg:text-[2.25rem]">{headingText(item.title)}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/80">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
