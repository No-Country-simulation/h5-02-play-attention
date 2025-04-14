'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');

  return (
    <div className='p-8 flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-6'>{t('welcome')}</h1>
        <p className='text-gray-600 mb-8'>
          Play Attention - {t('keepFocused')}
        </p>
        <Link
          href='/dashboard'
          className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          {t('explore')}
        </Link>
      </div>
    </div>
  );
}
