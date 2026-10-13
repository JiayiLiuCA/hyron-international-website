import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { routes } from '@/lib/paths';
import { ButtonLink, GoldRule, headingText } from './ui';

/** "A Better Way to Move Forward" — shared closing block (content-en §1). */
export async function ClosingCta() {
  const t = await getTranslations('ClosingCta');
  const tc = await getTranslations('Cta');
  const ti = await getTranslations('Images');

  return (
    <section
      aria-labelledby="closing-cta-title"
      className="on-dark relative isolate overflow-hidden bg-royal-950 text-ivory"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="parallax absolute inset-0">
          <Image
            src="/images/golden-gate-fog.jpg"
            alt={ti('goldenGate')}
            fill
            sizes="100vw"
            className="object-cover object-[22%_50%]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-royal-950/70" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(1_20_51/0.55)_0%,rgb(1_20_51/0.15)_70%)]"
        />
      </div>

      <div className="container-page flex min-h-[78svh] flex-col items-center justify-center py-28 text-center lg:py-40">
        <GoldRule className="[transform-origin:center]" />
        <p className="eyebrow mt-8 text-ivory/80">{t('eyebrow')}</p>
        <h2
          id="closing-cta-title"
          className="mt-6 max-w-5xl text-[2.5rem] leading-[1.1] text-ivory sm:text-[3.5rem] lg:text-[4.5rem] lg:leading-[1.06]"
        >
          {headingText(t('title'))}
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/85">{t('body')}</p>
        <div className="mt-12">
          <ButtonLink href={routes.contact} variant="gold">
            {tc('start')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
