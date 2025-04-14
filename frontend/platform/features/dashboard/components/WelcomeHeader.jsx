'use client';

import { useTranslations } from 'next-intl';

export default function WelcomeHeader() {
  const t = useTranslations('dashboard');

  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold mb-6'>{t('welcomeTitle')}</h1>
      <p className='text-gray-600'>{t('welcomeMessage')}</p>
    </div>
  );
}
