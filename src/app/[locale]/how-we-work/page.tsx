import { getTranslations } from 'next-intl/server';
import { ClosingCta } from '@/components/ClosingCta';
import { PageHero } from '@/components/PageHero';
import { headingText, MarkWatermark, PhotoSplit, SectionHeading } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata('howWeWork');
}

type Item = { title: string; body: string };

export default async function HowWeWorkPage() {
  const t = await getTranslations('HowWeWork');
  const ti = await getTranslations('Images');

  const steps = t.raw('steps') as Item[];
  const formats = t.raw('formats.list') as string[];

  return (
    <>
      <PageHero
        image={{ src: '/images/tree-golden-sky.jpg', alt: ti('tree'), position: '70% 45%' }}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      {/* Five steps: bridge tower photo (as tall as the timeline) | timeline
          whose gold line fills as you scroll. Phones: timeline only. ----- */}
      <PhotoSplit
        aria-label={t('eyebrow')}
        src="/images/bridge-cable-stayed-aerial.jpg"
        objectPosition="67% 50%"
        mobilePhoto={false}
        eager
      >
        <ol className="relative max-w-2xl">
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[1.375rem] w-px bg-royal/15 lg:left-[2rem]"
          />
          <span
            aria-hidden="true"
            className="timeline-fill absolute top-6 bottom-6 left-[1.375rem] w-px bg-gold lg:left-[2rem]"
          />
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative grid grid-cols-[2.75rem_1fr] gap-x-6 pb-14 last:pb-0 lg:grid-cols-[4rem_1fr] lg:gap-x-8 lg:pb-20"
            >
              <span className="relative flex size-11 items-center justify-center rounded-full border border-gold bg-ivory font-serif text-lg text-gold-700 lg:size-16 lg:text-2xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1.5 lg:pt-2.5">
                <h2 className="text-[1.75rem] leading-[1.15] text-royal lg:text-[2.25rem]">{headingText(step.title)}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/80">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </PhotoSplit>

      {/* Engagement Formats ----------------------------------------------- */}
      <section
        aria-labelledby="formats-title"
        className="relative isolate overflow-hidden bg-paper py-24 lg:py-36"
      >
        <MarkWatermark className="-bottom-56 -left-56 w-[46rem] max-w-none opacity-[0.05]" />
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <SectionHeading id="formats-title" title={t('formats.title')} className="lg:col-span-5" />
          <div className="lg:col-span-7 lg:pt-14">
            <ul className="border-t border-royal/15">
              {formats.map((item) => (
                <li key={item} className="flex gap-6 border-b border-royal/15 py-7 lg:gap-8">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-8 shrink-0 bg-gold" />
                  <span className="font-serif text-[1.3125rem] leading-snug text-royal sm:text-2xl lg:text-[1.625rem]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-lg leading-relaxed text-ink/80">{t('formats.closing')}</p>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
