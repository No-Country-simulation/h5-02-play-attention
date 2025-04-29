'use client';

import { useSession } from '../hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * HOC para proteger rutas que requieren autenticación
 * @param {React.ComponentType} Component - Componente a proteger
 * @param {Object} options - Opciones de configuración
 * @param {string} [options.redirectTo] - Ruta a la que redirigir si el usuario no está autenticado
 * @returns {React.ComponentType} Componente envuelto con protección de autenticación
 */
export function withAuth(Component, options = {}) {
  const { redirectTo = '/login' } = options;

  return function AuthProtectedComponent(props) {
    const { data: session, isLoading } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !session.isAuthenticated && pathname !== redirectTo) {
        router.push(redirectTo);
      }
    }, [isLoading, session, router, pathname]);

    // Mostrar un loader mientras se verifica la autenticación
    if (isLoading || (!session.isAuthenticated && pathname !== redirectTo)) {
      return <div>Verificando autenticación...</div>;
    }

    // Renderizar el componente protegido
    return <Component {...props} />;
  };
}
