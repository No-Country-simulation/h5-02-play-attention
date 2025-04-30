'use client';

import { useRequireAuth } from '@/shared/hooks';
import { useUser } from '@/shared/hooks';
import { LoadingSpinner } from './loading-spinner';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente renderizado
 */
export const AuthProtection = ({
  children,
  redirectTo = '/auth/login',
  loadingFallback = (
    <div className='flex items-center justify-center min-h-screen'>
      <LoadingSpinner className='w-12 h-12' />
    </div>
  )
}) => {
  // Hook para verificar autenticación y obtener datos de usuario
  const { isLoading: isAuthLoading } = useRequireAuth({ redirectTo });
  const { isLoading: isUserLoading, data: user } = useUser();

  const isLoading = isAuthLoading || isUserLoading;

  // Mientras verifica la autenticación, mostrar el componente de carga
  if (isLoading) {
    return loadingFallback;
  }

  // Usuario autenticado, mostrar el contenido
  return children;
};
