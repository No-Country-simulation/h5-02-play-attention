'use client';

import { useTranslations } from 'next-intl';

export default function NoResults() {
  const t = useTranslations('educationalMaterial');

  return (
    <div className='col-span-full text-center py-12 bg-gray-50 rounded-lg'>
      <p className='text-gray-500'>{t('noResultsFound')}</p>
    </div>
  );
}
