import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/ui';
import { routes } from '@/lib/paths';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <PageHero eyebrow={t('eyebrow')} title={t('title')} lead={t('body')}>
      <div className="mt-12 pb-16 rise-in" style={{ '--delay': '500ms' } as React.CSSProperties}>
        <ButtonLink href={routes.home}>{t('back')}</ButtonLink>
      </div>
    </PageHero>
  );
}
