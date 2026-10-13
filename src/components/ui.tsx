import Image from 'next/image';
import type { CSSProperties, ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

export type Tone = 'light' | 'dark';

/** `style` prop that staggers a `[data-reveal]` element. */
export function delay(ms: number): CSSProperties {
  return { '--reveal-delay': `${ms}ms` } as CSSProperties;
}

/** `style` prop that staggers a `rise-in` load animation. */
export function riseDelay(ms: number): CSSProperties {
  return { '--delay': `${ms}ms` } as CSSProperties;
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      fill="none"
      aria-hidden="true"
      className={cn('h-3 w-6 shrink-0', className)}
    >
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

const buttonVariants = {
  royal: 'bg-royal text-ivory hover:bg-royal-700',
  gold: 'bg-gold text-royal-900 hover:bg-gold-300',
  'outline-light': 'border border-ivory/45 text-ivory hover:border-ivory hover:bg-ivory/10',
  'outline-dark': 'border border-royal/30 text-royal hover:border-royal hover:bg-royal/5',
} as const;

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: keyof typeof buttonVariants;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = 'royal',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        'group inline-flex min-h-13 items-center justify-center gap-4 px-7 py-3.5 text-[0.8125rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 lang-zh:text-[0.9375rem] lang-zh:tracking-[0.08em] lang-zh:normal-case',
        buttonVariants[variant],
        className,
      )}
    >
      <span>{children}</span>
      <ArrowIcon className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
    </Link>
  );
}

export function TextLink({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, 'className'> & {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      {...props}
      className={cn(
        'group inline-flex items-center gap-3 border-b border-current/30 pb-1.5 text-[0.9375rem] font-semibold transition-colors duration-300 hover:border-current',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowIcon className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
    </Link>
  );
}

/** Gold hairline that draws in from the left. */
export function GoldRule({ className, style }: { className?: string; style?: CSSProperties }) {
  return <Reveal as="span" kind="line" style={style} className={cn('block h-px w-16 bg-gold', className)} />;
}

/** Keeps hyphenated compounds ("High-Stakes") from breaking at the hyphen in display type. */
export function keepHyphenated(text: ReactNode): ReactNode {
  if (typeof text !== 'string' || !/\S-\S/.test(text)) return text;
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const HAN = /\p{Script=Han}/u;
/** Never split these across lines (the word segmenter splits 海润|国际 etc.). */
const ZH_NO_BREAK = ['海润国际', '一以贯之', '下一步', '前路', '六个'];
const zhWords = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-Hans', { granularity: 'word' }) : null;

/**
 * Chinese headings only break after punctuation (`word-break: keep-all`,
 * globals.css). This adds <wbr> opportunities at word boundaries between two
 * Han characters, so a long phrase wraps between words — and `text-wrap:
 * balance` can even the lines out — instead of stranding its last character.
 */
function zhWordBreaks(text: string): ReactNode {
  if (!zhWords) return text;
  const blocked = new Set<number>();
  for (const term of ZH_NO_BREAK) {
    for (let i = text.indexOf(term); i !== -1; i = text.indexOf(term, i + 1)) {
      for (let k = i + 1; k < i + term.length; k++) blocked.add(k);
    }
  }
  const parts: ReactNode[] = [];
  let start = 0;
  for (const { index } of zhWords.segment(text)) {
    if (index === 0 || blocked.has(index) || !HAN.test(text[index - 1]) || !HAN.test(text[index])) continue;
    parts.push(text.slice(start, index), <wbr key={index} />);
    start = index;
  }
  parts.push(text.slice(start));
  return parts;
}

/** Line-break helper for display headings in either language. */
export function headingText(text: ReactNode): ReactNode {
  if (typeof text !== 'string') return text;
  return HAN.test(text) ? zhWordBreaks(text) : keepHyphenated(text);
}

export function SectionHeading({
  title,
  eyebrow,
  tone = 'light',
  as: Tag = 'h2',
  id,
  className,
  titleClassName,
}: {
  title: ReactNode;
  eyebrow?: ReactNode;
  tone?: Tone;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={className}>
      <GoldRule />
      {eyebrow ? (
        <p className={cn('eyebrow mt-7', tone === 'dark' ? 'text-ivory/75' : 'text-gold-700')}>{eyebrow}</p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          eyebrow ? 'mt-4' : 'mt-7',
          'text-[2.5rem] leading-[1.08] sm:text-5xl lg:text-[4rem] lg:leading-[1.05]',
          tone === 'dark' ? 'text-ivory' : 'text-royal',
          titleClassName,
        )}
      >
        {headingText(title)}
      </Tag>
    </div>
  );
}

/** Brand line pattern used as a faint texture on blue blocks. */
export function LinePattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 bg-[url(/pattern/hyron-line-pattern.svg)] bg-cover bg-center',
        className,
      )}
    />
  );
}

