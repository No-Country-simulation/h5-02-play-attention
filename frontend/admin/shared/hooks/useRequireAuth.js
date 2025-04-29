import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from './useAuthQuery';
import { AuthService } from '../lib/services/auth-service';

/**
 * Hook para proteger rutas que requieren autenticación
 * Redirecciona al login si el usuario no está autenticado
 *
 * @param {Object} options - Opciones
 * @param {string} options.redirectTo - Ruta a la que redirigir si no hay autenticación
 * @returns {{ user: Object, isLoading: boolean }} - Datos del usuario y estado de carga
 */
export function useRequireAuth({ redirectTo = '/auth/login' } = {}) {
  const router = useRouter();

  // Verificar token en localStorage
  const isAuthenticated = AuthService.isAuthenticated();

  // Cargar perfil del usuario desde la API
  const {
    data: user,
    isLoading,
    error
  } = useProfile({
    // Solo consultar si hay un token
    enabled: isAuthenticated,
    // Si falla la consulta, considerar que no está autenticado
    onError: () => {
      AuthService.logout();
      router.push(redirectTo);
    }
  });

  // Efecto para redireccionar si no hay token
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Guardar la URL actual para redireccionar después del login
      const currentPath = window.location.pathname;
      const loginPath = `${redirectTo}?callbackUrl=${encodeURIComponent(
        currentPath
      )}`;
      router.push(loginPath);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  return { user, isLoading: isLoading || !isAuthenticated };
}
