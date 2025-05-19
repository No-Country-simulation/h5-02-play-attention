'use client';

import {
  ErrorBackgroundGrid,
  ErrorCode,
  ErrorMessage,
  ErrorActions,
  BrandFooter
} from '@/shared/errors';

/**
 * Página de error 404 personalizada
 * Implementada con Tailwind CSS y siguiendo principios SOLID
 */
export default function NotFound() {
  return (
    <div className='fixed inset-0 bg-[#0a1128] text-white z-50'>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        {/* Fondo */}
        <ErrorBackgroundGrid />

        <main className='text-center p-8 max-w-md relative z-10'>
          {/* Código de error */}
          <ErrorCode code='404' />

          {/* Mensaje de error */}
          <ErrorMessage
            title='Página no encontrada'
            message='Lo sentimos, la página que estás buscando no existe o ha sido movida.'
          />

          {/* Botones */}
          <ErrorActions />

          {/* Marca */}
          <BrandFooter />
        </main>
      </div>
    </div>
  );
}
