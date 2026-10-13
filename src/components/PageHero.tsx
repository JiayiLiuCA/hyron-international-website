import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { headingText, MarkWatermark, riseDelay } from './ui';

export type HeroImage = { src: string; alt: string; position?: string };

/**
 * Opening block for inner pages. With `image`: full-bleed photo under a
 * royal-950 scrim (the header is transparent over it — see Header's
 * PHOTO_HERO_ROUTES). Without: a plain ivory block (legal page).
 */
export function PageHero({
  image,
  eyebrow,
  title,
  lead,
  size = 'display',
  className,
  children,
}: {
  image?: HeroImage;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** `statement` for long sentence-style H1s. */
  size?: 'display' | 'statement';
  className?: string;
  children?: ReactNode;
}) {
  const titleClass =
    size === 'display'
      ? 'text-[2.5rem] leading-[1.04] lang-zh:text-[2.125rem] lang-zh:leading-[1.25] sm:text-6xl sm:lang-zh:text-5xl lg:text-[4.75rem] lg:leading-[1.02] lg:lang-zh:text-[4.5rem] xl:text-[5.25rem]'
      : // Sentence-length titles wrap like running text (the zh heading rule
        // keeps phrases whole, which strands punctuation on narrow screens).
        'text-[2rem] leading-[1.18] break-normal lang-zh:text-[1.75rem] sm:text-[2.75rem] sm:lang-zh:text-[2.5rem] lg:text-[3.25rem] lg:leading-[1.12]';

  if (!image) {
    return (
      <section className={cn('relative isolate overflow-hidden pt-36 pb-16 lg:pt-52 lg:pb-24', className)}>
        <div
          aria-hidden="true"
          className="absolute top-24 -right-32 -z-10 w-[30rem] rise-in lg:-right-20 lg:w-[44rem]"
          style={riseDelay(200)}
        >
          <MarkWatermark eager className="relative! w-full max-w-none opacity-[0.07]" />
        </div>
        <div className="container-page">
          <span aria-hidden="true" className="block h-px w-16 bg-gold draw-in" style={riseDelay(100)} />
          {eyebrow ? (
            <p className="eyebrow mt-7 text-gold-700 rise-in" style={riseDelay(150)}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className={cn('mt-5 max-w-5xl text-royal rise-in', titleClass)} style={riseDelay(250)}>
            {headingText(title)}
          </h1>
          {lead ? (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80 rise-in sm:text-xl" style={riseDelay(400)}>
              {lead}
            </p>
          ) : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        'on-dark relative isolate flex min-h-[33rem] flex-col overflow-hidden bg-royal-950 text-ivory sm:min-h-[34rem] lg:min-h-[38rem]',
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-parallax absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="hero-zoom object-cover"
            style={{ objectPosition: image.position ?? '50% 50%' }}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-royal-950/75 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-royal-950 via-royal-950/60 to-royal-950/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-linear-to-r from-royal-950/70 via-royal-950/25 to-transparent lg:block"
        />
      </div>

      {/* Every photo hero shares one fixed minimum height (not a share of the
          viewport) and top-anchored copy, so titles start at the same place
          on every page and the photo stays a backdrop. */}
      <div className="container-page pt-28 pb-16 sm:pt-40 lg:pb-20">
        <span aria-hidden="true" className="block h-px w-16 bg-gold draw-in" style={riseDelay(250)} />
        {eyebrow ? (
          <p className="eyebrow mt-7 text-ivory/80 rise-in" style={riseDelay(300)}>
            {eyebrow}
          </p>
        ) : null}
        <h1 className={cn('mt-5 max-w-5xl text-ivory rise-in', titleClass)} style={riseDelay(380)}>
          {headingText(title)}
        </h1>
        {lead ? (
          <p
            className="mt-8 max-w-3xl text-base leading-relaxed text-ivory/85 rise-in sm:text-xl"
            style={riseDelay(520)}
          >
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
