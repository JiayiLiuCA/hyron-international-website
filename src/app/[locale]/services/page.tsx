import { getMessages, getTranslations } from 'next-intl/server';
import { ClosingCta } from '@/components/ClosingCta';
import { PageHero } from '@/components/PageHero';
import { ServicesNav } from '@/components/ServicesNav';
import { ArrowIcon, headingText, PhotoSplit } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pageMetadata } from '@/lib/metadata';
import { serviceAnchors, serviceKeys, type ServiceKey } from '@/lib/paths';

export function generateMetadata() {
  return pageMetadata('services');
}

type Service = {
  short: string;
  title: string;
  lead: string;
  mandates?: string[];
  body?: string;
  outcome?: string;
  noteLabel?: string;
  note?: string;
};

/** One photo per service (Unsplash License, see README "Photo sources"),
 * none of them used elsewhere on the site. On lg+ each fills half the width
 * at the text's height, so positions centre a strong vertical subject. */
const PHOTOS: Record<ServiceKey, { src: string; position: string }> = {
  strategicAdvisory: { src: '/images/lighthouse-above-clouds.jpg', position: '47% 40%' },
  financingReadiness: { src: '/images/glass-facade-looking-up.jpg', position: '50% 50%' },
  transactions: { src: '/images/footbridge-into-mist.jpg', position: '52% 50%' },
  realEstate: { src: '/images/tower-cranes-blue-hour.jpg', position: '45% 40%' },
  operations: { src: '/images/highway-interchange-night.jpg', position: '40% 50%' },
  professionalCoordination: { src: '/images/boardroom-city-dawn.jpg', position: '42% 50%' },
};

export default async function ServicesPage() {
  const t = await getTranslations('Services');
  const ti = await getTranslations('Images');

  const items: Record<ServiceKey, Service> = (await getMessages()).Services.items;
  const services = serviceKeys.map((key, i) => ({
    key,
    id: serviceAnchors[key],
    number: String(i + 1).padStart(2, '0'),
    mirrored: i % 2 === 1,
    photo: PHOTOS[key],
    ...items[key],
  }));

  return (
    <>
      <PageHero
        image={{ src: '/images/speedboat-deep-blue.jpg', alt: ti('speedboat'), position: '50% 58%' }}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      {/* Six-service index, overlapping the hero ---------------------------- */}
      <div className="container-page relative z-10 -mt-6 lg:-mt-16">
        <ol className="grid gap-px bg-royal/12 shadow-[0_40px_80px_-48px_rgb(1_20_51/0.55)] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.key} className="bg-paper">
              <a
                href={`#${s.id}`}
                className="group flex h-full flex-col p-7 transition-colors duration-500 hover:bg-white sm:p-8 lg:p-10"
              >
                <span className="font-serif text-lg leading-none text-gold-700">{s.number}</span>
                <span className="mt-6 font-serif text-[1.5rem] leading-[1.18] font-semibold text-balance break-keep wrap-break-word text-royal lg:mt-8 lg:text-[1.875rem]">
                  {headingText(s.title)}
                </span>
                <span className="mt-4 text-[0.9375rem] leading-relaxed text-ink/75 lg:text-base">{s.lead}</span>
                <span className="mt-auto pt-8 text-gold-700">
                  <ArrowIcon className="h-4 w-9 rotate-90 transition-transform duration-500 ease-out-expo group-hover:translate-y-1" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 lg:mt-28">
        <ServicesNav
          label={t('navLabel')}
          items={services.map(({ id, number, short }) => ({ id, number, title: short }))}
        />

        {services.map((s, i) => (
          <ServiceBlock
            key={s.key}
            service={s}
            index={i}
            mandatesLabel={t('mandatesLabel')}
            outcomeLabel={t('outcomeLabel')}
          />
        ))}
      </div>

      <ClosingCta />
    </>
  );
}

function ServiceBlock({
  service: s,
  index,
  mandatesLabel,
  outcomeLabel,
}: {
  service: Service & {
    key: ServiceKey;
    id: string;
    number: string;
    mirrored: boolean;
    photo: { src: string; position: string };
  };
  index: number;
  mandatesLabel: string;
  outcomeLabel: string;
}) {
  return (
    <PhotoSplit
      id={s.id}
      aria-labelledby={`${s.id}-title`}
      src={s.photo.src}
      objectPosition={s.photo.position}
      side={s.mirrored ? 'right' : 'left'}
      className={cn('scroll-mt-14', index % 2 === 1 ? 'bg-paper' : 'bg-ivory')}
    >
      <div className="max-w-2xl">
        <span className="block font-serif text-[3.5rem] leading-none text-gold-700 lg:text-[4.5rem]">{s.number}</span>
        <h2 id={`${s.id}-title`} className="mt-6 text-[2.125rem] leading-[1.1] text-royal lg:text-[2.75rem]">
          {headingText(s.title)}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink/80">{s.lead}</p>

        {s.mandates ? (
          <>
            <h3 className="mt-12 font-serif text-[1.375rem] leading-tight text-royal lg:text-2xl">{mandatesLabel}</h3>
            <ul className="mt-6 border-t border-royal/15">
              {s.mandates.map((m) => (
                <li key={m} className="flex gap-5 border-b border-royal/15 py-4 text-lg leading-snug text-ink/90">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-5 shrink-0 bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {s.body ? (
          <p className="mt-10 font-serif text-[1.375rem] leading-[1.5] font-normal text-royal lg:text-[1.5rem]">
            {s.body}
          </p>
        ) : null}

        {s.outcome ? (
          <div className="on-dark relative isolate mt-10 overflow-hidden bg-royal p-8 text-ivory lg:p-10">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" />
            <p className="eyebrow text-gold-300">{outcomeLabel}</p>
            <p className="mt-4 font-serif text-[1.375rem] leading-snug lg:text-[1.5rem]">{s.outcome}</p>
          </div>
        ) : null}

        {s.note ? (
          <aside className="mt-8 border border-royal/20 bg-white/60 p-6 text-[0.9375rem] leading-relaxed text-ink/85 lg:p-8">
            <p className="eyebrow text-royal">{s.noteLabel}</p>
            <p className="mt-3">{s.note}</p>
          </aside>
        ) : null}
      </div>
    </PhotoSplit>
  );
}
