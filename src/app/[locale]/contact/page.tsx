import { getLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/ContactForm';
import { PageHero } from '@/components/PageHero';
import { ArrowIcon, MarkWatermark } from '@/components/ui';
import { site } from '@/config/site';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata('contact');
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations('Contact');
  const ti = await getTranslations('Images');

  return (
    <>
      <PageHero
        image={{ src: '/images/golden-gate-fog.jpg', alt: ti('goldenGate'), position: '22% 50%' }}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('body')}
      />

      {/* Form and details overlap the hero's bottom edge. */}
      <section className="pb-24 lg:pb-36">
        <div className="container-page relative z-10 -mt-6 grid gap-8 lg:-mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="border-t-2 border-gold bg-paper p-6 shadow-[0_40px_80px_-48px_rgb(1_20_51/0.55)] sm:p-10 lg:col-span-7 lg:p-14">
            <h2 className="text-[1.75rem] leading-tight text-royal sm:text-[2rem]">{t('formTitle')}</h2>
            <div className="mt-10">
              <ContactForm email={site.email} />
            </div>
          </div>

          <aside
            aria-labelledby="contact-details-title"
            className="on-dark relative isolate self-start overflow-hidden bg-royal p-8 text-ivory sm:p-10 lg:col-span-5 lg:p-12"
          >
            <MarkWatermark className="-right-24 -bottom-24 w-80 opacity-[0.08]" />
            <h2 id="contact-details-title" className="text-[1.75rem] leading-tight text-gold">
              {t('details.title')}
            </h2>
            <dl className="mt-10 space-y-8">
              <div>
                <dt className="eyebrow text-ivory/70">{t('details.office')}</dt>
                <dd className="mt-3 text-lg leading-relaxed">
                  <address className="not-italic">
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={site.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex items-center gap-3 text-sm font-semibold text-ivory/85 underline decoration-gold/60 underline-offset-4 hover:text-ivory hover:decoration-gold"
                  >
                    {t('details.map')}
                    <ArrowIcon className="w-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ivory/70">{t('details.phone')}</dt>
                <dd className="mt-3 text-lg">
                  <a href={site.phone.href} className="hover:text-gold-300">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ivory/70">{t('details.email')}</dt>
                <dd className="mt-3 text-lg break-all">
                  <a href={`mailto:${site.email}`} className="hover:text-gold-300">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ivory/70">{t('details.hours')}</dt>
                <dd className="mt-3 text-lg leading-relaxed">
                  {site.hours[locale === 'zh' ? 'zh' : 'en']}
                  <span className="block text-ivory/75">{t('details.byAppointment')}</span>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
