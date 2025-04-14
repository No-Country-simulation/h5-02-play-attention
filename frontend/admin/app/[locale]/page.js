

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>{t('welcome')}</h1>
      <p>Dashboard content will go here</p>
    </div>
  );
}