/** Oversized H-circle watermark (letterhead detail, brief §3.6). */
export function MarkWatermark({ className, eager = false }: { className?: string; eager?: boolean }) {
  return (
    <Image
      src="/logo/hyron-mark-gold.svg"
      alt=""
      aria-hidden="true"
      width={600}
      height={600}
      unoptimized
      loading={eager ? 'eager' : 'lazy'}
      className={cn('pointer-events-none absolute -z-10 select-none', className)}
    />
  );
}

/** Photo masked into the brand's capital "I" serif frame. */
export function SerifFramedImage({
  src,
  alt,
  sizes,
  objectPosition = '50% 50%',
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <Reveal kind="image" className={cn('serif-frame relative overflow-hidden', className)}>
      <div className="parallax absolute inset-0">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition }} />
      </div>
    </Reveal>
  );
}

/** Photo in a fixed-ratio frame: wipes in on scroll and drifts slightly (parallax). */
export function Photo({
  src,
  alt,
  sizes,
  objectPosition = '50% 50%',
  eager = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  objectPosition?: string;
  /** For a photo that is (partly) visible on first load. */
  eager?: boolean;
  className?: string;
}) {
  return (
    <Reveal kind="image" className={cn('relative overflow-hidden bg-royal-900', className)}>
      <div className="parallax absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
    </Reveal>
  );
}

/**
 * Two halves on lg+: a photo that bleeds to the viewport edge and always
 * matches the text column's height (min 36rem), next to that text column.
 * Phones: photo band on top (or hidden), text below.
 */
export function PhotoSplit({
  src,
  alt = '',
  objectPosition,
  side = 'left',
  mobilePhoto = true,
  eager = false,
  className,
  contentClassName,
  children,
  ...rest
}: {
  src: string;
  alt?: string;
  objectPosition?: string;
  side?: 'left' | 'right';
  mobilePhoto?: boolean;
  /** Set when the split sits right under the hero (photo visible on load). */
  eager?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
} & Omit<ComponentProps<'section'>, 'className' | 'children'>) {
  return (
    <section {...rest} className={cn('lg:grid lg:grid-cols-2', className)}>
      <Photo
        src={src}
        alt={alt}
        // Hidden below lg when !mobilePhoto: "1px" makes phones pick the
        // smallest srcset entry if the (eager) image is fetched anyway.
        sizes={mobilePhoto ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 50vw, 1px'}
        objectPosition={objectPosition}
        eager={eager}
        className={cn(
          'aspect-[16/10] lg:aspect-auto lg:min-h-[36rem]',
          side === 'right' && 'lg:order-2',
          !mobilePhoto && 'hidden lg:block',
        )}
      />
      <div
        className={cn(
          'px-5 py-16 sm:px-8 sm:py-20 lg:py-28',
          side === 'left' ? 'lg:pl-16 lg:split-gutter-r xl:pl-24' : 'lg:pr-16 lg:split-gutter-l xl:pr-24',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Full-bleed photographic band between sections. */
export function ImageBand({
  src,
  alt,
  objectPosition = '50% 50%',
  className,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <Photo
      src={src}
      alt={alt}
      sizes="100vw"
      objectPosition={objectPosition}
      className={cn('h-[clamp(15rem,48vw,38rem)]', className)}
    />
  );
}
