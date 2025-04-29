import React from 'react';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { ShieldAlert, HomeIcon } from 'lucide-react';

/**
 * Componente que se muestra cuando un usuario no tiene acceso a una ruta
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje personalizado a mostrar
 * @param {string} props.redirectTo - Ruta a la que redirigir
 * @returns {JSX.Element} Componente de acceso denegado
 */
export const AccessDenied = ({
  message = 'No tienes permisos para acceder a esta sección',
  redirectTo = '/dashboard'
}) => {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4'>
      <div className='bg-red-50 border border-red-200 rounded-xl p-6 md:p-10 max-w-xl w-full text-center'>
        <div className='flex justify-center mb-4'>
          <ShieldAlert className='h-16 w-16 text-red-500' />
        </div>

        <h1 className='text-2xl md:text-3xl font-bold text-red-800 mb-4'>
          Acceso Denegado
        </h1>

        <p className='text-red-700 mb-6'>{message}</p>

        <p className='text-gray-600 mb-8'>
          Si crees que deberías tener acceso, por favor contacta al
          administrador del sistema.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            variant='default'
            onClick={() => router.push(redirectTo)}
            className='flex items-center gap-2'
          >
            <HomeIcon className='h-4 w-4' />
            Ir al inicio
          </Button>

          <Button variant='outline' onClick={() => router.back()}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};
