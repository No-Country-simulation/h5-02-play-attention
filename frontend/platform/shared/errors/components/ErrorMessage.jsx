'use client';

import { useTranslations } from 'next-intl';

/**
 * Componente para mostrar mensajes descriptivos de error
 * Sigue el principio de Inyección de Dependencias (DIP) de SOLID
 * Permite personalizar el mensaje a través de props
 */
export const ErrorMessage = ({
  titleKey = 'pageNotFound',
  messageKey = 'pageNotFoundMessage',
  customTitle = null,
  customMessage = null
}) => {
  const t = useTranslations('common');

  return (
    <>
      <h1 className='mb-4 text-3xl font-bold tracking-tight text-white'>
        {customTitle || t(titleKey)}
      </h1>

      <p className='mb-8 text-lg text-gray-300'>
        {customMessage || t(messageKey)}
      </p>
    </>
  );
};
