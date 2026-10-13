import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { GoldRule } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return pageMetadata('legal');
}

export default async function LegalPage() {
  const t = await getTranslations('Legal');
  const sections = (['disclaimer', 'privacy'] as const).map((key) => ({
    key,
    title: t(`${key}.title`),
    paragraphs: t.raw(`${key}.paragraphs`) as string[],
  }));

  return (
    <>
      <PageHero title={t('title')} />
      <div className="container-page pb-24 lg:pb-36">
        <div className="max-w-3xl space-y-16 lg:ml-[calc(100%*5/12)]">
          {sections.map((s) => (
            <section key={s.key} aria-labelledby={`legal-${s.key}`}>
              <GoldRule className="w-10" />
              <h2 id={`legal-${s.key}`} className="mt-6 text-[1.75rem] leading-tight text-royal lg:text-[2.25rem]">
                {s.title}
              </h2>
              <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-ink/85">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
