'use client';

import { useTranslations } from 'next-intl';

/**
 * Componente para mostrar información de marca en el pie de página de errores
 * Sigue el principio de Responsabilidad Única (SRP) de SOLID
 */
export const BrandFooter = () => {
  const t = useTranslations('common');

  return (
    <div className='mt-16 animate-pulse-slow'>
      <p className='text-xl font-bold tracking-tight text-white'>
        Play Attention
      </p>
      <p className='text-sm text-gray-400'>{t('keepFocused')}</p>
    </div>
  );
};
